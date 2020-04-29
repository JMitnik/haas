import { ApolloServer } from 'apollo-server-express';
import { Prisma } from 'prisma-binding';
import config from './config';
import ServiceContainer from './services/service-container';
import schema from './schema';

const makeApollo = async () => {
  const apollo: ApolloServer = new ApolloServer({
    schema,
    context: (req) => ({
      ...req,
      db: new Prisma({
        typeDefs: config.prismaSchemaUrl,
        endpoint: config.prismaUrl,
        secret: config.prismaServiceSecret,
      }),
      services: new ServiceContainer(config),
    }),
  });

  return apollo;
};

export default makeApollo;
