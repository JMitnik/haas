import * as UI from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import CreateCampaignForm from './CreateCampaignForm';
import React, { useState } from 'react';

const CampaignsView = () => {
  const { t } = useTranslation();
  const [openedModal, setIsOpenedModal] = useState(false);

  return (
    <UI.ViewContainer>
      <UI.PageTitle>{t('campaigns')}</UI.PageTitle>
      <UI.Button onClick={() => setIsOpenedModal(true)} variantColor="teal" leftIcon={Plus}>{t('create_campaign')}</UI.Button>
      {/* TODO: Set proper close */}
      <UI.Modal isOpen={openedModal} onClose={() => setIsOpenedModal(false)}>
        <UI.Card width={700} noHover bg="white">
          <UI.CardBody>
            <UI.FormSectionHeader>{t('create_campaign')}</UI.FormSectionHeader>
            <CreateCampaignForm />
          </UI.CardBody>
        </UI.Card>
      </UI.Modal>
    </UI.ViewContainer>
  );
};

export default CampaignsView;
