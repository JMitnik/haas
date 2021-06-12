import { inputObjectType, mutationField, objectType } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

// 1. Define the input of our mutation
export const EditTopicInput = inputObjectType({
  name: 'EditTopicInput',
  definition(t) {
    t.string('label', { required: true });
    t.string('topicId', { required: true });
  },
});

// 2. Define the output of our mutation
export const EditTopicOutput = objectType({
  name: 'EditTopicOutput',

  definition(t) {
    t.string('id');
  },
});

// 3. Define the mutation itself
export const EditTopicMutation = mutationField('editTopic', {
  type: EditTopicOutput,
  args: { input: EditTopicInput },

  async resolve(parent, args, ctx) {
    // We need to grab an existing topic
    // and edit its label.
    if (!args.input) throw new UserInputError('No input provided');

    const topic = await ctx.prisma.topic.update({
      data: {
        label: args.input.label
      },
      where: {
        id: args.input.topicId
      }
    });

    return {
      id: topic.id
    }
  },
});
