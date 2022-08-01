import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components';
import React, { useEffect, useState } from 'react';

import { makeCustomTheme } from 'utils/makeCustomerTheme';
import defaultTheme, { chakraDefaultTheme } from 'config/theme';

import { ensureDarkColor, generateDefaultGradient, generatePalette, isDarkColor } from 'utils/ColorUtils';
import { useCustomer } from './CustomerProvider';

interface ThemeProvidersProps {
  children?: any;
}

const makeBrandTheme = (settings: any) => {
  if (!settings) return {};

  if (!settings.colourSettings?.primary) return {};

  const brandTheme = {
    colors: {
      primaries: generatePalette(settings?.colourSettings.primary),
      strongPrimary: ensureDarkColor(settings?.colourSettings.primary),
      primaryGradient: generateDefaultGradient(settings?.colourSettings.primary),
      ...settings?.colourSettings,
    },
    isDarkColor: isDarkColor(settings?.colourSettings.primary),
  };

  return brandTheme;
};

export const DefaultThemeProviders = ({ children }: ThemeProvidersProps) => (
  // @ts-ignore
  <ChakraThemeProvider theme={chakraDefaultTheme}>
    <CSSReset />
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  </ChakraThemeProvider>
);

export const CustomThemeProviders = ({ children }: { children: any }) => {
  const [customTheme, setCustomTheme] = useState({});
  const { activeCustomer } = useCustomer();

  useEffect(() => {
    if (activeCustomer) {
      setCustomTheme(makeBrandTheme(activeCustomer.settings));
    } else {
      setCustomTheme({});
    }
  }, [activeCustomer, setCustomTheme]);

  return (
    <ThemeProvider theme={makeCustomTheme(defaultTheme, customTheme)}>
      {children}
    </ThemeProvider>
  );
};

export default DefaultThemeProviders;
