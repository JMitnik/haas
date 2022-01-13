import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components';
import React, { useState } from 'react';

import { theme, chakraDefaultTheme } from './theme';
import DialogueThemer from './DialogueThemer';

/* eslint-disable arrow-body-style */
export const removeEmpty = (obj: any) => {
  return Object.keys(obj).reduce((acc, key) => {
    // value is "falsey" or is empty array
    return !obj[key] || (Array.isArray(obj[key]) && !obj[key].length)
      ? acc
      : { ...acc, [key]: obj[key] };
  }, {});
};

export const makeCustomTheme = (currTheme: any, customTheme: any) => {
  const colors = {
    ...currTheme?.colors,
    ...removeEmpty({ ...customTheme?.colors }),
  };

  return { ...currTheme, colors };
};

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const [customTheme, setCustomTheme] = useState({});

  return (
    <ThemeProvider theme={makeCustomTheme(theme, customTheme)}>
      <ChakraThemeProvider theme={makeCustomTheme(chakraDefaultTheme, customTheme)}>
        <CSSReset />
        {children}
      </ChakraThemeProvider>
    </ThemeProvider>
  );
};

export default ThemeProviders;
