import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';

import { logger, LifeCycleType } from './logger';
import { makeApollo } from './apollo';
import { registerPlugins } from './ServerPlugins';
import { registerRoutes } from './routes/routes';

export const makeServer = async (port: number, prismaClient: PrismaClient) => {
  logger.logLifeCycle('Starting application');

  // Instantiate the server and enable all relevant middleware plugins
  const app = Fastify();
  await registerPlugins(app);

  // Create the GraphQL Server, and register all relevant routes
  const graphql = await makeApollo(prismaClient, app);
  registerRoutes(app, graphql);

  // Turn on the server
  await app.listen(port);
  logger.logLifeCycle('Started the server!', LifeCycleType.START);

  return app.server;
};
