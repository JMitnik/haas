import { ApolloProvider } from '@apollo/react-hooks';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import React, { FC } from 'react';

import DashboardPage from 'pages/dashboard';

import { AppContainer } from './styles/AppStyles';
import GlobalStyle from './config/global-styles';
import client from './config/apollo';
import themeConfig from './config/theme';

const AppRoutes = () => (
  <Switch>
    <Route path="/dashboard">
      <DashboardPage />
    </Route>
    <Route path="/">
      <Redirect to="/dashboard" />
    </Route>
  </Switch>
);

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            <AppRoutes />
          </AppContainer>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  </>
);

export default App;
