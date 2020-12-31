import { useParams, useRouteMatch, useHistory, generatePath } from 'react-router';

export const ROUTES = {
  WORKSPACE_ROOT: '/dashboard/b/:customerSlug',
  DIALOGUES_VIEW: '/dashboard/b/:customerSlug/d',
  DIALOGUE_ROOT: '/dashboard/b/:customerSlug/d/:dialogueSlug',
  CAMPAIGNS_VIEW: '/dashboard/b/:customerSlug/campaigns',
  CAMPAIGN_VIEW: '/dashboard/b/:customerSlug/campaign/:campaignId',
};

export const useNavigator = () => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const dialogueMatch = useRouteMatch<{ dialogueSlug: string }>({
    path: ROUTES.DIALOGUE_ROOT,
  });
  const history = useHistory();

  const goToCampaignView = (campaignId: string) => {
    const path = generatePath(ROUTES.CAMPAIGN_VIEW, {
      customerSlug,
      campaignId
    });
    
    history.push(path);
  }

  const dialoguesMatch = useRouteMatch({
    path: ROUTES.DIALOGUES_VIEW,
  });

  const campaignsMatch = useRouteMatch({
    path: ROUTES.CAMPAIGNS_VIEW,
  });

  return {
    goToCampaignView,
    dialoguesMatch,
    dialogueMatch,
    customerSlug,
    dialogueSlug,
    campaignsMatch,
  };
};
