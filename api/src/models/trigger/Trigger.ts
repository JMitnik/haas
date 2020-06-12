import { PrismaClient, Trigger, TriggerConditionCreateInput, TriggerCreateInput, User } from '@prisma/client';
import { arg, enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { UserType } from '../users/User';

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

const TriggerMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTrigger', {
      type: TriggerType,
      args: {
        userId: 'String',
        trigger: TriggerInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { name, type, medium, conditions } = args.trigger;
        const createArgs : TriggerCreateInput = { name, type, medium };
        const triggerConditions: TriggerConditionCreateInput[] = [];
        if (args.userId) {
          createArgs.recipients = { connect: { id: args.userId } };
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
    t.list.field('triggers', {
      type: TriggerType,
      args: {
        userId: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        return prisma.trigger.findMany({
          where: {
            recipients: {
              some: {
                id: args.userId,
              },
            },
          },
        });
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
