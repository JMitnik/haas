import { inputObjectType, objectType, queryField } from '@nexus/schema';
import { UserInputError } from 'apollo-server-express';

import { ConnectionInterface } from '../../models/general/Pagination';
import { DialogueConnectionFilterInput } from './graphql/DialogueConnection';

export const DialogueLinksInput = inputObjectType({
  name: 'DialogueLinksInput',
  definition(t) {
    t.string('workspaceId');
  },
});

export const PublicDialogueInfo = objectType({
  name: 'PublicDialogueInfo',
  definition(t) {
    t.string('title');
    t.string('slug');
    t.string('description', { nullable: true });
    t.string('url');
  },
});

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