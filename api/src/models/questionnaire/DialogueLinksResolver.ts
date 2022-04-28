import { inputObjectType, objectType, queryField } from '@nexus/schema';

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
})

export const DialogueLinksQuery = queryField('dialogueLinks', {
  type: PublicDialogueInfo,
  list: true,
  args: {
    input: DialogueLinksInput,
  },
  nullable: true,
  async resolve(parent, args, ctx) {
    if (!args.input?.workspaceId) return [];
    return ctx.services.dialogueService.findDialogueUrlsByWorkspaceId(args.input.workspaceId);
  },
});