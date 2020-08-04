import { ThemeProvider as ChakraThemeProvider, CSSReset } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components/macro';
import React, { useEffect, useState } from 'react';

import { makeCustomTheme } from 'utils/makeCustomerTheme';
import defaultTheme, { chakraDefaultTheme } from 'config/theme';

import { useCustomer } from './CustomerProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const [customTheme, setCustomTheme] = useState({});
  const { activeCustomer, storageCustomer } = useCustomer();

  useEffect(() => {
    if (activeCustomer) {
      const customerTheme = { colors: activeCustomer.settings?.colourSettings };
      setCustomTheme(customerTheme);
    } else if (storageCustomer) {
      if (storageCustomer.settings?.colourSettings) {
        const customerTheme = { colors: storageCustomer.settings?.colourSettings };
        setCustomTheme(customerTheme);
      } else {
        setCustomTheme({});
      }
    } else {
      setCustomTheme({});
    }
  }, [activeCustomer, setCustomTheme, storageCustomer]);

  if (customTheme) {
    return (
      <ChakraThemeProvider theme={chakraDefaultTheme}>
        <CSSReset />
        <ThemeProvider theme={defaultTheme}>
          <ThemeProvider theme={makeCustomTheme(defaultTheme, customTheme)}>
            {children}
          </ThemeProvider>
        </ThemeProvider>
      </ChakraThemeProvider>
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
