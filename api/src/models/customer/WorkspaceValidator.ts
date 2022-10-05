import { GraphQLYogaError } from '@graphql-yoga/node';
import { ContextSessionType } from '../auth/ContextSessionType';
import { SystemPermissionEnum } from '@prisma/client';


export const WorkspaceValidator = {
  canAccessAllActionables: (workspaceId: string, session: ContextSessionType | null): boolean => {
    if (!session) throw new GraphQLYogaError('no session found');
    const userWorkspacePermissions = session?.customersAndPermissions?.find(
      (customer) => customer.id === workspaceId)?.permissions;

    if (userWorkspacePermissions && userWorkspacePermissions.find(
      (permission) => permission === SystemPermissionEnum.CAN_ACCESS_ALL_ACTION_REQUESTS
    )) return true;

    if (session.globalPermissions.find(
      (permission) => permission === SystemPermissionEnum.CAN_ACCESS_ADMIN_PANEL
    )) return true

    return false;
  },
}
