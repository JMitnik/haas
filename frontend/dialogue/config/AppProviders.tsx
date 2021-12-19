import { SessionProvider } from 'components/Session/SessionProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { lang } from 'config/language'
import { theme } from './Theme/theme';
import ThemeProviders from './Theme/ThemeProviders';

interface AppProvidersProps {
  children: React.ReactNode;
  sessionId: string;
}

const AppProviders = ({ children, sessionId }: AppProvidersProps) => {
  return (
    <SessionProvider sessionId={sessionId}>
      <BrowserRouter>
      <I18nextProvider i18n={lang}>
        <ThemeProviders>
          {children}
        </ThemeProviders>
      </I18nextProvider>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default AppProviders;
