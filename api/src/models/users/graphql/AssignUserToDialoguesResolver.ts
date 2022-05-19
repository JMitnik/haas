import { inputObjectType, mutationField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { UserType } from './User';

export const AssignUserToDialoguesInput = inputObjectType({
  name: 'AssignUserToDialoguesInput',
  definition(t) {
    t.string('userId', { required: true });
    t.string('workspaceId', { required: true });
    t.list.string('assignedDialogueIds', { required: true });
  },
})

export const AssignUserToDialogues = mutationField('assignUserToDialogues', {
  type: UserType,
  args: { input: AssignUserToDialoguesInput },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input) throw new UserInputError('No input provided!');

    // TODO: Probably want to check if set dialogues belong to specified workspace
    return ctx.services.userService.assignUserToPrivateDialogues(args.input)
  },
})