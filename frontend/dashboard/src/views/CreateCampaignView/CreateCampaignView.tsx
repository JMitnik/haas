import { useToast } from '@chakra-ui/core';
import * as UI from '@haas/ui';
import { CampaignBuilder } from 'components/CampaignBuilder';
import { CampaignType } from 'components/CampaignBuilder/CampaignStore';

import { useNavigator } from 'hooks/useNavigator';
import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import { useCreateCampaignMutation } from 'types/generated-types';

export const CreateCampaignView = () => {
  const { activeCustomer: activeWorkspace } = useCustomer();
  const { getCampaignsPath } = useNavigator();
  const toast = useToast();
  const campaignsPath = getCampaignsPath();
  const { t } = useTranslation();


  const [createCampaign, { error }] = useCreateCampaignMutation({
    onCompleted: () => {
      toast({
        title: 'Completed!',
        description: 'Finished!.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Errored!',
        description: 'Errored!.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    }
  });


  const handleSave = (campaign: CampaignType) => {
    createCampaign({
      variables: {
        input: {
          workspaceId: activeWorkspace?.id || '',
          label: campaign.label,
          variants: campaign.variantEdges
        }
      }
    })
  }

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
