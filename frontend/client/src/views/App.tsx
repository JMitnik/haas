import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppProviders from './GlobalAppState';
import AppContainer from './AppContainer';
import { QuestionnaireProvider } from 'hooks/use-questionnaire';
import CustomerOverview from './CustomerOverview/CustomerOverview';
import QuestionnaireTree from './QuestionnaireTree/QuestionnaireTree';
import { HAASTreeProvider } from 'hooks/use-haas-tree';

const App = () => (
  <AppProviders>
    <AppContainer>
      {/* Top-level routes */}
      <Switch>
        <Route path="/c/:customerId/q/:questionnaireId">
          <QuestionnaireProvider>
            <HAASTreeProvider>
              <QuestionnaireTree />
            </HAASTreeProvider>
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
