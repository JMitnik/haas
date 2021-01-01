import * as UI from '@haas/ui';
import { useGetWorkspaceCampaign } from 'hooks/useGetWorkspaceCampaign';
import { useNavigator } from 'hooks/useNavigator';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CampaignView = () => {
  const { campaignId, getCampaignsPath } = useNavigator();
  const { campaign } = useGetWorkspaceCampaign({
    campaignId
  });

  const { t } = useTranslation();

  const campaignsPath = getCampaignsPath();
  
  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.PageTitle>{campaign?.label}</UI.PageTitle>
        </UI.Stack>
      </UI.ViewHeading>
    </>
  )
};
