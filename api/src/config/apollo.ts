import { ApolloError, ApolloServer } from 'apollo-server-express';
import { APIContext } from '../types/APIContext';
import { applyMiddleware } from 'graphql-middleware';
import Sentry from './sentry';
import authShield from './auth';
import config from './config';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import schema from './schema';

const verifyUser = async (authHeader: string | undefined) => {
  if (!authHeader) return null;

  const bearerToken = authHeader.slice(7);

  if (!bearerToken) return null;

  const isValid = await jwt.verify(bearerToken, config.jwtSecret);
  if (!isValid) return null;

  const decodedUser = jwt.decode(bearerToken);
  // @ts-ignore
  const decodedUserMail = decodedUser?.email;

  if (!decodedUserMail) return null;

  const user = await prisma.user.findOne({
    where: {
      email: decodedUserMail,
    },
    include: {
      customers: {
        include: {
          customer: true,
          role: true,
        },
      },
    },
  });

  return user;
};

const makeApollo = async () => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo: ApolloServer = new ApolloServer({
    schema: applyMiddleware(schema, authShield),
    context: async (ctx): Promise<APIContext> => ({
      ...ctx,
      user: await verifyUser(ctx.req.headers.authorization),
      prisma,
    }),
    plugins: [
      {
        requestDidStart: () => ({
          didEncounterErrors: (ctx) => {
            if (!ctx.operation) return;

            ctx.errors.forEach((error) => {
              if (error instanceof ApolloError) return;

              Sentry.withScope((scope) => {
                scope.setTag('kind', ctx.operation?.name?.kind.toString() || '');

                scope.setExtra('query', ctx.request.query);

                // TODO: Add this, but also strip password ...
                // scope.setExtra('variables', ctx.request.variables)

                if (error.path) {
                  scope.addBreadcrumb({
                    category: 'query-path',
                    message: error.path.join(' > '),
                    level: Sentry.Severity.Debug,
                  });
                }

                Sentry.captureException(error);
              });
            });
          },
        }),
      },
    ],
  });

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
