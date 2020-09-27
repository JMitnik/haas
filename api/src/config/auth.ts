import { allow, deny, or, rule, shield } from 'graphql-shield';

import { ApolloError, ValidationError } from 'apollo-server-express';
import { SystemPermissionEnum } from '@prisma/client';
import { APIContext } from '../types/APIContext';
import AuthorizationError from '../models/auth/AuthorizationError';

// const isLoggedIn = rule({ cache: 'strict' })(
//   async (parent, args, ctx: APIContext) => ctx.user !== null,
// );

const isSuperAdmin = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new ApolloError('Unauthenticated', 'UNAUTHENTICATED');

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

/**
 * Rule which takes a permission.
 * Assumptions: the args of the resolver contains either a (input.)customerId or (input.)customerSlug
 * @param guardedPermission
 */
const containsWorkspacePermission = (guardedPermission: SystemPermissionEnum) => rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    const inputCustomerSlug = args?.customerSlug || args?.input?.customerSlug;
    const inputCustomerId = args?.customerId || args?.input?.customerId;

    const customer = await ctx.prisma.customer.findOne({
      where: {
        slug: inputCustomerSlug || undefined,
        id: inputCustomerId || undefined,
      },
    });

    if (!customer) return false;

    const customerId = customer.id;

    const relevantCustomer = ctx.session.customersAndPermissions?.find((customer) => customer.id === customerId);

    if (!relevantCustomer?.permissions?.includes(guardedPermission)) return false;

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
    logout: allow,
    createSession: allow,
    verifyUserToken: allow,
    requestInvite: allow,
    editUser: or(isSelf, isSuperAdmin),

    // Workspace-specific settings
    inviteUser: containsWorkspacePermission(SystemPermissionEnum.CAN_ADD_USERS),
    deleteCustomer: isSuperAdmin,
    editCustomer: containsWorkspacePermission(SystemPermissionEnum.CAN_EDIT_WORKSPACE),

    // TODO: Figure out how to get the relevant customer for these nodes
    // // Dialogue-specific settings
    // deleteQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // updateQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // createQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // updateCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // deleteCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // createCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // copyDialogue: isSuperAdmin,
    // createDialogue: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    // deleteDialogue: containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_DIALOGUE),

    // // Workspace-trigger specific settings
    // deleteTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_TRIGGERS),
    // editTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS),
    // createTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS),

    // Workspace-
  },
}, { fallbackRule: allow, allowExternalErrors: true });

export default authShield;
