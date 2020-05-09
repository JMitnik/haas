import { Dialogue } from '@prisma/client';
import { objectType, extendType, inputObjectType } from '@nexus/schema';
import { UniqueDataResultEntry } from '../session/Session';
import { QuestionNodeType, QuestionNodeWhereInput } from '../question/QuestionNode';
import { CustomerType } from '../customer/Customer';
import DialogueResolver from './dialogue-resolver';

export const DialogueType = objectType({
  name: 'Dialogue',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('description');
    t.string('publicTitle', { nullable: true });
    t.string('creationDate', { nullable: true });
    t.string('updatedAt', { nullable: true });
    t.string('averageScore', { nullable: true });
    t.field('lineChartData', {
      nullable: true,
      type: 'String', // TODO: Change to appropriate return type
      resolve(parent: Dialogue, args: any, ctx: any, info: any) {
        return '';
      },
    });
    t.field('customer', {
      type: CustomerType,
      resolve(parent: Dialogue, args: any, ctx: any, info: any) {
        const customer = ctx.prisma.customer.findOne({
          where: {
            id: parent.customerId,
          },
        });
        return customer;
      },
    });
    t.string('customerId');
    t.list.field('questions', {
      type: QuestionNodeType,
      args: {
        where: QuestionNodeWhereInput,
      },
      resolve(parent: Dialogue, args: any, ctx: any) {
        // if (args?.where?.isRoot) {
        //   const rootQuestion = ctx.prisma.questionNode.findMany({
        //     where: {
        //       isRoot: args.where.isRoot,
        //     },
        //   });
        //   return rootQuestion;
        // }

        // if (args?.where?.id) {
        //   const questions = ctx.prisma.questionNode.findMany({
        //     where: {
        //       id: args.where.id,
        //     },
        //   });
        //   return questions;
        // }

        const questions = ctx.prisma.questionNode.findMany({
          where: {
            AND: [
              {
                questionDialogueId: parent.id,
              },
              {
                isLeaf: false,
              },
            ],
          },
        });
        return questions;
      },
    });
    t.list.field('leafs', {
      type: QuestionNodeType,
      resolve(parent: Dialogue, args: any, ctx: any, info: any) {
        const leafs = ctx.prisma.questionNode.findMany({
          where: {
            AND: [
              {
                questionDialogueId: parent.id,
              },
              {
                isLeaf: true,
              },
            ],
          },
        });
        return leafs;
      },
    });
  },
});

export const DialogueWhereUniqueInput = inputObjectType({
  name: 'DialogueWhereUniqueInput',
  definition(t) {
    t.id('id', { required: true });
  },
});

export const lineChartDataType = objectType({
  name: 'lineChartDataType',
  definition(t) {
    t.string('x');
    t.int('y');
  },
});

export const topPathType = objectType({
  name: 'topPathType',
  definition(t) {
    t.string('answer');
    t.int('quantity');
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
    t.list.field('lineChartData', {
      nullable: true,
      type: lineChartDataType,
    });
    t.list.field('topPositivePath', {
      type: topPathType,
      nullable: true,
    });
    t.list.field('topNegativePath', {
      type: topPathType,
      nullable: true,
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
        filter: 'Int',
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const aggregatedData = await DialogueResolver.getQuestionnaireAggregatedData(parent, args);
        const data = await DialogueResolver.getLineData(args.dialogueId, args.filter);
        const result = { ...aggregatedData, ...data };
        return result;
      },
    });
  },
});

export const deleteDialogueOfCustomerMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDialogue', {
      type: DialogueType,
      args: {
        customerId: 'String',
        title: 'String',
        description: 'String',
        publicTitle: 'String',
        isSeed: 'Boolean',
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return DialogueResolver.createDialogue(args);
      },
    });
    t.field('editDialogue', {
      type: DialogueType,
      args: {
        dialogueId: 'String',
        title: 'String',
        description: 'String',
        publicTitle: 'String',
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return DialogueResolver.editDialogue(args);
      },
    });
    t.field('deleteDialogue', {
      type: DialogueType,
      args: {
        where: DialogueWhereUniqueInput,
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return DialogueResolver.deleteDialogue(args.where.id);
      },
    });
  },
});

export const DialoguesOfCustomerQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('lineChartData', {
      type: lineChartDataType,
      args: {
        dialogueId: 'String',
        numberOfDaysBack: 'Int',
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return DialogueResolver.getLineData(args.dialogueId, 30);
      },
    });
    t.field('dialogue', {
      type: DialogueType,
      args: {
        where: DialogueWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const dialogue = await ctx.prisma.dialogue.findOne({ where: {
          id: args.where.id,
        } });
        return dialogue;
      },
    });
    t.list.field('dialogues', {
      type: DialogueType,
      args: {
        customerId: 'ID',
      },
      async resolve(parent: any, args: any, ctx: any, info: any) {
        const dialogues: Array<Dialogue> = await ctx.prisma.dialogue.findMany({
          where: {
            customerId: args.customerId,
          },
        });
        const updatedDialogues = Promise.all(dialogues.map(async (dialogue) => {
          const arg = { dialogueId: dialogue.id };
          const aggregated = await DialogueResolver.getQuestionnaireAggregatedData(parent, arg);
          return { ...dialogue, averageScore: aggregated.average };
        }));
        return updatedDialogues;
      },
    });
  },
});

const dialogueNexus = [
  topPathType,
  lineChartDataType,
  DialogueWhereUniqueInput,
  deleteDialogueOfCustomerMutation,
  DialogueType,
  DialoguesOfCustomerQuery,
  DialogueDetailResultType,
  getQuestionnaireDataQuery,
];

export default dialogueNexus;
