import { AnimatePresence } from 'framer-motion';
import { ApolloProvider } from '@apollo/react-hooks';
import { Div, ViewContainer } from '@haas/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import React, { FC } from 'react';

import { AppContainer } from 'styles/AppStyles';
import { DefaultThemeProviders } from 'providers/ThemeProvider';
import { SystemPermission } from 'types/globalTypes';
import ActionsPage from 'pages/dashboard/actions';
import AddCustomerPage from 'pages/dashboard/customers/add';
import AddDialogueView from 'views/AddDialogueView';
import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AddUserView from 'views/UsersOverview/AddUserView';
import AnalyticsPage from 'pages/dashboard/analytics';
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
import EditCustomerView from 'views/EditCustomerView';
import EditDialogueView from 'views/EditDialogueView';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import EditUserView from 'views/UsersOverview/EditUserView';
import FallbackServerError from 'components/FallbackServerError';
import FirstTimePage from 'pages/dashboard/first_time';
import GlobalLoader from 'components/GlobalLoader';
import GlobalStyle from 'config/global-styles';
import GuardedRoute from 'components/Routes/GuardedRoute';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import InviteUserView from 'views/UsersOverview/InviteUserView';
import LoggedOutView from 'layouts/LoggedOutView';
import LoginPage from 'pages/login';
import NotAuthorizedView from 'layouts/NotAuthorizedView';
import PreCustomerLayout from 'layouts/PreCustomerLayout';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UserProvider, { useUser } from 'providers/UserProvider';
import UsersOverview from 'views/UsersOverview/UsersOverview';
import VerifyTokenPage from 'pages/verify_token';
import client from 'config/apollo';
import lang from 'config/i18n-config';

const CustomerRoutes = () => (
  <AnimatePresence>
    <CustomerProvider>
      <CustomerLayout>
        <Switch>
          <CustomerRoute
            path="/dashboard/b/:customerSlug/d/:dialogueSlug"
            render={() => (
              <DialogueLayout>
                <Switch>
                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_BUILD_DIALOGUE}
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/builder"
                    render={() => <DialogueBuilderPage />}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_EDIT_DIALOGUE}
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/edit"
                    render={() => <EditDialogueView />}
                  />

                  <GuardedRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/interactions"
                    render={() => <InteractionsOverview />}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_BUILD_DIALOGUE}
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/actions"
                    render={() => <ActionsPage />}
                  />

                  <GuardedRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug"
                    render={() => <DialoguePage />}
                  />

                </Switch>
              </DialogueLayout>
            )}
          />

          <CustomerRoute
            path="/dashboard/b/:customerSlug"
            render={() => (
              <ViewContainer>
                <Switch>
                  <GuardedRoute
                    path="/dashboard/b/:customerSlug/analytics/"
                    render={() => (
                      <AnalyticsPage />
                    )}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_CREATE_TRIGGERS}
                    path="/dashboard/b/:customerSlug/triggers/add"
                    render={() => (
                      <AddTriggerView />
                    )}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_CREATE_TRIGGERS}
                    path="/dashboard/b/:customerSlug/triggers/:triggerId/edit"
                    render={() => (
                      <EditTriggerView />
                    )}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_CREATE_TRIGGERS}
                    path="/dashboard/b/:customerSlug/triggers"
                    render={() => <TriggersOverview />}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_EDIT_WORKSPACE}
                    path="/dashboard/b/:customerSlug/edit"
                    render={() => <EditCustomerView />}
                  />

                  <GuardedRoute
                    path="/dashboard/b/:customerSlug/u/:userId/edit"
                    render={() => (
                      <EditUserView />
                    )}
                  />

                  {/* Possible deprecate this */}
                  {/* <GuardedRoute
                    path="/dashboard/b/:customerSlug/users/add"
                    render={() => (
                      <AddUserView />
                    )}
                  /> */}

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_ADD_USERS}
                    path="/dashboard/b/:customerSlug/users/invite"
                    render={() => (
                      <InviteUserView />
                    )}
                  />

                  <GuardedRoute
                    allowedPermission={SystemPermission.CAN_VIEW_USERS}
                    path="/dashboard/b/:customerSlug/users"
                    render={() => <UsersOverview />}
                  />
                  {/* <GuardedRoute
                    path="/dashboard/b/:customerSlug/roles"
                    render={() => <RolesOverview />}
                  /> */}

                  <GuardedRoute
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
    </CustomerProvider>
  </AnimatePresence>
);

const PublicRoutes = () => (
  <Switch>
    <Route
      path="/public/login"
    >
      <LoginPage />
    </Route>

    <Route path="/public"><Redirect to="/public/login" /></Route>
  </Switch>
);

const RootAppRoute = () => <Redirect to="/dashboard" />;

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

      <Route
        path="/dashboard/b/:customerSlug"
        render={() => <CustomerRoutes />}
      />

      <GuardedRoute
        path="/dashboard/b/"
        render={() => (
          <PreCustomerLayout>
            <CustomersPage />
          </PreCustomerLayout>
        )}
      />

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

const RootApp = ({ children }: { children: React.ReactNode }) => {
  const { isInitializingUser, user } = useUser();

  if (isInitializingUser) return <GlobalLoader />;

  return <>{children}</>;
};

const GeneralErrorFallback = ({ error }: { error?: Error | undefined }) => (
  <Div minHeight="100vh" display="flex" alignItems="center">
    <FallbackServerError />
  </Div>
);

const App: FC = () => (
  <>
    <I18nextProvider i18n={lang}>
      <Router>
        <ApolloProvider client={client}>
          <DefaultThemeProviders>
            <UserProvider>
              <AppContainer>
                <ErrorBoundary FallbackComponent={GeneralErrorFallback}>
                  <AppRoutes />
                </ErrorBoundary>
              </AppContainer>
              <GlobalStyle />
            </UserProvider>
          </DefaultThemeProviders>
        </ApolloProvider>
      </Router>
    </I18nextProvider>
  </>
);

export default App;
