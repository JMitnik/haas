import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from './resolvers';

const makeApollo = async () => {
  const typeDefs = await importSchema(config.PATH_TO_APP_SCHEMA, {});

  const apollo: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: (req) => ({
      ...req,
      db: new Prisma({
        typeDefs: config.PATH_TO_PRISMA_GENERATED_SCHEMA,
        endpoint: config.PRISMA_ENDPOINT,
        secret: process.env.PRISMA_SERVICE_SECRET,
      }),
    }),
  });

  return apollo;
};

export default makeApollo;
