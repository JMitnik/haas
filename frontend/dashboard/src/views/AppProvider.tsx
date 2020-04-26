import React, { ReactNode } from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import themeConfig from '../config/theme';
import client from '../config/apollo';
import { UserProvider } from '../hooks/useUser';

const AppProvider = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <UserProvider>
      <Router>
        <ThemeProvider theme={themeConfig}>
          {children}
        </ThemeProvider>
      </Router>
    </UserProvider>
  </ApolloProvider>
);

export default AppProvider;
