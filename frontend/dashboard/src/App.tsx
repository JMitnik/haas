import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import { AppContainer, MainWindow } from './styles/AppStyles';
import TopNav from './components/Nav';
import GlobalStyle from './config/global-styles';
import themeConfig from './config/theme';
import client from './config/apollo';
import DashboardView from './views/DashboardView/DashboardView';
import AddTopicView from './views/AddTopicView';
import OrganisationSettingsView from './views/OrganisationSettingsView';
import TopicsOverview from './views/TopicsOverview/TopicsOverview';
import TopicDetail from './views/TopicDetail/TopicDetail';
import CustomerBuilderView from './views/CustomerBuilderView';

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
                <Route path="/c/:customerId/t/:topicId/" render={() => <TopicDetail />} />
                <Route path="/c/:customerId/topic-builder" render={() => <AddTopicView />} />
                <Route path="/customer-builder" render={() => <CustomerBuilderView />} />
                <Route path="/c/:customerId/" render={() => <TopicsOverview />} />
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
