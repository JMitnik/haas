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
        directVariantEdges: {
          include: {
            campaign: true,
            childCampaignVariant: {
              include: {
                children: true
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
    const createCampaignVariantEdges = campaignInput.variantEdges?.map(campaignVariantToCampaignInput => {
      return this.prisma.campaignVariantEdge.create({
        data: CampaignPrismaAdapter.parseCreateCampaignVariantInput(createdCampaign.id, 0, campaignVariantToCampaignInput),
      });
    }) || [];

    // Finally, wrap them in transactions, and let all campaign-variants write.
    await this.prisma.$transaction([...createCampaignVariantEdges]);

    // Query the final resulting campaign
    const campaign = await this.getCampaignById(createdCampaign.id);

    return campaign;
  }

  /**
   * Edit campaign variants
   * @param campaignId
   * @param campaignVariantEdgeInputs
   * @returns
   */
  async editCampaignVariants(campaignId: string, campaignVariantEdgeInputs: NexusGenInputs['EditCampaignVariantEdgeInputType'][]) {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) throw new UserInputError('Campaign cannot be found');

    // Find which variants are to be removed.
    const allVariants = CampaignPrismaAdapter.parseVariantsFromEditCampaignVariantInputs(campaignVariantEdgeInputs);
    const disconnectedVariantIds = difference(
      campaign?.variants.map(variant => variant.id),
      allVariants.map(variant => variant.id)
    );

    // Find which variants are direct descendants of the campaign
    const directVariantEdges = campaign?.directVariantEdges.filter(edge => edge.childCampaignVariant?.id);

    // Return a list of disconnects
    const disconnectActions = disconnectedVariantIds.map(variantId => {
      const parentVariantEdge = directVariantEdges.find(variantEdge => variantEdge.childCampaignVariant?.id === variantId);
      const deleteVariantEdge = parentVariantEdge ? this.prisma.campaignVariantEdge.delete({
        where: {
          id: parentVariantEdge.id,
        }
      }) : undefined;

      const disconnectVariant = this.prisma.campaignVariant.update({
        where: { id: variantId },
        data: {
          parent: !parentVariantEdge ? { delete: true } : undefined,
          campaign: { disconnect: true },
        }
      });

      return [deleteVariantEdge, disconnectVariant];
    }).flat().filter(isPresent);

    // @ts-ignore
    await this.prisma.$transaction(disconnectActions);

    const variantsUpdateActions = allVariants.map(variant => {
      return this.prisma.campaignVariant.upsert({
        create: {
          id: variant.id || undefined,
          body: variant.body || '',
          dialogue: { connect: { id: variant.dialogueId } },
          label: variant.label || '',
          type: variant.type,
          workspace: { connect: { id: variant.workspaceId } },
          campaign: { connect: { id: campaign.id } },
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
        }
      });
    });

    await this.prisma.$transaction(variantsUpdateActions);

    // Find which variant edges are to be created.
    const variantEdges = CampaignPrismaAdapter.parseVariantEdgesFromEditCampaignInputs(campaignVariantEdgeInputs);
    console.log(variantEdges);

    const variantsEdgesUpdateActions = variantEdges.map(variantEdge => {
      return this.prisma.campaignVariantEdge.upsert({
        create: {
          id: variantEdge.id || undefined,
          campaign: { connect: { id: campaign.id } },
          childCampaignVariant: { connect: variantEdge.childVariant?.id ? { id: variantEdge.childVariant?.id || undefined } : undefined },
          parentCampaignVariant: { connect: variantEdge.parentVariantId ? { id: variantEdge.parentVariantId } : undefined },
          condition: variantEdge.conditionType
        },
        where: {
          id: variantEdge.id || ''
        },
        update: {
          condition: variantEdge.conditionType
        }
      });
    }).filter(isPresent);

    await this.prisma.$transaction(variantsEdgesUpdateActions);

    return (await this.getCampaignById(campaignId));
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

    if (campaignInput.variantEdges !== undefined && campaignInput.variantEdges !== null) {
      await this.editCampaignVariants(editedCampaign.id, campaignInput.variantEdges);
    }

    return editedCampaign;
  }

  static parseVariantsFromEditCampaignVariantInputs(editCampaignVariantInputs: NexusGenInputs['EditCampaignVariantEdgeInputType'][]) {
    const variants = editCampaignVariantInputs?.map(directVariant => {
      return [
        directVariant.childVariant,
        ...(directVariant.childVariant ? this.parseVariantsFromEditCampaignVariantInput(directVariant.childVariant) : [])
      ].flat();
    }).flat().filter(isPresent) || [];

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

  static parseVariantEdgesFromEditCampaignInputs(editCampaignVariantInputs: NexusGenInputs['EditCampaignVariantEdgeInputType'][]): NexusGenInputs['EditCampaignVariantEdgeInputType'][] {
    const edges = editCampaignVariantInputs.map(directVariantEdge => {
      return [
        directVariantEdge,
        ...this.parseVariantEdgesFromEditCampaignVariantInput(directVariantEdge)
      ];
    }).filter(isPresent).flat() || [];

    return edges;
  }

  static parseVariantEdgesFromEditCampaignVariantInput(editCampaignVariantEdgeInput: NexusGenInputs['EditCampaignVariantEdgeInputType']): NexusGenInputs['EditCampaignVariantEdgeInputType'][] {
    const edges = editCampaignVariantEdgeInput.childVariant?.children?.map(childEdge => {
      const edge: NexusGenInputs['EditCampaignVariantEdgeInputType'] = {
        id: childEdge.id,
        parentVariantId: editCampaignVariantEdgeInput.childVariant?.id,
        childVariant: childEdge.childVariant,
        conditionType: childEdge.conditionType,
        condition: childEdge.condition,
        scheduleType: CampaignVariantScheduleTypeEnum.GENERAL,
      }

      let nestedEdges: NexusGenInputs['EditCampaignVariantEdgeInputType'][] = [];
      if (childEdge.childVariant?.children) {
        nestedEdges = this.parseVariantEdgesFromEditCampaignVariantInput(childEdge);
      }

      return [edge, ...nestedEdges];
    }).flat() || [];

    return edges;
  }

  /**
   * Parses create campaign-variant.
   */
  static parseCreateCampaignVariantInput(campaignId: string, depth: number, campaignVariantToCampaignInput: NexusGenInputs['CreateCampaignVariantEdgeInputType']): CampaignVariantEdgeCreateWithoutParentCampaignVariantInput {
    const variant = campaignVariantToCampaignInput.childVariant;

    return {
      id: campaignVariantToCampaignInput.id || undefined,
      condition: campaignVariantToCampaignInput.conditionType,
      scheduleType: campaignVariantToCampaignInput.scheduleType,
      // TODO: Fix schedule metric
      scheduleMetric: 'HOUR',
      scheduleAmount: 0,
      directCampaign: { connect: { id: campaignId } },
      campaign: { connect: { id: campaignId } },
      conditionValue: {
        create: campaignVariantToCampaignInput.condition?.AB__weight ? {
          AB__Weight: campaignVariantToCampaignInput.condition?.AB__weight || undefined
        } : undefined,
      },
      childCampaignVariant: {
        create: !!variant ? {
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
        } : undefined,
      },
    }
  }

  /**
   * Recursively parses nested campaign-variants.
   */
  static parseCreateChildrenCampaignVariantInput(campaignId: string, depth: number, campaignVariantInput: NexusGenInputs['CreateCampaignVariantEdgeInputType']): CampaignVariantEdgeCreateWithoutParentCampaignVariantInput {
    return {
      id: campaignVariantInput.id || undefined,
      campaign: { connect: { id: campaignId } },
      condition: campaignVariantInput.conditionType,
      conditionValue: {
        create: campaignVariantInput.condition?.AB__weight ? {
          AB__Weight: campaignVariantInput.condition?.AB__weight || undefined
        } : undefined,
      },
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
