import { inputObjectType, objectType } from '@nexus/schema';

import { FormNodeField, QuestionNodeType } from '../QuestionNode/QuestionNode';

export const TopicNodeEntryValue = objectType({
  name: 'TopicNodeEntryValue',
  definition(t) {
    t.int('id');
    t.string('value');
    t.string('nodeEntryId');
    t.int('mainScore');
  },
});

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
    t.string('videoNodeEntry', { nullable: true });
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

      async resolve(parent, args, ctx) {
        if (!parent.relatedNodeId) {
          return null;
        }
        const relatedNode = await ctx.services.nodeService.findNodeById(parent.relatedNodeId);
        return relatedNode;
      },
    });

    t.field('value', {
      type: NodeEntryValueType,
      description: 'The core scoring value associated with the node entry.',
      nullable: true,

      async resolve(parent, args, ctx) {
        const nodeEntryValues = await ctx.services.nodeEntryService.findNodeEntryValues(parent.id);
        return nodeEntryValues;
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
    t.string('contacts', { required: false });
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

export const VideoNodeEntryInput = inputObjectType({
  name: 'VideoNodeEntryInput',
  description: 'Input type for a video node',

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
    t.field('video', { type: VideoNodeEntryInput, nullable: true });

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
