import { PrismaClient } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')
import { formatDistance, subDays } from 'date-fns';

const prisma = new PrismaClient();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function main() {
  // ... you will write your Prisma Client queries here

  const dialogue = await prisma.dialogue.create({
    data: {
      customer: {
        create: {
          name: 'back in time',
        },
      },
      title: 'BACK_IN_TIME_DIALOGUE',
      description: 'NOW',
    },
  });
  const currentDate = new Date();
  const amtOfDaysBack = Array.from(Array(30)).map((empty, index) => index);
  const datesBackInTime = amtOfDaysBack.map((amtDaysBack) => subDays(currentDate, amtDaysBack));

  await Promise.all(datesBackInTime.map(async (backDate) => {
    await prisma.session.create({
      data: {
        nodeEntries: {
          create: {
            creationDate: backDate,
            values: {
              create: {
                numberValue: getRandomInt(100),
              },
            },

          },
        },
        dialogue: {
          connect: {
            id: dialogue.id,
          },
        },
      },
    });
  }));
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
