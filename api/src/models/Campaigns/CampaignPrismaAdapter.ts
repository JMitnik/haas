import { Campaign, CampaignCreateInput, CampaignVariantEdgeCreateWithoutParentCampaignVariantInput, CampaignVariantToCampaignCreateInput, CampaignVariantTypeEnum, PrismaClient } from '@prisma/client';
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

  async editCampaign(campaignInput: NexusGenInputs['EditCampaignInputType']) {
    // Edit campaign details
    const editedCampaign = await this.prisma.campaign.update({
      where: { id: campaignInput.id },
      data: {
        label: campaignInput.label || '',
        // variantsEdges: { deleteMany: {} }
      },
      include: {
        variants: true
      }
    });

    const variants = CampaignPrismaAdapter.parseVariantsFromEditCampaignInput(campaignInput);
    const variantEdges = CampaignPrismaAdapter.parseVariantEdgesFromEditCampaignInput(campaignInput);

    const variantsUpdates = variants.map(variant => {
      return this.prisma.campaignVariant.upsert({
        create: {
          id: variant.id || undefined,
          body: variant.body || '',
          dialogue: { connect: { id: variant.dialogueId } },
          label: variant.label || '',
          type: variant.type,
          workspace: { connect: { id: variant.workspaceId } },
          campaign: { connect: { id: editedCampaign.id } },
        },
        where: {
          id: variant.id
        },
        update: {
          body: variant.body || '',
          dialogue: { connect: { id: variant.dialogueId } },
          label: variant.label || '',
          campaign: { connect: { id: editedCampaign.id } },
          type: variant.type,
          workspace: { connect: { id: variant.workspaceId } },
        }
      });
    });
    await this.prisma.$transaction(variantsUpdates);

    const variantEdgeUpdates = variantEdges.map(edge => {
      return this.prisma.campaignVariantEdge.upsert({
        create: {
          campaign: { connect: { id: editedCampaign.id } },
          childCampaignVariant: { connect: { id: edge.childVariant?.id  } },
          parentCampaignVariant: { connect: { id: edge.parentVariantId } },
          condition: edge.condition,
        },
        where: { id: edge.id },
        update: {
          condition: edge.condition,
        }
      })
    });

    await this.prisma.$transaction(variantEdgeUpdates);

    const disconnectedVariants = difference(editedCampaign?.variants.map(variant => variant.id), variants.map(variant => variant.id));
    const disconnects = disconnectedVariants.map(variantId => {
      return this.prisma.campaignVariant.update({
        where: {id: variantId },
        data: {
          campaign: { disconnect: true },
          // parent: { delete: true }
        }
      })
    });
    await this.prisma.$transaction(disconnects);

    // console.log(campaignInput.variants);
    // const campaignDirectEdges = campaignInput.variants?.map(directVariant => {
    //   return this.prisma.campaign.update({
    //     where: { id: editedCampaign.id },
    //     data: {
    //       variantsEdges: {
    //         create: [{
    //           weight: 50,
    //           campaignVariant: { connect: { id: directVariant.id } }
    //         }]
    //       }
    //     }
    //   })
    // }) || [];

    // await this.prisma.$transaction(campaignDirectEdges);

    // Disconnect

    return editedCampaign;
  }

  static parseVariantsFromEditCampaignInput(editCampaignInput: NexusGenInputs['EditCampaignInputType']) {
    const variants = editCampaignInput.variants?.map(directVariant => {
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

  static parseVariantEdgesFromEditCampaignInput(editCampaignInput: NexusGenInputs['EditCampaignInputType']): NexusGenInputs['EditCampaignVariantEdgeInputType'][] {
    const edges = editCampaignInput.variants?.map(directVariant => {
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
        condition: childEdge.condition
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
      campaign: {
        connect: {
          id: campaignId
        }
      },
      condition: campaignVariantInput.condition,
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