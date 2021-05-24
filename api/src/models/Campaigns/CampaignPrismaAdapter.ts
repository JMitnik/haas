import { CampaignCreateInput, CampaignVariantEdgeCreateWithoutParentCampaignVariantInput, CampaignVariantTypeEnum } from '@prisma/client';

import { NexusGenInputs } from '../../generated/nexus';
export class CampaignPrismaAdapter {
  /**
   * Parses create campaign-variant.
   */
 static parseCreateCampaignInput(campaignInput: NexusGenInputs['CreateCampaignInputType']): CampaignCreateInput {
  return {
    label: campaignInput.label || '',
    workspace: {
      connect: {
        id: campaignInput.workspaceId,
      },
    },
    variantsEdges: {
      create: campaignInput.variants?.map((variant) => ({
        weight: variant.data.weight || 0,
        campaignVariant: {
          create: {
            label: variant.data.label || '',
            subject: variant.data.subject,
            type: variant.data.type,
            body: variant.data.body || '',
            dialogue: {
              connect: { id: variant.data.dialogueId },
            },
            workspace: {
              connect: { id: variant.data.workspaceId },
            },
            children: variant.data?.children?.length ? {
              create: variant.data.children?.map(childVariant => this.parseCreateChildrenCampaignVariantInput(childVariant))
            } : undefined
          },
        },
      })),
    },
  }
}

  /**
   * Recursively parses nested campaign-variants.
   */
  static parseCreateChildrenCampaignVariantInput(campaignVariantInput: NexusGenInputs['CampaignVariantEdgeInputType']): CampaignVariantEdgeCreateWithoutParentCampaignVariantInput {
    return {
      childCampaignVariant: {
        create: {
          label: campaignVariantInput?.childVariant?.label || '',
          subject: campaignVariantInput?.childVariant?.subject,
          type: campaignVariantInput?.childVariant?.type as CampaignVariantTypeEnum,
          body: campaignVariantInput?.childVariant?.body || '',
          dialogue: {
            connect: { id: campaignVariantInput?.childVariant?.dialogueId },
          },
          workspace: {
            connect: { id: campaignVariantInput?.childVariant?.workspaceId },
          },
          children: campaignVariantInput.childVariant?.children?.length ? {
            create: campaignVariantInput.childVariant.children?.map(childVariant => (
              CampaignPrismaAdapter.parseCreateChildrenCampaignVariantInput(childVariant)
            ))
          } : undefined
        }
      }
    }
  }
}