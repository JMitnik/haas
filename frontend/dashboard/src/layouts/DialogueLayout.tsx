import React from 'react';

import { DialogueProps } from 'types/generic';
import { Div, Loader, PageHeading } from '@haas/ui';
import Placeholder from 'components/Placeholder';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';

import DashboardLayout from './DashboardLayout';

interface DialogueLayoutProps {
  children: React.ReactNode;
  dialogueTitle?: string;
}

const DialogueLayout = ({ dialogueTitle, children }: DialogueLayoutProps) => (
  <DashboardLayout>
    <Div>
      {dialogueTitle ? (
        <PageHeading>{dialogueTitle}</PageHeading>
      ) : (
        <Placeholder height="30px" width="140px" mb={4} />
      )}
    </Div>

    <Tabbar>
      <Tab to="">General</Tab>
      <Tab to="interactions">Interactions</Tab>
      <Tab to="builder">Builder</Tab>
      <Tab to="settings">Settings</Tab>
    </Tabbar>

    {children}
  </DashboardLayout>
);

export default DialogueLayout;
