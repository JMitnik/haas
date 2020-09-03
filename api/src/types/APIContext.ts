import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line import/no-cycle
import ServiceContainer from '../services/service-container';

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  user: any;
}

