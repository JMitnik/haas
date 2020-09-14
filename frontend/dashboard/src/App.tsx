import { ApolloProvider } from '@apollo/react-hooks';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Redirect, Route, RouteProps, BrowserRouter as Router, Switch } from 'react-router-dom';
import CustomerProvider from 'providers/CustomerProvider';
import React, { FC } from 'react';

import { AppContainer } from 'styles/AppStyles';
import ActionsPage from 'pages/dashboard/actions';
import AddCustomerPage from 'pages/dashboard/customers/add';
import AddDialogueView from 'views/AddDialogueView';
import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AddUserView from 'views/UsersOverview/AddUserView';
import AnalyticsPage from 'pages/dashboard/analytics';
import CustomerPage from 'pages/dashboard/customer';

import { DefaultThemeProviders } from 'providers/ThemeProvider';
import CustomerLayout from 'layouts/CustomerLayout';
import CustomersPage from 'pages/dashboard/customers';
import DashboardPage from 'pages/dashboard';
import DialogueBuilderPage from 'pages/dashboard/builder';
import DialoguePage from 'pages/dashboard/dialogues/dialogue';
import DialoguesPage from 'pages/dashboard/dialogues';
import EditCustomerView from 'views/EditCustomerView';
import EditDialogueView from 'views/EditDialogueView';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import EditUserView from 'views/UsersOverview/EditUserView';
import GlobalStyle from 'config/global-styles';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import RolesOverview from 'views/RolesOverview/RolesOverview';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';

import { AnimatePresence } from 'framer-motion';
import { Div, ViewContainer } from '@haas/ui';
import AuthProvider, { useAuth } from 'providers/AuthProvider';
import CustomerRoute from 'components/Auth/CustomerRoute';
import DialogueLayout from 'layouts/DialogueLayout';
import FallbackServerError from 'components/FallbackServerError';
import InviteUserView from 'views/UsersOverview/InviteUserView';
import LoginPage from 'pages/login';
import PreCustomerLayout from 'layouts/PreCustomerLayout';
import VerifyTokenPage from 'pages/verify_token';
import client from 'config/apollo';
import lang from 'config/i18n-config';

const DashboardRoute = (props: RouteProps) => {
  useTranslation();
  const { user } = useAuth();

  // If user is not even logged in, send to public
  if (!user) return <Redirect to="/public/" />;

  return (
    <Route {...props} />
  );
};

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
                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/builder"
                    render={() => <DialogueBuilderPage />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/edit"
                    render={() => <EditDialogueView />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/interactions"
                    render={() => <InteractionsOverview />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/d/:dialogueSlug/actions"
                    render={() => <ActionsPage />}
                  />

                  <DashboardRoute
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
                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/analytics/"
                    render={() => (
                      <AnalyticsPage />
                    )}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/triggers/add"
                    render={() => (
                      <AddTriggerView />
                    )}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/triggers/:triggerId/edit"
                    render={() => (
                      <EditTriggerView />
                    )}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/triggers"
                    render={() => <TriggersOverview />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/edit"
                    render={() => <EditCustomerView />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/u/:userId/edit"
                    render={() => (
                      <EditUserView />
                    )}
                  />

                  {/* Possible deprecate this */}
                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/users/add"
                    render={() => (
                      <AddUserView />
                    )}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/users/invite"
                    render={() => (
                      <InviteUserView />
                    )}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/users"
                    render={() => <UsersOverview />}
                  />
                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/roles"
                    render={() => <RolesOverview />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/dialogue/add"
                    render={() => <AddDialogueView />}
                  />

                  <DashboardRoute
                    path="/dashboard/b/:customerSlug/d"
                    render={() => <DialoguesPage />}
                  />
                  <DashboardRoute
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

const RootAppRoute = () => {
  const { user } = useAuth();
  if (!user) return <Redirect to="/public" />;

  return <Redirect to="/dashboard" />;
};

const AppRoutes = () => (
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

    <DashboardRoute
      path="/dashboard/b/"
      render={() => (
        <PreCustomerLayout>
          <CustomersPage />
        </PreCustomerLayout>
      )}
    />

    <DashboardRoute path="/dashboard">
      <DashboardPage />
    </DashboardRoute>

    <Route path="/verify_token">
      <VerifyTokenPage />
    </Route>

    <Route path="/public">
      <PublicRoutes />
    </Route>

    <Route path="/">
      <RootAppRoute />
    </Route>
  </Switch>
);

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
            <AuthProvider>
              <AppContainer>
                <ErrorBoundary FallbackComponent={GeneralErrorFallback}>
                  <AppRoutes />
                </ErrorBoundary>
              </AppContainer>
              <GlobalStyle />
            </AuthProvider>
          </DefaultThemeProviders>
        </ApolloProvider>
      </Router>
    </I18nextProvider>
  </>
);

export default App;
