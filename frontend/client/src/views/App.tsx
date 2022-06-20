import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useLayoutEffect } from 'react';

import { Dialogue } from 'modules/Dialogue/Dialogue';
import AppProviders from 'config/AppProviders';
import GlobalAppLayout from 'layouts/GlobalAppLayout';

import { CampaignRedirectView } from './CampaignRedirectView/CampaignRedirectView';
import { DialogueRedirectView } from './DialogueRedirectView/DialogueRedirectView';
import lang from '../config/i18n-config';

const ErrorPage = () => (
  <div>
    Something went wrong, we will fix it right away!
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        <Route path="/_r" element={<CampaignRedirectView />} />
        <Route path="/:workspaceSlug/:dialogueSlug">
          <Route index element={<DialogueRedirectView />} />
          <Route path="n/:nodeId" element={<Dialogue />} />
        </Route>
        <Route element={<div />} />
      </Routes>
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
    <I18nextProvider i18n={lang}>
      <AppProviders>
        <GlobalAppLayout>
          <ErrorBoundary FallbackComponent={ErrorPage}>
            <AppRoutes />
          </ErrorBoundary>
        </GlobalAppLayout>
      </AppProviders>
    </I18nextProvider>

  );
};

export default App;
