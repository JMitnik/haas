import { AnimatePresence } from 'framer-motion';
import { Route, Switch, useLocation } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';

import AppProviders from 'providers/AppProviders';
import CustomerPage from 'pages/[customer]';
import CustomersPage from 'pages/customers';
import GlobalAppLayout from 'layouts/GlobalAppLayout';

import NodePage from './[customer]/[dialogue]/[node]';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch key={location.pathname} location={location}>
        <Route path={['/:customerSlug/:dialogueId/:edgeId', '/:customerSlug/:dialogueId']}>
          <NodePage />
        </Route>
        <Route path="/:customerSlug">
          <CustomerPage />
        </Route>
        <Route path="/">
          <CustomersPage />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};

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
      <GlobalAppLayout>
        <AppRoutes />
      </GlobalAppLayout>
    </AppProviders>
  );
};

export default App;
