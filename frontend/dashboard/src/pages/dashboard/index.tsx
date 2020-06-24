import { Route, Switch } from 'react-router';
import React from 'react';

import AddTopicView from 'views/AddTopicView';
import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AddUserView from 'views/UsersOverview/AddUserView';
import CustomerBuilderView from 'views/CustomerBuilderView';
import CustomerOverview from 'components/DashboardView';
import CustomerOverview from 'views/CustomerOverview';
import DashboardLayout from 'layouts/DashboardLayout';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import EditCustomerView from 'views/EditCustomerView';
import EditCustomerView from 'views/EditCustomerView/EditCustomerView';
import EditTopicView from 'views/EditTopicView';
import EditTopicView from 'views/EditDialogueView/EditTopicView';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import EditUserView from 'views/UsersOverview/EditUserView';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';

import OrganisationSettingsView from 'views/OrganisationSettingsView';

import RolesOverview from 'views/RolesOverview/RolesOverview';
import TopicDetail from 'views/TopicDetail/TopicDetail';
import TopicsOverview from 'views/TopicsOverview/TopicsOverview';
import TriggersOverview from 'views/TriggerOverview/TriggerOverview';
import UsersOverview from 'views/UsersOverview/UsersOverview';

import AddCustomerPage from './customers/add';
import DialoguePage from './dialogues/dialogue';
import DialoguesPage from './dialogues';

const DashboardRoutes = () => (
  <DashboardLayout>
    <Switch>
      <Route
        path="/dashboard/c/:customerId/n/:triggerId/edit"
        render={() => (
          <EditTriggerView />
        )}
      />

      <Route
        path="/dashboard/c/:customerId/u/:userId/edit"
        render={() => (
          <EditUserView />
        )}
      />

      <Route
        path="/dashboard/c/:customerId/users/add"
        render={() => (
          <AddUserView />
        )}
      />

      <Route
        path="/dashboard/c/:customerId/triggers/add"
        render={() => (
          <AddTriggerView />
        )}
      />

      <Route
        path="/dashboard/c/:customerId/triggers"
        render={() => <TriggersOverview />}
      />

      <Route
        path="/dashboard/c/:customerId/t/:topicId/edit"
        render={() => <EditTopicView />}
      />

      <Route
        path="/dashboard/c/:customerId/t/:dialogueId/interactions"
        render={() => <InteractionsOverview />}
      />

      <Route
        path="/dashboard/c/:customerId/edit"
        render={() => <EditCustomerView />}
      />

      <Route
        path="/dashboard/c/:customerId/users"
        render={() => <UsersOverview />}
      />
      <Route
        path="/dashboard/c/:customerId/roles"
        render={() => <RolesOverview />}
      />
      <Route
        path="/dashboard/customer-builder"
        render={() => <AddCustomerPage />}
      />

      <Route
        path="/dashboard/c/:customerId/dialogue-builder"
        render={() => <DialogueBuilderView />}
      />

      <Route
        path="/dashboard/c/:customerId/t/:dialogueId/"
        render={() => <DialoguePage />}
      />

      <Route
        path="/dashboard/c/:customerId/"
        render={() => <DialoguesPage />}
      />

      <Route path="/dashboard" render={() => <DashboardLayout><CustomerOverview /></DashboardLayout>} />

    </Switch>
  </DashboardLayout>
);

const DashboardPage = () => (
  <>
    <Switch>
      <Route
        path="/dashboard"
        render={() => <DashboardRoutes />}
      />
    </Switch>
  </>
);

export default DashboardPage;
