import { ApolloError, ApolloServer, UserInputError } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLError } from 'graphql';

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import authShield from './auth';
import constructSession from '../models/auth/constructContextSession';
import prisma from './prisma';
import schema from './schema';
import { bootstrapServices } from './bootstrap';

const handleError = (ctx: any, error: GraphQLError) => {
  // Filter out user-input-errors (not interesting)
  if (error.originalError instanceof UserInputError) {
    return;
  }

  // Handle Sentry
  Sentry.withScope((scope) => {
    // Provide query/mutation
    scope.setTag('kind', ctx.operation?.name?.kind.toString() || '');

    // If query, show what the query is
    scope.setExtra('query', ctx.request.query);

    // Potentially provide input variables
    if (ctx.request.variables) {
      scope.setExtra('variables', ctx.request.variables)
    }

    // If there is an error, provide the path to it
    if (error.path) {
      scope.addBreadcrumb({
        category: 'query-path',
        message: error.path.join(' > '),
        level: Sentry.Severity.Debug,
      });
    }

    // Send to Sentry
    Sentry.captureException(error);
  });
}


const makeApollo = async () => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo: ApolloServer = new ApolloServer({
    schema: applyMiddleware(schema, authShield),
    context: async (ctx): Promise<APIContext> => ({
      ...ctx,
      session: await constructSession(ctx),
      prisma,
      services: bootstrapServices(),
    }),
    plugins: [
      {
        requestDidStart: () => ({
          didEncounterErrors: (ctx) => {
            if (!ctx.operation) return;

            ctx.errors.forEach((error) => {
              handleError(ctx, error);
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
