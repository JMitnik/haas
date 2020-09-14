import { allow, deny, or, rule, shield } from 'graphql-shield';

import { APIContext } from '../types/APIContext';
import { ApolloError, ValidationError } from 'apollo-server-express';
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
    if (!ctx.session?.userId || !parent.id) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    if (!ctx.session.customersAndPermissions?.find((customer) => customer.id === parent.id)) {
      return new ApolloError('Unauthorized', 'UNAUTHORIZED');
    }

    return true;
  },
);

const authShield = shield({
  Customer: {
    dialogues: canAccessCompany,
  },
  Mutation: {
    '*': deny,
    // login: allow,
    verifyUserToken: allow,
    inviteUser: allow,
    requestInvite: allow,
  },
}, { fallbackRule: allow, allowExternalErrors: true });

export default authShield;
