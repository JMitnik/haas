import { DeliveryStatusTypeEnum, PrismaClient } from '@prisma/client';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

import { CampaignWithVariants, DeliveryInput } from './CampaignTypes';

export class CampaignPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create delivery.
   */
  createDelivery = async (input: DeliveryInput) => {
    return this.prisma.delivery.create({
      data: {
        id: input.id,
        deliveryRecipientEmail: input.email,
        deliveryRecipientLastName: input.lastName,
        deliveryRecipientFirstName: input.firstName,
        deliveryRecipientPhone: input.phoneNumber,
        deliveryRecipientPrefix: input.prefix,
        campaignVariant: {
          connect: { id: input.campaignVariantId },
        },
        customVariables: input.customVariables,
        campaign: {
          connect: { id: input.campaignId },
        },
        currentStatus: 'SCHEDULED',
        scheduledAt: input.scheduledAt,
        events: {
          create: {
            status: 'SCHEDULED',
          }
        }
      },
    });
  }

  /**
   * Create campaign from campaign-input.
   */
  createCampaign = async (input: NexusGenInputs['CreateCampaignInputType']) => {
    return this.prisma.campaign.create({
      data: {
        label: input.label || '',
        workspace: {
          connect: {
            id: input.workspaceId,
          },
        },
        variantsEdges: {
          create: input.variants?.map((variant) => ({
            weight: variant.weight ?? 50,
            campaignVariant: {
              create: {
                label: variant.label || '',
                subject: variant.subject,
                from: variant.from,
                type: variant.type,
                body: variant.body || '',
                customVariables: {
                  createMany: {
                    data: variant.customVariables?.map(variable => ({
                      key: variable.key || '',
                    })) || []
                  },
                },
                dialogue: {
                  connect: { id: variant.dialogueId },
                },
                workspace: {
                  connect: { id: variant.workspaceId },
                },
              },
            },
          })),
        },
      },
      include: {
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true,
                customVariables: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Create campaign-event.
   */
  addEventToDelivery = async (deliveryId: string, eventType: DeliveryStatusTypeEnum) => {
    await this.prisma.deliveryEvents.create({
      data: {
        status: eventType,
        Delivery: { connect: { id: deliveryId } },
        createdAt: new Date(Date.now()),
      }
    });
  }

  /**
   * Find campaign by id.
   */
  findCampaign = async (id: string): Promise<CampaignWithVariants | null> => {
    return this.prisma.campaign.findFirst({
      where: { id },
      include: {
        deliveries: true,
        variantsEdges: {
          include: {
            campaignVariant: {
              include: {
                dialogue: true,
                workspace: true,
                customVariables: true,
              }
            },
          }
        }
      }
    });
  }
}
