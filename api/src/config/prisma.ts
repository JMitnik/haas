import { PrismaClient } from '@prisma/client';

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal


const prisma = global.prisma || new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

if (process.env.NODE_ENV === 'development') global.prisma = prisma

prisma.$on('beforeExit', () => {
  console.log('Prisma: BeforeExit is being run (it is disconnecting)');
})

if (process.env.DEBUG_PRISMA) {
  // @ts-ignore
  prisma.$on('query', (event) => {
    // @ts-ignore
    console.log(event.query);
  });
}

export default prisma;
