import { allow, deny, or, rule, shield } from 'graphql-shield';

import { ApolloError, ValidationError } from 'apollo-server-express';
import { APIContext } from '../types/APIContext';
import AuthorizationError from '../models/auth/AuthorizationError';

// const isLoggedIn = rule({ cache: 'strict' })(
//   async (parent, args, ctx: APIContext) => ctx.user !== null,
// );

// const isSuperAdmin = rule({ cache: 'no_cache' })(
//   async (parent, args, ctx: APIContext) => {
//     if (!ctx.session?.userId) return false;

//     // console.log(ctx.session?.userId?.globalPermissions?.includes('CAN_ACCESS_ADMIN_PANEL'));

//     // return ctx.session?.userId?.globalPermissions?.includes('CAN_ACCESS_ADMIN_PANEL');
//   },
// );

const canAccessCompany = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    console.log(parent);
    console.log(ctx);
    if (!ctx.session?.userId || !parent.id) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    const customerWithUsers = await ctx.prisma.userOfCustomer.findOne({
      where: {
        userId_customerId: {
          customerId: parent.id,
          userId: ctx.session?.userId,
        },
      },
    });

    console.log(customerWithUsers);
    if (!customerWithUsers) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    return true;
  },
);

const authShield = shield({
  // Query: {
  //   customers: isLoggedIn,
  // },
  Customer: canAccessCompany,
  Mutation: {
    '*': deny,
    login: allow,
    // createCustomer: isSuperAdmin,
  },
}, { fallbackRule: allow });

export default authShield;
