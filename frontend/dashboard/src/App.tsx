import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import TopNav from './components/Nav';
import GlobalStyle from './config/global-styles';
import themeConfig from './config/theme';
import client from './config/apollo';
import DashboardView from './views/DashboardView/DashboardView';
import TopicBuilderView from './views/TopicBuilderView';
import OrganisationSettingsView from './views/OrganisationSettingsView';
import TopicsView from './views/TopicsOverview/TopicsView';
import TopicView from './views/DetailTopic/TopicDetail';
import CustomerBuilderView from './views/CustomerBuilderView';
import { AppContainer, MainWindow } from './AppStyles';

const App: FC = () => (
  <>
    <ApolloProvider client={client}>
      <Router>
        <ThemeProvider theme={themeConfig}>
          <AppContainer>
            {/* Top-level routes */}
            <TopNav />
            <MainWindow>
              <Switch>
                <Route path="/c/:customerId/t/:topicId/" render={() => <TopicView />} />
                <Route path="/c/:customerId/topic-builder" render={() => <TopicBuilderView />} />
                <Route path="/customer-builder" render={() => <CustomerBuilderView />} />
                <Route path="/c/:customerId/" render={() => <TopicsView />} />
                <Route
                  path="/organisation-settings"
                  render={() => <OrganisationSettingsView />}
                />

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
