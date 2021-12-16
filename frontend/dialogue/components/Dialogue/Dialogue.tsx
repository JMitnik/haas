import React from 'react';

import { Workspace, Dialogue as DialogueType, SessionEventInput } from 'types/helper-types';
import AppProviders from 'config/AppProviders';
import DialogueThemer from 'config/Theme/DialogueThemer';

import * as LS from './DialogueStyles';
import { DialogueRouter } from './DialogueRouter';

interface DialogueProps {
  onEventUpload: (events: SessionEventInput[]) => void;
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

const Dialogue = ({ dialogue, workspace, onEventUpload, sessionId }: DialogueProps) => {
  return (
    <AppProviders sessionId={sessionId}>
      <DialogueThemer>
        <LS.DialogueContainer>
          <DialogueRouter dialogue={dialogue} workspace={workspace} onEventUpload={onEventUpload} />
        </LS.DialogueContainer>
      </DialogueThemer>
    </AppProviders>
  )
}

export default Dialogue;
