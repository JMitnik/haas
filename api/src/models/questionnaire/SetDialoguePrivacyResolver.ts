import { inputObjectType, mutationField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';

export const SetDialoguePrivacyInput = inputObjectType({
  name: 'SetDialoguePrivacyInput',
  definition(t) {
    t.string('customerId', { required: true });
    t.string('dialogueSlug', { required: true });
    t.boolean('state', { required: true });
  },
})

export const SetDialoguePrivacyMutation = mutationField('setDialoguePrivacy', {
  type: 'Dialogue',
  args: { input: SetDialoguePrivacyInput },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input) throw new GraphQLYogaError('No input object provided!');
    return ctx.services.dialogueService.setDialoguePrivacy(args.input);
  },
})
