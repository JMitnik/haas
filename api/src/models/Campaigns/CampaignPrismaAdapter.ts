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
                children: true,
                CampaignVariantToCampaign: {
                  include: {
                    campaign: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async getCampaignVariantById(id: string) {
    return this.prisma.campaignVariant.findOne({
      where: { id },
      include: {
        children: true,
        parent: true,
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
                workspace: true,
                CampaignVariantToCampaign: {
                  include: {
                    campaign: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return campaign;
  }

  async editCampaign(campaignInput: NexusGenInputs['EditCampaignInputType']) {
    // Edit campaign details
    // Let's pretend these are ALL variants
    const campaignVariantEdges = campaignInput.variants?.map(parentVariant => {
      return parentVariant.children?.map(childEdge => ({
        parent: parentVariant,
        child: childEdge.childVariant,
        condition: childEdge.condition
      }))
    }).flat();

    console.log(campaignInput.variants)

    console.log(campaignVariantEdges);

    // Look at campaign direct children (variantEdges)

    // Extract from input nested campaignVariant
    // const editedCampaign = await this.prisma.campaign.update({
    //   where: { id: campaignInput.id },
    //   data: {
    //     label: campaignInput.label,
    //     variantsEdges: {

    //     }
    //   }
    // });

    // return editedCampaign;
  }

  /**
   * Parses create campaign-variant.
   */
 static parseCreateCampaignInput(campaignInput: NexusGenInputs['CreateCampaignInputType']): CampaignCreateInput {
  return {
    id: campaignInput.id || undefined,
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
            id: variant.id || undefined,
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
          id: campaignVariantInput.childVariant?.id || undefined,
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