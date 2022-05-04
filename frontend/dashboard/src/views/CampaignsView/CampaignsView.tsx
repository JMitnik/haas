import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import Select from 'react-select';

import { ReactComponent as EmptyIll } from 'assets/images/undraw_empty.svg';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import { useGetWorkspaceCampaignsQuery } from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import useAuth from 'hooks/useAuth';

import CreateCampaignForm from './CreateCampaignForm';

const CampaignsView = () => {
  const { t } = useTranslation();
  const { customerSlug, goToCampaignView } = useNavigator();
  const [openedModal, setIsOpenedModal] = useState(false);
  const { canCreateCampaigns } = useAuth();

  const { data } = useGetWorkspaceCampaignsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug,
    },
  });

  const campaigns = data?.customer?.campaigns || [];

  const handleSelectCampaign = ({ value }: any) => {
    goToCampaignView(value);
  };

  return (
    <>
      <UI.ViewHead>
        <UI.DeprecatedViewTitle>{t('campaigns')}</UI.DeprecatedViewTitle>
        {canCreateCampaigns && (
          <UI.Button
            size="sm"
            onClick={() => setIsOpenedModal(true)}
            variantColor="teal"
            leftIcon={Plus}
          >
            {t('create_campaign')}
          </UI.Button>
        )}
      </UI.ViewHead>
      <UI.ViewContainer>
        {/* TODO: Set proper close */}
        {campaigns.length === 0 ? (
          <UI.IllustrationCard
            svg={<EmptyIll />}
            isFlat
            text={t('no_campaigns')}
          >
            <UI.Button
              size="sm"
              onClick={() => setIsOpenedModal(true)}
              variantColor="teal"
              leftIcon={Plus}
            >
              {t('create_campaign')}
            </UI.Button>
          </UI.IllustrationCard>
        ) : (
          <UI.IllustrationCard
            svg={<SelectIll />}
            isFlat
            text={t('select_campaign_text')}
          >
            <UI.Div style={{ fontSize: '1rem', textAlign: 'left' }} margin="0 auto" maxWidth="200px">
              <Select
                options={campaigns.map((campaign: any) => ({
                  label: campaign.label,
                  value: campaign.id,
                }))}
                onChange={(selectedData) => handleSelectCampaign(selectedData)}
                placeholder={t('select_campaign')}
              />
            </UI.Div>
          </UI.IllustrationCard>
        )}
        <UI.Modal
          willCloseOnOutsideClick={false}
          isOpen={openedModal}
          onClose={() => setIsOpenedModal(false)}
        >
          <UI.ModalCard breakout maxWidth={1200} onClose={() => setIsOpenedModal(false)}>
            <UI.ModalHead>
              <UI.ModalTitle>{t('create_campaign')}</UI.ModalTitle>
            </UI.ModalHead>
            <UI.ModalBody>
              <CreateCampaignForm onClose={() => setIsOpenedModal(false)} />
            </UI.ModalBody>
          </UI.ModalCard>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  );
};

export default CampaignsView;
