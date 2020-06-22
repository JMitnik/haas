import React from 'react';

import { DialogueProps } from 'types/generic';
import { Div, PageHeading } from '@haas/ui';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';

import DashboardLayout from './DashboardLayout';

interface DialogueLayoutProps {
  dialogue: DialogueProps;
  children: React.ReactNode;
}

const DialogueLayout = ({ dialogue }: DialogueLayoutProps) => (
  <DashboardLayout>
    <Div>
      <PageHeading>{dialogue.title}</PageHeading>
    </Div>

    <Tabbar>
      <Tab to="general">General</Tab>
      <Tab to="interactions">Interactions</Tab>
      <Tab to="builder">Builder</Tab>
      <Tab to="settings">Settings</Tab>
    </Tabbar>
  </DashboardLayout>
);

export default DialogueLayout;
