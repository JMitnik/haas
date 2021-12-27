import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components';
import React, { useEffect, useState } from 'react';

import { autorun } from 'mobx';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { motion } from 'framer-motion';
import defaultTheme, { chakraDefaultTheme } from 'config/theme';
import useDialogueTree from './DialogueTreeProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const [customTheme, setCustomTheme] = useState({});
  const { store } = useDialogueTree();

  useEffect(() => autorun(() => {
    if (store.customer) {
      const customerTheme = { colors: store.customer.settings?.colourSettings };
      setCustomTheme(customerTheme);
    } else {
      setCustomTheme({});
    }
  }), [store.customer]);

  if (customTheme) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <ThemeProvider theme={makeCustomTheme(defaultTheme, customTheme)}>
          <ChakraThemeProvider theme={makeCustomTheme(chakraDefaultTheme, customTheme)}>
            <CSSReset />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {children}
            </motion.div>
          </ChakraThemeProvider>
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
