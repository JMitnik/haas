import { ThemeProvider } from 'styled-components/macro';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import React, { useEffect, useState } from 'react';
import defaultTheme from 'config/theme';
import useProject from './ProjectProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const { customer } = useProject();
  const [customTheme, setCustomTheme] = useState({});

  useEffect(() => () => {
    if (customer) {
      const customerTheme = { colors: customer?.settings?.colourSettings };
      setCustomTheme(customerTheme);
    }
  }, [customer]);

  if (customTheme) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <ThemeProvider theme={makeCustomTheme(defaultTheme, customTheme)}>
          {children}
        </ThemeProvider>
      </ThemeProvider>
    );
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        {children}
      </ThemeProvider>
    </>
  );
};

export default ThemeProviders;
