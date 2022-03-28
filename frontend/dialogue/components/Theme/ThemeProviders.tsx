import { CSSReset, ThemeProvider as ChakraThemeProvider } from '@chakra-ui/core';
import { ThemeProvider } from 'styled-components';
import React, { useMemo } from 'react';

import { theme, Theme } from '../../config/Theme/theme';
import { Workspace, WorkspaceSettings } from '../../types/core-types';
import { generateColorShades, getBrightMode } from './colorUtils';

/**
 * Merge workspace theme with the base theme derived from Chakra and default settings.
 *
 * @param workspaceSettings Workspace settings
 * @param baseTheme Base theme
 * @returns The workspace theme
 */
export const createCustomTheme = (workspaceSettings: WorkspaceSettings, baseTheme: Theme): Theme => {
  const brightMode = getBrightMode(workspaceSettings.colourSettings.primary);
  const colorShades = generateColorShades(workspaceSettings.colourSettings.primary, brightMode);

  const customTheme = {
    ...baseTheme,
    brightMode,
    colors: {
      ...baseTheme.colors,
      primary: {...colorShades},
      _primary: workspaceSettings?.colourSettings?.primary,
    },
  };

  return customTheme;
};

interface ThemeProvidersProps {
  workspace: Workspace;
  children?: React.ReactNode;
}

const ThemeProviders = ({ workspace, children }: ThemeProvidersProps) => {
  const customTheme: Theme = useMemo(() => createCustomTheme(workspace.settings, theme), [workspace.settings]);

  return (
    <ThemeProvider theme={customTheme}>
      <ChakraThemeProvider theme={customTheme}>
        <CSSReset/>
        {children}
      </ChakraThemeProvider>
    </ThemeProvider>
  );
};

export default ThemeProviders;