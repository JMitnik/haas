import * as UI from '@haas/ui';
import { CampaignBuilder } from 'components/CampaignBuilder';

import { useNavigator } from 'hooks/useNavigator';
import { useTranslation } from 'react-i18next';

export const CreateCampaignView = () => {
  const { getCampaignsPath } = useNavigator();
  const campaignsPath = getCampaignsPath();
  const { t } = useTranslation();

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{t('create_campaign')}</UI.PageTitle>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <CampaignBuilder />
      </UI.ViewContainer>
    </>
  )
}