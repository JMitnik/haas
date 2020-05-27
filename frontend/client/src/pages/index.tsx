import { Route, Switch } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';

import AppContainer from 'styles/AppStyles';
import AppProviders from 'providers/AppProviders';
import CustomerPage from 'pages/[customer]';
import CustomersPage from 'pages/customers';
import DialogueTreePage from './[customer]/[dialogue]';

const App = () => {
  useLayoutEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <AppProviders>
      <AppContainer>
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
};

export default App;
