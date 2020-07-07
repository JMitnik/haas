import { PrismaClient,
  Trigger,
  TriggerConditionCreateInput,
  TriggerCreateInput,
  TriggerUpdateInput } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';
import _ from 'lodash';

import { FilterInput, SortFilterObject } from '../session/Session';
import { PaginationProps } from '../../types/generic';
import { QuestionNodeType } from '../question/QuestionNode';
import { UserType } from '../users/User';
import TriggerService from './TriggerService';

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
        const { prisma }: { prisma: PrismaClient } = ctx;
        if (parent.relatedNodeId) {
          return prisma.questionNode.findOne({ where: { id: parent.relatedNodeId },
            include: {
              questionDialogue: {
                select: {
                  slug: true,
                },
              },
            } });
        }
        return null;
      },
    });
    t.list.field('conditions', {
      type: TriggerConditionType,
      resolve(parent: Trigger, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.triggerCondition.findMany({ where: { triggerId: parent.id } });
      },
    });
    t.list.field('recipients', {
      type: UserType,
      async resolve(parent: Trigger, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
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
        const { prisma }: { prisma: PrismaClient } = ctx;
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
        const { prisma }: { prisma: PrismaClient } = ctx;
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

        updateTriggerArgs = TriggerService.updateRelatedQuestion(
          dbTrigger?.relatedNodeId, args.questionId, updateTriggerArgs,
        );

        if (dbTrigger?.recipients) {
          updateTriggerArgs = TriggerService.updateRecipients(
            dbTrigger.recipients, args.recipients.ids, updateTriggerArgs,
          );
        }

        if (dbTrigger?.conditions) {
          await TriggerService.updateConditions(dbTrigger.conditions, conditions, dbTrigger.id);
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
        customerSlug: 'String',
        questionId: 'String',
        recipients: RecipientsInputType,
        trigger: TriggerInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { name, type, medium, conditions } = args.trigger;
        const createArgs : TriggerCreateInput = { name, type, medium };
        const triggerConditions: TriggerConditionCreateInput[] = [];

        // TODO: Put this in the TriggerService

        if (args.customerSlug) {
          createArgs.customer = { connect: { slug: args.customerSlug } };
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

export const TriggerTableType = objectType({
  name: 'TriggerTableType',
  definition(t) {
    t.int('totalPages');
    t.int('pageIndex');
    t.int('pageSize');
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });

    t.list.field('orderBy', { type: SortFilterObject });

    t.list.field('triggers', { type: TriggerType });
  },
});

const TriggerQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('triggerTable', {
      type: TriggerTableType,
      args: {
        customerSlug: 'String',
        filter: FilterInput,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { pageIndex, offset, limit, searchTerm, orderBy }: PaginationProps = args.filter;

        if (args.filter) {
          return TriggerService.paginatedTriggers(args.customerSlug, pageIndex, offset, limit, orderBy[0], searchTerm);
        }

        const users = await prisma.trigger.findMany({ where: { customerId: args.customerId } });
        const totalPages = Math.ceil(users.length / limit);

        return { users, pageIndex, totalPages };
      },
    });
    t.field('trigger', {
      type: TriggerType,
      args: {
        triggerId: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.trigger.findOne({ where: { id: args.triggerId } });
      },
    });

    t.list.field('triggers', {
      type: TriggerType,
      args: {
        customerSlug: 'String',
        dialogueId: 'String',
        userId: 'String',
        filter: FilterInput,
      },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
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
          return TriggerService.findTriggersByDialogueId(args.dialogueId);
        }

        if (args.customerSlug) {
          return prisma.trigger.findMany({
            where: {
              customer: {
                slug: args.customerSlug,
              },
            },
          });
        }
        return [];
      },
    });
  },
});

export default [
  TriggerTypeEnum,
  TriggerMediumEnum,
  TriggerConditionTypeEnum,
  TriggerConditionType,
  TriggerType,
  TriggerMutations,
  TriggerQueries,
];
