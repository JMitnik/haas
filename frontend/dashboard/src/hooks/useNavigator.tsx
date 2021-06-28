import { useParams, useRouteMatch, useHistory, generatePath } from 'react-router';

export const ROUTES = {
  WORKSPACE_ROOT: '/dashboard/b/:customerSlug',
  DIALOGUES_VIEW: '/dashboard/b/:customerSlug/d',
  DIALOGUE_ROOT: '/dashboard/b/:customerSlug/d/:dialogueSlug',
  CAMPAIGNS_VIEW: '/dashboard/b/:customerSlug/campaigns',
  CAMPAIGN_VIEW: '/dashboard/b/:customerSlug/campaign/:campaignId',
  AUTODECK_OVERVIEW: '/dashboard/autodeck-overview',
  ADMIN_OVERVIEW: '/dashboard/admin',
  HOME_ROOT: '/dashboard/b/',
};

interface DashboardParams {
  customerSlug: string;
  dialogueSlug: string;
  campaignId: string;
}

export const useNavigator = () => {
  const { customerSlug, dialogueSlug, campaignId } = useParams<DashboardParams>();
  const dialogueMatch = useRouteMatch<{ dialogueSlug: string }>({
    path: ROUTES.DIALOGUE_ROOT,
  });
  const history = useHistory();

  const goToCampaignView = (campaignId: string) => {
    const path = generatePath(ROUTES.CAMPAIGN_VIEW, {
      customerSlug,
      campaignId,
    });

    history.push(path);
  };

  const getCampaignsPath = () => generatePath(ROUTES.CAMPAIGNS_VIEW, { customerSlug, campaignId });

  const getWorkspacePath = () => generatePath(ROUTES.HOME_ROOT, { customerSlug, campaignId })

  const dialoguesMatch = useRouteMatch({
    path: ROUTES.DIALOGUES_VIEW,
  });

  const campaignsMatch = useRouteMatch({
    path: ROUTES.CAMPAIGNS_VIEW,
  });

  return {
    goToCampaignView,
    getCampaignsPath,
    getWorkspacePath,
    dialoguesMatch,
    dialogueMatch,
    customerSlug,
    dialogueSlug,
    campaignId,
    campaignsMatch,
  };
};
