import * as UI from '@haas/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateCampaignInputType, EditCampaignInputType } from 'types/generated-types';
import { ReactComponent as SelectIll } from 'assets/images/undraw_select.svg';

import * as LS from './CampaignBuilderStyles';


export const CampaignBuilder = () => {
  const { t } = useTranslation();
  const [campaign, setCampaign] = useState<CreateCampaignInputType | EditCampaignInputType | null>(null);

  return (
    <LS.BuilderContainer>
      <LS.BuilderCanvas>
        {!campaign ? (
          <UI.IllustrationCard svg={<SelectIll />}>
            {t('initialize_campaign')}
          </UI.IllustrationCard>
        )}
      </LS.BuilderCanvas>
      <LS.BuilderEditPane>
        test2
      </LS.BuilderEditPane>
    </LS.BuilderContainer>
  )
};