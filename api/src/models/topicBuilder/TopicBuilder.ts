import { PrismaClient } from '@prisma/client';
import { extendType, inputObjectType } from '@nexus/schema';
import DialogueService from '../questionnaire/DialogueService';

export const LeafNodeInput = inputObjectType({
  name: 'LeafNodeInput',

  definition(t) {
    t.id('id');
    t.string('type');
    t.string('title');
  },
});

export const QuestionConditionInput = inputObjectType({
  name: 'QuestionConditionInput',

  definition(t) {
    t.int('id');
    t.string('conditionType');
    t.int('renderMin', { nullable: true });
    t.int('renderMax', { nullable: true });
    t.string('matchValue', { nullable: true });
  },
});

export const EdgeNodeInput = inputObjectType({
  name: 'EdgeNodeInput',

  definition(t) {
    t.id('id');
    t.string('title');
  },
});

export const EdgeChildInput = inputObjectType({
  name: 'EdgeChildInput',

  definition(t) {
    t.id('id');

    t.list.field('conditions', {
      type: QuestionConditionInput,
    });

    t.field('parentNode', {
      type: EdgeNodeInput,
    });

    t.field('childNode', {
      type: EdgeNodeInput,
    });
  },
});

export const QuestionOptionInput = inputObjectType({
  name: 'OptionInput',

  definition(t) {
    t.int('id');
    t.string('value');
    t.string('publicValue', { nullable: true });
  },
});

export const QuestionInput = inputObjectType({
  name: 'QuestionInput',

  definition(t) {
    t.id('id');
    t.string('title');
    t.boolean('isRoot');
    t.boolean('isLeaf');
    t.string('type');

    t.field('overrideLeaf', {
      type: LeafNodeInput,

    });
    t.list.field('options', {
      type: QuestionOptionInput,
    });

    t.list.field('children', {
      type: EdgeChildInput,
    });
  },
});

export const TopicDataEntryInput = inputObjectType({
  name: 'TopicDataEntry',

  definition(t) {
    t.id('id');
    t.list.field('questions', {
      type: QuestionInput,
    });
  },
});

export const topicBuilderMutations = extendType({
  type: 'Mutation',
  
  definition(t) {
    t.field('updateTopicBuilder', {
      type: 'String',
      args: {
        dialogueSlug: 'String',
        customerSlug: 'String',
        topicData: TopicDataEntryInput,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        if (!args.dialogueSlug || !args.customerSlug) {
          return null;
        }

        const customer = await prisma.customer.findOne({
          where: { slug: args.customerSlug },
          include: {
            dialogues: {
              where: { slug: args.dialogueSlug },
            },
          },
        });

        const dialogue = customer?.dialogues?.[0];

        return DialogueService.updateTopicBuilder({ ...args, id: dialogue?.id });
      },
    });
  },
});

const topicBuilderNexus = [
  LeafNodeInput,
  QuestionConditionInput,
  EdgeNodeInput,
  EdgeChildInput,
  QuestionOptionInput,
  QuestionInput,
  TopicDataEntryInput,
  topicBuilderMutations,
];

export default topicBuilderNexus;
