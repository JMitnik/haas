import { inputObjectType, mutationField, objectType } from '@nexus/schema';

// 1. Define the input of our mutation
export const CreateTopicInput = inputObjectType({
  name: 'CreateTopicInput',
  definition(t) {
    t.string('label', { required: true });
  },
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
    // Create new topic (no topic values yet) in database.
    const topic = await ctx.prisma.topic.create({
      data: {
        label: args.input.label
      }
    });

    console.log(args.input.label);

    return {
      id: topic.id
    }
  },
});