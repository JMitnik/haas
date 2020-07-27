import { PrismaClient, QuestionNode, QuestionNodeUpdateInput } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CTALinksInputType, LinkType } from '../link/Link';
// eslint-disable-next-line import/named
// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
import { EdgeType } from '../edge/Edge';
import NodeService from './NodeService';

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

export const QuestionNodeTypeEnum = enumType({
  name: 'QuestionNodeTypeEnum',
  description: 'The different types a node can assume',

  members: ['GENERIC', 'SLIDER', 'CHOICE', 'REGISTRATION', 'TEXTBOX', 'LINK'],
});

export const QuestionNodeType = objectType({
  name: 'QuestionNode',
  definition(t) {
    t.id('id');
    t.boolean('isLeaf');
    t.boolean('isRoot');
    t.string('title');
    t.string('updatedAt');
    t.string('creationDate', { nullable: true });
    t.field('type', { type: QuestionNodeTypeEnum });
    t.string('overrideLeafId', { nullable: true });

    // TODO: Make this required in prisma.
    t.string('questionDialogueId', {
      nullable: true,
      resolve(parent) {
        if (!parent.questionDialogueId) return '';

        return parent.questionDialogueId;
      },
    });

    t.list.field('links', {
      type: LinkType,
      resolve(parent: QuestionNode, args: any, ctx) {
        if (parent.isLeaf) {
          return ctx.prisma.link.findMany({
            where: {
              questionNodeId: parent.id,
            },
          }) as any || [];
        }
        return [];
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

export const OptionInputType = inputObjectType({
  name: 'OptionInputType',
  definition(t) {
    t.int('id', { nullable: true });
    t.string('value');
    t.string('publicValue', { nullable: true });
  },
});

export const OptionsInputType = inputObjectType({
  name: 'OptionsInputType',
  definition(t) {
    t.list.field('options', { type: OptionInputType });
  },
});

export const EdgeConditionInputType = inputObjectType({
  name: 'EdgeConditionInputType',
  definition(t) {
    t.int('id', { nullable: true });
    t.string('conditionType', { nullable: true });
    t.int('renderMin', { nullable: true });
    t.int('renderMax', { nullable: true });
    t.string('matchValue', { nullable: true });
  },
});

export const QuestionNodeMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteQuestion', {
      type: QuestionNodeType,
      args: {
        id: 'String',
        customerSlug: 'String',
        dialogueSlug: 'String',
      },
      // TODO: Remove the any
      // @ts-ignore
      async resolve(parent: any, args: any, ctx: any) {
        const { id, customerSlug, dialogueSlug } = args;
        const { prisma }: { prisma: PrismaClient } = ctx;

        const customer = await prisma.customer.findOne({
          where: {
            slug: customerSlug || undefined,
          },
          include: {
            dialogues: {
              where: {
                slug: dialogueSlug,
              },
              include: {
                questions: {
                  select: {
                    id: true,
                  },
                },
                edges: {
                  select: {
                    id: true,
                    parentNodeId: true,
                    childNodeId: true,
                  },
                },
              },
            },
          },
        });

        const dialogue = customer?.dialogues[0];

        if (!dialogue) {
          throw new Error('No dialogue found to be removed');
        }

        const deletedDialogues = await NodeService.deleteQuestionFromBuilder(id, dialogue);

        if (!deletedDialogues) throw new Error('Unable to delete dialogue');

        return deletedDialogues;
      },
    });

    t.field('updateQuestion', {
      type: QuestionNodeType,
      args: {
        id: 'String',
        title: 'String',
        type: 'String',
        overrideLeafId: 'String',
        edgeId: 'String',
        optionEntries: OptionsInputType,
        edgeCondition: EdgeConditionInputType,
      },
      // TODO: Remove the any
      resolve(parent: any, args: any) {
        const { id, title, type, overrideLeafId, edgeId, optionEntries, edgeCondition } = args;
        const { options } = optionEntries;

        return NodeService.updateQuestionFromBuilder(id, title, type, overrideLeafId, edgeId, options, edgeCondition);
      },
    });

    t.field('createQuestion', {
      type: QuestionNodeType,
      nullable: true,
      args: {
        customerSlug: 'String',
        dialogueSlug: 'String',
        title: 'String',
        type: 'String',
        overrideLeafId: 'String',
        parentQuestionId: 'String',
        optionEntries: OptionsInputType,
        edgeCondition: EdgeConditionInputType,
      },
      // TODO: Remove the any
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        // eslint-disable-next-line max-len
        const { customerSlug, dialogueSlug, title, type, overrideLeafId, parentQuestionId, optionEntries, edgeCondition } = args;
        const { options } = optionEntries;

        const customer = await prisma.customer.findOne({
          where: {
            slug: customerSlug || undefined,
          },
          include: {
            dialogues: {
              where: {
                slug: dialogueSlug,
              },
            },
          },
        });

        const dialogue = customer?.dialogues[0];
        const dialogueId = dialogue?.id;

        if (dialogueId) {
          return NodeService.createQuestionFromBuilder(
            dialogueId, title, type, overrideLeafId, parentQuestionId, options, edgeCondition,
          );
        }

        return null;
      },
    });

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
          await NodeService.removeNonExistingLinks(dbQuestionNode?.links, links?.linkTypes);
        }

        await NodeService.upsertLinks(links?.linkTypes, id);

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
  QuestionNodeMutations,
  QuestionNodeType,
  QuestionOptionType,
  QuestionNodeWhereInputType,
  getQuestionNodeQuery,
  QuestionNodeInput,
];

export default questionNodeNexus;
