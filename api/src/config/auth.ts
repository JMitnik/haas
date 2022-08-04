/* eslint-disable max-len */
import { allow, or, rule, shield } from 'graphql-shield';

import { SystemPermissionEnum } from '@prisma/client';
import { UnauthenticatedError } from '../models/Common/Errors/UnauthenticatedError';
import { UnauthorizedError } from '../models/Common/Errors/UnauthorizedError';
import { APIContext } from '../types/APIContext';
import config from './config';

const isSuperAdmin = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new UnauthenticatedError();

    return ctx.session?.globalPermissions?.includes('CAN_ACCESS_ADMIN_PANEL');
  },
);

const isSelf = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id || !args.userId) return new UnauthenticatedError();
    if (args.userId === ctx.session?.user?.id) return true;

    return false;
  },
);

const isFromClient = rule({ cache: 'contextual' })(
  async (parent, args, ctx: APIContext) => {
    // console.log(ctx.req.get('origin'));
    if (config.env === 'local') return true;

    // TODO: Create fix for fastify but since all condition are returning true I will wait for now
    // if (ctx.req.get('origin') === config.clientUrl) {
    //     return true;
    //   }

    return true;
  },
)

const belongsToWorkspace = rule({ cache: 'no_cache' })(
  async (parent, args, ctx: APIContext) => {
    if (!ctx.session?.user?.id) return new UnauthenticatedError();
    if (!ctx.session?.activeWorkspace) return false;

    if (ctx.session.user.customers.find(workspace => workspace.customerId === ctx.session?.activeWorkspace?.id)) {
      return true;
    }

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
    // All permissions: either globalPermissions or workspace permissions
    const globalPermissions = ctx.session?.user?.globalPermissions || [];
    const workspacePermissions = ctx.session?.activeWorkspace?.permissions || [];

    const allRelevantPermissions = [
      ...globalPermissions,
      ...workspacePermissions,
    ];

    // console.log(ctx.session);


    if (!ctx.session?.user?.id) return new UnauthenticatedError();

    if (!ctx.session?.activeWorkspace) return false;
    if (!allRelevantPermissions?.includes(guardedPermission)) return false;

    return true;
  },
);

const authShield = shield({
  Query: {
    dialogueLinks: allow,
    users: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_USERS)),
    user: or(isSelf, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_USERS)),
  },
  Customer: {
    dialogueConnection: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_DIALOGUE)),
    automationConnection: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_AUTOMATIONS)),
    usersConnection: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_USERS)),
    sessionConnection: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_DIALOGUE)),
  },
  DeliveryType: {
    deliveryRecipientFirstName: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_DELIVERIES)),
    deliveryRecipientLastName: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_DELIVERIES)),
  },
  Dialogue: {
    // Write this up
    // statistics: canAccessCompany,
    sessionConnection: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_VIEW_DIALOGUE)),
  },
  Mutation: {
    '*': isSuperAdmin,
    logout: allow,
    createSession: allow,
    updateCreateWorkspaceJob: allow,
    appendToInteraction: allow,
    verifyUserToken: allow,
    requestInvite: allow,
    authenticateLambda: allow,
    resetWorkspaceData: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_RESET_WORKSPACE_DATA)),
    assignUserToDialogues: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_ASSIGN_USERS_TO_DIALOGUE)),
    uploadUpsellImage: containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE),
    deleteCustomer: isSuperAdmin,
    createAutomationToken: isSuperAdmin,

    createAutomation: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_AUTOMATIONS)),
    updateAutomation: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_UPDATE_AUTOMATIONS)),

    createCampaign: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_CAMPAIGNS)),
    createBatchDeliveries: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_DELIVERIES)),

    inviteUser: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_ADD_USERS)),
    editWorkspace: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_EDIT_WORKSPACE)),
    editUser: or(isSelf, isSuperAdmin),

    updateDeliveryStatus: isFromClient,

    // // Dialogue-specific settings
    deleteQuestion: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    updateQuestion: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    createQuestion: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    updateCTA: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    deleteCTA: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    createCTA: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    copyDialogue: isSuperAdmin,
    createDialogue: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_BUILD_DIALOGUE)),
    editDialogue: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_EDIT_DIALOGUE)),
    deleteDialogue: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_DIALOGUE)),

    // // Workspace-trigger specific settings
    deleteTrigger: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_DELETE_TRIGGERS)),
    editTrigger: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS)),
    createTrigger: or(isSuperAdmin, containsWorkspacePermission(SystemPermissionEnum.CAN_CREATE_TRIGGERS)),
  },
}, { fallbackRule: allow, allowExternalErrors: true, fallbackError: new UnauthorizedError() });

export default authShield;
