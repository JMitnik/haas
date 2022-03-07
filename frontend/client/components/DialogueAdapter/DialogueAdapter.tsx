import React from 'react'
import { DialogueBootstrap } from '@haas/dialogue';

import { useUploadSessionEventsMutation } from 'types/generated-types';
import { Dialogue as DialogueType, Workspace, SessionEventInput } from 'types/helper-types';


interface DialogueProps {
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

export const DialogueAdapter = ({ dialogue, workspace, sessionId }: DialogueProps) => {
  const [uploadSessionEvents] = useUploadSessionEventsMutation();

  const handleUploadEvents = async (events: SessionEventInput[]) => {
    try {
      await uploadSessionEvents({
        variables: {
          input: {
            sessionId,
            events,
          },
        },
      });
    } catch (error) {
      console.log('Session events');
    }
  };

  return (
    <DialogueBootstrap
      sessionId={sessionId}
      onEventUpload={handleUploadEvents}
      dialogue={dialogue}
      workspace={workspace}
    />
  )
}
