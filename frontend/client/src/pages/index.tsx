import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AppProviders from 'providers/AppProviders';
import AppContainer from 'styles/AppStyles';
import CustomersPage from 'pages/customers';
import DialogueTreePage from './[customer]/[dialogue]';
import CustomerPage from 'pages/[customer]';

const App = () => (
  <AppProviders>
    <AppContainer>
      {/* Top-level routes */}
      <Switch>
        <Route path="/:customerSlug/:dialogueId">
          <DialogueTreePage />
        </Route>
        <Route path="/:customerSlug">
          <CustomerPage />
        </Route>
        <Route path="/">
          <CustomersPage />
        </Route>
      </Switch>
    </AppContainer>
  </AppProviders>
);

export default App;
