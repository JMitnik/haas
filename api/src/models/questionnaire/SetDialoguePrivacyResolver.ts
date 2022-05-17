import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

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
    if (!args.input) throw new UserInputError('No input object provided!');
    return ctx.services.dialogueService.setDialoguePrivacy(args.input);
  },
})