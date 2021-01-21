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