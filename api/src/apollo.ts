import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from './resolvers';
import ServiceContainer from './services/service-container';

const makeApollo = async () => {
  const typeDefs = await importSchema(config.appSchemaUrl, {});

  const apollo: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
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
