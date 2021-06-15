import { PrismaClient } from '@prisma/client';

export const makeTestPrisma = () => {
  if (process.env.NODE_ENV === 'test') {
    return new PrismaClient({
      datasources: { postgresql: { url: 'postgresql://prisma:prisma@localhost:5431/postgres?schema=public' } }
    });
  }

  throw new Error('Not possible; only works in Test environment!');
}