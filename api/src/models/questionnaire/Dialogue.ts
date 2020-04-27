import { PrismaClient, Customer } from '@prisma/client';
import { objectType, queryType, extendType } from '@nexus/schema';

const prisma = new PrismaClient();

export const DialogueType = objectType({
  name: 'Dialogue',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('description');
    t.string('publicTitle', { nullable: true });
    t.string('creationDate', { nullable: true });
    t.string('updatedAt', { nullable: true });
    t.string('customerId');
  },
});

export const DialoguesOfCustomerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('dialogues', {
      type: DialogueType,
      args: {
        customerId: 'String',
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const dialogues = await prisma.dialogue.findMany({
          where: {
            customerId: args.customerId,
          },
        });
        return dialogues;
      },
    });
  },
});
