import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppProviders from 'providers/app-providers';
import AppContainer from 'styles/AppStyles';
import { QuestionnaireProvider } from 'providers/dialogue-provider';
import CustomerPage from 'pages/customers';
import DialogueTreePage from './dialogue';

const App = () => (
  <AppProviders>
    <AppContainer>
      {/* Top-level routes */}
      <Switch>
        <Route path="/c/:customerId/q/:questionnaireId">
          <QuestionnaireProvider>
            <DialogueTreePage />
          </QuestionnaireProvider>
        </Route>
        <Route path="/c/">
          <Redirect to="/" />
        </Route>
        <Route path="/">
          <CustomerPage />
        </Route>
      </Switch>
    </AppContainer>
  </AppProviders>
);

export default App;
