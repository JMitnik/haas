import { differenceInSeconds } from 'date-fns';
import { first, last, omit } from 'lodash';
import { useLocation } from 'react-router-dom';
import React, { useCallback, useContext, useRef, useState } from 'react';
import qs from 'qs';

import { CreatedSession, SessionEvent } from 'types/core-types';
import { useAppendToInteractionMutation, useCreateSessionMutation } from 'types/generated-types';
import { useDialogueState } from 'modules/Dialogue/DialogueState';
import useInterval from 'hooks/useInterval';

interface UploadQueueContextProps {
  session: CreatedSession | undefined;
  queueEvents: (events: SessionEvent[]) => void;
  resetSession: () => void;
}

const UploadQueueContext = React.createContext({} as UploadQueueContextProps);

export const UploadQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const willAppend = useRef(false);
  const location = useLocation();
  const { dialogue, metadata } = useDialogueState((state) => ({
    dialogue: state.dialogue,
    metadata: state.metadata,
  }));

  const [uploadQueue, setUploadQueue] = useState([] as SessionEvent[]);

  const [createSession, {
    data: interactionData,
    loading: isCreatingSession,
    reset: resetSessionCache,
  }] = useCreateSessionMutation();
  const [appendToInteraction] = useAppendToInteractionMutation();
  const ref = qs.parse(location.search, { ignoreQueryPrefix: true })?.ref?.toString() || '';

  /**
   * Resets the upload cache of the session.
   *
   * Resets:
   * - The stored mutation result.
   * - The upload queue.
   * - The flag that will append.
   */
  const resetSession = () => {
    resetSessionCache();
    setUploadQueue([]);
    willAppend.current = false;
  };

  /**
   * Creates an initial session.
   */
  const handleCreateInitialSession = useCallback((events: SessionEvent[]) => {
    const startTime = first(events)?.startTimestamp || new Date();
    const endTime = last(events)?.endTimestamp || new Date();

    createSession({
      variables: {
        input: {
          dialogueId: dialogue?.id as string,
          deliveryId: ref,
          totalTimeInSec: differenceInSeconds(endTime, startTime),
          originUrl: metadata?.originUrl,
          device: metadata?.device,
          entries: events.map((event) => ({
            nodeId: event.state?.nodeId,
            edgeId: event.state?.edgeId,
            depth: event.state?.depth,
            data: omit(event.action, ['type']),
          })),
        },
      },
    }).then(() => {
      willAppend.current = true;
    });
  }, [metadata, dialogue, createSession, ref]);

  /**
   * Queue a single event to be uploaded.
   */
  const handleAppendEventToSession = useCallback((event: SessionEvent) => appendToInteraction({
    variables: {
      input: {
        data: omit(event.action, ['type']),
        edgeId: event.state?.edgeId,
        nodeId: event.state?.nodeId,
        sessionId: interactionData?.createSession?.id,
      },
    },
  }), [interactionData, appendToInteraction]);

  /**
   * Queue a list of events to be uploaded.
   *
   * We can be in one of three states:
   * 1. We have not created a session yet, and are not uploading anything yet. => Upload immediately
   * 2. We have not created a session yet, but we are in the midst of creating one => Queue everything
   * 3. We have a session. => Queue everything.
   */
  const queueEvents = useCallback((events: SessionEvent[]) => {
    // If we are not in APPEND mode yet, we need to create a session first.
    if (!willAppend.current && !isCreatingSession) {
      return handleCreateInitialSession(events);
    }

    return setUploadQueue((prev) => [...prev, ...events]);
  }, [setUploadQueue, handleCreateInitialSession, isCreatingSession]);

  /**
   * Effect responsible for cleaning up the UploadQueue whenever a new event is appended to it.
   */
  useInterval(() => {
    if (uploadQueue.length > 0) {
      console.log('in useInterval and uploadQUeue more than one entry: ', uploadQueue);
      const event = uploadQueue[0];

      handleAppendEventToSession(event).then(() => {
        setUploadQueue((prev) => prev.slice(1));
      });
    }
  }, uploadQueue.length > 0 ? 1000 : null);

  const session = interactionData?.createSession || undefined;

  return (
    <UploadQueueContext.Provider value={{
      queueEvents,
      session,
      resetSession,
    }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
};

const useUploadQueue = () => useContext(UploadQueueContext);

export default useUploadQueue;
