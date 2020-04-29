import { Edge } from '@prisma/client';
import { objectType, extendType } from '@nexus/schema';
import { QuestionNodeType } from '../question/QuestionNode';

export const EdgeConditionType = objectType({
  name: 'EdgeCondition',
  definition(t) {
    t.int('id');
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
    t.field('parentNode', {
      type: QuestionNodeType,
      resolve(parent: Edge, args: any, ctx: any, info: any) {
        const parentNode = ctx.prisma.questionNode.findOne({ where: {
          id: parent.parentNodeId,
        } });
        return parentNode;
      },
    });
    t.field('childNode', {
      type: QuestionNodeType,
      resolve(parent: Edge, args: any, ctx: any, info: any) {
        const childNode = ctx.prisma.questionNode.findOne({ where: {
          id: parent.childNodeId,
        } });
        return childNode;
      },
    });
    t.list.field('conditions', {
      type: EdgeConditionType,
      resolve(parent: Edge, args: any, ctx: any, info: any) {
        const edgeConditions = ctx.prisma.questionCondition.findMany({
          where: {
            edgeId: parent.id,
          },
        });
        return edgeConditions;
      },
    });
  },
});

export const EdgeQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('edge', {
      type: EdgeType,
      args: {
        id: 'String',
      },
      resolve(parent: any, args: any, ctx: any, info: any) {
        return ctx.prisma.edge.findOne({ where: { id: args.id } });
      },
    });
  },
});

const edgeNexus = [EdgeConditionType,
  EdgeType,
  EdgeQueries];

export default edgeNexus;
