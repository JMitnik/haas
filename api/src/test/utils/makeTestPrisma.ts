import { PrismaClient } from '@prisma/client';


interface CustomNodeJsGlobal extends NodeJS.Global {
  testPrisma: PrismaClient
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal
export const makeTestPrisma = () => {
  if (process.env.NODE_ENV === 'test') {
    const prisma = global.testPrisma || new PrismaClient({
      datasources: { postgresql: { url: 'postgresql://prisma:prisma@localhost:5431/postgres?schema=public' } }
    });

    global.testPrisma = prisma;

    return prisma;
  }

  throw new Error('Not possible; only works in Test environment!');
}
