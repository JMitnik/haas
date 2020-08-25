import { ApolloServer, ApolloError, UserInputError } from 'apollo-server-express';

import { APIContext } from '../types/APIContext';
import config from './config';
import * as Sentry from '@sentry/node';
import prisma from './prisma';
import schema from './schema';

Sentry.init({ dsn: 'https://4e5e8f8821354e6dbe2f3124c7a297f5@o438134.ingest.sentry.io/5402429' });

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

            for (const error of ctx.errors) {
              if (error instanceof ApolloError) continue;

              Sentry.withScope(scope => {
                scope.setTag('kind', ctx.operation?.name?.kind.toString() || '');
                
                scope.setExtra('query', ctx.request.query);

                // TODO: Add this, but also strip password ...
                // scope.setExtra('variables', ctx.request.variables)

                if (error.path) {
                  scope.addBreadcrumb({
                    category: 'query-path',
                    message: error.path.join(' > '),
                    level: Sentry.Severity.Debug
                  })
                }

                Sentry.captureException(error);
              })
            };
          }
        })
      }
    ]
  });

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
