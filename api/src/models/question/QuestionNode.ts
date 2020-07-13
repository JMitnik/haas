import { CTALinksInputType, LinkType } from '../link/Link';
import { DialogueType } from '../questionnaire/Dialogue';
import { EdgeType } from '../edge/Edge';
import { LinkUpdateManyWithoutQuestionNodeInput, PrismaClient, QuestionNode, QuestionNodeUpdateInput } from '@prisma/client';
import { extendType, inputObjectType, objectType } from '@nexus/schema';
import NodeResolver from './node-resolver';

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

    t.list.field('links', {
      type: LinkType,
      resolve(parent: QuestionNode, args: any, ctx: any) {
        const { prisma } : { prisma: PrismaClient } = ctx;
        if (parent.isLeaf) {
          return prisma.link.findMany({
            where: {
              questionNodeId: parent.id,
            },
          });
        }
        return [];
      },
    });

    t.field('questionDialogue', {
      type: DialogueType,
      nullable: true,
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
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
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const overrideLeaf = prisma.questionNode.findOne(
          { where: { id: parent.id } },
        ).overrideLeaf();
        return overrideLeaf;
      },
    });
    t.list.field('options', {
      type: QuestionOptionType,
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
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
      resolve(parent: QuestionNode, args: any, ctx: any, info: any) {
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

export const QuestionNodeWhereInputType = inputObjectType({
  name: 'QuestionNodeWhereInputType',
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

export const QuestionNodeMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateCTA', {
      type: QuestionNodeType,
      args: {
        id: 'String',
        title: 'String',
        type: 'String',
        links: CTALinksInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { title, type, id, links } = args;
        console.log('links: ', links?.linkTypes);
        const dbQuestionNode = await prisma.questionNode.findOne({
          where: {
            id,
          },
          include: {
            links: true,
          },
        });

        const questionNodeUpdateInput: QuestionNodeUpdateInput = { title, type };
        if (dbQuestionNode?.links) {
          await NodeResolver.removeNonExistingLinks(dbQuestionNode?.links, links?.linkTypes);
        }

        await NodeResolver.upsertLinks(links?.linkTypes, id);

        return prisma.questionNode.update({
          where: {
            id,
          },
          data: questionNodeUpdateInput,
        });
      },
    });

    t.field('deleteCTA', {
      type: QuestionNodeType,
      args: {
        id: 'String',
      },
      resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.questionNode.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field('createCTA', {
      type: QuestionNodeType,
      args: {
        customerSlug: 'String',
        dialogueSlug: 'String',
        title: 'String',
        type: 'String',
        links: CTALinksInputType,
      },
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { customerSlug, dialogueSlug, title, type, links } = args;
        console.log('links: ', links?.linkTypes);

        const customer = await prisma.customer.findOne({
          where: {
            slug: customerSlug,
          },
          include: {
            dialogues: {
              where: {
                slug: dialogueSlug,
              },
              select: {
                id: true,
              },
            },
          },
        });

        return prisma.questionNode.create({
          data: {
            title,
            type,
            isLeaf: true,
            links: {
              create: [...links?.linkTypes],
            },
            questionDialogue: {
              connect: {
                id: customer?.dialogues[0].id,
              },
            },
          },
        });
      },
    });
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
      resolve(parent: any, args: any, ctx: any, info: any) {
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
      resolve(parent: any, args: any, ctx: any, info: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        return prisma.questionNode.findMany();
      },
    });
  },
});

const questionNodeNexus = [
  QuestionNodeMutations,
  QuestionNodeType,
  QuestionOptionType,
  QuestionNodeWhereInputType,
  getQuestionNodeQuery,
  QuestionNodeInput,
];

export default questionNodeNexus;
