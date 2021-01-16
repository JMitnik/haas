import { NodeEntry } from '@prisma/client';
import { inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { FormNodeField, QuestionNodeType } from '../QuestionNode/QuestionNode';
// eslint-disable-next-line import/no-cycle
import NodeEntryService from './NodeEntryService';

export const FormNodeEntryValueType = objectType({
  name: 'FormNodeEntryValueType',

  definition(t) {
    t.field('relatedField', { type: FormNodeField });
    t.string('email', { nullable: true });
    t.string('phoneNumber', { nullable: true });
    t.string('url', { nullable: true });
    t.string('shortText', { nullable: true });
    t.string('longText', { nullable: true });
    t.int('number', { nullable: true });
  },
});

export const FormNodeEntryType = objectType({
  name: 'FormNodeEntryType',

  definition(t) {
    t.int('id');

    t.list.field('values', { type: FormNodeEntryValueType });
  },
});

export const NodeEntryValueType = objectType({
  name: 'NodeEntryValue',

  definition(t) {
    t.int('sliderNodeEntry', { nullable: true });
    t.string('textboxNodeEntry', { nullable: true });
    t.string('registrationNodeEntry', { nullable: true });
    t.string('choiceNodeEntry', { nullable: true });
    t.string('linkNodeEntry', { nullable: true });
    t.field('formNodeEntry', { type: FormNodeEntryType, nullable: true });
  },
});

export const NodeEntryType = objectType({
  name: 'NodeEntry',

  definition(t) {
    t.string('creationDate');

    // TODO: Make non-nullable in schema
    t.int('depth', {
      nullable: true,
      resolve(parent) {
        if (!parent.depth) return 0;

        return parent.depth;
      },
    });

    t.id('id', { nullable: true });
    t.string('relatedEdgeId', { nullable: true });

    t.string('relatedNodeId', { nullable: true });
    t.field('relatedNode', {
      type: QuestionNodeType,
      nullable: true,

      resolve(parent, args, ctx) {
        if (!parent.relatedNodeId) {
          return null;
        }

        const relatedNode = ctx.prisma.questionNode.findUnique({ where: { id: parent.relatedNodeId } });
        return relatedNode;
      },
    });

    t.field('value', {
      type: NodeEntryValueType,
      description: 'The core scoring value associated with the node entry.',
      nullable: true,

      async resolve(parent, args, ctx) {
        const nodeEntry = await ctx.prisma.nodeEntry.findUnique({
          where: { id: parent.id },
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            sliderNodeEntry: true,
            textboxNodeEntry: true,
            formNodeEntry: {
              include: {
                values: {
                  include: {
                    relatedField: true,
                  },
                },
              },
            },
          },
        });

        return {
          choiceNodeEntry: nodeEntry?.choiceNodeEntry?.value,
          linkNodeEntry: nodeEntry?.linkNodeEntry?.value?.toString(),
          registrationNodeEntry: nodeEntry?.registrationNodeEntry?.value?.toString(),
          sliderNodeEntry: nodeEntry?.sliderNodeEntry?.value,
          textboxNodeEntry: nodeEntry?.textboxNodeEntry?.value,
          formNodeEntry: nodeEntry?.formNodeEntry,
        };
      },
    });
  },
});

export const FormNodeEntryFieldInput = inputObjectType({
  name: 'FormNodeEntryFieldInput',
  description: 'FormNodeEntryInput',

  definition(t) {
    t.id('relatedFieldId');
    t.string('email', { required: false });
    t.string('phoneNumber', { required: false });
    t.string('url', { required: false });
    t.string('shortText', { required: false });
    t.string('longText', { required: false });
    t.int('number', { required: false });
  },
});

export const FormNodeEntryInput = inputObjectType({
  name: 'FormNodeEntryInput',
  description: 'FormNodeEntryInput',

  definition(t) {
    t.list.field('values', { type: FormNodeEntryFieldInput });
  },
});

export const RegisterNodeEntryInput = inputObjectType({
  name: 'RegisterNodeEntryInput',
  description: 'Input type for a register node',

  definition(t) {
    t.string('value', { nullable: true });
  },
});

export const ChoiceNodeEntryInput = inputObjectType({
  name: 'ChoiceNodeEntryInput',
  description: 'Input type for a choice node',

  definition(t) {
    t.string('value');
  },
});

export const TextboxNodeEntryInput = inputObjectType({
  name: 'TextboxNodeEntryInput',
  description: 'Input type for a textbox node',

  definition(t) {
    t.string('value', { nullable: true });
  },
});

export const SliderNodeEntryInput = inputObjectType({
  name: 'SliderNodeEntryInput',
  description: 'Input type for a slider node',

  definition(t) {
    t.int('value');
  },
});

export const SocialNodeEntryInput = inputObjectType({
  name: 'SocialNodeEntryInput',
  description: 'Details regarding interaction with social node',

  definition(t) {
    t.string('visitedLink');
  },
});

export const NodeEntryDataInput = inputObjectType({
  name: 'NodeEntryDataInput',
  description: 'Data type for the actual node entry',

  definition(t) {
    t.field('slider', { type: SliderNodeEntryInput, nullable: true });
    t.field('textbox', { type: TextboxNodeEntryInput, nullable: true });
    t.field('form', { type: FormNodeEntryInput, nullable: true });
    t.field('choice', { type: ChoiceNodeEntryInput, nullable: true });

    // @deprecated
    t.field('register', { type: RegisterNodeEntryInput, nullable: true, deprecation: 'This will be deprectated from now on' });
  },
});

export const NodeEntryInput = inputObjectType({
  name: 'NodeEntryInput',
  description: 'Input type for node-entry metadata',

  definition(t) {
    t.string('nodeId');
    t.string('edgeId', { nullable: true });
    t.int('depth', { nullable: true });

    t.field('data', { type: NodeEntryDataInput });
  },
});
