
import { Dialogue, DialogueWhereInput, PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
import { EdgeType } from '../edge/Edge';
import { QuestionNodeType, QuestionNodeWhereInput } from '../question/QuestionNode';
// eslint-disable-next-line import/no-cycle
import { TagType, TagsInputType } from '../tag/Tag';

import { SessionType, UniqueDataResultEntry } from '../session/Session';
import DialogueService from './DialogueService';

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

export const DialogueStatistics = objectType({
  name: 'DialogueStatistics',
  definition(t) {
    t.float('averageScore', {
      resolve(parent: any) {
        if (!parent.id) {
          return null;
        }

        return DialogueService.calculateAverageScore(parent.id);
      },
    });
    t.int('countInteractions');

    t.list.field('lineChartData', {
      nullable: true,
      type: lineChartDataType,
    });

    // t.list.field('topPositivePath', {
    //   type: topPathType,
    //   nullable: true,
    // });

    // t.list.field('topNegativePath', {
    //   type: topPathType,
    //   nullable: true,
    // });
  },
});

export const DialogueType = objectType({
  name: 'Dialogue',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('slug');
    t.string('description');
    t.string('publicTitle', { nullable: true });
    t.string('creationDate', { nullable: true });
    t.string('updatedAt', { nullable: true });
    t.float('averageScore', {
      nullable: true,
      resolve(parent: any) {
        if (!parent.id) {
          return null;
        }

        return DialogueService.calculateAverageScore(parent.id);
      },
    });
    t.int('countInteractions', {
      nullable: true,
      resolve(parent: any) {
        if (!parent.id) {
          return null;
        }

        return DialogueService.countInteractions(parent.id);
      },
    });

    t.list.field('tags', {
      type: TagType,
      nullable: true,
    });

    t.field('lineChartData', {
      nullable: true,
      type: 'String', // TODO: Change to appropriate return type
      resolve() {
        return '';
      },
    });

    t.string('customerId');
    t.field('customer', {
      type: CustomerType,
      resolve(parent: Dialogue, args: any, ctx: any) {
        const customer = ctx.prisma.customer.findOne({
          where: {
            id: parent.customerId,
          },
        });

        return customer;
      },
    });

    t.field('rootQuestion', {
      type: QuestionNodeType,
      async resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        const rootQuestions = await prisma.questionNode.findMany({
          where: {
            isRoot: true,
          },
        });

        return rootQuestions[0];
      },
    });

    t.list.field('edges', {
      type: EdgeType,
      async resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        const dialogue = await prisma.dialogue.findOne({
          where: {
            id: parent.id,
          },
          include: {
            edges: {},
          },
        });

        const edges = dialogue?.edges;

        return edges;
      },
    });

    t.list.field('questions', {
      type: QuestionNodeType,
      args: {
        where: QuestionNodeWhereInput,
      },
      resolve(parent: Dialogue, args: any, ctx: any) {
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

    t.list.field('sessions', {
      type: SessionType,
      async resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        const dialogueWithSessions = await prisma.dialogue.findOne({
          where: { id: parent.id },
          include: { sessions: true },
        });

        return dialogueWithSessions?.sessions;
      },
    });

    t.list.field('leafs', {
      type: QuestionNodeType,
      resolve(parent: Dialogue, args: any, ctx: any) {
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
    t.id('id');
    t.string('slug');
  },
});

export const getQuestionnaireDataQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getQuestionnaireData', {
      type: DialogueStatistics,
      args: {
        dialogueId: 'String',
        filter: 'Int',
      },
      async resolve(parent: any, args: any) {
        const aggregatedData = await DialogueService.getQuestionnaireAggregatedData(parent, args);
        const data = await DialogueService.getLineData(args.dialogueId, args.filter);
        const result = { ...aggregatedData, ...data };
        return result;
      },
    });
  },
});

export const AddDialogueInput = inputObjectType({
  name: 'AddDialogueInput',
  definition(t) {
    t.string('customerSlug');
    t.string('title');
    t.string('dialogueSlug');
    t.string('description');
    t.string('publicTitle');
    t.boolean('isSeed');
    t.field('tags', {
      type: TagsInputType,
    });
  },
});

export const DialogueMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDialogue', {
      type: DialogueType,
      args: { data: AddDialogueInput },
      resolve(parent: any, args: any) {
        return DialogueService.createDialogue(args);
      },
    });

    t.field('editDialogue', {
      type: DialogueType,
      args: {
        dialogueId: 'String',
        title: 'String',
        description: 'String',
        publicTitle: 'String',
        tags: TagsInputType,
      },
      resolve(parent: any, args: any) {
        return DialogueService.editDialogue(args);
      },
    });

    t.field('deleteDialogue', {
      type: DialogueType,
      args: {
        where: DialogueWhereUniqueInput,
      },
      resolve(parent: any, args: any) {
        return DialogueService.deleteDialogue(args.where.id);
      },
    });
  },
});

export const DialogueFilterInputType = inputObjectType({
  name: 'DialogueFilterInputType',
  definition(t) {
    t.string('searchTerm');
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
        limit: 'Int',
        offset: 'Int',
      },
      resolve(parent: any, args: any) {
        return DialogueService.getNextLineData(
          args.dialogueId,
          args.numberOfDaysBack,
          args.limit,
          args.offset,
        );
      },
    });

    t.field('dialogue', {
      type: DialogueType,
      args: {
        where: DialogueWhereUniqueInput,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        if (args.where.slug) {
          return;
        }

        const dialogue = await prisma.dialogue.findOne({
          where: {
            id: args.where.id,
          },
          include: {
            tags: true,
          },
        });

        return dialogue;
      },
    });

    t.list.field('dialogues', {
      type: DialogueType,
      args: {
        customerId: 'ID',
        filter: DialogueFilterInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const dialogueWhereInput: DialogueWhereInput = { customerId: args.customerId };

        let dialogues = await prisma.dialogue.findMany({
          where: dialogueWhereInput,
          include: {
            tags: true,
          },
        });

        if (args.filter) {
          if (args.filter.searchTerm) {
            dialogues = DialogueService.filterDialoguesBySearchTerm(dialogues, args.filter.searchTerm);
          }
        }

        // TODO: AverageSCore should be a dervied field instead
        const updatedDialogues = Promise.all(dialogues.map(async (dialogue) => {
          const arg = { dialogueId: dialogue.id };
          const aggregated = await DialogueService.getQuestionnaireAggregatedData(parent, arg);
          return { ...dialogue, averageScore: aggregated.average };
        }));

        return updatedDialogues;
      },
    });
  },
});

export default [
  topPathType,
  lineChartDataType,
  DialogueWhereUniqueInput,
  DialogueMutations,
  DialogueType,
  DialoguesOfCustomerQuery,
  DialogueStatistics,
  getQuestionnaireDataQuery,
];
