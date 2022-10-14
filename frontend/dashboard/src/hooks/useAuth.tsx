import { SystemPermission } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import { useUser } from 'providers/UserProvider';

interface UseAuthProps {
  canViewActionRequests: boolean;
  canAccessAllActionRequests: boolean;
  canCreateAutomations: boolean;
  canUpdateAutomations: boolean;
  canViewAutomations: boolean;
  canResetWorkspaceData: boolean;
  canGenerateWorkspaceFromCsv: boolean;
  canAssignUsersToDialogue: boolean;
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
  canAccessDialogue: (dialogueSlug: string) => boolean;
}

const useAuth = (): UseAuthProps => {
  const { user } = useUser();

  // Technically this should not work in views without CustomerProvider <- Will return undefined thus
  const { activePermissions, assignedDialogues: privateDialogues } = useCustomer();

  const authPermissions = activePermissions || user?.globalPermissions;
  const isSuperAdmin = user?.globalPermissions?.includes(SystemPermission.CanAccessAdminPanel);

  const canAccessDialogue = (dialogueSlug: string) => {
    const privateDialoguesInWorkspace = privateDialogues?.privateWorkspaceDialogues || [];
    const assignedDialogues = privateDialogues?.assignedDialogues || [];

    const privateDialogue = privateDialoguesInWorkspace?.find(
      (dialogue) => dialogue.slug === dialogueSlug,
    );

    // Dialogue is not private => It is allowed to see dialogue
    if (!privateDialogue) return true;

    // If super admin or has permission to see all dialogues => It is allowed to see dialogue
    const canAccessAllDialogues = authPermissions?.includes(SystemPermission.CanAccessAllDialogues);
    if (isSuperAdmin || canAccessAllDialogues) return true;

    const isPrivateDialogue = !!privateDialogue;

    // Dialogue is private && no assigned dialogues for user => Not allowed to see dialogue
    if (assignedDialogues.length === 0 && privateDialoguesInWorkspace.length > 0) return false;

    const privateDialogueIds = privateDialogues?.privateWorkspaceDialogues?.map((dialogue) => dialogue.id) || [];

    const isAssignedToPrivateDialogue = isPrivateDialogue
      ? privateDialogueIds.includes(privateDialogue?.id)
      : true;

    return isSuperAdmin
      || !isPrivateDialogue
      || isAssignedToPrivateDialogue;
  };

  /**
   * Check if user has permission to features,
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
    canViewActionRequests: hasPermission(SystemPermission.CanViewActionRequests),
    canAccessAllActionRequests: hasPermission(SystemPermission.CanAccessAllActionRequests),
    canCreateAutomations: hasPermission(SystemPermission.CanCreateAutomations),
    canUpdateAutomations: hasPermission(SystemPermission.CanUpdateAutomations),
    canViewAutomations: hasPermission(SystemPermission.CanViewAutomations),
    canResetWorkspaceData: hasPermission(SystemPermission.CanResetWorkspaceData),
    canGenerateWorkspaceFromCsv: hasPermission(SystemPermission.CanGenerateWorkspaceFromCsv),
    canAssignUsersToDialogue: hasPermission(SystemPermission.CanAssignUsersToDialogue),
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
    canAccessDialogue,
  };
};

export default useAuth;
