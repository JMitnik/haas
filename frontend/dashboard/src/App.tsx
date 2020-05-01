import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import DashboardPage from 'pages/dashboard';
import { AppContainer } from './styles/AppStyles';
import TopNav from './components/Nav';
import GlobalStyle from './config/global-styles';
import themeConfig from './config/theme';
import client from './config/apollo';

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            {/* Top-level routes */}
            <Route path="/dashboard">
              <DashboardPage />
            </Route>
            <Redirect to="/dashboard" />
          </AppContainer>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  </>
);

export default App;
