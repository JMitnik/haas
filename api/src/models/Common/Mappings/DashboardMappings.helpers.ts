import config from '../../../config/config';

export const dashboardDialogueUrl = (workspaceSlug: string, dialogueSlug: string) => {
  return `${config.dashboardUrl}/dashboard/b/${workspaceSlug}/d/${dialogueSlug}`
}

export const workspaceDashboardUrl = (workspaceSlug: string) => {
  return `${config.dashboardUrl}/dashboard/b/${workspaceSlug}`;
}
