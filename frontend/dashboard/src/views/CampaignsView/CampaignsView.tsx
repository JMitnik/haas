import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import CreateCampaignForm from './CreateCampaignForm';

const CampaignsView = () => {
  const { t } = useTranslation();
  const [openedModal, setIsOpenedModal] = useState(false);

  return (
    <UI.ViewContainer>
      <UI.PageTitle>{t('campaigns')}</UI.PageTitle>
      <UI.Button onClick={() => setIsOpenedModal(true)} variantColor="teal" leftIcon={Plus}>
        {t('create_campaign')}
      </UI.Button>
      {/* TODO: Set proper close */}
      <UI.Modal isOpen={openedModal} onClose={() => setIsOpenedModal(false)}>
        <UI.Card width={900} noHover bg="white">
          <UI.CardBody>
            <UI.FormSectionHeader>{t('create_campaign')}</UI.FormSectionHeader>
            <CreateCampaignForm onClose={() => setIsOpenedModal(false)} />
          </UI.CardBody>
        </UI.Card>
      </UI.Modal>
    </UI.ViewContainer>
  );
};

export default CampaignsView;
