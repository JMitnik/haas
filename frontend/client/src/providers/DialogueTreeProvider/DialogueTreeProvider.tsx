import { TreeStoreModelProps } from 'models/TreeStoreModel';
import React, { useContext, useEffect } from 'react';

import { Customer, Dialogue } from 'types/generic';
import { useQuery } from '@apollo/react-hooks';
import { useRouteMatch } from 'react-router-dom';
import getCustomerFromSlug from 'queries/getCustomerFromSluqQuery';
import getDialogueFromSlug from 'queries/getDialogueFromSlugQuery';
import treeStore from './DialogueTreeStore';

const DialogueTreeContext = React.createContext({} as TreeStoreModelProps);

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
      treeStore.initTree(dialogueData?.customer?.dialogue);
    }
  }, [dialogueData]);

  return (
    <DialogueTreeContext.Provider value={treeStore}>
      {children}
    </DialogueTreeContext.Provider>
  );
};

// Hook which extracts the context with the state variables
const useDialogueTree = () => useContext(DialogueTreeContext);

export default useDialogueTree;
