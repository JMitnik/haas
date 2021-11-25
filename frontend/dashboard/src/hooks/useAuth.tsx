import { SystemPermission } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

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

  // console.log({ user, activePermissions });

  const authPermissions = activePermissions || user?.globalPermissions;
  const isSuperAdmin = user?.globalPermissions?.includes(SystemPermission.CanAccessAdminPanel);

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
    canDeleteDialogue: hasPermission(SystemPermission.CanDeleteDialogue),
    canEditDialogue: hasPermission(SystemPermission.CanEditDialogue),
    canViewCampaigns: hasPermission(SystemPermission.CanViewCampaigns),
    canCreateCampaigns: hasPermission(SystemPermission.CanCreateCampaigns),
    canCreateDeliveries: hasPermission(SystemPermission.CanCreateDeliveries),
    canViewDialogueView: hasPermission(SystemPermission.CanViewDialogueAnalytics),
    canEditTriggers: hasPermission(SystemPermission.CanCreateTriggers),
    canDeleteTriggers: hasPermission(SystemPermission.CanDeleteTriggers),
    canCreateCustomers: hasPermission(SystemPermission.CanAccessAdminPanel),
    canDeleteCustomers: hasPermission(SystemPermission.CanAccessAdminPanel),
    canCreateTriggers: hasPermission(SystemPermission.CanCreateTriggers),
    canEditUsers: hasPermission(SystemPermission.CanEditUsers),
    canEditCustomer: hasPermission(SystemPermission.CanEditWorkspace),
    canInviteUsers: hasPermission(SystemPermission.CanAddUsers),
    canAccessAdmin: hasPermission(SystemPermission.CanAccessAdminPanel),
    canViewUsers: hasPermission(SystemPermission.CanViewUsers),
    canDeleteUsers: hasPermission(SystemPermission.CanDeleteUsers),
    canViewDialogueBuilder: hasPermission(SystemPermission.CanViewDialogue),
    canBuildDialogues: hasPermission(SystemPermission.CanBuildDialogue),
    hasPermission,
  };
};

export default useAuth;
