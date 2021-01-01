import * as UI from '@haas/ui';
import { useGetWorkspaceCampaign } from 'hooks/useGetWorkspaceCampaign';
import { useNavigator } from 'hooks/useNavigator';
import React from 'react';

export const CampaignView = () => {
  const { campaignId } = useNavigator();
  const { campaign } = useGetWorkspaceCampaign({
    campaignId
  });

  console.log(campaign);
  
  return (
    <UI.Div>
      Test
    </UI.Div>
  )
};
