import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
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
    }
  ]
});

prisma.$on('query', (event) => {
  console.log(event.query);
})

export default prisma;
