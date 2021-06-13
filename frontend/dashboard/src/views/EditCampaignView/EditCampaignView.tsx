import { useToast } from '@chakra-ui/core';
import * as UI from '@haas/ui';
import { CampaignBuilder } from 'components/CampaignBuilder';

import { useNavigator } from 'hooks/useNavigator';
import { useCustomer } from 'providers/CustomerProvider';
import { useDialogue } from 'providers/DialogueProvider';
import { useTranslation } from 'react-i18next';
import { GetWorkspaceCampaignQuery, useCreateCampaignMutation, useGetWorkspaceCampaignQuery } from 'types/generated-types';

const buildRecursiveVariantEdges = (variantEdge: any, flatVariantEdges: any, flatVariants: any) => {
  const childVariant = flatVariants.find((variant: any) => variant.id === variantEdge.childCampaignVariant?.id);

  if (!childVariant) return undefined;

  return {
    ...variantEdge,
    childVariant: {
      ...childVariant,
      children: childVariant.children.map((childEdge: any) => {
        const edge = flatVariantEdges.find((edge: any) => edge.id === childEdge.id);
        return buildRecursiveVariantEdges(edge, flatVariantEdges, flatVariants)
      })
    }
  }
}

const buildNestedCampaignVariants = (campaignData: any) => {
  const campaign = campaignData?.customer?.campaign;

  return {
    variantEdges: campaign?.variantEdges.map((variantEdge: any) => buildRecursiveVariantEdges(variantEdge, campaign.flatVariantEdges, campaign.flatVariants))
  }
}


export const EditCampaignView = () => {
  const { activeCustomer: activeWorkspace } = useCustomer();
  const { activeDialogue } = useDialogue();
  const { campaignId, customerSlug, getCampaignsPath } = useNavigator();
  const toast = useToast();
  const { t } = useTranslation();
  const campaignsPath = getCampaignsPath();

  const { data } = useGetWorkspaceCampaignQuery({
    variables: {
      campaignId,
      customerSlug
    }
  });

  const campaignVariants = buildNestedCampaignVariants(data);
  console.log(campaignVariants);

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

  return (
    <>
      <UI.ViewHeading>
        <UI.Stack>
          <UI.Breadcrumb to={campaignsPath}>{t('back_to_campaigns')}</UI.Breadcrumb>
          <UI.Stack isInline alignItems="center" spacing={4}>
            <UI.PageTitle>{t('edit_campaign')}</UI.PageTitle>
          </UI.Stack>
        </UI.Stack>
      </UI.ViewHeading>
      <UI.ViewContainer>
        <CampaignBuilder onSave={() => console.log("HMM")} campaign={{label: data?.customer?.campaign.label ,variantEdges: campaignVariants.variantEdges}} />
      </UI.ViewContainer>
    </>
  )
}
