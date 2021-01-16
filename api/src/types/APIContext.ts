import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { PrismaClient } from '@prisma/client';

import { ContextSessionType } from '../models/auth/ContextSessionType';
import { RedisClient } from 'redis';
import { Redis } from 'ioredis';

export interface APIContext extends ExpressContext {
  prisma: PrismaClient;
  redis: Redis;
  session: ContextSessionType | null;
}
