import { TreeStoreModelProps } from 'models/TreeStoreModel';
import React, { useContext, useEffect } from 'react';

import { Customer, Dialogue } from 'types/generic';
import { useQuery } from '@apollo/react-hooks';
import { useRouteMatch } from 'react-router-dom';
import getCustomerFromSlug from 'queries/getCustomerFromSluqQuery';
import getDialogueFromSlug from 'queries/getDialogueFromSlugQuery';
import treeStore from './DialogueTreeStore';

interface DialogueTreeContextType {
  store: TreeStoreModelProps;
  getNode: any;
}

const DialogueTreeContext = React.createContext({} as DialogueTreeContextType);

interface CustomerDataProps {
  customer: Customer;
}

interface DialogueDataProps {
  customer: {
    dialogue: Dialogue;
  }
}

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const customerMatch = useRouteMatch<any>({
    path: '/:customerSlug',
    strict: true,
  });

  const { data: customerData } = useQuery<CustomerDataProps>(getCustomerFromSlug, {
    skip: !customerMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: customerMatch?.params.customerSlug,
    },
  });

  const dialogueMatch = useRouteMatch<any>('/:customerSlug/:dialogueSlug');

  const { data: dialogueData } = useQuery<DialogueDataProps>(getDialogueFromSlug, {
    skip: !dialogueMatch,
    fetchPolicy: 'network-only',
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      dialogueSlug: dialogueMatch?.params.dialogueSlug,
      customerSlug: dialogueMatch?.params.customerSlug,
    },
  });

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (customerData) {
      treeStore.initCustomer(customerData.customer);
    }
  }, [customerData]);

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (dialogueData) {
      console.log(dialogueData);
      treeStore.initTree(dialogueData?.customer?.dialogue);
    }
  }, [dialogueData]);

  const getNode = (edgeId: string, nodeId: string) => {
    if (!treeStore.tree?.rootNode) return null;
    // Either we  from the 'root' (no edge) or we get the next node.
    let node = treeStore.tree.rootNode;

    if (edgeId) {
      node = treeStore.tree.getChildNodeByEdge(edgeId) || treeStore.tree.rootNode;
    } else if (!edgeId && nodeId) {
      node = treeStore.tree.getNodeById(nodeId) || treeStore.tree.rootNode;
    } else {
      node = treeStore.tree.rootNode;
    }

    console.log(node.type);

    return node;
  };

  return (
    <DialogueTreeContext.Provider value={{
      store: treeStore,
      getNode,
    }}
    >
      {children}
    </DialogueTreeContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTree = () => useContext(DialogueTreeContext);

export default useDialogueTree;
