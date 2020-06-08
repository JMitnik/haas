import { Route, Switch } from 'react-router';

import AddTopicView from 'views/AddTopicView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import CustomerOverview from 'components/DashboardView';
import EditCustomerView from 'views/EditCustomerView';
import EditTopicView from 'views/EditTopicView';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import React from 'react';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';

import DashboardLayout from './DashboardLayout';

const DashboardPage = () => (
  <>
    <Switch>
      <Route
        path="/dashboard/c/:customerId/t/:topicId/edit"
        render={() => <DashboardLayout><EditTopicView /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/t/:topicId/interactions"
        render={() => <DashboardLayout><InteractionsOverview /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/t/:topicId/"
        render={() => <DashboardLayout><TopicDetail /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/topic-builder"
        render={() => <DashboardLayout><AddTopicView /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/edit"
        render={() => <DashboardLayout><EditCustomerView /></DashboardLayout>}
      />
      <Route
        path="/dashboard/customer-builder"
        render={() => <DashboardLayout><CustomerBuilderView /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/"
        render={() => <DashboardLayout><TopicsOverview /></DashboardLayout>}
      />
      <Route
        path="/dashboard/organisation-settings"
        render={() => <OrganisationSettingsView />}
      />

      {/* Default-view: Ensure this is last */}
      <Route path="/dashboard" render={() => <DashboardLayout><CustomerOverview /></DashboardLayout>} />
    </Switch>
  </>
);

export default DashboardPage;
