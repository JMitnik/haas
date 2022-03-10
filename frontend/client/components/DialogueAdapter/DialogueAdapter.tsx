import React from 'react'
import { DialogueBootstrap } from '@haas/dialogue';
import { useLogger } from '@haas/tools';

import { useCreateSessionEventsMutation } from 'types/generated-types';
import { Dialogue as DialogueType, Workspace, SessionEventInput } from 'types/helper-types';


interface DialogueProps {
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

export const DialogueAdapter = ({ dialogue, workspace, sessionId }: DialogueProps) => {
  const [createSessionEvents] = useCreateSessionEventsMutation();
  const { logger } = useLogger();

  const handleUploadEvents = async (events: SessionEventInput[]) => {
    try {
      await createSessionEvents({
        variables: {
          input: {
            sessionId,
            events,
          },
        },
      });
    } catch (error) {
      logger.error('Error creating session events', error, {
        tags: { section: 'Session' },
      });
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
