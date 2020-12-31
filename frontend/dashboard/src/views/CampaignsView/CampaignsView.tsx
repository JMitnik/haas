import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { ReactComponent as EmptyIll } from 'assets/images/undraw_empty.svg';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import { useGetWorkspaceCampaigns } from 'hooks/useGetWorkspaceCampaigns';

import CreateCampaignForm from './CreateCampaignForm';
import Select from 'react-select';
import { useHistory } from 'react-router';
import { useNavigator } from 'hooks/useNavigator';

const CampaignsView = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { customerSlug, goToCampaignView } = useNavigator();
  const [openedModal, setIsOpenedModal] = useState(false);

  const { campaigns } = useGetWorkspaceCampaigns({
    // onlyLazy: true,
  });

  const handleSelectCampaign = ({label, value}: any) => {
    goToCampaignView(value);
  }

  return (
    <>
      <UI.ViewHeading>
        <UI.PageTitle>{t('campaigns')}</UI.PageTitle>
        <UI.Button
          size="sm"
          onClick={() => setIsOpenedModal(true)}
          variantColor="teal"
          leftIcon={Plus}
        >
          {t('create_campaign')}
        </UI.Button>
      </UI.ViewHeading>
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
          ): (
            <UI.IllustrationCard
            svg={<SelectIll />}
            isFlat
            text={t('select_campaign_text')}
          >
            <UI.Div style={{ fontSize: '1rem', textAlign: 'left' }} margin="0 auto" maxWidth="200px">
              <Select
                options={campaigns.map((campaign: any) => ({
                  label: campaign.label,
                  value: campaign.id
                }))}
                onChange={(data) => handleSelectCampaign(data)}
                placeholder={t('select_campaign')}
              />
            </UI.Div>
          </UI.IllustrationCard>
          )}
        <UI.Modal isOpen={openedModal} onClose={() => setIsOpenedModal(false)}>
          <UI.Card width={900} noHover bg="white">
            <UI.CardBody>
              <UI.FormSectionHeader>{t('create_campaign')}</UI.FormSectionHeader>
              <CreateCampaignForm onClose={() => setIsOpenedModal(false)} />
            </UI.CardBody>
          </UI.Card>
        </UI.Modal>
      </UI.ViewContainer>
    </>
  );
};

export default CampaignsView;
