import { useMutation } from '@apollo/react-hooks';
import React, { useCallback, useContext, useRef } from 'react';

import createInteractionMutation from 'mutations/createSessionMutation';
import gql from 'graphql-tag';
import useDialogueTree from 'providers/DialogueTreeProvider';

const UploadQueueContext = React.createContext({} as any);

const appendToInteractionMutation = gql`
  mutation appendToInteraction($input: AppendToInteractionInput) {
    appendToInteraction(input: $input) {
      id
    }
  }
`;

export const UploadQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useRef<any>([]);
  const store = useDialogueTree();
  const [createInteraction, { data: interactionData }] = useMutation(createInteractionMutation);
  const [appendToInteraction] = useMutation(appendToInteractionMutation);

  /**
   * Upload the main interaction
  */
  const handleUploadInteraction = useCallback(() => {
    const uploadEntries = store.relevantSessionEntries;

    // We only upload if we have not done so before, and also, as long as we have any entries to upload after all.
    if (!interactionData && uploadEntries.length) {
      createInteraction({
        variables: {
          input: {
            dialogueId: store.tree?.id,
            entries: uploadEntries.map((entry: any) => ({
              nodeId: entry.node.node.id,
              edgeId: entry.edge?.id,
              depth: entry.depth,
              data: entry.node?.data,
            })),
          },
        },
      });
    }
  }, [createInteraction, store, interactionData]);

  /**
   * Dequeue the first item in our queue.
   */
  const dequeueEntry = () => {
    if (!queue.current.length || !interactionData) return;

    const entry = queue.current[0];

    appendToInteraction({
      variables: {
        input: {
          sessionId: interactionData?.createSession?.id,
          nodeId: entry.nodeId,
          edgeId: entry.edgeId,
          data: { ...entry.data },
        },
      },
    })
      .catch((err) => console.error(err))
      .finally(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, ...tempQueue] = queue.current;
        queue.current = tempQueue;

        if (queue.current.length) dequeueEntry();
      });
  };

  /**
   * Queue an item to the end of our list, and instantly dequeue it.
   */
  const queueEntry = (entry: any) => {
    queue.current = [...queue.current, entry];
    dequeueEntry();
  };

  return (
    <UploadQueueContext.Provider value={{
      queueEntry,
      dequeueEntry,
      uploadInteraction: handleUploadInteraction,
      appendToInteraction: null,
      willQueueEntry: !!interactionData,
    }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
};

const useUploadQueue = () => useContext(UploadQueueContext);

export default useUploadQueue;
