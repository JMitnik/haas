import { PrismaClient, Customer, QuestionNode } from '@prisma/client';
import { objectType, queryType, extendType, inputObjectType, arg } from '@nexus/schema';
import { EdgeType } from '../edge/Edge';
import DialogueResolver from '../questionnaire/questionnaire-resolver';

const prisma = new PrismaClient();

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
        id: 'String',
        topicData: TopicDataEntryInput,
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return DialogueResolver.updateTopicBuilder(args);
      },
    });
  },
});
