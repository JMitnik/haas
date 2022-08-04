import { YogaNodeServerInstance } from '@graphql-yoga/node';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { APIContext } from 'types/APIContext';

type GraphQLServer = YogaNodeServerInstance<any, APIContext, {}>;

export const registerRoutes = (app: FastifyInstance, graphqlInstance: GraphQLServer) => {
  void app.register(routes, { graphql: graphqlInstance  });
}

export const routes: FastifyPluginCallback<{graphql: GraphQLServer}> = (app, { graphql }, done) => {
  app.addHook('preHandler', async (req, res) => {
    if (res.sent) return;
  });

  // Root routes
  app.get('/', async (req, res) => res.send({ status: 'HAAS API V2.1.0' }));
  app.get('/health', async (req, res) => res.send({ status: 'Health check' }));

  // Main GraphQL Route
  app.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await graphql.handleIncomingMessage(req, { req, reply });

      response.headers.forEach((value, key) => {
        void reply.header(key, value)
      })

      void reply.status(response.status);
      void reply.send(response.body);

      return reply;
    },
  });

  done();
};
