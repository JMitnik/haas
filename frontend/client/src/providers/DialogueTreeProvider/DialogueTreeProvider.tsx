import { TreeStoreModelProps } from 'models/TreeStoreModel';
import React, { useContext, useEffect } from 'react';

import { Customer, Dialogue } from 'types/generic';
import { useQuery } from '@apollo/react-hooks';
import { useRouteMatch } from 'react-router-dom';
import getCustomerFromSlug from 'queries/getCustomerFromSluqQuery';
import getDialogueQuery from 'queries/getDialogueQuery';
import treeStore from './DialogueTreeStore';

const DialogueTreeContext = React.createContext({} as TreeStoreModelProps);

interface CustomerDataProps {
  customer: Customer;
}

interface DialogueDataProps {
  dialogue: Dialogue;
}

export const DialogueTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const customerMatch = useRouteMatch<any>({
    path: '/:customerSlug',
    strict: true,
  });
  const dialogueMatch = useRouteMatch<any>('/:customerSlug/:dialogueId');

  const { data: customerData } = useQuery<CustomerDataProps>(getCustomerFromSlug, {
    skip: !customerMatch,
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      slug: customerMatch?.params.customerSlug,
    },
  });

  const { data: dialogueData } = useQuery<DialogueDataProps>(getDialogueQuery, {
    skip: !dialogueMatch,
    onError: (e) => {
      console.log(e.message);
    },
    variables: {
      id: dialogueMatch?.params.dialogueId,
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
      treeStore.initTree(dialogueData.dialogue);
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
