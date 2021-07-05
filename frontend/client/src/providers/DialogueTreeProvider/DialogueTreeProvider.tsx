import { TreeStoreModelProps } from 'models/TreeStoreModel';
import { useQuery } from '@apollo/client';
import { useRouteMatch } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Customer, Dialogue } from 'types/generic';
import getCustomerFromSlug from 'queries/getCustomerFromSluqQuery';
import getDialogueFromSlug from 'queries/getDialogueFromSlugQuery';

import { useTranslation } from 'react-i18next';
import treeStore from './DialogueTreeStore';

interface DialogueTreeContextType {
  store: TreeStoreModelProps;
  originUrl: string;
  device: string;
  getNode: any;
  startTime: number;
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
  const [originUrl, setOriginUrl] = useState<string | null>(null);
  const [device] = useState<string | null>(navigator.platform);
  const [startTime] = useState(Date.now());
  const { i18n } = useTranslation();

  const initLanguage = (language: string | undefined) => {
    switch (language) {
      case 'ENGLISH':
        i18n.changeLanguage('en');
        break;
      case 'GERMAN':
        i18n.changeLanguage('de');
        break;
      case 'DUTCH':
        i18n.changeLanguage('nl');
        break;
      default:
        i18n.changeLanguage('en');
        break;
    }
  };

  useEffect(() => {
    if (!originUrl) {
      setOriginUrl(window.location.href);
    }
  }, [setOriginUrl, originUrl]);

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
    if (customerData?.customer) {
      treeStore.initCustomer(customerData.customer);
    }
  }, [customerData]);

  // When dialogue changes, set initial nodes and initial edges
  useEffect(() => {
    if (dialogueData?.customer) {
      treeStore.initTree(dialogueData?.customer?.dialogue);
      initLanguage(dialogueData?.customer?.dialogue.language);
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
    return node;
  };

  return (
    <DialogueTreeContext.Provider value={{
      store: treeStore,
      getNode,
      device: device || '',
      startTime,
      originUrl: originUrl || '',
    }}
    >
      {children}
    </DialogueTreeContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTree = () => useContext(DialogueTreeContext);

export default useDialogueTree;
