import { Route, Switch } from 'react-router';

import CustomerOverview from 'views/CustomerOverview';
import DashboardLayout from 'layouts/DashboardLayout';
import DialogueBuilderView from 'views/DialogueBuilderView/DialogueBuilderView';
import EditCustomerView from 'views/EditCustomerView/EditCustomerView';
import EditTopicView from 'views/EditDialogueView/EditTopicView';
import InteractionsOverview from 'views/InteractionsOverview/InteractionsOverview';
import React from 'react';

import AddCustomerPage from './customers/add';
import DialoguePage from './dialogues/dialogue';
import DialoguesPage from './dialogues';

const DashboardPage = () => (
  <>
    <Switch>
      <Route
        path="/dashboard/c/:customerId/t/:dialogueId/edit"
        render={() => <DashboardLayout><EditTopicView /></DashboardLayout>}
      />

      <Route
        path="/dashboard/c/:customerId/t/:dialogueId/interactions"
        render={() => <DashboardLayout><InteractionsOverview /></DashboardLayout>}
      />

      <Route
        path="/dashboard/c/:customerId/edit"
        render={() => <DashboardLayout><EditCustomerView /></DashboardLayout>}
      />

      <Route
        path="/dashboard/customer-builder"
        render={() => <AddCustomerPage />}
      />

      <Route
        path="/dashboard/c/:customerId/dialogue-builder"
        render={() => <DashboardLayout><DialogueBuilderView /></DashboardLayout>}
      />

      <Route
        path="/dashboard/c/:customerId/t/:dialogueId/"
        render={() => <DialoguePage />}
      />

      <Route
        path="/dashboard/c/:customerId/"
        render={() => <DialoguesPage />}
      />

      {/* Default-view: Ensure this is last */}
      <Route path="/dashboard" render={() => <DashboardLayout><CustomerOverview /></DashboardLayout>} />
    </Switch>
  </>
);

export default DashboardPage;
