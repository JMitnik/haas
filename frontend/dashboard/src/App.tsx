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

import CustomersPage from 'pages/dashboard/customers';
import DashboardLayout from 'layouts/DashboardLayout';
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
import ThemesProvider from 'providers/ThemeProvider';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';

import { AnimatePresence } from 'framer-motion';
import { ViewContainer } from '@haas/ui';
import AuthProvider from 'providers/AuthProvider';
import CustomerRoute from 'components/Auth/CustomerRoute';
import DialogueLayout from 'layouts/DialogueLayout';
import LoginPage from 'pages/login';
import PreCustomerLayout from 'layouts/PreCustomerLayout';
import client from 'config/apollo';
import lang from 'config/i18n-config';

const ProtectedRoute = (props: RouteProps) => {
  useTranslation();
  // const { user } = useAuth();
  // Note-Login: Uncomment this for login
  // if (!user) return <Redirect to="/login" />;

  return (
    <Route {...props} />
  );
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
      render={() => (
        <AnimatePresence>
          <DashboardLayout>
            <Switch>
              <CustomerRoute
                path="/dashboard/b/:customerSlug/d/:dialogueSlug"
                render={() => (
                  <DialogueLayout>
                    <Switch>
                      <Route
                        path="/dashboard/b/:customerSlug/d/:dialogueSlug/builder"
                        render={() => <DialogueBuilderPage />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/d/:dialogueSlug/edit"
                        render={() => <EditDialogueView />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/d/:dialogueSlug/interactions"
                        render={() => <InteractionsOverview />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/d/:dialogueSlug/actions"
                        render={() => <ActionsPage />}
                      />

                      <Route
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
                      <Route
                        path="/dashboard/b/:customerSlug/analytics/"
                        render={() => (
                          <AnalyticsPage />
                        )}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/triggers/add"
                        render={() => (
                          <AddTriggerView />
                        )}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/triggers/:triggerId/edit"
                        render={() => (
                          <EditTriggerView />
                        )}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/triggers"
                        render={() => <TriggersOverview />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/edit"
                        render={() => <EditCustomerView />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/u/:userId/edit"
                        render={() => (
                          <EditUserView />
                        )}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/users/add"
                        render={() => (
                          <AddUserView />
                        )}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/users"
                        render={() => <UsersOverview />}
                      />
                      <Route
                        path="/dashboard/b/:customerSlug/roles"
                        render={() => <RolesOverview />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/dialogue/add"
                        render={() => <AddDialogueView />}
                      />

                      <Route
                        path="/dashboard/b/:customerSlug/d"
                        render={() => <DialoguesPage />}
                      />
                      <Route
                        path="/dashboard/b/:customerSlug/"
                        render={() => <CustomerPage />}
                      />
                    </Switch>
                  </ViewContainer>
                )}
              />
            </Switch>
          </DashboardLayout>
        </AnimatePresence>
      )}
    />

    <ProtectedRoute
      path="/dashboard/b/"
      render={() => (
        <PreCustomerLayout>
          <CustomersPage />
        </PreCustomerLayout>
      )}
    />

    <ProtectedRoute path="/dashboard" render={() => <DashboardPage />} />

    <Route path="/login"><LoginPage /></Route>

    <Route path="/">
      <Redirect to="/dashboard" />
    </Route>
  </Switch>
);

const GeneralErrorFallback = ({ error }: { error?: Error | undefined }) => (
  <div>
    Problem with connection, we will be back shortly!
    {error?.message}
  </div>
);

const App: FC = () => (
  <>
    <I18nextProvider i18n={lang}>
      <ApolloProvider client={client}>
        <CustomerProvider>
          <Router>
            <ThemesProvider>
              <AuthProvider>
                <AppContainer>
                  <ErrorBoundary FallbackComponent={GeneralErrorFallback}>
                    <AppRoutes />
                  </ErrorBoundary>
                </AppContainer>
                <GlobalStyle />
              </AuthProvider>
            </ThemesProvider>
          </Router>
        </CustomerProvider>
      </ApolloProvider>
    </I18nextProvider>
  </>
);

export default App;
