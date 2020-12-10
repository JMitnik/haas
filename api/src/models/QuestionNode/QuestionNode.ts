import { PrismaClient } from '@prisma/client';
import { enumType, extendType, inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { CTALinksInputType, LinkType } from '../link/Link';
// eslint-disable-next-line import/named
// eslint-disable-next-line import/no-cycle
import { DialogueType } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
import { EdgeType } from '../edge/Edge';
import { SliderNode } from './SliderNode';
import NodeService from './NodeService';

export const CTAShareInputObjectType = inputObjectType({
  name: 'CTAShareInputObjectType',
  definition(t) {
    t.string('url');
    t.string('tooltip');

    t.string('title', { nullable: true });
    t.string('id', { nullable: true });
  },
});

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

  members: ['GENERIC', 'SLIDER', 'CHOICE', 'REGISTRATION', 'FORM', 'TEXTBOX', 'LINK', 'SHARE'],
});

export const ShareNodeType = objectType({
  name: 'ShareNodeType',
  definition(t) {
    t.string('id');
    t.string('url');
    t.string('title');

    t.string('tooltip', { nullable: true });
    t.string('createdAt', { nullable: true });
    t.string('updatedAt', { nullable: true });
  },
});

export const ShareNodeInputType = inputObjectType({
  name: 'ShareNodeInputType',
  definition(t) {
    t.string('id', { nullable: true });
    t.string('tooltip');
    t.string('url');
    t.string('title');
  },
});

export const FormNodeFieldTypeEnum = enumType({
  name: 'FormNodeFieldTypeEnum',
  description: 'The types a field can assume',

  members: ['email', 'phoneNumber', 'url', 'shortText', 'longText', 'number'],
});

export const FormNodeFieldInput = inputObjectType({
  name: 'FormNodeFieldInput',

  definition(t) {
    t.id('id', { required: false });
    t.string('label');
    t.field('type', { type: FormNodeFieldTypeEnum });
    t.boolean('isRequired', { default: false });
    t.int('position');
  },
});

export const FormNodeInputType = inputObjectType({
  name: 'FormNodeInputType',

  definition(t) {
    t.string('id', { nullable: true });
    t.list.field('fields', { type: FormNodeFieldInput });
  },
});

export const FormNodeField = objectType({
  name: 'FormNodeField',

  definition(t) {
    t.id('id');
    t.string('label');
    t.field('type', { type: FormNodeFieldTypeEnum });
    t.boolean('isRequired');
    t.int('position');
  },
});

export const FormNodeType = objectType({
  name: 'FormNodeType',

  definition(t) {
    t.string('id', { nullable: true });
    t.list.field('fields', { type: FormNodeField });
  },
});

export const SliderNodeRangeType = objectType({
  name: 'SliderNodeRangeType',

  definition(t) {
    t.id('id');
    t.float('start', { nullable: true });
    t.float('end', { nullable: true });
  },
});

export const SliderNodeMarkerType = objectType({
  name: 'SliderNodeMarkerType',

  definition(t) {
    t.id('id');
    t.string('label');
    t.string('subLabel');
    t.field('range', { type: SliderNodeRangeType, nullable: true, resolve: (parent: any) => parent.range || null });
  },
});

export const SliderNodeType = objectType({
  name: 'SliderNodeType',

  definition(t) {
    t.id('id', { nullable: true });
    t.list.field('markers', {
      type: SliderNodeMarkerType,
      nullable: true,
      resolve: (parent: any) => parent.markers || SliderNode.DEFAULT_MARKERS,
    });
  },
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
    t.string('updatedAt', {
      nullable: true,
      resolve: (parent) => parent.updatedAt?.toString() || '',
    });

    // Node-types
    // TODO: Remove `any` once we figure out how to not make prisma the backing-type
    t.field('sliderNode', { description: 'Slidernode resolver',
      type: SliderNodeType,
      nullable: true,
      resolve: (parent: any) => {
        if (parent.type === 'SLIDER') {
          return (parent.sliderNode || { markers: SliderNode.DEFAULT_MARKERS });
        }

        return null;
      } });

    // Node-types
    // TODO: Remove `any` once we figure out how to not make prisma the backing-type
    t.field('form', { description: 'FormNode resolver',
      type: FormNodeType,
      nullable: true,
      resolve: (parent: any) => {
        if (parent.type === 'FORM') {
          console.log(parent.form);
          return parent.form;
        }

        return null;
      } });

    t.field('share', {
      type: ShareNodeType,
      nullable: true,
      async resolve(parent, args, ctx) {
        if (!parent.isLeaf || !parent.id) {
          return null;
        }

        const [share] = await ctx.prisma.share.findMany({
          where: {
            questionNodeId: parent.id,
          },
        });

        if (!share) return null;

        return {
          id: share.id,
          title: share.title,
          tooltip: share.tooltip,
          url: share.url,
        };
      },
    });

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
      async resolve(parent, args, ctx) {
        if (parent.isLeaf) {
          const links = await ctx.prisma.link.findMany({
            where: {
              questionNodeId: parent.id,
            },
          });

          return links as any;
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

export const CreateCTAInputType = inputObjectType({
  name: 'CreateCTAInputType',
  definition(t) {
    t.string('customerSlug');
    t.string('dialogueSlug');
    t.string('title');
    t.string('type');

    t.field('links', {
      type: CTALinksInputType,
    });

    t.field('share', {
      type: ShareNodeInputType,
    });

    t.field('form', {
      type: 'FormNodeInputType',
    });
  },
});

export const SliderNodeRangeInputType = inputObjectType({
  name: 'SliderNodeRangeInputType',

  definition(t) {
    t.float('start', { nullable: true });
    t.float('end', { nullable: true });
  },
});

export const SliderNodeMarkerInputType = inputObjectType({
  name: 'SlideNodeMarkerInput',

  definition(t) {
    t.id('id', { nullable: true });
    t.string('label', { required: true });
    t.string('subLabel', { required: true });
    t.field('range', { type: SliderNodeRangeInputType });
  },
});

export const SliderNodeInputType = inputObjectType({
  name: 'SliderNodeInputType',

  definition(t) {
    t.id('id', { nullable: true });
    t.list.field('markers', { type: SliderNodeMarkerInputType });
  },
});

export const CreateQuestionNodeInputType = inputObjectType({
  name: 'CreateQuestionNodeInputType',

  definition(t) {
    t.id('customerId');
    t.id('overrideLeafId');
    t.id('parentQuestionId');

    t.string('dialogueSlug');
    t.string('title');
    t.string('type');

    t.field('optionEntries', { type: OptionsInputType });
    t.field('edgeCondition', { type: EdgeConditionInputType });
  },
});

export const UpdateQuestionNodeInputType = inputObjectType({
  name: 'UpdateQuestionNodeInputType',

  definition(t) {
    t.id('id');
    t.id('customerId');
    t.id('overrideLeafId');
    t.id('edgeId');

    t.string('title');
    t.string('type');

    t.field('sliderNode', { type: SliderNodeInputType });

    t.field('optionEntries', { type: OptionsInputType });
    t.field('edgeCondition', { type: EdgeConditionInputType });
  },
});

export const DeleteNodeInputType = inputObjectType({
  name: 'DeleteNodeInputType',
  description: 'Delete Node Input type',

  definition(t) {
    t.string('id');
    t.id('customerId');
    t.string('dialogueSlug');
  },
});

export const QuestionNodeMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteQuestion', {
      type: QuestionNodeType,
      args: { input: DeleteNodeInputType },
      // TODO: Remove the any
      // @ts-ignore
      async resolve(parent: any, args: any, ctx: any) {
        const { id, customerId, dialogueSlug } = args.input;
        const { prisma }: { prisma: PrismaClient } = ctx;

        const customer = await prisma.customer.findOne({
          where: {
            id: customerId || undefined,
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
      args: { input: UpdateQuestionNodeInputType },
      // TODO: Remove the any
      resolve(parent: any, args: any) {
        const { id, title, type, overrideLeafId, edgeId, optionEntries: { options }, edgeCondition, sliderNode } = args?.input;

        console.log(args.input);
        return NodeService.updateQuestionFromBuilder(id, title, type, overrideLeafId, edgeId, options, edgeCondition, sliderNode);
      },
    });

    t.field('createQuestion', {
      type: QuestionNodeType,
      nullable: true,
      args: {
        input: CreateQuestionNodeInputType,
      },
      // TODO: Remove the any
      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        // eslint-disable-next-line max-len
        const { customerId, dialogueSlug, title, type, overrideLeafId, parentQuestionId, optionEntries, edgeCondition } = args.input;
        const { options } = optionEntries;

        const customer = await prisma.customer.findOne({
          where: {
            id: customerId,
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

    t.field('deleteCTA', {
      type: QuestionNodeType,
      args: { input: DeleteNodeInputType },

      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        await prisma.share.deleteMany({ where: {
          questionNodeId: args?.input?.id,
        } });

        return prisma.questionNode.delete({
          where: {
            id: args?.input?.id,
          },
        });
      },
    });

    t.field('createCTA', {
      description: 'Create Call to Actions',
      type: QuestionNodeType,
      args: { input: CreateCTAInputType },

      async resolve(parent: any, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const { customerSlug, dialogueSlug, title, type, links, share } = args.input;

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
            share: {
              create: share,
            },
            form: {
              create: args.input.form ? NodeService.saveCreateFormNodeInput(args.input.form) : undefined,
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
