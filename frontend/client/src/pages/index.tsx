import { Route, Switch } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';

import { AnimatePresence } from 'framer-motion';
import AppContainer from 'styles/AppStyles';
import AppProviders from 'providers/AppProviders';
import CustomerPage from 'pages/[customer]';
import CustomersPage from 'pages/customers';
import DialogueTreePage from './[customer]/[dialogue]';
import NodePage from './[customer]/[dialogue]/[node]';

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
      <AnimatePresence>
        <AppContainer>
          <Switch>
            <Route path="/:customerSlug/:dialogueId/:edgeId">
              <NodePage />
            </Route>
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
      </AnimatePresence>
    </AppProviders>
  );
};

export default App;
