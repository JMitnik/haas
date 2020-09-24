import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import { SystemPermission } from 'types/globalTypes';

interface UseAuthProps {
  canCreateTriggers: boolean;
  canEditCustomer: boolean;
  canAccessAdmin: boolean;
  canViewDialogueBuilder: boolean;
  canBuildDialogues: boolean;
  canViewUsers: boolean;
  hasPermission: (permission: SystemPermission) => boolean;
}

const useAuth = (): UseAuthProps => {
  const { user } = useUser();

  // Technically this should not work in views without CustomerProvider <- Will return undefined thus
  const { activePermissions } = useCustomer();

  const authPermissions = activePermissions || user?.globalPermissions;

  const hasPermission = (permission: SystemPermission) => authPermissions?.includes(permission) || false;
  // const hasAllPermissions = (permission: SystemPermission) => authPermissions.includes(permission);

  const canAccessAdmin = authPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL) || false;
  const canViewUsers = authPermissions?.includes(SystemPermission.CAN_VIEW_USERS) || false;

  // Workspace-specific actions
  const canEditCustomer = authPermissions?.includes(SystemPermission.CAN_EDIT_WORKSPACE) || false;
  const canViewDialogueBuilder = authPermissions?.includes(SystemPermission.CAN_VIEW_DIALOGUE) || false;
  const canBuildDialogues = authPermissions?.includes(SystemPermission.CAN_BUILD_DIALOGUE) || false;

  const canCreateTriggers = authPermissions?.includes(SystemPermission.CAN_CREATE_TRIGGERS) || false;

  return {
    canCreateTriggers,
    canEditCustomer,
    hasPermission,
    canAccessAdmin,
    canViewUsers,
    canViewDialogueBuilder,
    canBuildDialogues,
  };
};

export default useAuth;
