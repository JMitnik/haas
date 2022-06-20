import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components';
import React, { useMemo } from 'react';

import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { motion } from 'framer-motion';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import defaultTheme from 'config/theme';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const { workspace } = useDialogueState();

  const workspaceTheme = useMemo(() => {
    if (!workspace?.settings?.colourSettings?.primary) return {};

    return workspace?.settings?.colourSettings?.primary;
  }, [workspace]);

  const dialogueTheme = useMemo(() => {
    if (!workspaceTheme) return defaultTheme;

    return makeCustomTheme(defaultTheme, workspaceTheme);
  }, [workspaceTheme]);

  if (workspaceTheme) {
    return (
      <ThemeProvider theme={dialogueTheme}>
        <ChakraThemeProvider theme={dialogueTheme}>
          <CSSReset />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        </ChakraThemeProvider>
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
