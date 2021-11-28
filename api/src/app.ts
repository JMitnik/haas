import prisma from './config/prisma';
import config from './config/config';
import { makeServer } from './config/server';

/**
 * Terminates the server and other processes (such as Prisma) when the process is killed.
 * - SIGTERM is triggered by AWS Fargate. Prisma only watches for SIGINT.
 */
process.on('SIGTERM', async () => {
  console.log('App Lifecycle: Disconnecting from prisma');
  await prisma.$disconnect()

  console.log('App Lifecycle: Disconnecting child');
  process.exit(0);
});

try {
  console.log('App Lifecycle: Starting app');
  makeServer(config.port, prisma);
} catch (e) {
  console.log(e);
}
