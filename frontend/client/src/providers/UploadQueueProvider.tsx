import { useMutation } from '@apollo/react-hooks';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { onPatch } from 'mobx-state-tree';
import createInteractionMutation from 'mutations/createSessionMutation';
import gql from 'graphql-tag';
import useDebugMobx from 'hooks/useDebugMobxStore';
import useDebugReference from 'hooks/useDebugReference';
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

  const [createInteraction] = useMutation(createInteractionMutation);
  useDebugReference(createInteraction, 'GraphQL: createInteraction mutation');

  const handleCreateInteraction = () => {
    // if (entries.length && !hasCreatedSession) {
    //   createInteraction();
    // }
  };

  useDebugMobx(store);

  /**
   * Either uploads using the `create` mutation, or appends using the `append` mutation.
  */
  const handleUploadInteraction = useCallback(() => {
    const uploadEntries = store.relevantSessionEntries;

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
  }, [createInteraction, store]);

  return (
    <UploadQueueContext.Provider value={{
      isCreatingSession: false,
      uploadInteraction: handleUploadInteraction,
      createInteraction: handleCreateInteraction,
      hasCreatedSession: false,
    }}
    >
      {children}
    </UploadQueueContext.Provider>
  );
};

const useUploadQueue = () => useContext(UploadQueueContext);

export default useUploadQueue;
