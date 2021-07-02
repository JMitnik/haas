
import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { subDays } from 'date-fns';

// eslint-disable-next-line import/no-cycle
import { CustomerType } from '../customer/Customer';
// eslint-disable-next-line import/no-cycle
import { EdgeType } from '../edge/Edge';
// eslint-disable-next-line import/no-cycle
import { QuestionNodeType } from '../QuestionNode/QuestionNode';
// eslint-disable-next-line import/no-cycle
import { SessionConnection, SessionType } from '../session/Session';
// eslint-disable-next-line import/no-cycle
import { TagType, TagsInputType } from '../tag/Tag';
// eslint-disable-next-line import/no-cycle
import DialogueService from './DialogueService';
// eslint-disable-next-line import/no-cycle
import { PaginationWhereInput } from '../general/Pagination';
// eslint-disable-next-line import/no-cycle
import PaginationService from '../general/PaginationService';
// eslint-disable-next-line import/no-cycle
import SessionService from '../session/SessionService';
import formatDate from '../../utils/formatDate';
import isValidDate from '../../utils/isValidDate';

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
    t.string('basicSentiment', { nullable: true });
  },
});

export const DialogueStatistics = objectType({
  name: 'DialogueStatistics',

  definition(t) {
    t.int('nrInteractions');

    t.list.field('topPositivePath', {
      type: topPathType,
      nullable: true,
    });

    t.list.field('topNegativePath', {
      type: topPathType,
      nullable: true,
    });

    t.field('mostPopularPath', {
      type: topPathType,
      nullable: true,
    });

    t.list.field('history', {
      nullable: true,
      type: lineChartDataType,
    });
  },
});

export const DialogueFilterInputType = inputObjectType({
  name: 'DialogueFilterInputType',

  definition(t) {
    t.string('searchTerm', { nullable: true });
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
  },
});

export const DialogueFinisherType = objectType({
  name: 'DialogueFinisherObjectType',
  definition(t) {
    t.id('id');
    t.string('header');
    t.string('subtext');
  }
});

export const DialogueType = objectType({
  name: 'Dialogue',

  definition(t) {
    t.id('id');
    t.string('title');
    t.string('slug');
    t.string('description');

    // Placeholder data related properties
    t.boolean('isWithoutGenData');
    t.boolean('wasGeneratedWithGenData');
    t.field('language', {
      type: LanguageEnumType,
    });

    t.string('publicTitle', { nullable: true });
    t.string('creationDate', { nullable: true });
    t.string('updatedAt', { nullable: true });

    t.field('postLeafNode', {
      type: DialogueFinisherType,
      nullable: true,
      resolve(parent, args, ctx) {
        if (!parent.postLeafNodeId) {
          return null
        };
        return ctx.prisma.postLeafNode.findFirst({
          where: {
            id: parent.postLeafNodeId,
          }
        });
      }
    });

    t.field('averageScore', {
      type: 'Float',
      args: { input: DialogueFilterInputType },
      async resolve(parent, args) {
        if (!parent.id) {
          return 0;
        }

        if (args.input?.startDate && !isValidDate(args.input.startDate)) {
          throw new UserInputError('Start date invalid');
        }

        if (args.input?.endDate && !isValidDate(args.input.endDate)) {
          throw new UserInputError('End date invalid');
        }

        const score = await DialogueService.calculateAverageDialogueScore(parent.id, {
          startDate: args.input?.startDate,
          endDate: args.input?.endDate,
        });

        return score;
      },
    });

    t.field('statistics', {
      type: DialogueStatistics,
      args: { input: DialogueFilterInputType },
      nullable: true,

      async resolve(parent, args) {
        const startDate = args.input?.startDate ? formatDate(args.input.startDate) : subDays(new Date(), 7);
        const endDate = args.input?.endDate ? formatDate(args.input.endDate) : null;

        const statistics = await DialogueService.getStatistics(
          parent.id,
          startDate,
          endDate,
        );

        if (!statistics) {
          return {
            nrInteractions: 0,
            history: [],
            topNegativePath: [],
            topPositivePath: [],
          };
        }

        return statistics;
      },
    });

    t.field('sessionConnection', {
      type: SessionConnection,
      args: { filter: PaginationWhereInput },
      nullable: true,

      async resolve(parent, args) {
        if (!parent.id) return null;

        const sessionConnection = await SessionService.getSessionConnection(parent.id, {
          startDate: args.filter?.startDate ? PaginationService.formatDate(args.filter?.startDate) : null,
          endDate: args.filter?.endDate ? PaginationService.formatDate(args.filter?.endDate) : null,
          limit: args.filter?.limit,
          offset: args.filter?.offset,
          orderBy: args.filter?.orderBy,
          pageIndex: args.filter?.pageIndex,
          searchTerm: args.filter?.searchTerm,
        });

        if (!sessionConnection) return null;

        return sessionConnection;
      },
    });

    t.list.field('tags', {
      type: TagType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.id) {
          return [];
        }

        const dialogue = await ctx.prisma.dialogue.findOne({
          where: { id: parent.id },
          include: { tags: true },
        });

        return dialogue?.tags || [];
      },
    });

    t.string('customerId');
    t.field('customer', {
      type: CustomerType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.customerId) {
          throw new Error('Cant find associated customer of dialogue');
        }

        const customer = await ctx.prisma.customer.findOne({
          where: { id: parent.customerId },
        });

        if (!customer) {
          throw new Error('Unable to find associated customer of dialogue.');
        }

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
          include: {
            form: {
              include: {
                fields: true,
              },
            },
            sliderNode: {
              include: {
                markers: {
                  include: {
                    range: true,
                  },
                },
              },
            },
          },
        });

        return rootQuestions[0];
      },
    });

    t.list.field('edges', {
      type: EdgeType,
      async resolve(parent, args, ctx) {
        const dialogue = await ctx.prisma.dialogue.findOne({
          where: {
            id: parent.id,
          },
          include: {
            edges: {},
          },
        });

        const edges = dialogue?.edges;

        return edges || [];
      },
    });

    t.list.field('questions', {
      type: QuestionNodeType,

      async resolve(parent, args, ctx) {
        const questions = await ctx.prisma.questionNode.findMany({
          where: {
            AND: [
              { questionDialogueId: parent.id },
              {
                isLeaf: false,
              },
            ],
          },
          orderBy: {
            creationDate: 'asc',
          },
          include: {
            form: {
              include: {
                fields: true,
              },
            },
            options: {
              orderBy: { position: 'asc' },
            },
            sliderNode: {
              include: {
                markers: {
                  include: {
                    range: true,
                  },
                },
              },
            },
          },
        });

        return questions;
      },
    });

    t.list.field('sessions', {
      type: SessionType,
      args: { take: 'Int' },

      async resolve(parent, args) {
        const dialogueWithSessions = await SessionService.fetchSessionsByDialogue(parent.id);

        if (args.take) {
          return dialogueWithSessions?.length ? dialogueWithSessions.slice(0, args.take) || [] : [];
        }

        return dialogueWithSessions || [];
      },
    });

    t.list.field('leafs', {
      type: QuestionNodeType,
      args: {
        searchTerm: 'String',
      },
      async resolve(parent, args, ctx) {
        const leafs = await ctx.prisma.questionNode.findMany({
          where: {
            AND: [
              { questionDialogueId: parent.id },
              { isLeaf: true },
            ],
          },
          orderBy: { updatedAt: 'desc' },
          include: {
            form: {
              include: {
                fields: true,
              },
            },
          },
        });

        if (args.searchTerm) {
          const lowerCasedSearch = args.searchTerm.toLowerCase();
          return leafs.filter((leaf) => leaf.title.toLowerCase().includes(lowerCasedSearch));
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

export const DeleteDialogueInputType = inputObjectType({
  name: 'DeleteDialogueInputType',
  definition(t) {
    t.id('id');
    t.string('customerSlug');
  },
});

export const LanguageEnumType = enumType({
  name: 'LanguageEnumType',
  members: ['ENGLISH', 'DUTCH', 'GERMAN'],
});

export const CreateDialogueInputType = inputObjectType({
  name: 'CreateDialogueInputType',
  definition(t) {
    t.string('customerSlug');
    t.string('title');
    t.string('dialogueSlug');
    t.string('description');
    t.boolean('isSeed');
    t.string('contentType');

    t.string('templateDialogueId', { nullable: true });
    t.string('publicTitle', { nullable: true });

    t.field('tags', {
      type: TagsInputType,
    });
    t.field('language', {
      type: LanguageEnumType,
    });
  },
});

export const DialogueMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('copyDialogue', {
      type: DialogueType,
      args: { input: CreateDialogueInputType },

      async resolve(parent, args: any, ctx: any) {
        const {
          input: { dialogueSlug, customerSlug, title, publicTitle, description, tags = [], templateDialogueId },
        } = args;
        // TODO: Add language option to copy function
        const { prisma }: { prisma: PrismaClient } = ctx;

        const dialogueTags = tags?.entries?.length > 0
          ? tags?.entries?.map((tag: string) => ({ id: tag }))
          : [];

        const customers = await prisma.customer.findMany({ where: { slug: customerSlug } });
        const customer = customers?.[0];

        if (!customer) throw new Error('Cant find customer related');

        return DialogueService.copyDialogue(
          templateDialogueId, customer?.id, title, dialogueSlug, description, publicTitle, dialogueTags,
        );
      },
    });

    t.field('createDialogue', {
      type: DialogueType,
      args: { input: CreateDialogueInputType },

      async resolve(parent, args) {
        if (!args.input) {
          throw new Error('Unable to find any input data');
        }

        return DialogueService.createDialogue(args.input);
      },
    });

    t.field('editDialogue', {
      type: DialogueType,
      // TODO: Move args to their own InputType
      args: {
        customerSlug: 'String',
        dialogueSlug: 'String',
        title: 'String',
        description: 'String',
        publicTitle: 'String',
        isWithoutGenData: 'Boolean',
        tags: TagsInputType,
        language: LanguageEnumType,
        dialogueFinisherHeading: 'String',
        dialogueFinisherSubheading: 'String',
      },
      resolve(parent, args) {
        return DialogueService.editDialogue(args);
      },
    });

    t.field('deleteDialogue', {
      type: DialogueType,
      args: { input: DeleteDialogueInputType },

      resolve(parent, args) {
        if (!args.input?.id) {
          throw new Error('Unable to find dialogue to delete');
        }

        return DialogueService.deleteDialogue(args.input?.id);
      },
    });
  },
});

export const DialogueRootQuery = extendType({
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
        if (!args.dialogueId || !args.numberOfDaysBack || !args.limit || !args.offset) {
          return [];
        }

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
      args: { where: DialogueWhereUniqueInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.where?.id) {
          throw new Error('No valid id supplied');
        }

        const dialogue = await ctx.prisma.dialogue.findOne({
          where: { id: args.where.id },
        });

        if (!dialogue) {
          throw new Error('Unable to find dialogue with supplied id');
        }

        return dialogue;
      },
    });

    t.list.field('dialogues', {
      type: DialogueType,
      args: {
        filter: DialogueFilterInputType,
      },
      async resolve(parent, args, ctx) {
        let dialogues = await ctx.prisma.dialogue.findMany({
          include: {
            tags: true,
          },
        });

        // TODO: Put this in a single service
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
  DialogueRootQuery,
  DialogueStatistics,
];
