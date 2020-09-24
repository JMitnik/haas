import { ApolloError, ApolloServer } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import authShield from './auth';
import constructSession from '../models/auth/constructContextSession';
import prisma from './prisma';
import schema from './schema';

const makeApollo = async () => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo: ApolloServer = new ApolloServer({
    schema: applyMiddleware(schema, authShield),
    context: async (ctx): Promise<APIContext> => ({
      ...ctx,
      session: await constructSession(ctx),
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
