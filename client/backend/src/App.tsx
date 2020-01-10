import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import styled, { ThemeProvider, css } from 'styled-components';

import SideNav from './components/UI/Nav';
import GlobalStyle from './config/global-styles';
import themeConfig from './config/theme';
import client from './config/apollo';
import DashboardView from './views/DashboardView';
import TopicBuilderView from './views/TopicBuilderView';
import OrganisationSettingsView from './views/OrganisationSettingsView';

const AppContainer = styled.div`
  display: grid;
  background: blue;
  grid-template-columns: 200px 1fr;
  min-height: 1vh;
`;

const MainWindow = styled.div`
  ${({ theme }) => css`
    padding: ${theme.gutter}px;
    background: ${theme.defaultColors.normal};
    min-height: 100vh;
  `}
`;

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            <SideNav />

            {/* Top-level routes */}
            <MainWindow>
              <Switch>
                <Route path="/topic-builder" render={() => <TopicBuilderView />} />
                <Route path="/organisation-settings" render={() => <OrganisationSettingsView />} />

                {/* Default-view: Ensure this is last */}
                <Route path="/" render={() => <DashboardView />} />
              </Switch>
            </MainWindow>
          </AppContainer>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  </>
);

export default App;
