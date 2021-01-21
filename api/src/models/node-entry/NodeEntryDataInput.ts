import { inputObjectType } from "@nexus/schema";

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
