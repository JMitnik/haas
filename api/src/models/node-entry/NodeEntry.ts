import { NodeEntry, PrismaClient } from '@prisma/client';
import { inputObjectType, objectType } from '@nexus/schema';

// eslint-disable-next-line import/no-cycle
import { QuestionNodeType } from '../question/QuestionNode';
import NodeEntryService from './NodeEntryService';

export const NodeEntryValueType = objectType({
  name: 'NodeEntryValue',

  definition(t) {
    t.id('id');

    t.int('slider', { nullable: true });
    t.string('textbox', { nullable: true });
    t.string('register', { nullable: true });
    t.string('choice', { nullable: true });
  },
});

export const NodeEntryType = objectType({
  name: 'NodeEntry',

  definition(t) {
    t.id('id', { nullable: true });
    t.string('creationDate');
    t.int('depth');

    t.string('relatedEdgeId', { nullable: true });
    t.string('sessionId');

    t.string('relatedNodeId', { nullable: true });
    t.field('relatedNode', {
      type: QuestionNodeType,
      nullable: true,

      resolve(parent: NodeEntry, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;

        if (!parent.relatedNodeId) {
          return null;
        }

        const relatedNode = prisma.questionNode.findOne({ where: { id: parent.relatedNodeId } });
        return relatedNode;
      },
    });

    t.field('value', {
      type: NodeEntryValueType,
      description: 'The core scoring value associated with the node entry.',
      nullable: true,

      resolve(parent: NodeEntry) {
        return NodeEntryService.getNodeEntryValue(parent);
      },
    });
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

export const NodeEntryInput = inputObjectType({
  name: 'NodeEntryInput',
  description: 'Input type for node-entry metadata',

  definition(t) {
    t.string('nodeId');
    t.string('edgeId', { nullable: true });
    t.int('depth', { nullable: true });

    t.field('slider', { type: SliderNodeEntryInput, nullable: true });
    t.field('textbox', { type: TextboxNodeEntryInput, nullable: true });
    t.field('register', { type: RegisterNodeEntryInput, nullable: true });
    t.field('choice', { type: ChoiceNodeEntryInput, nullable: true });
  },
});
