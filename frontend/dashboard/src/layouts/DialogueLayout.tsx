import React from 'react';

import { DialogueProps } from 'types/generic';
import { Div, Loader, PageHeading } from '@haas/ui';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';

import DashboardLayout from './DashboardLayout';

interface DialogueLayoutProps {
  dialogue: DialogueProps;
  children: React.ReactNode;
}

const DialogueLayout = ({ dialogue, children }: DialogueLayoutProps) => {
  console.log('Hmm');

  return (
    <DashboardLayout>
      <Div>
        <PageHeading>{dialogue.title}</PageHeading>
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
};

export default DialogueLayout;
