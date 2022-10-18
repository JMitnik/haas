/* eslint-disable @typescript-eslint/no-shadow */
import { generatePath, useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { useMemo } from 'react';

export const ROUTES = {
  GENERATE_WORKSPACE_VIEW: '/dashboard/b/generate-workspace',
  WORKSPACE_ROOT: '/dashboard/b/:customerSlug',
  DIALOGUES_VIEW: '/dashboard/b/:customerSlug/d',
  DIALOGUE_ROOT: '/dashboard/b/:customerSlug/d/:dialogueSlug',
  DIALOGUE_FEEDBACK_OVERVIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/feedback',
  DIALOGUE_CTA_OVERVIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/actions',
  DIALOGUE_CONFIG_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/edit',
  INTERACTIONS_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/interactions',
  DASHBOARD_VIEW: '/dashboard/b/:customerSlug/dashboard',
  INTERACTION_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/interactions/:interactionId',
  WORKSPACE_INTERACTIONS_VIEW: '/dashboard/b/:customerSlug/dashboard/feedback',
  WORKSPACE_ACTION_REQUESTS_VIEW: '/dashboard/b/:customerSlug/dashboard/action_requests',
  WORKSPACE_INTERACTION_VIEW: '/dashboard/b/:customerSlug/dashboard/feedback/:interactionId',
  CAMPAIGNS_VIEW: '/dashboard/b/:customerSlug/campaigns',
  CAMPAIGN_VIEW: '/dashboard/b/:customerSlug/campaign/:campaignId',
  DELIVERY_VIEW: '/dashboard/b/:customerSlug/campaign/:campaignId/:deliveryId',
  AUTODECK_OVERVIEW: '/dashboard/autodeck-overview',
  ADMIN_OVERVIEW: '/dashboard/admin',
  USER_VIEW: '/dashboard/b/:customerSlug/users/:userId',
  ROLE_USER_VIEW: '/dashboard/b/:customerSlug/users/:userId/role/:roleId',
  WORKSPACE_REPORT_VIEW: '/dashboard/b/:customerSlug/_reports',
  DIALOGUE_REPORT_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/_reports/weekly',
  USERS_OVERVIEW: '/dashboard/b/:customerSlug/users',
  ALERTS_OVERVIEW: '/dashboard/b/:customerSlug/triggers',
  DIALOGUE_BUILDER_OVERVIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/builder',
  NEW_QUESTION_CTA_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/builder/question/:questionId/new-cta',
  NEW_OPTION_CTA_VIEW: '/dashboard/b/:customerSlug/d/:dialogueSlug/builder/option/:optionIndex/new-cta',
  AUTOMATION_OVERVIEW: '/dashboard/b/:customerSlug/automations',
  NEW_AUTOMATION_VIEW: '/dashboard/b/:customerSlug/automation/add',
  EDIT_AUTOMATION_VIEW: '/dashboard/b/:customerSlug/automation/:automationId/edit',
};

export interface DashboardParams {
  customerSlug: string;
  dialogueSlug: string;
  campaignId: string;
}

export const useNavigator = () => {
  const { customerSlug, dialogueSlug, campaignId } = useParams<DashboardParams>();

  const dashboardScopeMatch = useRouteMatch<{ customerSlug: string }>({ path: ROUTES.DASHBOARD_VIEW });
  const dialogueScopeMatch = useRouteMatch<{ dialogueSlug: string }>({ path: ROUTES.DIALOGUE_ROOT });
  const dialogueScopeFeedbackMatch = useRouteMatch<{ dialogueSlug: string }>(
    { path: ROUTES.DIALOGUE_FEEDBACK_OVERVIEW },
  );
  const dialogueMatch = useRouteMatch<{ dialogueSlug: string }>({ path: ROUTES.DIALOGUE_ROOT });
  const userOverviewMatch = useRouteMatch<{ dialogueSlug: string }>({ path: ROUTES.USERS_OVERVIEW });
  const dialoguesMatch = useRouteMatch({ path: ROUTES.DIALOGUES_VIEW });
  const campaignsMatch = useRouteMatch({ path: ROUTES.CAMPAIGNS_VIEW });

  const history = useHistory();
  const location = useLocation();

  const goToDialogueFeedbackOverview = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    dialogueSlug: string,
    dialogueIds: string[],
    startDate: string,
    endDate: string,
    maxScore?: number,
    withFollowUpAction?: boolean,
    search?: string,
  ) => {
    const path = generatePath(ROUTES.DIALOGUE_FEEDBACK_OVERVIEW, {
      customerSlug, dialogueSlug,
    });

    const dialogueQueryParams = dialogueIds.length > 1 ? dialogueIds.join('&dialogueIds=') : `${dialogueIds?.[0] || ''}`;
    let targetPath = `${path}?startDate=${startDate}&endDate=${endDate}&dialogueIds=${dialogueQueryParams}`;
    if (maxScore) targetPath = `${targetPath}&maxScore=${maxScore}`;
    if (search) targetPath = `${targetPath}&${search}`;
    if (withFollowUpAction) targetPath = `${targetPath}&withFollowUpAction=1`;

    history.push(targetPath + location.search);
  };
  const goToEditAutomationView = (automationId: string) => {
    const path = generatePath(ROUTES.EDIT_AUTOMATION_VIEW, {
      customerSlug,
      automationId,
    });

    history.push(path + location.search);
  };

  const goToActionRequestOverview = () => {
    const path = generatePath(ROUTES.WORKSPACE_ACTION_REQUESTS_VIEW, {
      customerSlug,
    });

    history.push(path + location.search);
  };

  const goToAutomationOverview = () => {
    const path = generatePath(ROUTES.AUTOMATION_OVERVIEW, {
      customerSlug,
    });

    history.push(path + location.search);
  };

  const goToNewAutomationView = () => {
    const path = generatePath(ROUTES.NEW_AUTOMATION_VIEW, {
      customerSlug,
    });

    history.push(path + location.search);
  };

  const goToWorkspaceFeedbackOverview = (
    dialogueIds: string[], startDate: string, endDate: string, maxScore?: number, withFollowUpAction?: boolean,
  ) => {
    const path = generatePath(ROUTES.WORKSPACE_INTERACTIONS_VIEW, {
      customerSlug,
    });

    const dialogueQueryParams = dialogueIds.length > 1 ? dialogueIds.join('&dialogueIds=') : `${dialogueIds?.[0] || ''}`;
    let targetPath = `${path}?startDate=${startDate}&endDate=${endDate}&dialogueIds=${dialogueQueryParams}`;
    if (maxScore) targetPath = `${targetPath}&maxScore=${maxScore}`;
    if (withFollowUpAction) targetPath = `${targetPath}&withFollowUpAction=1`;

    history.push(targetPath + location.search);
  };

  const goToDialogueBuilderOverview = () => {
    const path = generatePath(ROUTES.DIALOGUE_BUILDER_OVERVIEW, {
      customerSlug,
      dialogueSlug,
    });

    history.push(path + location.search);
  };

  const goToNewOptionsCTAView = (optionIndex: number) => {
    const path = generatePath(ROUTES.NEW_OPTION_CTA_VIEW, {
      customerSlug,
      dialogueSlug,
      optionIndex,
    });

    history.push(path + location.search);
  };

  const goToNewQuestionCTAView = (questionId: string) => {
    const path = generatePath(ROUTES.NEW_QUESTION_CTA_VIEW, {
      customerSlug,
      dialogueSlug,
      questionId,
    });

    history.push(path + location.search);
  };

  const goToCampaignView = (nextCampaignId: string) => {
    const path = generatePath(ROUTES.CAMPAIGN_VIEW, {
      customerSlug,
      campaignId: nextCampaignId,
    });

    history.push(path + location.search);
  };

  const goToGenerateWorkspaceOverview = () => {
    const path = generatePath(ROUTES.GENERATE_WORKSPACE_VIEW, {
      customerSlug,
    });

    history.push(path + location.search);
  };

  const goToUsersOverview = () => {
    const path = generatePath(ROUTES.USERS_OVERVIEW, {
      customerSlug,
    });

    history.push(path + location.search);
  };

  const goToRoleUserView = (userId: string, roleId: string) => {
    const path = generatePath(ROUTES.ROLE_USER_VIEW, {
      customerSlug,
      userId,
      roleId,
    });

    history.push(path + location.search);
  };

  const goToUserView = (userId: string) => {
    const path = generatePath(ROUTES.USER_VIEW, {
      customerSlug,
      userId,
    });

    history.push(path + location.search);
  };

  const goToDeliveryView = (nextCampaignId: string, deliveryId: string) => {
    const path = generatePath(ROUTES.DELIVERY_VIEW, {
      customerSlug,
      campaignId: nextCampaignId,
      deliveryId,
    });

    history.push(path + location.search);
  };

  const goToInteractionsView = (interactionId?: string) => {
    if (interactionId) {
      history.push(generatePath(ROUTES.INTERACTION_VIEW, {
        customerSlug,
        dialogueSlug,
        interactionId,
      }) + location.search);
    } else {
      history.push(generatePath(ROUTES.INTERACTIONS_VIEW, {
        customerSlug,
        dialogueSlug,
      }) + location.search);
    }
  };

  const getCampaignsPath = () => generatePath(ROUTES.CAMPAIGNS_VIEW, { customerSlug, campaignId });
  const getUsersPath = () => generatePath(ROUTES.USERS_OVERVIEW, { customerSlug });
  const getDialoguesPath = () => generatePath(ROUTES.DIALOGUES_VIEW, { customerSlug });
  const getAlertsPath = () => generatePath(ROUTES.ALERTS_OVERVIEW, { customerSlug });
  const getDialogueViewPath = (currCustomerSlug: string, currDialogueSlug: string) => currDialogueSlug
    && currCustomerSlug
    && generatePath(
      ROUTES.DIALOGUE_ROOT, { customerSlug: currCustomerSlug, dialogueSlug: currDialogueSlug },
    );
  const getDialogueFeedbackOverviewPath = (currCustomerSlug: string, currDialogueSlug: string) => currDialogueSlug
    && currCustomerSlug
    && generatePath(
      ROUTES.DIALOGUE_FEEDBACK_OVERVIEW, { customerSlug: currCustomerSlug, dialogueSlug: currDialogueSlug },
    );

  const getDialogueCTAOverviewPath = (currCustomerSlug: string, currDialogueSlug: string) => currDialogueSlug
    && currCustomerSlug
    && generatePath(
      ROUTES.DIALOGUE_CTA_OVERVIEW, { customerSlug: currCustomerSlug, dialogueSlug: currDialogueSlug },
    );

  const getDialogueBuilderViewPath = (currCustomerSlug: string, currDialogueSlug: string) => currDialogueSlug
    && currCustomerSlug
    && generatePath(
      ROUTES.DIALOGUE_BUILDER_OVERVIEW, { customerSlug: currCustomerSlug, dialogueSlug: currDialogueSlug },
    );

  const getDialogueConfigViewPath = (currCustomerSlug: string, currDialogueSlug: string) => currDialogueSlug
    && currCustomerSlug
    && generatePath(
      ROUTES.DIALOGUE_CONFIG_VIEW, { customerSlug: currCustomerSlug, dialogueSlug: currDialogueSlug },
    );

  const dialoguePath = () => dialogueSlug && customerSlug && generatePath(
    ROUTES.DIALOGUE_ROOT, { customerSlug, dialogueSlug },
  );

  const dashboardPath = useMemo(() => customerSlug && generatePath(
    ROUTES.DASHBOARD_VIEW, { customerSlug },
  ), [customerSlug]);

  const workspaceInteractionsPath = useMemo(() => customerSlug && generatePath(
    ROUTES.WORKSPACE_INTERACTIONS_VIEW, { customerSlug },
  ), [customerSlug]);

  const workspaceActionRequestsPath = useMemo(() => customerSlug && generatePath(
    ROUTES.WORKSPACE_ACTION_REQUESTS_VIEW, { customerSlug },
  ), [customerSlug]);

  const goTo = (path: string) => history.push(path);

  return {
    goToActionRequestOverview,
    workspaceActionRequestsPath,
    getDialogueConfigViewPath,
    getDialogueBuilderViewPath,
    getDialogueCTAOverviewPath,
    getDialogueFeedbackOverviewPath,
    getDialogueViewPath,
    goToDialogueFeedbackOverview,
    goToAutomationOverview,
    goToNewAutomationView,
    goToEditAutomationView,
    goTo,
    dashboardPath,
    dialoguePath,
    workspaceInteractionsPath,
    goToWorkspaceFeedbackOverview,
    goToGenerateWorkspaceOverview,
    goToNewOptionsCTAView,
    goToDialogueBuilderOverview,
    goToNewQuestionCTAView,
    goToUsersOverview,
    goToUserView,
    goToRoleUserView,
    goToDeliveryView,
    goToInteractionsView,
    goToCampaignView,
    getCampaignsPath,
    getDialoguesPath,
    getUsersPath,
    getAlertsPath,
    dialoguesMatch,
    dialogueMatch,
    dashboardScopeMatch,
    dialogueScopeMatch,
    dialogueScopeFeedbackMatch,
    customerSlug,
    dialogueSlug,
    campaignId,
    campaignsMatch,
    userOverviewMatch,
  };
};

