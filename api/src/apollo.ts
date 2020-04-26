import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { importSchema } from 'graphql-import';
import { Prisma } from 'prisma-binding';
import config from './config';
import resolvers from './resolvers';
import ServiceContainer from './services/service-container';

const authenticateToken = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, config.jwtSecret);
    }
  } catch {
    return null;
  }

  return null;
};

const makeApollo = async () => {
  const typeDefs = await importSchema(config.appSchemaUrl, {});

  const apollo: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      const tokenWithBearer = req.headers.authorization || '';
      const token = tokenWithBearer.split(' ')[1];
      const user = authenticateToken(token);

      return {
        ...req,
        db: new Prisma({
          typeDefs: config.prismaSchemaUrl,
          endpoint: config.prismaUrl,
          secret: config.prismaServiceSecret,
        }),
        user,
        config,
        services: new ServiceContainer(config),
      };
    },
  });

  return apollo;
};

export default makeApollo;
