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
    })

    t.nonNull.string('userTourId');
  },
})