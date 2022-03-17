import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ModalProvider } from 'react-modal-hook';
import { AnimatePresence } from 'framer-motion';

import { lang } from './language'
import { SessionProvider } from '../components/Session/SessionProvider';
import ThemeProviders from '../components/Theme/ThemeProviders';
import { Workspace } from '../types/core-types';

interface AppProvidersProps {
  children: React.ReactNode;
  sessionId: string;
  workspace: Workspace;
}

const ModalPresence = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence initial={false} exitBeforeEnter onExitComplete={() => null}>
    {children}
  </AnimatePresence>
)

const AppProviders = ({ workspace, children, sessionId }: AppProvidersProps) => {
  return (
    <SessionProvider sessionId={sessionId}>
      <BrowserRouter>
        <I18nextProvider i18n={lang}>
          <ThemeProviders workspace={workspace}>
            <ModalProvider rootComponent={ModalPresence}>
              {children}
            </ModalProvider>
          </ThemeProviders>
        </I18nextProvider>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default AppProviders;
