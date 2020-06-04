import React, { useContext, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TreeStoreModelProps } from 'models/TreeStoreModel';

import treeStore from './DialogueTreeStore';

const DialogueTreeContext = React.createContext({} as TreeStoreModelProps);

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const { dialogue } = useProject();

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (dialogue) {
      // Clean optional existing session data
      treeStore.session.reset();

      // (Re)initialize dialogue tree
      treeStore.initTree(dialogue);
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
