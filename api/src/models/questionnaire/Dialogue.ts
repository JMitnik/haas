
import { Dialogue, DialogueWhereInput, PrismaClient } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { EdgeType } from '../edge/Edge';
// eslint-disable-next-line import/no-cycle
import { QuestionNodeType, QuestionNodeWhereInput } from '../question/QuestionNode';
// eslint-disable-next-line import/no-cycle
import { FilterInput, InteractionType, SessionType } from '../session/Session';
// eslint-disable-next-line import/no-cycle
import { TagType, TagsInputType } from '../tag/Tag';
// eslint-disable-next-line import/no-cycle
import DialogueService from './DialogueService';
import NodeEntryService from '../node-entry/NodeEntryService';
// eslint-disable-next-line import/no-cycle
import SessionService from '../session/SessionService';

export const TEXT_NODES = [
  'TEXTBOX',
  'CHOICE',
];

export const lineChartDataType = objectType({
  name: 'lineChartDataType',

  definition(t) {
    t.string('x', { nullable: true });
    t.int('y', { nullable: true });
    t.string('entryId', { nullable: true });
  },
});

export const topPathType = objectType({
  name: 'topPathType',

  definition(t) {
    t.string('answer', { nullable: true });
    t.int('quantity', { nullable: true });
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

    t.list.field('history', {
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
      async resolve(parent) {
        if (!parent.id) {
          return 0.0;
        }

        const score = await DialogueService.calculateAverageDialogueScore(parent.id);

        return score;
      },
    });

    t.int('countInteractions', {
      nullable: true,

      async resolve(parent) {
        const interactions = await DialogueService.countInteractions(parent.id);

        return interactions || null;
      },
    });

    t.field('statistics', {
      type: DialogueStatistics,
      nullable: true,

      async resolve(parent) {
        const statistics = await DialogueService.getStatistics(parent.id, 7);

        if (!statistics) {
          return {
            history: [],
            topNegativePath: [],
            topPositivePath: [],
          };
        }

        return statistics;
      },
    });

    t.field('interactions', {
      type: InteractionType,
      args: { filter: FilterInput },
      async resolve(parent, args) {
        if (!parent.id) {
          return null;
        }

        const { pageIndex, startDate, endDate, offset, limit, searchTerm } = args?.filter;
        const dateRange = SessionService.constructDateRangeWhereInput(startDate, endDate);
        const orderBy = args.filter.orderBy ? Object.assign({}, ...args.filter.orderBy) : null;

        const { pageSessions, totalPages, resetPages } = await NodeEntryService.getCurrentInteractionSessions(
          parent.id,
          offset,
          limit,
          pageIndex,
          orderBy,
          dateRange,
          searchTerm,
        );

        const sessionsWithIndex = pageSessions.map((session, index) => ({ ...session, index }));

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
      async resolve(parent, args, ctx) {
        if (!parent.id) {
          return null;
        }

        const dialogue = await ctx.prisma.dialogue.findOne({
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

        const interactionFeedItems = await DialogueService.getDialogueInteractionFeedItems(parent.id);
        const nrItems = Math.min(interactionFeedItems.length, 3);

        return interactionFeedItems.slice(0, nrItems);
      },
    });

    t.string('customerId');
    t.field('customer', {
      type: CustomerType,

      resolve(parent, args, ctx) {
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
      async resolve(parent, args, ctx) {
        const rootQuestions = await ctx.prisma.questionNode.findMany({
          where: {
            isRoot: true,
          },
        });

        return rootQuestions[0];
      },
    });

    t.list.field('edges', {
      type: EdgeType,
      async resolve(parent: Dialogue, args, ctx) {
        const dialogue = await ctx.prisma.dialogue.findOne({
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
      resolve(parent: Dialogue, args, ctx) {
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
      async resolve(parent: Dialogue, args, ctx) {
        const dialogueWithSessions = await ctx.prisma.dialogue.findOne({
          where: { id: parent.id },
          include: { sessions: true },
        });

        return dialogueWithSessions?.sessions;
      },
    });

    t.list.field('leafs', {
      type: QuestionNodeType,
      resolve(parent: Dialogue, args, ctx) {
        const leafs = ctx.prisma.questionNode.findMany({
          where: {
            AND: [
              { questionDialogueId: parent.id },
              { isLeaf: true },
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
      resolve(parent, args) {
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
      resolve(parent, args) {
        return DialogueService.editDialogue(args);
      },
    });

    t.field('deleteDialogue', {
      type: DialogueType,
      args: {
        where: DialogueWhereUniqueInput,
      },
      resolve(parent, args) {
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
      resolve(parent, args) {
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
      async resolve(parent, args, ctx) {
        if (args.where.slug) {
          return {};
        }

        const dialogue = await ctx.prisma.dialogue.findOne({
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
      async resolve(parent, args, ctx) {
        let dialogues = await ctx.prisma.dialogue.findMany({
          where: args?.filter,
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
