import React from 'react';
import * as UI from '@haas/ui';
import { Customer, Dialogue as DialogueType } from 'types/generated-types';
import AppProviders from 'config/AppProviders';

interface DialogueProps {
  dialogue: DialogueType;
  workspace: Customer;
}

const Dialogue = ({ dialogue, workspace }: DialogueProps) => {
  return (
    <AppProviders>
      <div style={{ height: '100%' }}>
        <UI.Text>
          {dialogue.title}
        </UI.Text>
      </div>
    </AppProviders>
  )
}

export default Dialogue;
