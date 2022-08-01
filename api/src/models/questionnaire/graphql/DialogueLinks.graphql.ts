import { objectType, queryField } from 'nexus';
import { GraphQLYogaError } from '@graphql-yoga/node';

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
    if (!args.workspaceId) throw new GraphQLYogaError('No workspace ID provided!');

    const result = await ctx.services.dialogueService.findDialogueUrlsByWorkspaceId(args.workspaceId, args.filter);
    return result;
  },
});
