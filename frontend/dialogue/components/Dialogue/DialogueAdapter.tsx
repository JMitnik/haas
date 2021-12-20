import React from 'react'

import { useUploadSessionEventsMutation } from 'types/generated-types';
import { Dialogue as DialogueType, Workspace, SessionEventInput } from 'types/helper-types';

import Dialogue from './Dialogue';

interface DialogueProps {
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

export const DialogueAdapter = ({ dialogue, workspace, sessionId }: DialogueProps) => {
  const [uploadSessionEvents] = useUploadSessionEventsMutation();

  const handleUploadEvents = async (events: SessionEventInput[]) => {
    await uploadSessionEvents({
      variables: {
        input: { events, sessionId },
      },
    });
  };

  return (
    <Dialogue
      sessionId={sessionId}
      onEventUpload={handleUploadEvents}
      dialogue={dialogue}
      workspace={workspace}
    />
  )
}
