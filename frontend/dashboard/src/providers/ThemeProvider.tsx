import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components/macro';
import React, { useEffect, useState } from 'react';

import { makeCustomTheme } from 'utils/makeCustomerTheme';
import defaultTheme, { chakraDefaultTheme } from 'config/theme';

import { generatePalette, isDarkColor } from 'utils/ColorUtils';
import { useCustomer } from './CustomerProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const makeBrandTheme = (settings: any) => {
  if (!settings) return {};

  if (!settings.colourSettings?.primary) return {};

  const brandTheme = {
    colors: {
      primaries: generatePalette(settings?.colourSettings.primary),
      ...settings?.colourSettings,
    },
    isDarkColor: isDarkColor(settings?.colourSettings.primary),
  };

  return brandTheme;
};

export const DefaultThemeProviders = ({ children }: ThemeProvidersProps) => (
  <ChakraThemeProvider theme={chakraDefaultTheme}>
    <CSSReset />
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  </ChakraThemeProvider>
);

export const CustomThemeProviders = ({ children }: { children: React.ReactNode }) => {
  const [customTheme, setCustomTheme] = useState({});
  const { activeCustomer, storageCustomer } = useCustomer();

  useEffect(() => {
    console.log(activeCustomer);

    if (activeCustomer) {
      setCustomTheme(makeBrandTheme(activeCustomer.settings));
    } else if (storageCustomer?.settings?.colourSettings) {
      setCustomTheme(makeBrandTheme(storageCustomer.settings));
    } else {
      setCustomTheme({});
    }
  }, [activeCustomer, setCustomTheme, storageCustomer]);

  return (
    <ThemeProvider theme={makeCustomTheme(defaultTheme, customTheme)}>
      {children}
    </ThemeProvider>
  );
};

export default DefaultThemeProviders;
