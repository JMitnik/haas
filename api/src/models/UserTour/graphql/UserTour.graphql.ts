import { objectType } from 'nexus';

export const UserTour = objectType({
  name: 'UserTour',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');

    t.string('triggerVersion');
    t.string('triggerPage');

    t.nonNull.field('type', {
      type: 'TourType',
    });

    t.list.field('usersOfTour', {
      type: 'TourOfUser',
    });

    t.list.field('steps', {
      type: 'TourStep',
      resolve(parent: any, _, ctx) {
        if (parent?.steps?.length) return parent.steps;

        return ctx.services.userTourService.findTourStepsByUserTour(parent.id);
      },
    });
  },
})