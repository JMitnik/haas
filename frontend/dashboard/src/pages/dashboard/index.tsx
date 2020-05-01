import React from 'react';
import CustomerOverview from 'components/DashboardView';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { Route, Switch } from 'react-router';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import AddTopicView from 'views/AddTopicView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import Sidenav from 'components/Sidenav';
import DashboardView from 'components/DashboardView';
import Logo from 'assets/Logo';
import { Div } from '@haas/ui';

const DashboardPage = () => (
  <DashboardContainer>
    <Sidenav>
      <Div>
        <Logo />
      </Div>
      Hello
    </Sidenav>

    <Switch>
      <Route path="/dashboard/c/:customerId/t/:topicId/" render={() => <TopicDetail />} />
      <Route path="/dashboard/c/:customerId/topic-builder" render={() => <AddTopicView />} />
      <Route path="/dashboard/customer-builder" render={() => <CustomerBuilderView />} />
      <Route path="/dashboard/c/:customerId/" render={() => <TopicsOverview />} />
      <Route
        path="/organisation-settings"
        render={() => <OrganisationSettingsView />}
      />

      {/* Default-view: Ensure this is last */}
      <Route path="/" render={() => <CustomerOverview />} />
    </Switch>
  </DashboardContainer>
);

export default DashboardPage;
