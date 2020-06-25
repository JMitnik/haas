import { ApolloProvider } from '@apollo/react-hooks';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import React, { FC } from 'react';

import CustomerProvider from 'providers/CustomerProvider';
import DashboardPage from 'pages/dashboard';

import { AppContainer } from 'styles/AppStyles';
import AddCustomerPage from 'pages/dashboard/customers/add';
import AddDialogueView from 'views/AddDialogueView';
import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AddUserView from 'views/UsersOverview/AddUserView';
import AnalyticsPage from 'pages/dashboard/analytics';
import CustomersPage from 'pages/dashboard/customers';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import DialoguePage from 'pages/dashboard/dialogues/dialogue';
import DialoguesPage from 'pages/dashboard/dialogues';
import EditCustomerView from 'views/EditCustomerView';
import EditDialogueView from 'views/EditDialogueView';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import GlobalStyle from 'config/global-styles';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import RolesOverview from 'views/RolesOverview/RolesOverview';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';

import DashboardLayout from 'layouts/DashboardLayout';
import DialogueLayout from 'layouts/DialogueLayout';
import client from './config/apollo';
import themeConfig from './config/theme';

const AppRoutes = () => (
  <Switch>

    <Route
      path="/dashboard/b/add"
      render={() => <AddCustomerPage />}
    />

    <Route
      path="/dashboard/b/:customerSlug"
      render={() => (
        <DashboardLayout>
          <Switch>
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
              path="/dashboard/b/:customerSlug/analytics/"
              render={() => (
                <AnalyticsPage />
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
              path="/dashboard/b/:customerSlug/d/add"
              render={() => <AddDialogueView />}
            />

            <Route
              path="/dashboard/b/:customerSlug/d/:dialogueSlug"
              render={() => (
                <DialogueLayout>
                  <Switch>
                    <Route
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug/builder"
                      render={() => <DialogueBuilderView />}
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
                      path="/dashboard/b/:customerSlug/d/:dialogueSlug"
                      render={() => <DialoguePage />}
                    />
                  </Switch>
                </DialogueLayout>
              )}
            />

            <Route
              path="/dashboard/b/:customerSlug/"
              render={() => <DialoguesPage />}
            />
          </Switch>
        </DashboardLayout>
      )}
    />

    <Route path="/dashboard/b/" render={() => <CustomersPage />} />
    <Route path="/dashboard" render={() => <DashboardPage />} />

    <Route path="/">
      <Redirect to="/dashboard" />
    </Route>
  </Switch>
);

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <CustomerProvider>
        <Router>
          <ThemeProvider theme={themeConfig}>
            <AppContainer>
              <AppRoutes />
            </AppContainer>
            <GlobalStyle />
          </ThemeProvider>
        </Router>
      </CustomerProvider>
    </ApolloProvider>
  </>
);

export default App;
