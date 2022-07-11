import { objectType } from '@nexus/schema';

export const PublicDialogueInfo = objectType({
  name: 'PublicDialogueInfo',
  definition(t) {
    t.string('title');
    t.string('slug');
    t.string('description', { nullable: true });
    t.string('url');
  },
});
