import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import Select from 'react-select';

import * as Modal from 'components/Common/Modal';
import { ReactComponent as EmptyIll } from 'assets/images/undraw_empty.svg';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import { View } from 'layouts/View';
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
    <View documentTitle="haas | Campaigns">
      <UI.ViewHead>
        <UI.Flex alignItems="flex-end">
          <UI.Div>
            <UI.ViewTitle>{t('campaigns')}</UI.ViewTitle>
            <UI.ViewSubTitle>
              {t('campaigns_subtitle')}
            </UI.ViewSubTitle>
          </UI.Div>
          {canCreateCampaigns && (
            <UI.Div>
              <UI.Button
                ml={8}
                size="sm"
                onClick={() => setIsOpenedModal(true)}
                variantColor="main"
                leftIcon={() => <Plus />}
              >
                {t('create_campaign')}
              </UI.Button>
            </UI.Div>
          )}
        </UI.Flex>
      </UI.ViewHead>
      <UI.ViewBody>
        {/* TODO: Set proper close */}
        {campaigns.length === 0 ? (
          <UI.IllustrationCard
            svg={<EmptyIll />}
            text={t('no_campaigns')}
          >
            <UI.Button
              size="sm"
              onClick={() => setIsOpenedModal(true)}
              leftIcon={() => <Plus />}
            >
              {t('create_campaign')}
            </UI.Button>
          </UI.IllustrationCard>
        ) : (
          <UI.IllustrationCard
            svg={<SelectIll />}
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

        <Modal.Root minWidth={800} open={openedModal} onClose={() => setIsOpenedModal(false)}>
          <UI.ModalHead>
            <UI.ModalTitle>{t('create_campaign')}</UI.ModalTitle>
          </UI.ModalHead>
          <UI.ModalBody>
            <CreateCampaignForm onClose={() => setIsOpenedModal(false)} />
          </UI.ModalBody>
        </Modal.Root>
      </UI.ViewBody>
    </View>
  );
};

export default CampaignsView;
