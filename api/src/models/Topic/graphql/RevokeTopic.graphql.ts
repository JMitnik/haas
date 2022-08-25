import { inputObjectType, list, mutationField, nonNull } from 'nexus';
import { UserInputError } from 'apollo-server-express';
import { Topic } from './Topic.graphql';

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
    console.log('Args: ', args);
    if (!args.input) throw new UserInputError('No input object!');
    return ctx.services.topicService.revokeTopic(args.input);
  },
});
