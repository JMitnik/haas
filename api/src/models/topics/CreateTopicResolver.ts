import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

// 1. Define the input of our mutation
export const CreateTopicInput = inputObjectType({
  name: 'CreateTopicInput',
  definition(t) {
    t.string('label', { required: true });
    t.string('customerId', { required: true });
    t.string('relatedDialogueSlug', { required: true });

    t.list.field('topicValues', { type: CreateTopicValueInput });
  },
});

export const CreateTopicValueInput = inputObjectType({
  name: 'CreateTopicValueInput',

  definition(t) {
    t.string('label');
  }
});

// 2. Define the output of our mutation
export const CreateTopicOutput = objectType({
  name: 'CreateTopicOutput',

  definition(t) {
    t.string('id');
  },
});

// 3. Define the mutation itself
export const CreateTopicMutation = mutationField('createTopic', {
  type: CreateTopicOutput,
  args: { input: CreateTopicInput },

  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input is provided');

    // Create new topic (no topic values yet) in database.
    const topic = await ctx.prisma.topic.create({
      data: {
        label: args.input?.label,
        relatedDialogue: {
          connect: {
            slug_customerId: {
              customerId: args.input?.customerId,
              slug: args.input?.relatedDialogueSlug
            }
          }
        },
        values: {
          create: args.input?.topicValues?.map(topicValue => ({
            label: topicValue.label || ''
          }))
        }
      }
    });

    return {
      id: topic.id
    }
  },
});
