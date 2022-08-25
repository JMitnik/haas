import { inputObjectType, list, mutationField, nonNull } from 'nexus';
import { UserInputError } from 'apollo-server-express';
import { Topic } from './Topic.graphql';

export const CreateTopicInput = inputObjectType({
  name: 'CreateTopicInput',
  description: 'Creates a topic (with subTopics) based on input',

  definition(t) {
    t.nonNull.string('name');
    t.string('type', { default: 'SYSTEM' });
    t.nullable.list.field('subTopics', {
      type: CreateTopicInput,
    });
  },
});

export const CreateTopicInput = inputObjectType({
  name: 'CreateTopicInput',
  description: 'Creates a topic (with subTopics) based on input',

  definition(t) {
    t.nonNull.string('name');
    t.string('type', { default: 'SYSTEM' });
    t.nullable.list.field('subTopics', {
      type: CreateTopicInput,
    });
  },
});

export const CreateTopicsMutation = mutationField('createTopics', {
  type: 'Boolean',
  args: { input: list(nonNull(CreateTopicInput)) },
  async resolve(parent, args, ctx) {
    console.log('Args: ', args);
    if (!args.input) throw new UserInputError('No input object!');
    return ctx.services.topicService.createTopics(args.input);
  },
});
