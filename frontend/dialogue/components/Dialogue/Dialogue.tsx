import React from 'react';

import { Workspace, Dialogue as DialogueType, SessionEventInput } from '../../types/core-types';
import DialogueThemer from '../../config/Theme/DialogueThemer';
import AppProviders from '../../config/AppProviders';
import * as LS from './DialogueStyles';
import { DialogueRoutes } from '../Navigation/DialogueRoutes';



interface DialogueProps {
  onEventUpload: (events: SessionEventInput[]) => void;
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

const Dialogue = ({ dialogue, workspace, onEventUpload, sessionId }: DialogueProps) => {
  return (
    <AppProviders workspace={workspace} sessionId={sessionId}>
      <DialogueThemer>
        <LS.DialogueContainer>
          <DialogueRoutes dialogue={dialogue} workspace={workspace} onEventUpload={onEventUpload} />
        </LS.DialogueContainer>
      </DialogueThemer>
    </AppProviders>
  )
}

export default Dialogue;
