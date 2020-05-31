import React, { useContext, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TreeStoreModelProps } from 'models/TreeStoreModel';
import useProject from 'providers/ProjectProvider/ProjectProvider';

import treeStore from './DialogueTreeStore';

const DialogueTreeContext = React.createContext({} as TreeStoreModelProps);

// Provider which manages the state of the context
export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { customer, dialogue } = useProject();

  // Start the tree project
  useEffect(() => {
    if (dialogue?.questions && dialogue?.edges && dialogue?.edges) {
      treeStore.tree.setInitialNodes(dialogue?.questions);
      treeStore.tree.setInitialEdges(dialogue?.edges);
      treeStore.tree.setInitialLeaves(dialogue?.leafs);
    }
  }, [customer, dialogue]);

  return (
    <DialogueTreeContext.Provider value={treeStore}>
      {children}
    </DialogueTreeContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTree = () => useContext(DialogueTreeContext);

export default useDialogueTree;
