/* eslint-disable import/prefer-default-export */
import { PrismaClient, Customer, QuestionNode } from '@prisma/client';
import { objectType, queryType, extendType, inputObjectType, arg } from '@nexus/schema';
import { EdgeType } from '../edge/Edge';

const prisma = new PrismaClient();

export const QuestionOptionType = objectType({
  name: 'QuestionOption',
  definition(t) {
    t.id('id');
    t.string('value');
    t.string('publicValue', { nullable: true });
    t.string('questionId');
  },
});

export const QuestionNodeType = objectType({
  name: 'QuestionNode',
  definition(t) {
    t.id('id');
    t.boolean('isLeaf');
    t.boolean('isRoot');
    t.string('title');
    t.string('type');
    t.string('overrideLeafId', { nullable: true });
    t.string('questionDialogueId');
    t.list.field('options', {
      type: QuestionOptionType,
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
        const options = prisma.questionOption.findMany({
          where: {
            questionNodeId: parent.id,
          },
        });
        return options;
      },
    });
    t.list.field('children', {
      type: EdgeType,
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
        const children = prisma.edge.findMany({
          where: {
            parentNodeId: parent.id,
          },
        });
        return children;
      },
    });
  },
});

export const QuestionNodeWhereInput = inputObjectType({
  name: 'QuestionNodeWhereInput',
  definition(t) {
    t.boolean('isRoot', { nullable: true });
  },
});

