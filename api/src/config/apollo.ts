import { applyMiddleware } from 'graphql-middleware';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-fastify';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { FastifyInstance } from 'fastify';
import { createServer } from '@graphql-yoga/node'
import { useSentry } from '@envelop/sentry';
import { useGraphQlJit } from '@envelop/graphql-jit';

import { APIContext } from '../types/APIContext';
import Sentry from './sentry';
import authShield from './auth';
import ContextSessionService from '../models/auth/ContextSessionService';
import schema from './schema';
import { bootstrapServices } from './bootstrap';

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

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

const SentryPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx) {
        if (!ctx.operation) return;

        ctx.errors.forEach((error) => {
          handleError(ctx, error);
        });
      },
    };
  },
};

export const makeApollo = async (prisma: PrismaClient, app: FastifyInstance) => {
  const apollo = createServer({
    cors: true,
    logging: true,
    maskedErrors: false,
    schema: applyMiddleware(schema, authShield),
    context: async (ctx: any): Promise<APIContext> => ({
      ...ctx,
      req: ctx.request,
      res: ctx.reply,
      session: await new ContextSessionService(ctx, prisma).constructContextSession(),
      prisma,
      services: bootstrapServices(prisma),
    }),
    plugins: process.env.NODE_ENV === 'test' ? [] : [
      SentryPlugin,
      fastifyAppClosePlugin(app),
      useGraphQlJit(),
      useSentry(),
    ],
  });

  return apollo;
};

export default makeApollo;
