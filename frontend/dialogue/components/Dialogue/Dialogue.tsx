import React from 'react';

import { Workspace, Dialogue as DialogueType } from 'types/helper-types';
import AppProviders from 'config/AppProviders';
import DialogueThemer from 'config/Theme/DialogueThemer';

import * as LS from './DialogueStyles';
import { DialogueRouter } from './DialogueRouter';

interface DialogueProps {
  dialogue: DialogueType;
  workspace: Workspace;
}

const Dialogue = ({ dialogue, workspace }: DialogueProps) => {
  return (
    <AppProviders>
      <DialogueThemer>
        <LS.DialogueContainer>
          <DialogueRouter dialogue={dialogue} workspace={workspace} />
        </LS.DialogueContainer>
      </DialogueThemer>
    </AppProviders>
  )
}

export default Dialogue;
