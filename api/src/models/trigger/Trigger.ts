import {
  TriggerUpdateInput,
  TriggerEnum,
} from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { DialogueType } from '../questionnaire/Dialogue';
import { PaginationWhereInput } from '../general/Pagination';
import { QuestionNodeType } from '../QuestionNode/QuestionNode';
import { UserType } from '../users/User';
import TriggerService from './TriggerService';
import { CreateTriggerInput } from './TriggerServiceType';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

const TriggerTypeEnum = enumType({
  name: 'TriggerTypeEnum',
  members: ['QUESTION', 'SCHEDULED'],
});

const TriggerMediumEnum = enumType({
  name: 'TriggerMediumEnum',
  members: ['EMAIL', 'PHONE', 'BOTH'],
});

const TriggerConditionEnum = enumType({
  name: 'TriggerConditionEnum',
  members: ['LOW_THRESHOLD',
    'HIGH_THRESHOLD',
    'INNER_RANGE',
    'OUTER_RANGE',
    'TEXT_MATCH'],
});

const TriggerConditionType = objectType({
  name: 'TriggerConditionType',
  definition(t) {
    t.int('id');
    t.field('type', { type: TriggerConditionEnum });
    t.int('minValue', { nullable: true });
    t.int('maxValue', { nullable: true });
    t.string('textValue', { nullable: true });

    t.string('triggerId');
    t.field('question', {
      nullable: true,
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        return ctx.services.triggerService.getQuestionOfTrigger(parent.triggerId, parent.id);
      },
    });
  },
});

const TriggerType = objectType({
  name: 'TriggerType',

  definition(t) {
    t.string('id');
    t.string('name');
    t.field('type', { type: TriggerTypeEnum });
    t.field('medium', { type: TriggerMediumEnum });

    t.string('relatedNodeId', { nullable: true });
    t.field('relatedDialogue', {
      type: DialogueType,
      nullable: true,

      async resolve(parent, args, ctx) {
        return ctx.services.triggerService.getDialogueOfTrigger(parent.id)
      },
    });

    t.list.field('conditions', {
      type: TriggerConditionType,
      resolve(parent, args, ctx) {
        return ctx.services.triggerService.getConditionsOfTrigger(parent.id);
      },
    });
    t.list.field('recipients', {
      type: UserType,
      async resolve(parent, args, ctx) {
        return ctx.services.userService.getRecipientsOfTrigger(parent.id);
      },
    });
  },
});

const TriggerConditionInputType = inputObjectType({
  name: 'TriggerConditionInputType',
  definition(t) {
    t.int('id');
    t.string('questionId');
    t.field('type', { type: TriggerConditionEnum });
    t.int('minValue', { nullable: true });
    t.int('maxValue', { nullable: true });
    t.string('textValue', { nullable: true });
  },
});

const TriggerInputType = inputObjectType({
  name: 'TriggerInputType',
  definition(t) {
    t.string('name');
    t.field('type', { type: TriggerTypeEnum });
    t.field('medium', { type: TriggerMediumEnum });
    t.list.field('conditions', { type: TriggerConditionInputType });
  },
});

const RecipientsInputType = inputObjectType({
  name: 'RecipientsInputType',
  definition(t) {
    t.list.string('ids');
  },
});

const CreateTriggerInputType = inputObjectType({
  name: 'CreateTriggerInputType',
  definition(t) {
    t.string('customerSlug');
    t.field('recipients', {
      type: RecipientsInputType,
    });
    t.field('trigger', {
      type: TriggerInputType,
    });
  },
});

const TriggerMutations = extendType({
  type: 'Mutation',

  definition(t) {
    t.field('deleteTrigger', {
      type: TriggerType,
      args: { id: 'String', customerSlug: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.id) throw new Error('No valid id for trigger provided');

        // Clean up trail

        const trigger = await ctx.services.triggerService.deleteTrigger(args.id);

        if (!trigger) throw new Error('Something went wrong during deletion of trigger');

        return trigger;
      },
    });

    t.field('editTrigger', {
      type: TriggerType,
      args: {
        triggerId: 'String',
        customerSlug: 'String',
        recipients: RecipientsInputType,
        trigger: TriggerInputType,
      },

      async resolve(parent, args, ctx) {
        const validatedType = Object.values(TriggerEnum).find((type) => type === args.trigger?.type);
        if (!args.triggerId || !validatedType || !args.trigger?.name || !args.trigger?.medium) throw new Error('Missing input data!');

        let updateTriggerArgs: TriggerUpdateInput = {
          name: args.trigger?.name,
          type: validatedType,
          medium: args.trigger?.medium,
        };

        const recipientIds = args.recipients?.ids || [];
        const conditions: Array<NexusGenInputs['TriggerConditionInputType']> = args.trigger.conditions || [];

        return ctx.services.triggerService.editTrigger(args.triggerId, updateTriggerArgs, recipientIds, conditions) as any;
      },
    });

    t.field('createTrigger', {
      type: TriggerType,
      args: {
        input: CreateTriggerInputType,
      },
      async resolve(parent, args, ctx) {
        if (!args.input?.customerSlug) throw new Error('No provided customer found');
        if (!args.input.trigger?.name) throw new UserInputError('No trigger name provided');
        if (!args.input.trigger?.medium) throw new UserInputError('No trigger medium provided');
        if (!args.input.trigger?.type) throw new UserInputError('No trigger type provided');

        const createArgs: CreateTriggerInput = {
          name: args.input.trigger?.name,
          medium: args.input.trigger?.medium,
          type: args.input.trigger?.type,
          customerSlug: args.input.customerSlug,
          recipients: args.input.recipients?.ids?.map((id: string) => ({ id })) || [],
        };

        return ctx.services.triggerService.createTrigger(createArgs, args.input.trigger?.conditions || []);
      },
    });
  },
});

// TODO: Replace by generic connection interface
export const TriggerConnectionType = objectType({
  name: 'TriggerConnectionType',
  definition(t) {
    t.implements('ConnectionInterface');
    t.list.field('triggers', { type: TriggerType });
  },
});

const TriggerQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('triggerConnection', {
      type: TriggerConnectionType,
      args: {
        customerSlug: 'String',
        filter: PaginationWhereInput,
      },
      nullable: true,

      async resolve(parent, args) {
        if (!args.customerSlug) throw new Error('No customer provided');

        const { entries, pageInfo } = await TriggerService.paginatedTriggers(args.customerSlug, {
          limit: args.filter?.limit,
          offset: args.filter?.offset,
          orderBy: args.filter?.orderBy,
          search: args.filter?.searchTerm,
        });

        // TODO: Do we put this here, or extract it from the graph?
        // const users = await ctx.prisma.trigger.findMany({ where: { customerId: args.customerId } });

        return {
          triggers: entries as NexusGenFieldTypes['TriggerType'][],
          pageInfo,
          offset: args.filter?.offset || 0,
          limit: args.filter?.limit || 0
        };
      },
    });

    t.field('trigger', {
      type: TriggerType,
      args: { triggerId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.triggerId) throw new Error('No id provided');

        const trigger = await ctx.services.triggerService.getTriggerById(args.triggerId);

        if (!trigger) throw new Error('Cant find trigger');

        return trigger;
      },
    });

    t.list.field('triggers', {
      type: TriggerType,
      args: {
        customerSlug: 'String',
        dialogueId: 'String',
        userId: 'String',
        filter: PaginationWhereInput,
      },
      resolve(parent, args, ctx) {
        if (args.userId) {
          return ctx.services.triggerService.getTriggersByUserId(args.userId);
        };

        if (args.dialogueId) {
          return ctx.services.triggerService.findTriggersByDialogueId(args.dialogueId);
        };

        if (args.customerSlug) {
          return ctx.services.triggerService.getTriggersByCustomerSlug(args.customerSlug);
        }
        return [];
      },
    });
  },
});

export default [
  TriggerTypeEnum,
  TriggerMediumEnum,
  TriggerConditionEnum,
  TriggerConditionType,
  TriggerType,
  TriggerMutations,
  TriggerQueries,
];
