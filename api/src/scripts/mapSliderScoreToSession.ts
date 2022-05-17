import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mapSliderScoreToSession = async () => {
  const sessions = await prisma.session.findMany({
    where: {
      mainScore: 0,
      nodeEntries: {
        some: {
          sliderNodeEntry: {
            isNot: null,
          },
        },
      },
    },
    select: {
      id: true,
      nodeEntries: {
        select: {
          sliderNodeEntry: {
            select: {
              value: true,
            },
          },
        },
        where: {
          AND: [
            {
              sliderNodeEntry: {
                isNot: undefined,
              },
            },
            {
              sliderNodeEntry: {
                isNot: null,
              },
            },
          ],
        },
      },
    },
  });

  if (sessions.length === 0) {
    console.log('No sessions with 0 main score found. abort.')
    process.exit(0);
  }

  console.log('Amount of sessions being converted: ', sessions.length);

  await Promise.all(sessions.map(async (session) => {
    const score = session.nodeEntries[0].sliderNodeEntry?.value;

    if (!score) {
      console.log('Find session with 0 score but nog sliderNodeValue. CANCELD.');
      return;
    }

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        mainScore: score,
      },
    })
  }));

  console.log('Successfully mapped slider scores to their sessions');
  process.exit(0);
};

mapSliderScoreToSession().then(() => { }).catch(err => { console.log(err) }).finally(() => { });
