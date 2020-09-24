import { allow, deny, or, rule, shield } from 'graphql-shield';

import { ApolloError, ValidationError } from 'apollo-server-express';
import { APIContext } from '../types/APIContext';
import AuthorizationError from '../models/auth/AuthorizationError';

// const isLoggedIn = rule({ cache: 'strict' })(
//   async (parent, args, ctx: APIContext) => ctx.user !== null,
// );

const isSuperAdmin = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return false;

    return ctx.session?.globalPermissions?.includes('CAN_ACCESS_ADMIN_PANEL');
  },
);

const isSelf = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    console.log(args.userId);
    if (!ctx.session?.user?.id || !args.userId) return new ApolloError('Unauthenticated', 'UNAUTHENTICATED');

    // For now, assume there is always a userId (representing the sender)
    if (args.userId === ctx.session?.user?.id) return true;

    return false;
  },
);

const canAccessCompany = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id || !parent.id) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    if (!ctx.session.customersAndPermissions?.find((customer) => customer.id === parent.id)) {
      return new ApolloError('Unauthorized', 'UNAUTHORIZED');
    }

    return true;
  },
);

const authShield = shield({
  Dialogue: {
    // Write this up
    // statistics: canAccessCompany,
  },
  Mutation: {
    '*': isSuperAdmin,
    createSession: allow,
    verifyUserToken: allow,
    inviteUser: allow,
    requestInvite: allow,
    editUser: or(isSelf, isSuperAdmin),
  },
}, { fallbackRule: allow, allowExternalErrors: true });

export default authShield;
