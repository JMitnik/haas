/* eslint-disable import/prefer-default-export */
import { PrismaClient, Customer, QuestionNode, Edge } from '@prisma/client';
import { objectType, queryType, extendType } from '@nexus/schema';

const prisma = new PrismaClient();

export const EdgeConditionType = objectType({
  name: 'EdgeCondition',
  definition(t) {
    t.id('id');
    t.string('matchValue', { nullable: true });
    t.string('conditionType');
    t.int('renderMin', { nullable: true });
    t.int('renderMax', { nullable: true });
    t.string('edgeId');
  },
});

export const EdgeType = objectType({
  name: 'Edge',
  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.string('parentNodeId');
    t.string('childNodeId');
    t.string('dialogueId');
    t.list.field('conditions', {
      type: EdgeConditionType,
      resolve(parent: Edge, args: any, ctx: any, info: any) {
        const edgeConditions = prisma.questionCondition.findMany({
          where: {
            edgeId: parent.id,
          },
        });
        return edgeConditions;
      },
    });
  },
});
