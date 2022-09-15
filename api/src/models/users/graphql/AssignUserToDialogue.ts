import { inputObjectType, mutationField } from 'nexus';
import { UserInputError } from 'apollo-server-express';

import { UserType } from './User';

export const AssignUserToDialogueInput = inputObjectType({
  name: 'AssignUserToDialogueInput',
  definition(t) {
    t.string('userId', { required: true });
    t.string('workspaceId', { required: true });
    t.string('dialogueId', { required: true });
    t.boolean('state', { required: true });
  },
})

export const AssignUserToDialogue = mutationField('assignUserToDialogue', {
  type: UserType,
  args: { input: AssignUserToDialogueInput },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input provided!');

    return ctx.services.userService.assignUserToDialogue(args.input)
  },
})