import { ApolloServer } from 'apollo-server-express';

import { APIContext } from './types/APIContext';
// eslint-disable-next-line import/no-cycle
import ServiceContainer from './services/service-container';
import config from './config/config';
import prisma from './config/prisma';
import schema from './config/schema';

const makeApollo = async () => {
  console.log('💼\tBootstrapping Graphql Engine Apollo');

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

  console.log('🏁\tFinished bootstrapping Graphql Engine Apollo');

  return apollo;
};

export default makeApollo;
