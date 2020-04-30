import { PrismaClient } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  const questionnaireId = 'ck9jm0gsf00008dr5w2w54vcc';

  const nodes = await prisma.questionNode.findMany();
  console.log(nodes[0]);

  const specificNode = await prisma.questionNode.findOne({
    where: { id: 'ck9ldc2mg0000xsr5fk4wqob9' },
  });
  console.log(specificNode);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
