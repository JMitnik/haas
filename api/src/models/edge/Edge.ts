import { extendType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { QuestionNodeType } from '../QuestionNode/QuestionNode';

export const EdgeConditionType = objectType({
  name: 'EdgeCondition',
  definition(t) {
    t.int('id');
    t.string('conditionType');
    t.string('matchValue', { nullable: true });
    t.int('renderMin', { nullable: true });
    t.int('renderMax', { nullable: true });

    // TODO: Make non-nullable
    t.string('edgeId', { nullable: true });
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

    t.field('parentNode', {
      type: QuestionNodeType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.parentNodeId) return null;

        const parentNode = await ctx.prisma.questionNode.findOne({
          where: { id: parent.parentNodeId },
        });

        return parentNode;
      },
    });

    t.field('childNode', {
      type: QuestionNodeType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.parentNodeId) return null;

        const childNode = await ctx.prisma.questionNode.findOne({
          where: { id: parent.childNodeId },
        });

        return childNode;
      },
    });
    t.list.field('conditions', {
      type: EdgeConditionType,
      nullable: true,

      async resolve(parent, args, ctx) {
        const edgeConditions = await ctx.prisma.questionCondition.findMany({
          where: { edgeId: parent.id },
        });

        return edgeConditions || [];
      },
    });
  },
});

export const EdgeQueries = extendType({
  type: 'Query',

  definition(t) {
    t.field('edge', {
      type: EdgeType,
      args: { id: 'String' },
      nullable: true,

      resolve(parent, args, ctx) {
        if (!args.id) return null;

        return ctx.prisma.edge.findOne({ where: { id: args.id } });
      },
    });
  },
});

export default [
  EdgeConditionType,
  EdgeType,
  EdgeQueries,
];
