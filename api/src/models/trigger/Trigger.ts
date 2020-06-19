import { PrismaClient, Trigger, TriggerConditionCreateInput, TriggerCreateInput, TriggerUpdateInput } from '@prisma/client';
import { arg, enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { FilterInput } from '../session/Session';
import { QuestionNodeType } from '../question/QuestionNode';
import { UserType } from '../users/User';
import TriggerResolver from './trigger-resolver';

const prisma = new PrismaClient();

const TriggerTypeEnum = enumType({
  name: 'TriggerTypeEnum',
  members: ['QUESTION', 'SCHEDULED'],
});

const TriggerMediumEnum = enumType({
  name: 'TriggerMediumEnum',
  members: ['EMAIL', 'PHONE', 'BOTH'],
});

const TriggerConditionTypeEnum = enumType({
  name: 'TriggerConditionTypeEnum',
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
    t.field('type', {
      type: TriggerConditionTypeEnum,
    });
    t.int('minValue', { nullable: true });
    t.int('maxValue', { nullable: true });
    t.string('textValue', { nullable: true });
    t.string('triggerId');
  },
});

const TriggerType = objectType({
  name: 'TriggerType',
  definition(t) {
    t.string('id');
    t.string('name');
    t.field('type', {
      type: TriggerTypeEnum,
    });
    t.field('medium', {
      type: TriggerMediumEnum,
    });

    t.field('relatedNode', {
      type: QuestionNodeType,
      nullable: true,
      resolve(parent: Trigger, args: any, ctx: any) {
        if (parent.relatedNodeId) {
          return prisma.questionNode.findOne({ where: { id: parent.relatedNodeId } });
        }
        return null;
      },
    });
    t.list.field('conditions', {
      type: TriggerConditionType,
      resolve(parent: Trigger, args: any, ctx: any) {
        return prisma.triggerCondition.findMany({ where: { triggerId: parent.id } });
      },
    });
    t.list.field('recipients', {
      type: UserType,
      async resolve(parent: Trigger, args: any, ctx: any) {
        const users = await prisma.user.findMany({ where: {
          triggers: {
            some: {
              id: parent.id,
            },
          },
        } });
        return users;
      },
    });
  },
});

const TriggerConditionInputType = inputObjectType({
  name: 'TriggerConditionInputType',
  definition(t) {
    t.int('id');
    t.field('type', {
      type: TriggerConditionTypeEnum,
    });
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

const TriggerMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteTrigger', {
      type: TriggerType,
      args: {
        id: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.trigger.delete({ where: { id: args.id } });
      },
    });
    t.field('editTrigger', {
      type: TriggerType,
      args: {
        triggerId: 'String',
        questionId: 'String',
        recipients: RecipientsInputType,
        trigger: TriggerInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { name, type, medium, conditions } = args.trigger;
        const dbTrigger = await prisma.trigger.findOne({
          where: { id: args.triggerId },
          include: {
            conditions: true,
            recipients: true,
            relatedNode: true,
          },
        });
        let updateTriggerArgs: TriggerUpdateInput = { name, type, medium };
        updateTriggerArgs = TriggerResolver.updateRelatedQuestion(dbTrigger?.relatedNodeId, args.questionId, updateTriggerArgs);
        if (dbTrigger?.recipients) {
          updateTriggerArgs = TriggerResolver.updateRecipients(dbTrigger.recipients, args.recipients.ids, updateTriggerArgs);
        }

        if (dbTrigger?.conditions) {
          await TriggerResolver.updateConditions(dbTrigger.conditions, conditions, dbTrigger.id);
        }

        const updatedTrigger = await prisma.trigger.update({
          where: { id: dbTrigger?.id },
          data: updateTriggerArgs,
        });

        return updatedTrigger;
      },
    });
    t.field('createTrigger', {
      type: TriggerType,
      args: {
        customerId: 'String',
        questionId: 'String',
        recipients: RecipientsInputType,
        trigger: TriggerInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { name, type, medium, conditions } = args.trigger;
        const createArgs : TriggerCreateInput = { name, type, medium };
        const triggerConditions: TriggerConditionCreateInput[] = [];

        // TODO: Add the following code to trigger seed (if it will be added)
        if (args.customerId) {
          createArgs.customer = { connect: { id: args.customerId } };
        }

        if (args.questionId) {
          createArgs.relatedNode = { connect: { id: args.questionId } };
        }

        if (args.recipients.ids.length > 0) {
          createArgs.recipients = { connect: args.recipients.ids.map((id: string) => ({ id })) };
        }

        if (conditions.length > 0) {
          _.forEach(conditions, (condition) => triggerConditions.push(
            { type: condition.type,
              minValue: condition.minValue,
              maxValue: condition.maxValue,
              textValue: condition.textValue },
          ));
          createArgs.conditions = { create: triggerConditions };
        }

        return prisma.trigger.create({
          data: createArgs,
        });
      },
    });
  },
});

const TriggerQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('trigger', {
      type: TriggerType,
      args: {
        triggerId: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.trigger.findOne({ where: { id: args.triggerId } });
      },
    });
    t.list.field('triggers', {
      type: TriggerType,
      args: {
        customerId: 'String',
        dialogueId: 'String',
        userId: 'String',
        filter: FilterInput,
      },
      resolve(parent: any, args: any, ctx: any) {
        if (args.userId) {
          return prisma.trigger.findMany({
            where: {
              recipients: {
                some: {
                  id: args.userId,
                },
              },
            },
          });
        }

        if (args.dialogueId) {
          return prisma.trigger.findMany({
            where: {
              relatedNode: {
                questionDialogueId: args.dialogueId,
              },
            },
          });
        }

        if (args.customerId) {
          return prisma.trigger.findMany({
            where: {
              customerId: args.customerId,
            },
          });
        }
        return [];
      },
    });
  },
});

const triggerNexus = [
  TriggerTypeEnum,
  TriggerMediumEnum,
  TriggerConditionTypeEnum,
  TriggerConditionType,
  TriggerType,
  TriggerMutations,
  TriggerQueries,
];

export default triggerNexus;
