import { DeliveryStatusTypeEnum, Prisma, PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

import { CampaignWithVariants, DeliveryInput } from './CampaignTypes';

export class CampaignPrismaAdapter {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }


  /**
   * Build a session prisma query based on the filter parameters.
   * @param dialogueId
   * @param filter
   */
  buildFindDeliveriesQuery = (campaignId: string, filter?: NexusGenInputs['DeliveryConnectionFilterInput'] | null) => {
    // Required: filter by campaignId
    let query: Prisma.DeliveryWhereInput = { campaignId };

    // Optional: Filter by campaign-variant
    if (filter?.campaignVariantId) {
      query.campaignVariantId = filter.campaignVariantId;
    }

    // Optional: filter by date
    if (filter?.startDate || filter?.endDate) {
      query.createdAt = {
        gte: filter?.startDate ? new Date(filter.startDate) : undefined,
        lte: filter?.endDate ? new Date(filter.endDate) : undefined,
      }
    }

    // Add search filter
    if (filter?.search) {
      const [potentialFirstName, potentialLastName] = filter.search.split(' ');

      query = {
        ...cloneDeep(query),
        OR: [
          { deliveryRecipientEmail: { contains: filter.search, mode: 'insensitive' }, },
          { deliveryRecipientPhone: { contains: filter.search, mode: 'insensitive' }, },
          {
            AND: potentialLastName ? [
              { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' }, },
              { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' }, },
            ] : undefined
          },
          {
            OR: !potentialLastName ? [
              { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' }, },
              { deliveryRecipientLastName: { contains: potentialFirstName, mode: 'insensitive' }, },
            ] : undefined
          }
        ]
      }
    }

    return query;
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
   * Order interactions by a "created-at".
   * @param filter
   */
  buildOrderByQuery = (filter?: NexusGenInputs['DeliveryConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.DeliveryOrderByInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      })
    }

    return orderByQuery;
  }

  /**
   * Find deliveries, given a filter.
   * @param campaignId
   * @param filter
   * @returns
   */
  findDeliveries = async (campaignId: string, filter?: NexusGenInputs['DeliveryConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const deliveries = await this.prisma.delivery.findMany({
      where: this.buildFindDeliveriesQuery(campaignId, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: { campaignVariant: true, campaign: true }
    });

    return deliveries;
  }

  /**
   * Count deliveries matching a filter.
   * @param campaignId
   * @param filter
   * @returns
   */
  countDeliveries = async (campaignId: string, filter?: NexusGenInputs['DeliveryConnectionFilterInput'] | null) => {
    return this.prisma.delivery.count({ where: this.buildFindDeliveriesQuery(campaignId, filter) });
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
    const edges = await this.prisma.campaignVariant.findUnique({
      where: { id: campaignVariantId },
      include: {
        CampaignVariantToCampaign: {
          include: {
            campaign: true,
          }
        }
      }
    });

    return edges?.CampaignVariantToCampaign[0]?.campaign;
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
