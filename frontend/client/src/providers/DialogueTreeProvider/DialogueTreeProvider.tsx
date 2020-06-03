import React, { useContext, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TreeStoreModelProps } from 'models/TreeStoreModel';
import useProject from 'providers/ProjectProvider/ProjectProvider';

import treeStore from './DialogueTreeStore';

const DialogueTreeContext = React.createContext({} as TreeStoreModelProps);

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { dialogue } = useProject();

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (dialogue?.questions && dialogue?.edges && dialogue?.edges) {
      // Clean existing session data
      treeStore.session.reset();

      // Initialize tree
      treeStore.tree.setInitialNodes(dialogue?.questions);
      treeStore.tree.setInitialEdges(dialogue?.edges);
      treeStore.tree.setInitialLeaves(dialogue?.leafs);
    }
  }, [dialogue]);

  return (
    <DialogueTreeContext.Provider value={treeStore}>
      {children}
    </DialogueTreeContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTree = () => useContext(DialogueTreeContext);

export default useDialogueTree;
