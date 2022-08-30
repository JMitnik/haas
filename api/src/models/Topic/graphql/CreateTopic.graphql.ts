import { inputObjectType, list, mutationField, nonNull } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';
import { TopicEnumType } from '.';

export const CreateTopicInput = inputObjectType({
  name: 'CreateTopicInput',
  description: 'Creates a topic (with subTopics) based on input',

  definition(t) {
    t.nonNull.string('name');
    t.field('type', { type: TopicEnumType, default: 'SYSTEM' });
    t.nullable.list.field('subTopics', {
      type: CreateTopicInput,
    });
  },
});


export const CreateTopicMutation = mutationField('createTopic', {
  type: 'Boolean',
  args: { input: list(nonNull(CreateTopicInput)) },
  description: 'Creates a list of topics and its subtopics.',
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object!');
    return ctx.services.topicService.createTopics(args.input);
  },
});
