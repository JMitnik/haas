import { extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
import { EdgeType } from '../edge/Edge';

export const QuestionOptionType = objectType({
  name: 'QuestionOption',
  definition(t) {
    t.int('id');
    t.string('value');

    // TODO: Make this required in prisma.
    t.string('questionId', {
      nullable: true,
      resolve(parent) {
        if (!parent.questionId) return '';

        return parent.questionId;
      },
    });

    t.string('publicValue', { nullable: true });
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
    t.string('creationDate', { nullable: true });
    t.string('overrideLeafId', { nullable: true });

    // TODO: Make this required in prisma.
    t.string('questionDialogueId', {
      nullable: true,
      resolve(parent) {
        if (!parent.questionDialogueId) return '';

        return parent.questionDialogueId;
      },
    });

    t.field('questionDialogue', {
      type: DialogueType,
      nullable: true,
      resolve(parent, args, ctx) {
        if (parent.questionDialogueId) {
          return ctx.prisma.dialogue.findOne({
            where: {
              id: parent.questionDialogueId,
            },
          });
        }

        return null;
      },
    });
    t.field('overrideLeaf', {
      type: QuestionNodeType,
      nullable: true,

      resolve(parent, args, ctx) {
        const overrideLeaf = ctx.prisma.questionNode.findOne({
          where: { id: parent.id },
        }).overrideLeaf();

        return overrideLeaf;
      },
    });
    t.list.field('options', {
      type: QuestionOptionType,

      resolve(parent, args, ctx) {
        const options = ctx.prisma.questionOption.findMany({
          where: { questionNodeId: parent.id },
        });

        return options;
      },
    });
    t.list.field('children', {
      type: EdgeType,
      resolve(parent, args, ctx) {
        const children = ctx.prisma.edge.findMany({
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
    t.id('id', { nullable: true });
  },
});

export const QuestionNodeInput = inputObjectType({
  name: 'QuestionNodeWhereUniqueInput',
  definition(t) {
    t.string('id', { required: true });
  },
});

export const getQuestionNodeQuery = extendType({
  type: 'Query',

  definition(t) {
    t.field('questionNode', {
      type: QuestionNodeType,
      args: {
        where: QuestionNodeInput,
      },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.where?.id) return null;

        const questionNode = await ctx.prisma.questionNode.findOne({
          where: { id: args.where.id },
        });

        return questionNode;
      },
    });
    t.list.field('questionNodes', {
      type: QuestionNodeType,
      resolve(parent, args, ctx) {
        return ctx.prisma.questionNode.findMany();
      },
    });
  },
});

const questionNodeNexus = [
  QuestionNodeType,
  QuestionOptionType,
  QuestionNodeWhereInput,
  getQuestionNodeQuery,
  QuestionNodeInput,
];

export default questionNodeNexus;
