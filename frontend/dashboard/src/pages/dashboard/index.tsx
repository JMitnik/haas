import { TopNav, H3, Div, Flex, H2, H1 } from '@haas/ui';
import { Route, Switch } from 'react-router';
import React, { FC } from 'react';

import TopicDetail from 'views/TopicDetail/TopicDetail';
import AddTopicView from 'views/AddTopicView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import DashboardView from 'views/DashboardView/DashboardView';
import { DashboardLayout } from 'styles/DashboardStyles';
import { SideNav } from 'components/Nav';
import { NavLink } from 'react-router-dom';
import Logo from 'assets/Logo';
import { Grid, Home, Activity } from 'react-feather';
import LogoutButton from 'components/LogoutButton';

const Dashboard = () => (
  <DashboardLayout>
    <SideNav>
      <Div>
        <Flex alignItems="flex-end">
          <Logo />
          <H1 ml={4}>haas</H1>
        </Flex>
        <ul>
          <li><NavLink to="/"><Home /> <span>Dashboard</span></NavLink></li>
          <li><NavLink to="/analyse"><Activity /> <span>Analyse</span></NavLink></li>
        </ul>
      </Div>
      <Div>
        <LogoutButton />
      </Div>
    </SideNav>
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
  </DashboardLayout>
);

export default Dashboard;
