import { allow, or, rule, shield } from 'graphql-shield';

import { ApolloError } from 'apollo-server-express';
import { SystemPermissionEnum } from '@prisma/client';

import { APIContext } from '../types/APIContext';
import config from './config';

const isSuperAdmin = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new ApolloError('Unauthenticated', 'UNAUTHENTICATED');

    return ctx.session?.globalPermissions?.includes('CAN_ACCESS_ADMIN_PANEL');
  },
);

const isSelf = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id || !args.userId) return new ApolloError('Unauthenticated', 'UNAUTHENTICATED');
    if (args.userId === ctx.session?.user?.id) return true;

    return false;
  },
);

const isLocal = rule({ cache: 'no_cache' })(
  async () => config.env === 'local',
);

/**
 * Rule which takes a permission.
 * Assumptions: the args of the resolver contains either a (input.)customerId or (input.)customerSlug
 * @param guardedPermission
 */
const containsWorkspacePermission = (guardedPermission: SystemPermissionEnum) => rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new ApolloError('Unauthorized', 'UNAUTHORIZED');

    if (!ctx.session?.activeWorkspace) return false;
    if (!ctx.session.activeWorkspace?.permissions?.includes(guardedPermission)) return false;

    console.log(ctx.session.activeWorkspace);

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
    deleteCustomer: isSuperAdmin,
    inviteUser: containsWorkspacePermission(SystemPermissionEnum.CAN_ADD_USERS),
    // editCustomer: containsWorkspacePermission(SystemPermissionEnum.CAN_EDIT_WORKSPACE),
    editUser: or(isSelf, isSuperAdmin),

    debugMutation: isLocal,

    // // Dialogue-specific settings
    deleteQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    updateQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    createQuestion: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    updateCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    deleteCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    createCTA: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    copyDialogue: isSuperAdmin,
    createDialogue: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    deleteDialogue: containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_DIALOGUE),

    // // Workspace-trigger specific settings
    // deleteTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_TRIGGERS),
    // editTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS),
    // createTrigger: containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS),
  },
}, { fallbackRule: allow, allowExternalErrors: true });

export default authShield;
