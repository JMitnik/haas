import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

import { SystemPermission } from 'types/globalTypes';

interface UseAuthProps {
  canAccessAdmin: boolean;
  canViewDialogueBuilder: boolean;
  canBuildDialogues: boolean;
  hasPermission: (permission: SystemPermission) => boolean;
}

const useAuth = (): UseAuthProps => {
  const { user } = useUser();

  // Technically this should not work in views without CustomerProvider <- Will return undefined thus
  const { activePermissions } = useCustomer();

  const authPermissions = activePermissions || user.globalPermissions;

  const hasPermission = (permission: SystemPermission) => authPermissions?.includes(permission) || false;
  // const hasAllPermissions = (permission: SystemPermission) => authPermissions.includes(permission);

  const canAccessAdmin = authPermissions?.includes(SystemPermission.CAN_ACCESS_ADMIN_PANEL) || false;

  // Workspace-specific actions
  const canViewDialogueBuilder = authPermissions?.includes(SystemPermission.CAN_VIEW_DIALOGUES) || false;
  const canBuildDialogues = authPermissions?.includes(SystemPermission.CAN_BUILD_DIALOGUES) || false;

  return {
    hasPermission,
    canAccessAdmin,
    canViewDialogueBuilder,
    canBuildDialogues,
  };
};

export default useAuth;
