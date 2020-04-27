import { PrismaClient, Customer } from '@prisma/client';
import { objectType, queryType, extendType } from '@nexus/schema';
import { UniqueDataResultEntry } from '../session/Session';
import DialogueResolver from './questionnaire-resolver';

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

export const DialogueDetailResultType = objectType({
  name: 'DialogueDetailResult',
  definition(t) {
    t.string('customerName');
    t.string('title');
    t.string('description');
    t.string('creationDate');
    t.string('updatedAt');
    t.string('average');
    t.int('totalNodeEntries');
    t.list.field('timelineEntries', {
      type: UniqueDataResultEntry,
    });
  },
});

export const getQuestionnaireDataQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getQuestionnaireData', {
      type: DialogueDetailResultType,
      args: {
        dialogueId: 'String',
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        const result = DialogueResolver.getQuestionnaireAggregatedData(parent, args);
        return result;
      },
    });
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
      resolve(parent: any, args: any, ctx: any, info: any) {
        const dialogues = prisma.dialogue.findMany({
          where: {
            customerId: args.customerId,
          },
        });
        return dialogues;
      },
    });
  },
});
