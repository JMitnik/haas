import { objectType } from 'nexus';

export const PublicDialogueInfo = objectType({
  name: 'PublicDialogueInfo',
  definition(t) {
    t.string('title');
    t.string('slug');
    t.string('description', { nullable: true });
    t.string('url');
  },
});
