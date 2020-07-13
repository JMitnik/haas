import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import ServiceContainer from '../services/service-container';

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  services: ServiceContainer;
}

