import React, { useEffect, useLayoutEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import AppProviders from 'providers/app-providers';
import AppContainer from 'styles/AppStyles';
import CustomersPage from 'pages/customers';
import DialogueTreePage from './[customer]/[dialogue]';
import CustomerPage from 'pages/[customer]';

const App = () => {

  useLayoutEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
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
  )
};

export default App;
