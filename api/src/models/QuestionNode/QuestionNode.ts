import { PrismaClient, NodeType } from '@prisma/client';
import { enumType, extendType, inputObjectType, interfaceType, objectType, queryField } from '@nexus/schema';
import { ApolloError, UserInputError } from 'apollo-server-express';

import { CTALinksInputType, LinkType } from '../link/Link';
import { DialogueType } from '../questionnaire/Dialogue';
import { EdgeType } from '../edge/Edge';
import { SliderNode } from './SliderNode';
import { IndepthQuestionStatisticsSummary, QuestionImpactScoreType, QuestionStatisticsSummary } from './QuestionStatisticsSummary';
import { isValidDateTime } from '../../utils/isValidDate';

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

    t.field('overrideLeaf', {
      type: 'QuestionNode',
      nullable: true,

      resolve: async (parent, args, ctx) => {
        if (!parent.overrideLeafId) return null;
        const cta = await ctx.services.nodeService.findNodeById(parent.overrideLeafId);
        return cta as any;
      },
    });

    t.int('position', {
      nullable: true,
      resolve(parent) {
        if (!parent.position) return null;

        return parent.position;
      },
    });
  },
});

export const QuestionNodeTypeEnum = enumType({
  name: 'QuestionNodeTypeEnum',
  description: 'The different types a node can assume',

  members: ['GENERIC', 'SLIDER', 'CHOICE', 'REGISTRATION', 'FORM', 'TEXTBOX', 'LINK', 'SHARE', 'VIDEO_EMBEDDED'],
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

  members: ['email', 'phoneNumber', 'url', 'shortText', 'longText', 'number', 'contacts'],
});

export const PickerEntryInput = inputObjectType({
  name: 'PickerEntryInput',
  definition(t) {
    t.string('label', { required: true });
    t.string('value', { required: true });
    t.string('type', { required: true });
  },
});

export const FormNodeFieldInput = inputObjectType({
  name: 'FormNodeFieldInput',

  definition(t) {
    t.id('id', { required: false });
    t.string('label');
    t.string('placeholder');
    t.field('type', { type: FormNodeFieldTypeEnum });
    t.boolean('isRequired', { default: false });
    t.int('position');
    t.list.string('userIds');
  },
});

export const FormNodeInputType = inputObjectType({
  name: 'FormNodeInputType',

  definition(t) {
    t.string('id', { nullable: true });
    t.string('helperText', { nullable: true });

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
    t.string('placeholder', {
      nullable: true,
      resolve(root) {
        return root.placeholder;
      },
    });
    t.list.field('contacts', {
      type: 'UserType',
      nullable: true,
    });
  },
});

export const FormNodeType = objectType({
  name: 'FormNodeType',

  definition(t) {
    t.string('id', { nullable: true });
    t.string('helperText', { nullable: true });

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

export const QuestionStatisticsSummaryFilterInput = inputObjectType({
  name: 'QuestionStatisticsSummaryFilterInput',
  definition(t) {
    t.string('startDateTime', { required: true });
    t.field('impactType', {
      type: QuestionImpactScoreType,
      required: true,
    });

    t.string('endDateTime');
    t.int('impactTreshold');
    t.boolean('refresh');
  },
})

export const SliderNodeType = objectType({
  name: 'SliderNodeType',

  definition(t) {
    t.id('id', { nullable: true });
    t.string('happyText', { nullable: true });
    t.string('unhappyText', { nullable: true });

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

    t.string('extraContent', {
      nullable: true,
      resolve: async (parent, args, ctx) => {
        if (!parent.videoEmbeddedNodeId) return null;
        const node = await ctx.services.nodeService.getVideoEmbeddedNode(parent.videoEmbeddedNodeId);
        return node?.videoUrl || null;
      },
    });
    t.string('creationDate', { nullable: true });
    t.field('type', { type: QuestionNodeTypeEnum });
    t.string('overrideLeafId', { nullable: true });

    t.string('updatedAt', {
      nullable: true,
      resolve: (parent) => parent.updatedAt?.toString() || '',
    });

    t.field('indepthQuestionStatisticsSummary', {
      type: IndepthQuestionStatisticsSummary,
      nullable: true,
      list: true,
      args: {
        input: QuestionStatisticsSummaryFilterInput,
      },
      async resolve(parent, args, ctx) {
        if (!parent.questionDialogueId) throw new ApolloError('No dialogue Id available for question!');
        if (!args.input) throw new UserInputError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new UserInputError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE');
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        const analysis = await ctx.services.questionStatisticsService.indepthAnalysis({
          dialogueId: parent.questionDialogueId,
          questionId: parent.id,
          startDateTime: utcStartDateTime as Date,
          endDateTime: utcEndDateTime,
          type: args.input.impactType,
          impactTreshold: args.input.impactTreshold || undefined,
        });
        return analysis;
      },
    })

    t.field('questionStatisticsSummary', {
      type: QuestionStatisticsSummary,
      nullable: true,
      args: {
        input: QuestionStatisticsSummaryFilterInput,
      },
      useTimeResolve: true,
      resolve(parent, args, ctx) {
        if (!parent.questionDialogueId) throw new ApolloError('No dialogue Id available for question!');
        if (!args.input) throw new UserInputError('No input provided for dialogue statistics summary!');
        if (!args.input.impactType) throw new UserInputError('No impact type provided dialogue statistics summary!');

        let utcStartDateTime: Date | undefined;
        let utcEndDateTime: Date | undefined;

        if (args.input?.startDateTime) {
          utcStartDateTime = isValidDateTime(args.input.startDateTime, 'START_DATE');
        }

        if (args.input?.endDateTime) {
          utcEndDateTime = isValidDateTime(args.input.endDateTime, 'END_DATE');
        }

        // return ctx.services.questionStatisticsService.initiate({
        //   dialogueId: parent.questionDialogueId,
        //   questionId: parent.id,
        //   startDateTime: utcStartDateTime as Date,
        //   endDateTime: utcEndDateTime,
        //   type: args.input.impactType,
        //   impactTreshold: args.input.impactTreshold || undefined,
        // });
        return null;
      },
    })

    // Node-types
    // TODO: Remove `any` once we figure out how to not make prisma the backing-type
    t.field('sliderNode', {
      description: 'Slidernode resolver',
      type: SliderNodeType,
      nullable: true,
      resolve: (parent: any) => {
        if (parent.type === 'SLIDER') {
          return (parent.sliderNode || { markers: SliderNode.DEFAULT_MARKERS });
        }

        return null;
      },
    });

    // Node-types
    // TODO: Remove `any` once we figure out how to not make prisma the backing-type
    t.field('form', {
      description: 'FormNode resolver',
      type: FormNodeType,
      nullable: true,
      resolve: (parent: any) => {
        if (parent.type === 'FORM') {
          return parent.form;
        }

        return null;
      },
    });

    t.field('share', {
      type: ShareNodeType,
      nullable: true,
      async resolve(parent, args, ctx) {
        if (!parent.isLeaf || !parent.id) {
          return null;
        }

        const share = await ctx.services.nodeService.getShareNode(parent.id);

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
          const links = await ctx.services.nodeService.getLinksByNodeId(parent.id);

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
          return ctx.services.dialogueService.getDialogueById(parent.questionDialogueId);
        }

        return null;
      },
    });

    t.field('overrideLeaf', {
      type: QuestionNodeType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.overrideLeafId) return null
        const overrideLeaf = await ctx.services.nodeService.findNodeById(parent.overrideLeafId);

        return overrideLeaf;
      },
    });

    t.list.field('options', {
      type: QuestionOptionType,

      resolve(parent, args, ctx) {
        return ctx.services.nodeService.getOptionsByNodeId(parent.id);
      },
    });

    t.list.field('children', {
      type: EdgeType,
      resolve(parent, args, ctx) {
        return ctx.services.nodeService.getChildEdgesOfNode(parent.id);
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
    t.string('overrideLeafId', { required: false });
    t.int('position', { required: true });
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
    t.string('questionId', { description: 'Linked question-node id', nullable: true });

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
    t.string('extraContent', { nullable: true });
    t.string('unhappyText');
    t.string('happyText');

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

export const QuestionWhereUniqueInput = inputObjectType({
  name: 'QuestionWhereUniqueInput',
  definition(t) {
    t.id('id', { required: true });
  },
});

export const QuestionQuery = queryField('question', {
  type: QuestionNodeType,
  args: {
    where: QuestionWhereUniqueInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.where?.id) throw new UserInputError('No question id provided');
    return ctx.services.nodeService.findNodeById(args.where?.id);
  },
})

export const QuestionNodeMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('duplicateQuestion', {
      type: QuestionNodeType,
      nullable: true,
      args: { questionId: 'String' },

      async resolve(parent, args, ctx) {
        if (!args.questionId) {
          throw new UserInputError('Question id is missing!');
        }

        await ctx.services.nodeService.duplicateBranch(args.questionId);
        return null;
      },
    });

    t.field('deleteQuestion', {
      type: QuestionNodeType,
      args: { input: DeleteNodeInputType },
      // TODO: Remove the any
      // @ts-ignore
      async resolve(parent: any, args: any, ctx) {
        const { id, customerId, dialogueSlug } = args.input;

        const dialogue = await ctx.services.customerService.getDialogue(customerId, dialogueSlug);

        if (!dialogue) {
          throw new Error('No dialogue found to be removed');
        }

        const deletedDialogues = await ctx.services.nodeService.deleteQuestionNode(id, dialogue);

        if (!deletedDialogues) throw new Error('Unable to delete dialogue');

        return deletedDialogues;
      },
    });

    t.field('createQuestion', {
      type: QuestionNodeType,
      nullable: true,
      args: {
        input: CreateQuestionNodeInputType,
      },
      // TODO: Remove the any
      async resolve(parent: any, args: any, ctx) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        // eslint-disable-next-line max-len
        const { customerId, dialogueSlug, title, type, overrideLeafId, parentQuestionId, optionEntries, edgeCondition, extraContent } = args.input;
        const { options } = optionEntries;

        const dialogue = await ctx.services.customerService.getDialogue(customerId, dialogueSlug);
        const dialogueId = dialogue?.id;

        if (dialogueId) {
          return ctx.services.nodeService.createQuestionFromBuilder(
            dialogueId, title, type, overrideLeafId, parentQuestionId, options, edgeCondition, extraContent
          );
        }

        return null;
      },
    });

    t.field('deleteCTA', {
      type: QuestionNodeType,
      args: { input: DeleteNodeInputType },

      async resolve(parent: any, args: any, ctx) {
        return ctx.services.nodeService.deleteNode(args?.input?.id);
      },
    });

    t.field('createCTA', {
      description: 'Create Call to Actions',
      type: QuestionNodeType,
      args: { input: CreateCTAInputType },

      async resolve(parent, args, ctx) {
        const links = args.input?.links;

        const validatedType = Object.values(NodeType).find((type) => type === args.input?.type);

        if (!args.input?.customerSlug
          || !args.input?.dialogueSlug
          || !args.input?.title
          || typeof validatedType === undefined
          || (args.input.type === NodeType.LINK && links?.linkTypes?.length === 0)
          || (args.input.type === NodeType.SHARE && !args.input?.share?.title)
          || (args.input.type === NodeType.FORM && args.input.form?.fields?.length === 0))
          throw new UserInputError(`Input data is unsufficient: ${args.input}`);


        const share = args.input?.share?.title ? {
          id: args.input?.share?.id || undefined,
          title: args.input?.share?.title,
          tooltip: args.input?.share?.tooltip || undefined,
          url: args.input?.share?.url || '',
        } : undefined;


        const mappedLinks = links?.linkTypes?.map(({ backgroundColor, iconUrl, id, title, type, url, buttonText, subHeader, header, imageUrl }) => ({
          id: id || undefined,
          backgroundColor: backgroundColor || undefined,
          iconUrl: iconUrl || undefined,
          title: title || undefined,
          type: type || 'SOCIAL',
          url: url || '',
          imageUrl: imageUrl || undefined,
          buttonText: buttonText || undefined,
          subHeader: subHeader || undefined,
          header: header || undefined,
        })) || [];

        const createCTAInput = {
          form: args.input.form,
          share,
          customerSlug: args.input?.customerSlug,
          dialogueSlug: args.input?.dialogueSlug,
          title: args.input?.title,
          type: validatedType,
          links: mappedLinks,
          questionId: args.input.questionId,
        }

        return ctx.services.nodeService.createCallToAction(createCTAInput);
      },
    });
  },
});
