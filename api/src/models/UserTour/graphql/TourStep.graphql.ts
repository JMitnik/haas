import { objectType } from 'nexus';

export const TourStep = objectType({
  name: 'TourStep',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.nonNull.string('translationTitle');
    t.nonNull.string('translationHelper');
    t.string('imageUrl');

  },
})