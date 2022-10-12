import { objectType } from 'nexus';
import { TourOfUser } from 'prisma/prisma-client';

export const TourOfUserType = objectType({
  name: 'TourOfUser',
  definition(t) {
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.date('seenAt');

    t.nonNull.string('userId');
    t.field('user', {
      type: 'UserType',
      resolve(parent: any, args, ctx) {
        if (parent.user) return parent.user;

        return ctx.services.userService.getUserById(parent.userId);
      },
    });

    t.field('tour', {
      type: 'UserTour',
      async resolve(parent, _, ctx) {
        return ctx.services.userTourService.findUserTour(parent.userTourId);
      },
    })

    t.nonNull.string('userTourId');
  },
})