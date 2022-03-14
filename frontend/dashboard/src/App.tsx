import { AnimatePresence } from 'framer-motion';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ViewContainer } from '@haas/ui';
import React, { FC } from 'react';

import { AppProviders } from 'config/AppProviders';
import { CampaignView } from 'views/CampaignView/CampaignView';
import { DialogueProvider } from 'providers/DialogueProvider';
import { InteractionsOverview } from 'views/InteractionsOverview';
import { ROUTES } from 'hooks/useNavigator';
import { ReportView } from 'views/ReportView';
import { SystemPermission } from 'types/generated-types';
import { sub } from 'date-fns';
import { useUser } from 'providers/UserProvider';
import ActionsPage from 'pages/dashboard/actions';
import AddAutomationView from 'views/AddAutomationView';
import AddCustomerPage from 'pages/dashboard/customers/add';
import AddDialogueView from 'views/AddDialogueView';
import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AdminOverview from 'views/AdminOverview/AdminOverview';
import AnalyticsPage from 'pages/dashboard/analytics';
import AutodeckOverview from 'views/AutodeckOverview/AutodeckOverview';
import AutomationsPage from 'pages/dashboard/automations';
import CampaignsView from 'views/CampaignsView/CampaignsView';
import CustomerLayout from 'layouts/CustomerLayout';
import CustomerPage from 'pages/dashboard/customer';
import CustomerProvider from 'providers/CustomerProvider';
import CustomerRoute from 'components/Routes/CustomerRoute';
import CustomersPage from 'pages/dashboard/customers';
import DashboardPage from 'pages/dashboard';
import DialogueBuilderPage from 'pages/dashboard/builder';
import DialogueLayout from 'layouts/DialogueLayout';
import DialoguePage from 'pages/dashboard/dialogues/dialogue';
import DialoguesPage from 'pages/dashboard/dialogues';
import EditAutomationView from 'views/EditAutomationView';
import EditCustomerView from 'views/EditCustomerView';
import EditDialogueView from 'views/EditDialogueView';
import EditMePage from 'pages/me/edit';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import EditUserView from 'views/UsersOverview/EditUserView';
import FirstTimePage from 'pages/dashboard/first_time';
import GlobalLoader from 'components/GlobalLoader';
import GuardedRoute from 'components/Routes/GuardedRoute';
import LoggedOutView from 'layouts/LoggedOutView';
import LoginPage from 'pages/login';
import NotAuthorizedView from 'layouts/NotAuthorizedView';
import PreCustomerLayout from 'layouts/PreCustomerLayout';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';
import VerifyTokenPage from 'pages/verify_token';

const CustomerRoutes = () => (
  <AnimatePresence>
    <CustomerProvider>
      <DialogueProvider>
        <CustomerLayout>
          <Switch>
            <CustomerRoute
              path="/dashboard/b/:customerSlug/d/:dialogueSlug"
              render={() => (
                <DialogueLayout>
                  <Switch>
                    <GuardedRoute
                      allowedPermission={SystemPermission.CanBuildDialogue}
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug/builder"
                      render={() => <DialogueBuilderPage />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanEditDialogue}
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug/edit"
                      render={() => <EditDialogueView />}
                    />

                    <GuardedRoute
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug/interactions"
                      render={() => <InteractionsOverview />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanBuildDialogue}
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug/actions"
                      render={() => <ActionsPage />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanViewDialogueAnalytics}
                      redirectRoute="/dashboard/b/:customerSlug/d/:dialogueSlug/interactions"
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug"
                      render={() => <DialoguePage />}
                    />

                  </Switch>
                </DialogueLayout>
              )}
            />

            <GuardedRoute
              allowedPermission={SystemPermission.CanViewCampaigns}
              path={ROUTES.CAMPAIGNS_VIEW}
              render={() => <CampaignsView />}
            />

            <GuardedRoute
              allowedPermission={SystemPermission.CanCreateDeliveries}
              path={ROUTES.CAMPAIGN_VIEW}
              render={() => <CampaignView />}
            />

            <CustomerRoute
              path="/dashboard/b/:customerSlug"
              render={() => (
                <ViewContainer>
                  <Switch>
                    <GuardedRoute
                      path="/dashboard/b/:customerSlug/analytics/"
                      render={() => <AnalyticsPage />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanCreateAutomations}
                      path={ROUTES.NEW_AUTOMATION_VIEW}
                      render={() => <AddAutomationView />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanUpdateAutomations}
                      path={ROUTES.EDIT_AUTOMATION_VIEW}
                      render={() => <EditAutomationView />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanViewAutomations}
                      path="/dashboard/b/:customerSlug/automations/"
                      render={() => <AutomationsPage />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanCreateTriggers}
                      path="/dashboard/b/:customerSlug/triggers/add"
                      render={() => <AddTriggerView />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanCreateTriggers}
                      path="/dashboard/b/:customerSlug/triggers/:triggerId/edit"
                      render={() => <EditTriggerView />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanCreateTriggers}
                      path="/dashboard/b/:customerSlug/triggers"
                      render={() => <TriggersOverview />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanEditWorkspace}
                      path="/dashboard/b/:customerSlug/edit"
                      render={() => <EditCustomerView />}
                    />

                    <GuardedRoute
                      path="/dashboard/b/:customerSlug/u/:userId/edit"
                      allowedPermission={SystemPermission.CanEditUsers}
                      render={() => <EditUserView />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanViewUsers}
                      path="/dashboard/b/:customerSlug/users"
                      render={() => <UsersOverview />}
                    />

                    <GuardedRoute
                      allowedPermission={SystemPermission.CanDeleteDialogue}
                      path="/dashboard/b/:customerSlug/dialogue/add"
                      render={() => <AddDialogueView />}
                    />

                    <GuardedRoute
                      path="/dashboard/b/:customerSlug/d"
                      render={() => <DialoguesPage />}
                    />
                    <GuardedRoute
                      path="/dashboard/b/:customerSlug/"
                      render={() => <CustomerPage />}
                    />
                  </Switch>
                </ViewContainer>
              )}
            />
          </Switch>
        </CustomerLayout>
      </DialogueProvider>
    </CustomerProvider>
  </AnimatePresence>
);

const PublicRoutes = () => (
  <Switch>
    <Route path="/public/login">
      <LoginPage />
    </Route>

    <Route path="/public">
      <Redirect to="/public/login" />
    </Route>
  </Switch>
);

const ReportRoutes = () => (
  <AnimatePresence>
    <CustomerProvider>
      <DialogueProvider>
        <Switch>
          <GuardedRoute
            allowedPermission={SystemPermission.CanAccessReportPage}
            path={ROUTES.WEEKLY_REPORT_VIEW}
            render={() => (
              <ReportView
                startDate={sub(new Date(), { weeks: 1 })}
                dateLabel="last_week"
                compareStatisticStartDate={sub(new Date(), { weeks: 2 })}
              />
            )}
          />
        </Switch>
      </DialogueProvider>
    </CustomerProvider>
  </AnimatePresence>
);

const RootAppRoute = () => {
  const { isLoggedIn } = useUser();

  if (isLoggedIn) return <Redirect to="/dashboard" />;

  return <Redirect to="/public/login" />;
};

const RootApp = ({ children }: { children: React.ReactNode }) => {
  const { isInitializingUser } = useUser();

  if (isInitializingUser) return <GlobalLoader />;

  return <>{children}</>;
};

const AppRoutes = () => (
  <RootApp>
    <Switch>
      <Route
        path="/dashboard/b/add"
        render={() => (
          <PreCustomerLayout>
            <AddCustomerPage />
          </PreCustomerLayout>
        )}
      />

      <Route path="/dashboard/b/:customerSlug/d/:dialogueSlug/_reports" render={() => <ReportRoutes />} />
      <Route path="/dashboard/b/:customerSlug" render={() => <CustomerRoutes />} />

      <GuardedRoute
        allowedPermission={SystemPermission.CanAccessAdminPanel}
        path={ROUTES.AUTODECK_OVERVIEW}
        render={() => <AutodeckOverview />}
      />

      <GuardedRoute
        allowedPermission={SystemPermission.CanAccessAdminPanel}
        path={ROUTES.ADMIN_OVERVIEW}
        render={() => <AdminOverview />}
      />

      <GuardedRoute
        path="/dashboard/b/"
        render={() => (
          <PreCustomerLayout>
            <CustomersPage />
          </PreCustomerLayout>
        )}
      />

      <GuardedRoute path="/dashboard/me/edit">
        <EditMePage />
      </GuardedRoute>

      <GuardedRoute path="/dashboard/first_time">
        <FirstTimePage />
      </GuardedRoute>

      <GuardedRoute path="/dashboard">
        <DashboardPage />
      </GuardedRoute>

      <Route path="/verify_token">
        <VerifyTokenPage />
      </Route>

      <Route path="/public">
        <PublicRoutes />
      </Route>

      <Route path="/unauthorized">
        <NotAuthorizedView />
      </Route>

      <Route path="/logged_out">
        <LoggedOutView />
      </Route>

      <Route path="/">
        <RootAppRoute />
      </Route>
    </Switch>
  </RootApp>
);

const App: FC = () => (
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);

export default App;
