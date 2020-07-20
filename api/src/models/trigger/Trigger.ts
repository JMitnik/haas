import { PrismaClient,
  Trigger,
  TriggerCreateInput,
  TriggerUpdateInput } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

import { PaginationProps } from '../../types/generic';
import { PaginationWhereInput } from '../general/Pagination';
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

    // TODO: Return this?
    // t.string('triggerId', { nullable: true, resolve: (parent) => parent.triggerId });
  },
});

const TriggerType = objectType({
  name: 'TriggerType',

  definition(t) {
    t.string('id');
    t.string('name');
    t.field('type', { type: TriggerTypeEnum });
    t.field('medium', { type: TriggerMediumEnum });

    t.field('relatedNode', {
      type: QuestionNodeType,
      nullable: true,
      resolve(parent: Trigger, args, ctx) {
        if (parent.relatedNodeId) {
          return ctx.prisma.questionNode.findOne({ where: { id: parent.relatedNodeId },
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
      resolve(parent, args, ctx) {
        return ctx.prisma.triggerCondition.findMany({ where: { triggerId: parent.id } });
      },
    });
    t.list.field('recipients', {
      type: UserType,
      async resolve(parent: Trigger, args, ctx) {
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

const TriggerMutations = extendType({
  type: 'Mutation',

  definition(t) {
    t.field('deleteTrigger', {
      type: TriggerType,
      args: { id: 'String' },

      resolve(parent, args, ctx) {
        if (!args.id) throw new Error('No valid id for trigger provided');

        return ctx.prisma.trigger.delete({ where: { id: args.id } });
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

      async resolve(parent, args, ctx) {
        if (!args.triggerId) throw new Error('No valid trigger ID provided');

        const dbTrigger = await ctx.prisma.trigger.findOne({
          where: { id: args.triggerId },
          include: {
            conditions: true,
            recipients: true,
            relatedNode: true,
          },
        });

        if (!dbTrigger) throw new Error('Unable to find trigger with given ID');

        let updateTriggerArgs: TriggerUpdateInput = {
          name: args.trigger?.name || '',
          type: args.trigger?.type || 'QUESTION',
          medium: args.trigger?.medium || 'EMAIL',
        };

        updateTriggerArgs = TriggerService.updateRelatedQuestion(
          dbTrigger?.relatedNodeId, args.questionId, updateTriggerArgs,
        );

        if (dbTrigger?.recipients) {
          updateTriggerArgs = TriggerService.updateRecipients(
            dbTrigger.recipients, (args.recipients?.ids || []), updateTriggerArgs,
          );
        }

        if (dbTrigger?.conditions) {
          await TriggerService.updateConditions(dbTrigger.conditions, args.trigger?.conditions || [], dbTrigger.id);
        }

        const updatedTrigger = await ctx.prisma.trigger.update({
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
      async resolve(parent, args, ctx) {
        if (!args.customerSlug) throw new Error('No provided customer found');

        // TODO: Setup sensible defaults instead of these?
        const createArgs : TriggerCreateInput = {
          name: args.trigger?.name || '',
          medium: args.trigger?.medium || 'EMAIL',
          type: args.trigger?.type || 'QUESTION',
          customer: { connect: { slug: args.customerSlug } },
          relatedNode: { connect: { id: args.questionId || undefined } },
          recipients: { connect: args.recipients?.ids?.map((id: string) => ({ id })) },
          conditions: { create: args.trigger?.conditions?.map((condition) => ({
            type: condition.type || 'TEXT_MATCH',
            maxValue: condition.maxValue,
            minValue: condition.minValue,
            textValue: condition.textValue,
          })) },
        };

        return ctx.prisma.trigger.create({
          data: createArgs,
        });
      },
    });
  },
});

// TODO: Replace by generic connection interface
export const TriggerConnectionType = objectType({
  name: 'TriggerConnectionType',
  definition(t) {
    t.int('totalPages');
    t.int('pageIndex');
    t.int('pageSize');
    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });

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

      async resolve(parent, args, ctx) {
        const { pageIndex, offset, limit, searchTerm, orderBy }: PaginationProps = args.filter;

        if (args.filter) {
          return TriggerService.paginatedTriggers(
            args.customerSlug,
            pageIndex,
            offset,
            limit,
            orderBy?.[0],
            searchTerm,
          );
        }

        const users = await ctx.prisma.trigger.findMany({ where: { customerId: args.customerId } });
        const totalPages = Math.ceil(users.length / (limit || 0));

        return { users, pageIndex, totalPages };
      },
    });

    t.field('trigger', {
      type: TriggerType,
      args: { triggerId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.triggerId) throw new Error('No id provided');

        const trigger = await ctx.prisma.trigger.findOne({ where: { id: args.triggerId } });

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
  TriggerConditionEnum,
  TriggerConditionType,
  TriggerType,
  TriggerMutations,
  TriggerQueries,
];
