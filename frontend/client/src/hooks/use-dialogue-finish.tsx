import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import createSessionMutation from 'mutations/createSessionMutation';
import gql from 'graphql-tag';
import useDialogueTree from 'providers/DialogueTreeProvider';

const appendToInteractionMutation = gql`
  mutation appendToInteraction($input: AppendToInteractionMutation) {
    appendToInteraction(input: $input) {
      id
    }
  }
`;

const useJourneyFinish = (submitInstant: boolean = true) => {
  const [isFinished, setIsFinished] = useState(false);
  const [postSessionCreateQueue, setPostSessionCreateQueue] = useState<any[]>([]);
  const [retryCounter, setRetryCounter] = useState<number>(0);
  const isUpdatingQueue = useRef<boolean>(false);
  const store = useDialogueTree();

  const entries = store.relevantSessionEntries;
  const { customer } = store;
  const dialogue = store.tree;

  const [createInteraction, { data: createdSessionData, loading: isCreatingSession }] = useMutation(createSessionMutation, {
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
      setIsFinished(true);
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

      setPostSessionCreateQueue((el) => {
        const [_, ...restQueue] = el;

        return restQueue;
      });
    },
  });

  const handleCreateInteraction = () => {
    if (entries.length && !isFinished) {
      createInteraction();
    }
  };

  const handleAppendToInteraction = (entry: any) => {
    setPostSessionCreateQueue((queue) => [...queue, entry]);
  };

  useEffect(() => {
    const willUpdateToQueue = createdSessionData && !isUpdatingQueue.current && postSessionCreateQueue.length && !isCreatingSession;

    // In case
    if (willUpdateToQueue) {
      isUpdatingQueue.current = true;
      const [addedNodeEntry] = postSessionCreateQueue;

      appendToInteraction({
        variables: {
          input: addedNodeEntry,
        },
      });
    }
  }, [createdSessionData, postSessionCreateQueue, retryCounter]);

  // Effect for Post-submission
  useEffect(() => {
    if (isFinished) {
      store.session.reset();
    }
  }, [isFinished, store.session]);

  return {
    createInteraction: handleCreateInteraction,
    appendToInteraction: handleAppendToInteraction,
    isFinished,
  };
};

export default useJourneyFinish;
