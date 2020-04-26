import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';

import { AppContainer, MainWindow } from './styles/AppStyles';
import TopNav from './components/Nav';
import GlobalStyle from './config/global-styles';
import DashboardView from './views/DashboardView/DashboardView';
import AddTopicView from './views/AddTopicView';
import OrganisationSettingsView from './views/OrganisationSettingsView';
import TopicsOverview from './views/TopicsOverview/TopicsOverview';
import TopicDetail from './views/TopicDetail/TopicDetail';
import CustomerBuilderView from './views/CustomerBuilderView';
import Login from './pages/Login';
import useUser from './hooks/useUser';

const App: FC = () => {
  const { user } = useUser();

  return (
    <>
      <AppContainer>
        {/* Top-level routes */}
        {user ? (
          <>
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
          </>
        ) : (
          <Login />
        )}
      </AppContainer>
      <GlobalStyle />
    </>
  );
};

export default App;
