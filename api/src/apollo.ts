import { ApolloServer } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import ServiceContainer from './services/service-container';
import config from './config';
import schema from './schema';

const prisma = new PrismaClient();

const makeApollo = async () => {
  const apollo: ApolloServer = new ApolloServer({
    schema,
    context: (req) => ({
      ...req,
      prisma,
      services: new ServiceContainer(config),
    }),
  });

  return apollo;
};

export default makeApollo;
