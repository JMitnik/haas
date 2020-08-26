import { ApolloError, ApolloServer } from 'apollo-server-express';

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import prisma from './prisma';
import schema from './schema';

const makeApollo = async () => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo: ApolloServer = new ApolloServer({
    schema,
    context: (ctx): APIContext => ({
      ...ctx,
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
