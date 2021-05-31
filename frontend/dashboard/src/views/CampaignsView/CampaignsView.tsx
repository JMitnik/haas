import * as UI from '@haas/ui';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import Select from 'react-select';
import { useHistory } from 'react-router';

import { ReactComponent as EmptyIll } from 'assets/images/undraw_empty.svg';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';
import { ROUTES, useNavigator } from 'hooks/useNavigator';
import { useGetWorkspaceCampaignsQuery } from 'types/generated-types';
import useAuth from 'hooks/useAuth';

import CreateCampaignForm from './CreateCampaignForm';

const CampaignsView = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { customerSlug, goToCampaignView, getCreateCampaignsPath } = useNavigator();
  const [openedModal, setIsOpenedModal] = useState(false);
  const { canCreateCampaigns } = useAuth();

  const { data } = useGetWorkspaceCampaignsQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      customerSlug
    }
  });

  const campaigns = data?.customer?.campaigns || [];

  const handleSelectCampaign = ({ value }: any) => {
    goToCampaignView(value);
  }

  return (
    <>
      <UI.ViewHeading>
        <UI.PageTitle>{t('campaigns')}</UI.PageTitle>
        {canCreateCampaigns && (
          <UI.Button
            size="sm"
            onClick={() => history.push(getCreateCampaignsPath())}
            variantColor="teal"
            leftIcon={Plus}
          >
            {t('create_campaign')}
          </UI.Button>
        )}
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
              onClick={() => history.push(getCreateCampaignsPath())}
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
                    value: campaign.id
                  }))}
                  onChange={(data) => handleSelectCampaign(data)}
                  placeholder={t('select_campaign')}
                />
              </UI.Div>
            </UI.IllustrationCard>
          )}
        <UI.Modal
          willCloseOnOutsideClick={false}
          isOpen={openedModal}
          onClose={() => setIsOpenedModal(false)}
          width="90%"
        >
          <UI.Card  noHover bg="white">
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
