import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import styled, { ThemeProvider, css } from 'styled-components';

import { TopNav } from './components/UI/Nav';
import GlobalStyle from './config/global-styles';
import themeConfig from './config/theme';
import client from './config/apollo';
import DashboardView from './views/DashboardView';
import TopicBuilderView from './views/TopicBuilderView';
import OrganisationSettingsView from './views/OrganisationSettingsView';
import { Container } from './components/UI/Container';

const AppContainer = styled.div`
  ${({ theme }) => css`
    min-height: 1vh;
    background: ${theme.colors.default.normal};
    margin: 0 auto;
  `}
`;

const MainWindow = styled.div`
  ${({ theme }) => css`
    padding: ${theme.gutter}px 0;
    background: ${theme.colors.default.normal};
    min-height: 100vh;
  `}
`;

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            {/* Top-level routes */}
            <TopNav />
            <MainWindow>
              <Container>
                <Switch>
                  <Route path="/topic-builder" render={() => <TopicBuilderView />} />
                  <Route
                    path="/organisation-settings"
                    render={() => <OrganisationSettingsView />}
                  />

                  {/* Default-view: Ensure this is last */}
                  <Route path="/" render={() => <DashboardView />} />
                </Switch>
              </Container>
            </MainWindow>
          </AppContainer>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  </>
);

export default App;
