import React from 'react';

import { Div, PageHeading } from '@haas/ui';
import { useParams } from 'react-router';
import Placeholder from 'components/Placeholder';
import Tabbar, { Tab } from 'components/Tabbar/Tabbar';

interface DialogueLayoutProps {
  children: React.ReactNode;
  dialogueTitle?: string;
}

const DialogueLayout = ({ dialogueTitle, children }: DialogueLayoutProps) => {
  const { customerSlug, dialogueSlug } = useParams<{customerSlug: string, dialogueSlug: string}>();

  return (
    <>
      <Div>
        {dialogueTitle ? (
          <PageHeading>{dialogueTitle}</PageHeading>
        ) : (
          <Placeholder height="30px" width="140px" mb={4} />
        )}
      </Div>

      <Tabbar>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}`} exact>General</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/interactions`}>Interactions</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/builder`}>Builder</Tab>
        <Tab to={`/dashboard/b/${customerSlug}/d/${dialogueSlug}/edit`}>Settings</Tab>
      </Tabbar>

      {children}
    </>

  );
};

export default DialogueLayout;
