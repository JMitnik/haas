import { inputObjectType, mutationField } from 'nexus';
import { Topic } from './Topic.graphql';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const RevokeTopicInput = inputObjectType({
  name: 'RevokeTopicInput',
  description: 'Revokes a sub topic from a topic based on input',

  definition(t) {
    t.nonNull.string('topic');
    t.nonNull.string('subTopic');
  },
});

export const RevokeTopicMutation = mutationField('revokeTopic', {
  type: Topic,
  args: { input: RevokeTopicInput },
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object!');
    return ctx.services.topicService.revokeTopic(args.input);
  },
});
