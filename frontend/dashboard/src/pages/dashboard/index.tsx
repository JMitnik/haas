import { Redirect, Route, Switch } from 'react-router';
import React from 'react';

import AddTriggerView from 'views/TriggerOverview/AddTriggerView';
import AddUserView from 'views/UsersOverview/AddUserView';
import CustomerOverview from 'views/CustomerOverview';
import DashboardLayout from 'layouts/DashboardLayout';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import EditCustomerView from 'views/EditCustomerView';
import EditDialogueView from 'views/EditDialogueView';
import EditTriggerView from 'views/TriggerOverview/EditTriggerView';
import EditUserView from 'views/UsersOverview/EditUserView';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';

import RolesOverview from 'views/RolesOverview/RolesOverview';
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
        path="/dashboard/c/:customerId/t/:dialogueId/edit"
        render={() => <EditDialogueView />}
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

      <Route path="/dashboard" render={() => <DialoguesPage />} />

    </Switch>
  </DashboardLayout>
);

// Here check if our account has access to more than one customer.
const DashboardPage = () => (
  <Redirect to="/dashboard/b" />
);

export default DashboardPage;
