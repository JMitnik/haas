import { Campaign, CampaignCreateInput, CampaignVariantEdgeCreateWithoutParentCampaignVariantInput, CampaignVariantScheduleTypeEnum, CampaignVariantToCampaignCreateInput, CampaignVariantTypeEnum, PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';
import { difference } from 'lodash';
import { isPresent } from 'ts-is-present';

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
        nestedVariantEdges: true,
        variantsEdges: {
          include: {
            campaign: true,
            campaignVariant: {
              include: {
                children: true,
                campaign: true,
              }
            }
          }
        },
        variants: {
          include: {
            parent: true,
            children: true
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
    // First make the campaign itself.
    const createdCampaign = await this.prisma.campaign.create({
      data: {
        id: campaignInput.id || undefined,
        label: campaignInput.label || '',
        workspace: {
          connect: {
            id: campaignInput.workspaceId,
          },
        },
      }
    });

    // Secondly, create Promises that create the campaign-variants
    const createCampaignVariantEdges = campaignInput.variants?.map(campaignVariantToCampaignInput => {
      return this.prisma.campaignVariantToCampaign.create({
        data: CampaignPrismaAdapter.parseCreateCampaignVariantInput(createdCampaign.id, 0, campaignVariantToCampaignInput),
      });
    }) || [];

    // Finally, wrap them in transactions, and let all campaign-variants write.
    await this.prisma.$transaction([...createCampaignVariantEdges]);

    // Query the final resulting campaign
    const campaign = await this.getCampaignById(createdCampaign.id);

    return campaign;
  }

  async editCampaignVariants(campaignId: string, campaignVariantInputs: NexusGenInputs['EditCampaignVariantInputType'][]) {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) throw new UserInputError('Campaign cannot be found');

    // Find which variants are to be removed.
    const variants = CampaignPrismaAdapter.parseVariantsFromEditCampaignVariantInputs(campaignVariantInputs);
    const disconnectedVariantIds = difference(campaign?.variants.map(variant => variant.id), variants.map(variant => variant.id));

    // Find which variants are direct descendants of the campaign
    const directVariantIds = campaign?.variantsEdges.map(edge => edge.campaignVariantId);

    // Return a list of disconnects
    const disconnectActions = disconnectedVariantIds.map(variantId => {
      const isDirectVariant = directVariantIds?.includes(variantId);
      const deleteVariantToCampaign = isDirectVariant ? this.prisma.campaignVariantToCampaign.delete({
        where: {
          campaignId_campaignVariantId: {
            campaignId,
            campaignVariantId: variantId
          }
        }
      }) : undefined;

      const disconnectVariant = this.prisma.campaignVariant.update({
        where: { id: variantId },
        data: {
          parent: !isDirectVariant ? { delete: true }: undefined,
          campaign: { disconnect: true },
        }
      });

      return [deleteVariantToCampaign, disconnectVariant];
    }).flat().filter(isPresent);

    // @ts-ignore
    await this.prisma.$transaction(disconnectActions);

    const variantsUpdateActions = variants.map(variant => {
      const isDirectVariant = campaignVariantInputs.filter(directVariant => directVariant.id === variant.id).length > 0;
      return this.prisma.campaignVariant.upsert({
        create: {
          id: variant.id || undefined,
          body: variant.body || '',
          dialogue: { connect: { id: variant.dialogueId } },
          label: variant.label || '',
          type: variant.type,
          workspace: { connect: { id: variant.workspaceId } },
          campaign: { connect: { id: campaign.id } },
          CampaignVariantToCampaign: isDirectVariant ? {
            create: {
              campaign: { connect: {id: campaignId } },
              weight: variant.weight || 0
            },
          }: undefined
        },
        where: {
          id: variant.id
        },
        update: {
          body: variant.body || '',
          dialogue: { connect: { id: variant.dialogueId } },
          label: variant.label || '',
          campaign: { connect: { id: campaign.id } },
          type: variant.type,
          workspace: { connect: { id: variant.workspaceId } },
          CampaignVariantToCampaign: isDirectVariant ? {
            update: {
              data: {
                weight: variant.weight || 0,
              },
              where: { campaignId_campaignVariantId: {
                campaignId,
                campaignVariantId: variant.id
              },
              }
            }
          }: undefined
        }
      });
    });

    await this.prisma.$transaction(variantsUpdateActions);
    const refreshedCampaign = await this.getCampaignById(campaignId);

    // Find which variants are to be removed.
    const variantEdges = CampaignPrismaAdapter.parseVariantEdgesFromEditCampaignInputs(campaignVariantInputs);

    const variantsEdgesUpdateActions = variantEdges.map(variantEdge => {
      if (variantEdge.childVariant && variantEdge.parentVariantId) {
        return this.prisma.campaignVariantEdge.upsert({
          create: {
            id: variantEdge.id || undefined,
            campaign: { connect: { id: campaign.id } },
            childCampaignVariant: { connect: { id: variantEdge.childVariant?.id || undefined } },
            parentCampaignVariant: { connect: { id: variantEdge.parentVariantId } },
            condition: variantEdge.conditionType
          },
          where: {
            id: variantEdge.id || ''
          },
          update: {
            condition: variantEdge.conditionType
          }
        });
      }

      return undefined;
    }).filter(isPresent);

    await this.prisma.$transaction(variantsEdgesUpdateActions);

    return (await this.getCampaignById(campaignId))?.variants;
  }

  async editCampaign(campaignInput: NexusGenInputs['EditCampaignInputType']) {
    // Edit campaign details
    const editedCampaign = await this.prisma.campaign.update({
      where: { id: campaignInput.id },
      data: {
        label: campaignInput.label || '',
      },
      include: {
        variants: true
      }
    });

    if (campaignInput.variants !== undefined && campaignInput.variants !== null) {
      await this.editCampaignVariants(editedCampaign.id, campaignInput.variants);
    }

    return editedCampaign;
  }

  static parseVariantsFromEditCampaignVariantInputs(editCampaignVariantInputs: NexusGenInputs['EditCampaignVariantInputType'][]) {
    const variants = editCampaignVariantInputs?.map(directVariant => {
      return [directVariant, ...this.parseVariantsFromEditCampaignVariantInput(directVariant)].flat();
    }).filter(isPresent).flat() || [];

    return variants;
  }

  static parseVariantsFromEditCampaignVariantInput(editCampaignVariantInput: NexusGenInputs['EditCampaignVariantInputType']) {
    const variants = editCampaignVariantInput.children?.map(childEdge => {
      const variant = childEdge.childVariant;

      let nestedVariants: NexusGenInputs['EditCampaignVariantInputType'][] = [];
      if (variant?.children) {
        nestedVariants = this.parseVariantsFromEditCampaignVariantInput(variant);
      }

      return [variant, ...nestedVariants];
    }).flat() || [];

    return variants.filter(isPresent);
  }

  static parseVariantEdgesFromEditCampaignInputs(editCampaignVariantInputs: NexusGenInputs['EditCampaignVariantInputType'][]): NexusGenInputs['EditCampaignVariantEdgeInputType'][] {
    const edges = editCampaignVariantInputs.map(directVariant => {
      return this.parseVariantEdgesFromEditCampaignVariantInput(directVariant);
    }).filter(isPresent).flat() || [];

    return edges;
  }

  static parseVariantEdgesFromEditCampaignVariantInput(editCampaignVariantInput: NexusGenInputs['EditCampaignVariantInputType']): NexusGenInputs['EditCampaignVariantEdgeInputType'][] {
    const edges = editCampaignVariantInput.children?.map(childEdge => {
      const edge = {
        id: childEdge.id,
        parentVariantId: editCampaignVariantInput.id,
        childVariant: childEdge.childVariant,
        condition: childEdge.conditionType,
        scheduleType: CampaignVariantScheduleTypeEnum.GENERAL,
      }

      let nestedEdges: NexusGenInputs['EditCampaignVariantEdgeInputType'][] = [];
      if (childEdge.childVariant?.children) {
        nestedEdges = this.parseVariantEdgesFromEditCampaignVariantInput(childEdge.childVariant);
      }

      return [edge, ...nestedEdges];
    }).flat() || [];

    return edges;
  }

  /**
   * Parses create campaign-variant.
   */
 static parseCreateCampaignVariantInput(campaignId: string, depth: number, campaignVariantToCampaignInput: NexusGenInputs['CreateCampaignVariantInputType']): CampaignVariantToCampaignCreateInput {
  const variant = campaignVariantToCampaignInput;

  return {
    weight: variant.weight || 0,
    campaign: {
      connect: {
        id: campaignId
      }
    },
    campaignVariant: {
      create: {
        id: variant.id || undefined,
        label: variant.label || '',
        subject: variant.subject,
        type: variant.type,
        body: variant.body || '',
        depth,
        campaign: {
          connect: {
            id: campaignId
          }
        },
        dialogue: {
          connect: { id: variant.dialogueId },
        },
        workspace: {
          connect: { id: variant.workspaceId },
        },
        children: variant?.children?.length ? {
          create: variant.children?.map(childVariant => this.parseCreateChildrenCampaignVariantInput(campaignId, depth + 1, childVariant))
        } : undefined
      },
    },
  }
}

  /**
   * Recursively parses nested campaign-variants.
   */
  static parseCreateChildrenCampaignVariantInput(campaignId: string, depth: number, campaignVariantInput: NexusGenInputs['CreateCampaignVariantEdgeInputType']): CampaignVariantEdgeCreateWithoutParentCampaignVariantInput {
    return {
      id: campaignVariantInput.id || undefined,
      campaign: {
        connect: {
          id: campaignId
        }
      },
      condition: campaignVariantInput.conditionType,
      childCampaignVariant: {
        create: {
          id: campaignVariantInput.childVariant?.id || undefined,
          label: campaignVariantInput?.childVariant?.label || '',
          subject: campaignVariantInput?.childVariant?.subject,
          type: campaignVariantInput?.childVariant?.type as CampaignVariantTypeEnum,
          body: campaignVariantInput?.childVariant?.body || '',
          campaign: {
            connect: {
              id: campaignId
            }
          },
          depth,
          dialogue: {
            connect: { id: campaignVariantInput?.childVariant?.dialogueId },
          },
          workspace: {
            connect: { id: campaignVariantInput?.childVariant?.workspaceId },
          },
          children: campaignVariantInput.childVariant?.children?.length ? {
            create: campaignVariantInput.childVariant.children?.map(childVariant => (
              CampaignPrismaAdapter.parseCreateChildrenCampaignVariantInput(campaignId, depth + 1, childVariant)
            ))
          } : undefined
        }
      }
    }
  }
}
