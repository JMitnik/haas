import { GraphQLYogaError } from '@graphql-yoga/node';
import { ContextSessionType } from '../auth/ContextSessionType';
import { SystemPermissionEnum } from 'prisma/prisma-client';


export const DialogueValidator = {
  canAccessAllDialogues: (workspaceId: string, session: ContextSessionType | null): boolean => {
    if (!session) throw new GraphQLYogaError('no session found');
    const userWorkspacePermissions = session?.customersAndPermissions?.find(
      (customer) => customer.id === workspaceId)?.permissions;

    if (userWorkspacePermissions && userWorkspacePermissions.find(
      (permission) => permission === SystemPermissionEnum.CAN_ACCESS_ALL_DIALOGUES
    )) return true;

    if (session.globalPermissions.find(
      (permission) => permission === SystemPermissionEnum.CAN_ACCESS_ADMIN_PANEL
    )) return true

    return false;
  },
}