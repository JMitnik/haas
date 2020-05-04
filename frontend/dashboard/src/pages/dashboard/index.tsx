import React from 'react';
import CustomerOverview from 'components/DashboardView';
import { DashboardContainer } from 'components/DashboardView/DashboardViewStyles';
import { Route, Switch, useParams } from 'react-router';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import AddTopicView from 'views/AddTopicView';
import EditCustomerView from 'views/EditCustomerView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import Sidenav from 'components/Sidenav';
import Logo from 'assets/Logo';
import { Div } from '@haas/ui';
import DashboardLayout from './DashboardLayout';

const DashboardPage = () => {
  console.log("Hello");
  return (
    <>
      <Switch>
        <Route path="/dashboard/c/:customerId/t/:topicId/" render={() => <DashboardLayout><TopicDetail /></DashboardLayout>} />
        <Route path="/dashboard/c/:customerId/topic-builder" render={() => <DashboardLayout><AddTopicView /></DashboardLayout>} />
        <Route path="/dashboard/c/:customerId/edit" render={() => <DashboardLayout><EditCustomerView /></DashboardLayout>} />
        <Route path="/dashboard/customer-builder" render={() => <DashboardLayout>
          <CustomerBuilderView />
        </DashboardLayout>} />
        <Route path="/dashboard/c/:customerId/" render={() => <DashboardLayout>
          <TopicsOverview />
        </DashboardLayout>} />
        <Route
          path="/dashboard/organisation-settings"
          render={() => <OrganisationSettingsView />}
        />

        {/* Default-view: Ensure this is last */}
        <Route path="/dashboard" render={() => <DashboardLayout><CustomerOverview /></DashboardLayout>} />
      </Switch>
    </>
  );
};

export default DashboardPage;
