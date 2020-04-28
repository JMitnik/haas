import { PrismaClient } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  const questionnaireId = 'ck9jm0gsf00008dr5w2w54vcc';

  const session = await prisma.session.create({
    data: {
      dialogue: {
        connect: {
          id: questionnaireId,
        },
      },
      nodeEntries: {
        create: [
          {},
          {},
        ],
      },
    },
  });

  const nodeEntry = await prisma.nodeEntry.create({
    data: {
      // relatedNode: {
      //   create: {
      //     title: 'Hi',
      //     type: 'mult',
      //   },
      // },
      session: {
        connect: {
          id: session.id,
        },
      },
    },
  });

  console.log('NodeEntry: ', nodeEntry);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
