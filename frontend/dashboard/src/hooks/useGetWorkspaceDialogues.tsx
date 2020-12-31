import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import React from 'react';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import gql from 'graphql-tag';

import { useNavigator } from './useNavigator';

interface UseGetWorkspaceDialoguesOptionsProps {
  onlyLazy?: boolean;
}

export const useGetWorkspaceDialogues = (options?: UseGetWorkspaceDialoguesOptionsProps) => {
  const { customerSlug } = useNavigator();
  const { data: workspaceOfDialogues, loading: isLoading, client } = useQuery(getDialoguesOfCustomer, {
    skip: true,
  });

  const fetchLazyDialogues = async () => new Promise(async (resolve) => {
    const { data } = await client.query({
      query: getDialoguesOfCustomer,
      variables: {
        // TODO: Fix for testing that we can mock the slug
        customerSlug: customerSlug || 'test',
      },
    });

    const dialogues = (data?.customer?.dialogues || []).map((dialogue: any) => ({
      label: dialogue.title,
      value: dialogue.id,
      ...dialogue,
    }));

    return resolve(dialogues);
  });

  return {
    workspaceOfDialogues,
    isLoading,
    fetchLazyDialogues,
  };
};
