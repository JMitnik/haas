
import { Dialogue, DialogueWhereInput, PrismaClient, QuestionNodeWhereInput } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
import { EdgeType } from '../edge/Edge';
import { QuestionNodeType, QuestionNodeWhereInputType } from '../question/QuestionNode';
// eslint-disable-next-line import/no-cycle
import { TagType, TagsInputType } from '../tag/Tag';

import { FilterInput, InteractionType, SessionType, UniqueDataResultEntry } from '../session/Session';
import DialogueService from './DialogueService';
import NodeEntryService from '../nodeentry/NodeEntryService';
import SessionService from '../session/SessionService';

export const lineChartDataType = objectType({
  name: 'lineChartDataType',
  definition(t) {
    t.string('x', { nullable: true });
    t.int('y', { nullable: true });
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
    t.list.field('topPositivePath', {
      type: topPathType,
      nullable: true,
    });

    t.list.field('topNegativePath', {
      type: topPathType,
      nullable: true,
    });

    t.list.field('lineChartData', {
      nullable: true,
      type: lineChartDataType,
    });
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
    t.field('statistics', {
      type: DialogueStatistics,
      resolve(parent: Dialogue) {
        if (!parent.id) {
          return null;
        }

        return DialogueService.getLineData(parent.id, 7);
      },
    });

    t.field('interactions', {
      type: InteractionType,
      args: {
        filter: FilterInput,
      },
      async resolve(parent: Dialogue, args: any, ctx: any) {
        if (!parent.id) {
          return null;
        }
        const { pages, pageIndex, startDate, endDate, offset, limit, searchTerm } = args?.filter;
        const dateRange = SessionService.constructDateRangeWhereInput(startDate, endDate);
        const orderBy = args.filter.orderBy ? Object.assign({}, ...args.filter.orderBy) : null;

        const { pageSessions, totalPages, resetPages } = await NodeEntryService.getCurrentInteractionSessions(parent.id, offset, limit, pageIndex, orderBy, dateRange, searchTerm);

        const sessionsWithIndex = pageSessions.map((session: any, index: any) => ({ ...session, index }));

        return {
          sessions: sessionsWithIndex,
          pages: !resetPages ? totalPages : 1,
          offset,
          limit,
          pageIndex: !resetPages ? pageIndex : 0,
          startDate,
          endDate,
          orderBy: args.filter.orderBy || [],
        };
      },
    });

    t.list.field('tags', {
      type: TagType,
      nullable: true,
      async resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        if (!parent.id) {
          return null;
        }

        const dialogue = await prisma.dialogue.findOne({
          where: { id: parent.id },
          include: { tags: true },
        });

        return dialogue?.tags;
      },
    });

    t.list.field('interactionFeedItems', {
      nullable: true,
      type: SessionType,
      async resolve(parent) {
        if (!parent.id) {
          return null;
        }

        const interactionFeedItems = await DialogueService.interactionFeedItems(parent);
        const sliceLength = Math.min(interactionFeedItems.length, 3);

        return interactionFeedItems.slice(0, sliceLength);
      },
    });

    t.string('customerId');
    t.field('customer', {
      type: CustomerType,
      resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const customer = prisma.customer.findOne({
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
        where: QuestionNodeWhereInputType,
      },
      resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const questions = prisma.questionNode.findMany({
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
      args: {
        searchTerm: 'String',
      },
      async resolve(parent: Dialogue, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { searchTerm }: { searchTerm: string } = args;
        const leafWhereInput: QuestionNodeWhereInput = { AND: [
          {
            questionDialogueId: parent.id,
          },
          {
            isLeaf: true,
          },
        ] };

        const leafs = await prisma.questionNode.findMany({
          where: leafWhereInput,
          orderBy: {
            updatedAt: 'desc',
          },
        });

        if (searchTerm) {
          return leafs.filter((leaf) => leaf.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
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

        return dialogues;
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
];
