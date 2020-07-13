import { ApolloServer } from 'apollo-server-express';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import ServiceContainer from './services/service-container';
import config from './config';
import schema from './schema';

const prisma = new PrismaClient();

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  services: ServiceContainer;
}

const makeApollo = async () => {
  const apollo: ApolloServer = new ApolloServer({
    schema,
    context: (ctx): APIContext => ({
      ...ctx,
      prisma,
      services: new ServiceContainer(config),
    }),
    formatError(err) {
      if (config.env === 'local') {
        return err;
      }

      if (err.name === 'ValidationError') {
        return new Error(`Different authentication error message, due to ${err.message}`);
      }

      return err;
    },
  });

  return apollo;
};

export default makeApollo;
