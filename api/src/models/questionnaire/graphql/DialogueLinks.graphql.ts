import { objectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { ConnectionInterface } from '../../general/Pagination';
import { DialogueConnectionFilterInput } from './DialogueConnection';
import { PublicDialogueInfo } from './PublicDialogue.graphql';

export const PublicDialogueConnection = objectType({
  name: 'PublicDialogueConnection',
  definition(t) {
    t.implements(ConnectionInterface);
    t.list.field('dialogues', { type: PublicDialogueInfo });
  },
});

export const DialogueLinksQuery = queryField('dialogueLinks', {
  type: PublicDialogueConnection,
  args: {
    workspaceId: 'String',
    filter: DialogueConnectionFilterInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.workspaceId) throw new UserInputError('No workspace ID provided!');

    const result = await ctx.services.dialogueService.findDialogueUrlsByWorkspaceId(args.workspaceId, args.filter);
    return result;
  },
});
