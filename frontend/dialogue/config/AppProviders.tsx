import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { theme } from './Theme/theme';
import ThemeProviders from './Theme/ThemeProviders';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <ThemeProviders>
        {children}
      </ThemeProviders>
    </BrowserRouter>
  )
}

export default AppProviders;
