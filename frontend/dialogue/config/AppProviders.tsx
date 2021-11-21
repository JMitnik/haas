import React from 'react';

import { theme } from './theme';
import ThemeProviders from './ThemeProviders';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProviders>
      {children}
    </ThemeProviders>
  )
}

export default AppProviders;
