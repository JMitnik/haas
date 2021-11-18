import { extendType } from "@nexus/schema";
import { UserInputError } from "apollo-server";

import { UserCustomerType } from "../../users/graphql/User";

export const GetUserCustomerOfCustomer = extendType({
  type: 'Customer',

  definition(t) {
    t.field('userCustomer', {
      type: UserCustomerType,
      args: { userId: 'String' },
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!args.userId) throw new UserInputError('No valid user id provided');

        const customerWithUsers = await ctx.prisma.customer.findUnique({
          where: { id: parent.id },
          include: {
            users: {
              where: {
                userId: args.userId,
              },
              include: {
                user: true,
                role: true,
                customer: true,
              },
            },
          },
        });

        const user = customerWithUsers?.users[0];

        if (!user) throw new UserInputError('Cant find user with this ID');

        return user as any;
      },
    });
  }
});
