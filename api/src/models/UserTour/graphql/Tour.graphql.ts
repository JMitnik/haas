import { objectType } from 'nexus';

export const Tour = objectType({
  name: 'Tour',
  definition(t) {
    t.field('releaseTour', {
      type: 'UserTour',
    });

    t.list.field('featureTours', {
      type: 'UserTour',
    });
  },
})