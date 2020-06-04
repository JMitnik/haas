import { ThemeProvider } from 'styled-components/macro';
import React, { useEffect, useState } from 'react';

import { autorun } from 'mobx';
import { makeCustomTheme } from 'utils/makeCustomerTheme';
import { useObserver } from 'mobx-react-lite';
import defaultTheme from 'config/theme';
import useDialogueTree from './DialogueTreeProvider';

interface ThemeProvidersProps {
  children?: React.ReactNode;
}

const ThemeProviders = ({ children }: ThemeProvidersProps) => {
  const [customTheme, setCustomTheme] = useState({});
  const store = useDialogueTree();

  useEffect(() => autorun(() => {
    if (store.customer) {
      const customerTheme = { colors: store.customer.settings?.colourSettings };
      setCustomTheme(customerTheme);
    } else {
      setCustomTheme({});
    }
  }), []);

  return useObserver(() => {
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
  });
};

export default ThemeProviders;
