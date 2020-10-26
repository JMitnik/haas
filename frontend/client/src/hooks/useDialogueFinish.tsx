import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { autorun } from 'mobx';
import createInteractionMutation from 'mutations/createSessionMutation';
import gql from 'graphql-tag';
import useDialogueTree from 'providers/DialogueTreeProvider';

const appendToInteractionMutation = gql`
  mutation appendToInteraction($input: AppendToInteractionMutation) {
    appendToInteraction(input: $input) {
      id
    }
  }
`;

const useDialogueFinish = () => {
  const [hasCreatedSession, setHasCreatedSession] = useState(false);
  const [entryQueue, setEntryQueue] = useState<any[]>([]);
  const [retryCounter, setRetryCounter] = useState<number>(0);
  const isUpdatingQueue = useRef<boolean>(false);
  const store = useDialogueTree();

  const entries = store.relevantSessionEntries;
  const dialogue = store.tree;

  const [createInteraction, { data: createdSessionData }] = useMutation(createInteractionMutation, {
    variables: {
      input: {
        dialogueId: dialogue?.id,
        entries: entries.map((entry) => ({
          nodeId: entry.node.node.id,
          edgeId: entry.edge?.id,
          depth: entry.depth,
          data: entry.node?.data,
        })),
      },
    },
    onCompleted: () => {
      setHasCreatedSession(true);
    },
  });

  const [appendToInteraction] = useMutation(appendToInteractionMutation, {
    variables: {
      input: {
        sessionId: createdSessionData?.id,
      },
    },
    onError: () => {
      isUpdatingQueue.current = false;

      setTimeout(() => {
        setRetryCounter((retries) => retries + 1);
      }, 200);
    },
    onCompleted: () => {
      isUpdatingQueue.current = false;

      // TODO: Remove this item from the queue (ENSURE WE REMOVE IT!)
    },
  });

  /**
   * Add items to the queue
   * @param entry
   */
  const enqueueEntry = (entry: any) => {
    setEntryQueue((entries) => [entry, ...entries]);
  };

  useEffect(() => {
    // If we have entries in our queue, and we are done uploading our session
    if (entryQueue.length && hasCreatedSession) {
      appendToInteraction().
    }
  }, [entryQueue]);

  const handleCreateInteraction = () => {
    if (entries.length && !hasCreatedSession) {
      createInteraction();
    }
  };

  /**
   * Either uploads using the `create` mutation, or appends using the `append` mutation.
   */
  const handleUploadInteraction = (entry?: any) => {
    if (entry && hasCreatedSession) {
      enqueueEntry(entry);
      return;
    }

    if (entries.length) {
      createInteraction();
    }
  };

  // Effect to cleanup store for post-submission
  useEffect(() => {
    if (hasCreatedSession) {
      store.session.reset();
    }
  }, [hasCreatedSession, store.session]);

  return {
    uploadInteraction: handleUploadInteraction,
    createInteraction: handleCreateInteraction,
    hasCreatedSession,
  };
};

export default useDialogueFinish;
