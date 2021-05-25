import { CampaignCreateInput, CampaignVariantEdgeCreateWithoutParentCampaignVariantInput, CampaignVariantTypeEnum, PrismaClient } from '@prisma/client';

import { NexusGenInputs } from '../../generated/nexus';
export class CampaignPrismaAdapter {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCampaignById(id: string) {
    return this.prisma.campaign.findOne({
      where: { id },
      include: {
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                children: true
              }
            }
          }
        }
      }
    });
  }

  async createCampaign(campaignInput: NexusGenInputs['CreateCampaignInputType']) {
    const campaign = await this.prisma.campaign.create({
      data: CampaignPrismaAdapter.parseCreateCampaignInput(campaignInput),
      include: {
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true
              }
            }
          }
        }
      }
    });

    return campaign;
  }

  async editCampaign(campaignInput: NexusGenInputs['EditCampaignInputType']) {
    const existingCampaign = await this.getCampaignById(campaignInput.id);

    const editedCampaign = await this.prisma.campaign.create({
      data: CampaignPrismaAdapter.parseCreateCampaignInput(campaignInput),
      include: {
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true
              }
            }
          }
        }
      }
    });

    return editedCampaign;
  }

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
        weight: variant.weight || 0,
        campaignVariant: {
          create: {
            label: variant.label || '',
            subject: variant.subject,
            type: variant.type,
            body: variant.body || '',
            dialogue: {
              connect: { id: variant.dialogueId },
            },
            workspace: {
              connect: { id: variant.workspaceId },
            },
            children: variant?.children?.length ? {
              create: variant.children?.map(childVariant => this.parseCreateChildrenCampaignVariantInput(childVariant))
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
  static parseCreateChildrenCampaignVariantInput(campaignVariantInput: NexusGenInputs['CreateCampaignVariantEdgeInputType']): CampaignVariantEdgeCreateWithoutParentCampaignVariantInput {
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