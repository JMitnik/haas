import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useNavigator } from './useNavigator';

interface UseGetWorkspaceCampaignsOptionsProps {
  onlyLazy?: boolean;
}

const GET_WORKSPACE_CAMPAIGNS = gql`
  query getWorkspaceCampaigns($customerSlug: String!) {
    customer(slug: $customerSlug) {
      id
      campaigns {
        id
        label
        
        variants {
          id
          label
        }
      }
    }
  }
`;

export const useGetWorkspaceCampaigns = (options?: UseGetWorkspaceCampaignsOptionsProps) => {
  const { customerSlug } = useNavigator();
  const { data: workspaceOfCampaigns, loading: isLoading, client } = useQuery(GET_WORKSPACE_CAMPAIGNS, {
    skip: options?.onlyLazy,
    fetchPolicy: 'cache-and-network',
    variables: {
      // TODO: Fix for testing that we can mock the slug
      customerSlug: customerSlug || 'test',
    },
  });

  const fetchLazyCampaigns = async () => new Promise(async (resolve) => {
    const { data } = await client.query({
      query: GET_WORKSPACE_CAMPAIGNS,
      variables: {
        // TODO: Fix for testing that we can mock the slug
        customerSlug: customerSlug || 'test',
      },
    });

    const campaigns = (data?.customer?.campaigns || []).map((dialogue: any) => ({
      label: dialogue.title,
      value: dialogue.id,
      ...dialogue,
    }));

    return resolve(campaigns);
  });

  return {
    campaigns: workspaceOfCampaigns?.customer?.campaigns || [],
    isLoading,
    fetchLazyCampaigns,
  };
};
