import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppProviders from 'providers/app-providers';
import AppContainer from 'styles/AppStyles';
import { QuestionnaireProvider } from 'providers/dialogue-provider';
import CustomerOverview from 'pages/customers';
import DialogueTree from 'components/DialogueTree';

const App = () => (
  <AppProviders>
    <AppContainer>
      {/* Top-level routes */}
      <Switch>
        <Route path="/c/:customerId/q/:questionnaireId">
          <QuestionnaireProvider>
            <DialogueTree />
          </QuestionnaireProvider>
        </Route>
        <Route path="/c/">
          <Redirect to="/" />
        </Route>
        <Route path="/">
          <CustomerOverview />
        </Route>
      </Switch>
    </AppContainer>
  </AppProviders>
);

export default App;
