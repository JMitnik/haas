import React, { useEffect } from 'react';

import { Workspace, Dialogue as DialogueType, SessionActionInput } from '../../types/core-types';
import DialogueThemer from '../Theme/DialogueThemer';
import AppProviders from '../../config/AppProviders';
import * as LS from './DialogueStyles';
import { DialogueRoutes } from '../Navigation/DialogueRoutes';
import { useDialogueStore } from './DialogueStore';

interface DialogueBootstrapProps {
  onEventUpload: (events: SessionActionInput[]) => void;
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

/**
 * The Dialogue Bootstrap components sets up the store, and ensures that everything is setup.
 *
 * - It also houses the relevant providers.
 */
export const DialogueBootstrap = ({ dialogue, workspace, onEventUpload, sessionId }: DialogueBootstrapProps) => {
  const { initialize, isInitializing } = useDialogueStore((store) => ({
    initialize: store.initialize,
    isInitializing: store.isInitializing,
  }));

  useEffect(() => {
    initialize(dialogue, sessionId);
  }, [initialize, dialogue, sessionId]);

  if (isInitializing) {
    return null;
  }

  return (
    <LS.DialogueRootContainer>
      <AppProviders workspace={workspace} sessionId={sessionId}>
        <DialogueThemer>
          <LS.DialogueContainer>
            <DialogueRoutes dialogue={dialogue} workspace={workspace} onEventUpload={onEventUpload}/>
          </LS.DialogueContainer>
        </DialogueThemer>
      </AppProviders>
    </LS.DialogueRootContainer>
  )
}

export default DialogueBootstrap;
