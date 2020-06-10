import { Route, Switch } from 'react-router';
import React from 'react';

import AddTopicView from 'views/AddTopicView';
import AddUserView from 'views/UsersOverview/AddUserView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import CustomerOverview from 'components/DashboardView';
import EditCustomerView from 'views/EditCustomerView';
import EditTopicView from 'views/EditTopicView';
import EditUserView from 'views/UsersOverview/EditUserView';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import OrganisationSettingsView from 'views/OrganisationSettingsView';
import RolesOverview from 'views/RolesOverview/RolesOverview';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';

import DashboardLayout from './DashboardLayout';

const DashboardPage = () => (
  <>
    <Switch>
      <Route
        path="/dashboard/c/:customerId/u/:userId/edit"
        render={() => (
          <DashboardLayout>
            <EditUserView />
          </DashboardLayout>
        )}
      />
      <Route
        path="/dashboard/c/:customerId/users/add"
        render={() => (
          <DashboardLayout>
            <AddUserView />
          </DashboardLayout>
        )}
      />
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
        path="/dashboard/c/:customerId/users"
        render={() => <DashboardLayout><UsersOverview /></DashboardLayout>}
      />
      <Route
        path="/dashboard/c/:customerId/roles"
        render={() => <DashboardLayout><RolesOverview /></DashboardLayout>}
      />
      <Route
        path="/dashboard/customer-builder"
        render={() => (
          <DashboardLayout>
            <CustomerBuilderView />
          </DashboardLayout>
        )}
      />
      <Route
        path="/dashboard/c/:customerId/"
        render={() => (
          <DashboardLayout>
            <TopicsOverview />
          </DashboardLayout>
        )}
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
