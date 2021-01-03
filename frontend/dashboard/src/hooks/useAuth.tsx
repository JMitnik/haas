import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import { SystemPermission } from 'types/globalTypes';

interface UseAuthProps {
  canCreateCustomers: boolean;
  canDeleteCustomers: boolean;
  canCreateTriggers: boolean;
  canViewCampaigns: boolean;
  canCreateCampaigns: boolean;
  canCreateDeliveries: boolean;
  canEditTriggers: boolean;
  canDeleteTriggers: boolean;
  canInviteUsers: boolean;
  canEditCustomer: boolean;
  canAccessAdmin: boolean;
  canViewDialogueBuilder: boolean;
  canEditUsers: boolean;
  canBuildDialogues: boolean;
  canViewUsers: boolean;
  canDeleteUsers: boolean;
  canViewDialogueView: boolean;
  hasPermission: (permission: SystemPermission) => boolean;
}

const useAuth = (): UseAuthProps => {
  const { user } = useUser();

  // Technically this should not work in views without CustomerProvider <- Will return undefined thus
  const { activePermissions } = useCustomer();

  const authPermissions = activePermissions || user?.globalPermissions;

  const hasPermission = (permission: SystemPermission) => authPermissions?.includes(permission) || false;
  // const hasAllPermissions = (permission: SystemPermission) => authPermissions.includes(permission);

  const canDeleteCustomers = authPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL) || false;
  const canCreateCustomers = authPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL) || false;
  const canAccessAdmin = authPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL) || false;
  const canInviteUsers = authPermissions?.includes(SystemPermission.CAN_ADD_USERS) || false;
  const canViewUsers = authPermissions?.includes(SystemPermission.CAN_VIEW_USERS) || false;
  const canDeleteUsers = authPermissions?.includes(SystemPermission.CAN_DELETE_USERS) || false;
  const canEditUsers = authPermissions?.includes(SystemPermission.CAN_EDIT_USERS) || false;
  
  const canViewCampaigns = authPermissions?.includes(SystemPermission.CAN_VIEW_CAMPAIGNS) || false;
  const canCreateCampaigns = authPermissions?.includes(SystemPermission.CAN_CREATE_CAMPAIGNS) || false;
  const canCreateDeliveries = authPermissions?.includes(SystemPermission.CAN_CREATE_DELIVERIES) || false;

  // Workspace-specific actions
  const canEditCustomer = authPermissions?.includes(SystemPermission.CAN_EDIT_WORKSPACE) || false;
  const canViewDialogueBuilder = authPermissions?.includes(SystemPermission.CAN_VIEW_DIALOGUE) || false;
  const canBuildDialogues = authPermissions?.includes(SystemPermission.CAN_BUILD_DIALOGUE) || false;
  const canViewDialogueView = authPermissions?.includes(SystemPermission.CAN_VIEW_DIALOGUE_ANALYTICS) || false;

  const canCreateTriggers = authPermissions?.includes(SystemPermission.CAN_CREATE_TRIGGERS) || false;
  const canEditTriggers = authPermissions?.includes(SystemPermission.CAN_CREATE_TRIGGERS) || false;
  const canDeleteTriggers = authPermissions?.includes(SystemPermission.CAN_DELETE_TRIGGERS) || false;

  return {
    canViewCampaigns,
    canCreateCampaigns,
    canCreateDeliveries,
    canViewDialogueView,
    canEditTriggers,
    canDeleteTriggers,
    canCreateCustomers,
    canDeleteCustomers,
    canCreateTriggers,
    canEditUsers,
    canEditCustomer,
    canInviteUsers,
    hasPermission,
    canAccessAdmin,
    canViewUsers,
    canDeleteUsers,
    canViewDialogueBuilder,
    canBuildDialogues,
  };
};

export default useAuth;
