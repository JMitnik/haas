import '@lumigo/opentelemetry';
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

try {
  makeServer(config.port, prisma);
} catch (e: unknown) {
  logger.error('Error in lifecycle', e);
}
