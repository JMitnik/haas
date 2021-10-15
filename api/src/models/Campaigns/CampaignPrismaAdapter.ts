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
   * Find campaign of campaign-variant
   *
   * Warning: (not a good query.)
   *
   * @param campaignVariantId
   * @returns
   */
  findCampaignOfVariantId = async (campaignVariantId: string) => {
    const edges = await this.prisma.campaign.findUnique({
      where: { id: campaignVariantId },
      include: {
        variantsEdges: {
          include: {
            campaign: true
          }
        }
      }
    });

    return edges?.variantsEdges[0].campaign;
  }

  /**
   * Find campaign variant of delivery.
   * @param deliveryId
   */
  findCampaignVariantOfDelivery = async (deliveryId: string) => {
    return this.prisma.delivery.findUnique({
      where: { id: deliveryId }
    }).campaignVariant();
  }

  /**
   * Find campaign variant of delivery.
   * @param deliveryId
   */
  findWorkspaceOfCampaignVariant = async (campaignVariantId: string) => {
    return this.prisma.campaignVariant.findUnique({
      where: { id: campaignVariantId }
    }).workspace();
  }

  /**
   * Find campaign variant of delivery.
   * @param deliveryId
   */
  findDialogueOfCampaignVariant = async (campaignVariantId: string) => {
    return this.prisma.campaignVariant.findUnique({
      where: { id: campaignVariantId }
    }).dialogue();
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
   * Find campaigns of workspace.
   */
  findCampaignsOfWorkspace = async (workspaceId: string) => {
    return this.prisma.customer.findFirst({
      where: { id: workspaceId },
      include: {
        campaigns: {
          include: {
            variantsEdges: {
              include: {
                campaignVariant: {
                  include: {
                    dialogue: true,
                    workspace: true,
                  }
                },
              },
            },
          },
        },
      },
    });
  }


  /**
   * Find delivery of session.
   * @param campaignId
   * @returns
   */
  findDeliveryOfSession = async (sessionId: string) => {
    return this.prisma.session.findUnique({
      where: { id: sessionId }
    }).delivery();
  }

  /**
   * Find delivery-events of delivery.
   * @param campaignId
   * @returns
   */
  findDeliveryEventsOfDelivery = async (deliveryId: string) => {
    return this.prisma.delivery.findFirst({
      where: { id: deliveryId }
    }).events();
  }

  /**
   * Find delivery
   *
   * Note:
   * - Eager loads `campaign` and `campaignVariant` as well (often requested together).
   * @param id
   * @returns
   */
  findDelivery = async (deliveryId: string) => {
    return this.prisma.delivery.findFirst({
      where: { id: deliveryId },
      include: {
        campaign: true,
        campaignVariant: true,
      }
    })
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
