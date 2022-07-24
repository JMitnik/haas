import prisma from './config/prisma';
import config from './config/config';
import { makeServer } from './config/server';
import { redis } from './config/redis';
import { logger } from './config/logger';

/**
 * Terminates the server and other processes (such as Prisma) when the process is killed.
 * - SIGTERM is triggered by AWS Fargate. Prisma only watches for SIGINT.
 */
process.on('SIGTERM', async () => {
  logger.logLifeCycle('Disconnecting from prisma and redis');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

makeServer(
  config.port, prisma
).then(
  () => { return; },
).catch((e) => logger.error('Init error', e));
