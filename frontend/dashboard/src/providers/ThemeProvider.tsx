import { ThemeProvider } from 'styled-components/macro';
import React, { useEffect, useState } from 'react';

import { makeCustomTheme } from 'utils/makeCustomerTheme';
import defaultTheme from 'config/theme';

import { useCustomer } from './CustomerProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const [customTheme, setCustomTheme] = useState({});
  const { activeCustomer } = useCustomer();

  useEffect(() => {
    if (activeCustomer) {
      const customerTheme = { colors: activeCustomer.settings?.colourSettings };
      setCustomTheme(customerTheme);
    } else if (localStorage.getItem('customer') !== null) {
      const storageCustomer = localStorage.getItem('customer');
      const parsedCustomer = storageCustomer && JSON.parse(storageCustomer);
      if (parsedCustomer.settings?.colourSettings) {
        const customerTheme = { colors: parsedCustomer.settings?.colourSettings };
        setCustomTheme(customerTheme);
      } else {
        setCustomTheme({});
      }
    } else {
      setCustomTheme({});
    }
  }, [activeCustomer, setCustomTheme]);

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
