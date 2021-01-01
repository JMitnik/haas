import * as UI from '@haas/ui';
import { useGetWorkspaceCampaign } from 'hooks/useGetWorkspaceCampaign';
import { useNavigator } from 'hooks/useNavigator';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImportDeliveriesForm } from './ImportDeliveriesForm';

export const CampaignView = () => {
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);
  const { campaignId, getCampaignsPath } = useNavigator();
  const { campaign } = useGetWorkspaceCampaign({
    campaignId
  });

  const { t } = useTranslation();

  const campaignsPath = getCampaignsPath();

  console.log({ campaign });
  
  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{campaign?.label}</UI.PageTitle>
            <UI.Button onClick={() => setIsOpenImportModal(true)} size="sm" variantColor="teal">{t('import_deliveries')}</UI.Button>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <UI.Modal isOpen={isOpenImportModal} onClose={() => setIsOpenImportModal(false)}>
          <UI.Card bg="white" noHover width={700}>
            <UI.CardBody>
              <ImportDeliveriesForm 
              onClose={() => setIsOpenImportModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  )
};