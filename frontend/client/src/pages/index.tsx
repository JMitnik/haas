import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Switch, useLocation } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';

import AppProviders from 'providers/AppProviders';
import CustomerPage from 'pages/[customer]';
import CustomersPage from 'pages/customers';
import GlobalAppLayout from 'layouts/GlobalAppLayout';

import { Div } from '@haas/ui';
import NodePage from './[customer]/[dialogue]/[node]';

const ErrorPage = () => (
  <div>
    Something went wrong, we will fix it right away!
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch key={location.pathname} location={location}>
        <Route path={['/:customerSlug/:dialogueSlug/:edgeId', '/:customerSlug/:dialogueSlug']}>
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
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <AppRoutes />
        </ErrorBoundary>
      </GlobalAppLayout>
    </AppProviders>
  );
};

export default App;
