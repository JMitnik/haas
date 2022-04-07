
import { UserInputError } from 'apollo-server-express';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { subDays } from 'date-fns';

import { DialgoueStatisticsLineChartDataType, DialogueStatistics } from './graphql/DialogueStatistics';
import { CustomerType } from '../customer/graphql/Customer';
import { EdgeType } from '../edge/Edge';
import { QuestionNodeType } from '../QuestionNode/QuestionNode';
import { SessionConnection, SessionType } from '../session/graphql/Session';
import { TagType, TagsInputType } from '../tag/Tag';
import DialogueService from './DialogueService';
import { PaginationWhereInput } from '../general/Pagination';
import PaginationService from '../general/PaginationService';
import SessionService from '../session/SessionService';
import formatDate from '../../utils/formatDate';
import isValidDate from '../../utils/isValidDate';
import { CopyDialogueInputType } from './DialogueTypes';
import { SessionConnectionFilterInput } from '../session/graphql';

export const TEXT_NODES = [
  'TEXTBOX',
  'CHOICE',
];


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
  },
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
          },
        });
      },
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
      args: { filter: SessionConnectionFilterInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.id) return null;
        const sessionConnection = await ctx.services.sessionService.getSessionConnection(
          parent.id,
          args.filter
        );

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

        return ctx.services.dialogueService.getTagsByDialogueId(parent.id);
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
        const customer = await ctx.services.customerService.findWorkspaceById(parent.customerId);

        if (!customer) {
          throw new Error('Unable to find associated customer of dialogue.');
        }

        return customer;
      },
    });

    t.field('rootQuestion', {
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        const rootQuestion = await ctx.services.dialogueService.getRootQuestionByDialogueId(parent.id);
        if (!rootQuestion) throw Error('No root question found');

        return rootQuestion;
      },
    });

    t.list.field('edges', {
      type: EdgeType,
      async resolve(parent, args, ctx) {
        return ctx.services.dialogueService.getEdgesByDialogueId(parent.id);
      },
    });

    t.list.field('questions', {
      type: QuestionNodeType,

      async resolve(parent, args, ctx) {
        const questions = await ctx.services.dialogueService.getQuestionsByDialogueId(parent.id);
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
        return ctx.services.dialogueService.getCTAsByDialogueId(parent.id, args.searchTerm);
      },
    });

    t.list.field('campaignVariants', {
      type: 'CampaignVariantType',
      // @ts-ignore
      resolve: (parent, args, ctx) => {
        return ctx.services.dialogueService.getCampaignVariantsByDialogueId(parent.id);
      },
    })
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

      async resolve(parent, args: any, ctx) {
        const {
          input: { dialogueSlug, customerSlug, title, publicTitle, description, tags = [], templateDialogueId, language },
        } = args;
        const copyDialogueInput: CopyDialogueInputType = { customerSlug, dialogueSlug, templateId: templateDialogueId, title, publicTitle, description, dialogueTags: tags, language };

        return ctx.services.dialogueService.copyDialogue(copyDialogueInput);
      },
    });

    t.field('createDialogue', {
      type: DialogueType,
      args: { input: CreateDialogueInputType },

      async resolve(parent, args, ctx) {
        if (!args.input) {
          throw new Error('Unable to find any input data');
        }
        return ctx.services.dialogueService.createDialogue(args.input);
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
      resolve(parent, args, ctx) {
        return ctx.services.dialogueService.editDialogue(args);
      },
    });

    t.field('deleteDialogue', {
      type: DialogueType,
      args: { input: DeleteDialogueInputType },

      resolve(parent, args, ctx) {
        if (!args.input?.id) {
          throw new Error('Unable to find dialogue to delete');
        }

        return ctx.services.dialogueService.deleteDialogue(args.input?.id);
      },
    });
  },
});

export const DialogueRootQuery = extendType({
  type: 'Query',

  definition(t) {
    t.field('dialogue', {
      type: DialogueType,
      args: { where: DialogueWhereUniqueInput },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.where?.id) {
          throw new Error('No valid id supplied');
        }

        const dialogue = await ctx.services.dialogueService.getDialogueById(args.where.id);

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
        return ctx.services.dialogueService.getFilteredDialogues(args.filter?.searchTerm);
      },
    });
  },
});

export default [
  DialogueWhereUniqueInput,
  DialogueMutations,
  DialogueType,
  DialogueRootQuery,
  DialogueStatistics,
];
