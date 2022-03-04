import React from 'react'
import { DialogueBootstrap } from '@haas/dialogue';

import { useAppendToSessionMutation, useUploadSessionEventsMutation } from 'types/generated-types';
import { Dialogue as DialogueType, Workspace, SessionEventInput } from 'types/helper-types';


interface DialogueProps {
  dialogue: DialogueType;
  workspace: Workspace;
  sessionId: string;
}

export const DialogueAdapter = ({ dialogue, workspace, sessionId }: DialogueProps) => {
  // const [uploadSessionEvents] = useUploadSessionEventsMutation();
  // const [appendToSession] = useAppendToSessionMutation();

  // const handleUploadEvents = async (events: SessionEventInput[]) => {
  //   // await uploadSessionEvents({
  //   //   variables: {
  //   //     input: { events, sessionId },
  //   //   },
  //   // });
  //   // appendToSession({
  //   //   variables: {
  //   //     input: {
  //   //       data: {
  //   //         choice: {
  //   //           value: events[0].choiceValue.value,
  //   //         },
  //   //       },
  //   //       // edgeId: events[0].no,
  //   //     },
  //   //   },
  //   // })
  // };

  const handleUploadEvents = () => {
    return;
  }

  console.log(DialogueBootstrap);

  return (
    <DialogueBootstrap
      sessionId={sessionId}
      onEventUpload={handleUploadEvents}
      dialogue={dialogue}
      workspace={workspace}
    />
  )
}
