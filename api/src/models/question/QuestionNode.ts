import { PrismaClient, QuestionNode } from '@prisma/client';
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
    t.string('publicValue', { nullable: true });
    t.string('questionId');
  },
});

export const QuestionNodeType = objectType({
  name: 'QuestionNode',
  definition(t) {
    t.id('id');
    t.string('creationDate', { nullable: true });
    t.boolean('isLeaf');
    t.boolean('isRoot');
    t.string('title');
    t.string('type');
    t.string('overrideLeafId', { nullable: true });
    t.string('questionDialogueId');

    t.field('questionDialogue', {
      type: DialogueType,
      nullable: true,
      resolve(parent: QuestionNode, args: any, ctx: any) {
        const { prisma } : { prisma: PrismaClient } = ctx;
        if (parent.questionDialogueId) {
          return prisma.dialogue.findOne({
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
      resolve(parent: QuestionNode, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const overrideLeaf = prisma.questionNode.findOne(
          { where: { id: parent.id } },
        ).overrideLeaf();
        return overrideLeaf;
      },
    });
    t.list.field('options', {
      type: QuestionOptionType,
      resolve(parent: QuestionNode, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
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
      resolve(parent: QuestionNode, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
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
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const questionNode = prisma.questionNode.findOne({
          where: {
            id: args.where.id,
          },
        });
        return questionNode;
      },
    });
    t.list.field('questionNodes', {
      type: QuestionNodeType,
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.questionNode.findMany();
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
