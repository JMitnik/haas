import { ApolloProvider } from '@apollo/react-hooks';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import React, { FC } from 'react';

import DashboardPage from 'pages/dashboard';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';

import { AppContainer } from './styles/AppStyles';
import GlobalStyle from './config/global-styles';
import TopNav from './components/Nav';
import client from './config/apollo';
import themeConfig from './config/theme';

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            {/* Top-level routes */}
            <Switch>
              <Route path="/dashboard">
                <DashboardPage />
              </Route>
              <Route path="/">
                <Redirect to="/dashboard" />
              </Route>
            </Switch>
          </AppContainer>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  </>
);

export default App;
