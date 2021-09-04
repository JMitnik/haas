import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import { SystemPermission } from 'types/globalTypes';

interface UseAuthProps {
  canCreateCustomers: boolean;
  canDeleteDialogue: boolean;
  canDeleteCustomers: boolean;
  canEditDialogue: boolean;
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
  const isSuperAdmin = user?.globalPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL);

  /**
   * Chcek if user has permission to features,
   * 1. Check if user is SuperAdmin (allow *).
   * 2. Check if feature is in user's workspace permissions or globalpermissions.
   * 3. Else, return false.
   */
  const hasPermission = (permission: SystemPermission): boolean => (
    isSuperAdmin
    || authPermissions?.includes(permission)
    || false
  );

  return {
    canDeleteDialogue: hasPermission(SystemPermission.CAN_DELETE_DIALOGUE),
    canEditDialogue: hasPermission(SystemPermission.CAN_EDIT_DIALOGUE),
    canViewCampaigns: hasPermission(SystemPermission.CAN_VIEW_CAMPAIGNS),
    canCreateCampaigns: hasPermission(SystemPermission.CAN_CREATE_CAMPAIGNS),
    canCreateDeliveries: hasPermission(SystemPermission.CAN_CREATE_DELIVERIES),
    canViewDialogueView: hasPermission(SystemPermission.CAN_VIEW_DIALOGUE_ANALYTICS),
    canEditTriggers: hasPermission(SystemPermission.CAN_CREATE_TRIGGERS),
    canDeleteTriggers: hasPermission(SystemPermission.CAN_DELETE_TRIGGERS),
    canCreateCustomers: hasPermission(SystemPermission.CAN_ACCESS_ADMIN_PANEL),
    canDeleteCustomers: hasPermission(SystemPermission.CAN_ACCESS_ADMIN_PANEL),
    canCreateTriggers: hasPermission(SystemPermission.CAN_CREATE_TRIGGERS),
    canEditUsers: hasPermission(SystemPermission.CAN_EDIT_USERS),
    canEditCustomer: hasPermission(SystemPermission.CAN_EDIT_WORKSPACE),
    canInviteUsers: hasPermission(SystemPermission.CAN_ADD_USERS),
    canAccessAdmin: hasPermission(SystemPermission.CAN_ACCESS_ADMIN_PANEL),
    canViewUsers: hasPermission(SystemPermission.CAN_VIEW_USERS),
    canDeleteUsers: hasPermission(SystemPermission.CAN_DELETE_USERS),
    canViewDialogueBuilder: hasPermission(SystemPermission.CAN_VIEW_DIALOGUE),
    canBuildDialogues: hasPermission(SystemPermission.CAN_BUILD_DIALOGUE),
    hasPermission,
  };
};

export default useAuth;
