import { useMutation } from '@apollo/react-hooks';
import React, { useCallback, useContext } from 'react';

import createInteractionMutation from 'mutations/createSessionMutation';
import gql from 'graphql-tag';
import useDialogueTree from 'providers/DialogueTreeProvider';

const UploadQueueContext = React.createContext({} as any);

const appendToInteractionMutation = gql`
  mutation appendToInteraction($input: AppendToInteractionMutation) {
    appendToInteraction(input: $input) {
      id
    }
  }
`;

export const UploadQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useDialogueTree();
  const [createInteraction, { data }] = useMutation(createInteractionMutation);

  /**
   * Either uploads using the `create` mutation, or appends using the `append` mutation.
  */
  const handleUploadInteraction = useCallback(() => {
    const uploadEntries = store.relevantSessionEntries;

    // Case 1: We have no uploaded data, yet.
    if (!data && uploadEntries.length) {
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
  }, [createInteraction, store]);

  return (
    <UploadQueueContext.Provider value={{
      isCreatingSession: false,
      uploadInteraction: handleUploadInteraction,
      createInteraction: null,
      hasCreatedSession: false,
    }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
};

const useUploadQueue = () => useContext(UploadQueueContext);

export default useUploadQueue;
