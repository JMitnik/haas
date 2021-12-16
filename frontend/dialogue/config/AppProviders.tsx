import { SessionProvider } from 'components/Session/SessionProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

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
        <ThemeProviders>
          {children}
        </ThemeProviders>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default AppProviders;
