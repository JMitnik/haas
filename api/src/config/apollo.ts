import { UserInputError } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { createServer } from '@graphql-yoga/node'
import { useApolloServerErrors } from '@envelop/apollo-server-errors'
import { useResponseCache } from '@envelop/response-cache'
import { useSentry } from '@envelop/sentry';
import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { useGraphQlJit } from '@envelop/graphql-jit';

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import authShield from './auth';
import ContextSessionService from '../models/auth/ContextSessionService';
import schema from './schema';
import { bootstrapServices } from './bootstrap';
import config from './config';

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
    cors: true,
    logging: true,
    maskedErrors: false,
    schema: applyMiddleware(schema, authShield),
    context: async (ctx: any): Promise<APIContext> => ({
      ...ctx,
      session: await new ContextSessionService(ctx, prisma).constructContextSession(),
      prisma,
      services: bootstrapServices(prisma),
    }),
    plugins: process.env.NODE_ENV === 'test' ? [] : [
      useGraphQlJit(),
      useValidationCache(),
      useParserCache(),
      useSentry(),
      useResponseCache({
        includeExtensionMetadata: true,
        idFields: [
          'id',
          'userId',
          'customerId',
          'roleId',
          'questionId',
          'dialogueId',
        ],
      }),
      useApolloServerErrors({
        debug: true,
      }),
    ],
  });

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
