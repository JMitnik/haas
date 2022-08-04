import { inputObjectType, mutationField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const DeselectTopicInput = inputObjectType({
  name: 'DeselectTopicInput',
  description: 'Deselects all question options as topic within workspace',
  definition(t) {
    t.id('workspaceId', { required: true });
    t.string('topic', { required: true });
  },
})

export const DeselectTopicMutation = mutationField('deselectTopic', {
  type: 'Boolean',
  args: { input: DeselectTopicInput },
  nullable: true,
  description: `
    Deselcting a topic implies that all question-options related to the topic string are disregarded as topic.
  `,

  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object!');
    return ctx.services.topicService.hideTopic(args.input) || null;
  },
});
