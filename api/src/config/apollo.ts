import { applyMiddleware } from 'graphql-middleware';
import { GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { ApolloServer, UserInputError } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { FastifyInstance } from 'fastify';

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
  async requestDidStart(requestContext) {
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
  console.log('💼\tBootstrapping Graphql Engine Apollo');

  const apollo: ApolloServer = new ApolloServer({
    // uploads: false,
    schema: applyMiddleware(schema, authShield),
    context: async (ctx): Promise<APIContext> => ({
      req: ctx.request,
      res: ctx.reply,
      ...ctx,
      config: ctx,
      session: await new ContextSessionService(ctx, prisma).constructContextSession(),
      prisma,
      services: bootstrapServices(prisma),
    }),
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      SentryPlugin,
    ],
  });

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
