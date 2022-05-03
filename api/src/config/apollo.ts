import { ApolloServer, UserInputError } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { createServer } from '@graphql-yoga/node'
import { useApolloServerErrors } from '@envelop/apollo-server-errors'

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import authShield from './auth';
import ContextSessionService from '../models/auth/ContextSessionService';
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


export const makeApollo = async (prisma: PrismaClient) => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo = createServer({
    // uploads: false,
    cors: false,
    logging: true,
    // schema,
    maskedErrors: false, // TODO: Remove again

    schema: applyMiddleware(schema, authShield),
    context: async (ctx: any): Promise<APIContext> => ({
      ...ctx,
      session: await new ContextSessionService(ctx, prisma).constructContextSession(),
      prisma,
      services: bootstrapServices(prisma),
    }),
    plugins: [
      useApolloServerErrors({
        debug: true,
      }),
    ],
  });

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
