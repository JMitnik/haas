import { PrismaClient } from '@prisma/client';
// or const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here

  const edge = await prisma.edge.create({
    data: {
      parentNode: {
        create: {
          title: 'parentNode',
          type: 'SLIDER',
        },
      },
      childNode: {
        create: {
          title: 'childNode',
          type: 'multi-value',
        },
      },
      conditions: {
        create: [
          {
            conditionType: 'match',
            matchValue: 'FACILITIES',
          },
        ],
      },
    },
  });

  // const dialogue = await prisma.dialogue.create({
  //   data: {
  //     title: 'Dialogue',
  //     description: 'Desc.',
  //     questions: {
  //       create: {
  //         title: 'OverrideLeaf Question',
  //         type: 'MULTI-VALUE',
  //         options: {
  //           create: {
  //             value: 'Option 1',
  //           },
  //         },
  //         overrideLeaf: {
  //           create: {
  //             title: 'Leaf',
  //             type: 'Social-Share',
  //           },
  //         },
  //         children: {
  //           connect: {
  //             id: edge.id,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // console.log('Edge dialogue id: ', await prisma.dialogue.findOne({ where: { id: dialogue.id } }).edges());
  // await prisma.questionNode.create({
  //   data: {
  //     title: 'Question1',
  //     type: 'Multi-Value',
  //   },
  // });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
