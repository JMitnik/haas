import { PrismaClient,
  TriggerCreateInput,
  TriggerUpdateInput } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

import { DialogueType } from '../questionnaire/Dialogue';
import { PaginationWhereInput } from '../general/Pagination';
import { QuestionNodeType } from '../question/QuestionNode';
import { UserType } from '../users/User';
import { resolve } from 'path';
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

    t.string('triggerId');
    t.field('question', {
      nullable: true,
      type: QuestionNodeType,
      async resolve(parent, args, ctx) {
        const questionOfTrigger = await ctx.prisma.questionOfTrigger.findMany({
          where: {
            triggerId: parent.triggerId,
            triggerConditionId: parent.id,
          },
          include: {
            question: true,
          },
        });

        if (!questionOfTrigger.length) return null;

        return questionOfTrigger[0].question;
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
        const questionsOfTrigger = await ctx.prisma.questionOfTrigger.findMany({
          where: {
            triggerId: parent.id,
          },
          include: {
            question: {
              select: {
                questionDialogue: true,
              },
            },
          },
        });

        if (!questionsOfTrigger.length) return null;

        return questionsOfTrigger[0].question.questionDialogue;
      },
    });

    t.list.field('conditions', {
      type: TriggerConditionType,
      resolve(parent, args, ctx) {
        return ctx.prisma.triggerCondition.findMany({ where: { triggerId: parent.id }, orderBy: { createdAt: 'asc' } });
      },
    });
    t.list.field('recipients', {
      type: UserType,
      async resolve(parent, args, ctx) {
        const users = await ctx.prisma.user.findMany({
          where: { triggers: { some: { id: parent.id } } },
        });

        return users || [];
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
        await ctx.prisma.questionOfTrigger.deleteMany({ where: { triggerId: args.id } });
        await ctx.prisma.triggerCondition.deleteMany({ where: { triggerId: args.id } });
        const trigger = await ctx.prisma.trigger.delete({ where: { id: args.id } });

        if (!trigger) throw new Error('Something went wrong during deletion of trigger');

        return trigger as any;
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

        return updatedTrigger as any;
      },
    });

    t.field('createTrigger', {
      type: TriggerType,
      args: {
        input: CreateTriggerInputType, // FIXME: args is still considered pre-input so if i don't make it any it won't work
      },
      async resolve(parent, args: any, ctx) {
        if (!args.input.customerSlug) throw new Error('No provided customer found');

        // TODO: Setup sensible defaults instead of these?
        const createArgs : TriggerCreateInput = {
          name: args.input.trigger?.name || '',
          medium: args.input.trigger?.medium || 'EMAIL',
          type: args.input.trigger?.type || 'QUESTION',
          customer: { connect: { slug: args.input.customerSlug } },
          relatedNode: undefined,
          recipients: { connect: args.input.recipients?.ids?.map((id: string) => ({ id })) },
        };

        const trigger = await ctx.prisma.trigger.create({
          data: createArgs,
        });

        const questionOfTriggers = await args.input.trigger?.conditions?.map(async (condition: any) => ctx.prisma.questionOfTrigger.create({
          data: {
            question: {
              connect: {
                id: condition?.questionId || undefined,
              },
            },
            trigger: {
              connect: {
                id: trigger.id,
              },
            },
            triggerCondition: {
              create: {
                type: condition.type || 'TEXT_MATCH',
                maxValue: condition.maxValue,
                minValue: condition.minValue,
                textValue: condition.textValue,
                trigger: {
                  connect: {
                    id: trigger.id,
                  },
                },
              },
            },
          },
        }));

        return trigger as any;
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

        const { triggers, pageInfo } = await TriggerService.paginatedTriggers(args.customerSlug, {
          limit: args.filter?.limit,
          offset: args.filter?.offset,
          orderBy: args.filter?.orderBy,
          search: args.filter?.searchTerm,
        });

        // TODO: Do we put this here, or extract it from the graph?
        // const users = await ctx.prisma.trigger.findMany({ where: { customerId: args.customerId } });

        return { triggers, pageInfo, offset: args.filter?.offset || 0, limit: args.filter?.limit || 0 };
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

        return trigger as any;
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
          }) as any;
        }

        if (args.dialogueId) {
          return TriggerService.findTriggersByDialogueId(args.dialogueId) as any;
        }

        if (args.customerSlug) {
          return prisma.trigger.findMany({
            where: {
              customer: {
                slug: args.customerSlug,
              },
            },
          }) as any;
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
