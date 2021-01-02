import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useNavigator } from './useNavigator';

interface UseGetWorkspaceDialoguesOptionsProps {
  campaignId?: string; 
  onlyLazy?: boolean;
}

const GET_WORKSPACE_CAMPAIGN = gql`
  query getWorkspaceCampaign($customerSlug: String!, $campaignId: String!) {
    customer(slug: $customerSlug) {
      id
      campaign(campaignId: $campaignId) {
        id
        label
        deliveryConnection {
          deliveries {
            id
            deliveryRecipientFirstName
            deliveryRecipientLastName
            deliveryRecipientEmail
            deliveryRecipientPhone
            scheduledAt
            currentStatus
          }
        }
        
        variants {
          id
          label
        }
      }
    }
  }
`;

export const useGetWorkspaceCampaign = (options?: UseGetWorkspaceDialoguesOptionsProps) => {
  const { customerSlug } = useNavigator();
  const { data: workspaceOfCampaign, loading: isLoading, client } = useQuery(GET_WORKSPACE_CAMPAIGN, {
    skip: options?.onlyLazy,
    fetchPolicy: 'cache-and-network',
    variables: {
      // TODO: Fix for testing that we can mock the slug
      customerSlug: customerSlug || 'test',
      campaignId: options?.campaignId,
    },
  });

  const fetchLazyCampaigns = async () => new Promise(async (resolve) => {
    const { data } = await client.query({
      query: GET_WORKSPACE_CAMPAIGN,
      variables: {
        // TODO: Fix for testing that we can mock the slug
        customerSlug: customerSlug || 'test',
        campaignId: options?.campaignId,
      },
    });

    const deliveries = (data?.customer?.campaigns || []).map((dialogue: any) => ({
      label: dialogue.title,
      value: dialogue.id,
      ...dialogue,
    }));

    return resolve(deliveries);
  });

  return {
    campaign: workspaceOfCampaign?.customer?.campaign,
    isLoading,
    fetchLazyCampaigns,
  };
};
