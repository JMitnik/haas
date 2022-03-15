import { Prisma, PrismaClient, Session } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { NexusGenFieldTypes, NexusGenInputNames, NexusGenInputs } from '../../generated/nexus';

import NodeEntryService from '../node-entry/NodeEntryService';
import { CreateSessionInput } from './SessionPrismaAdapterType';

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };

  /**
   * Finds all sessions of a dialogue within provided dates 
   * @param dialogueId the ID of a dialogue
   * @param startDateTime the start date from when sessions should be found
   * @param endDateTime the end date until sessions should be found
   * @returns a list of sessions
   */
  findScopedSessions = async (dialogueId: string, startDateTime?: string, endDateTime?: string) => {
    const dialogueWithSessions = await this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: {
        sessions: {
          where: {
            createdAt: (startDateTime || endDateTime) ? {
              gte: startDateTime,
              lte: endDateTime,
            } : undefined,
          },
        },
      },
    });
    return dialogueWithSessions?.sessions || [];
  }

  /**
   * Finds all relevant node entries based on session IDs and (optionally) depth
   * @param sessionIds a list of session Ids
   * @param depth OPTIONAL: a number to fetch a specific depth layer
   * @returns a list of node entries
   */
  findNodeEntriesBySessionIds = async (sessionIds: string[], depth?: number) => {
    const verifiedDepth = typeof depth === 'number' ? depth : undefined;
    return this.prisma.nodeEntry.findMany({
      where: {
        AND: [
          {
            sessionId: {
              in: sessionIds,
            },
          },
          {
            depth: verifiedDepth,
          },
        ],
      },
      include: {
        sliderNodeEntry: verifiedDepth === 0,
        choiceNodeEntry: verifiedDepth ? verifiedDepth > 0 : false,
        videoNodeEntry: verifiedDepth ? verifiedDepth > 0 : false,
      },
    })
  }

  /**
   * Build a session prisma query based on the filter parameters.
   * @param dialogueId
   * @param filter
   */
  buildFindSessionsQuery = (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    // Required: filter by dialogueId
    let query: Prisma.SessionWhereInput = { dialogueId, delivery: undefined };

    // Optional: Filter by campaigns or not
    if (filter?.deliveryType) {
      query.delivery = {
        is: filter?.deliveryType === 'noCampaigns' ? null : undefined,
        isNot: filter?.deliveryType === 'campaigns' ? null : undefined,
      }
    }

    // Optional: filter by score range.
    if (filter?.scoreRange?.min || filter?.scoreRange?.max) {
      query.nodeEntries = {
        some: {
          sliderNodeEntry: {
            value: {
              gte: filter?.scoreRange?.min || undefined,
              lte: filter?.scoreRange?.max || undefined,
            },
          },
        },
      }
    }

    // Optional: Filter by campaign-variant
    if (filter?.campaignVariantId) {
      query.delivery = {
        campaignVariantId: filter.campaignVariantId,
      }
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

      const doFullSearch = () => {
        if (potentialLastName) {
          return {
            AND: potentialLastName ? [
              { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' } },
              { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' } },
            ] : undefined,
          }
        }

        return
      };

      query = {
        ...cloneDeep(query),
        OR: [{
          nodeEntries: {
            some: {
              // Allow searching in choices and form entries
              OR: [
                {
                  choiceNodeEntry: { value: { contains: filter.search, mode: 'insensitive' } },
                },
                {
                  formNodeEntry: {
                    values: {
                      some: {
                        OR: [
                          { longText: { contains: filter.search, mode: 'insensitive' } },
                          { shortText: { contains: filter.search, mode: 'insensitive' } },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },

        // Allow searching for delivery properties
        // TODO: Might be a tricky query, perhaps we should do per-field searching instead.
        {
          delivery: {
            OR: [
              { deliveryRecipientEmail: { equals: filter.search, mode: 'insensitive' } },
              { deliveryRecipientPhone: { equals: filter.search, mode: 'insensitive' } },
              {
                AND: potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' } },
                  { deliveryRecipientLastName: { contains: potentialLastName, mode: 'insensitive' } },
                ] : undefined,
              },
              {
                OR: !potentialLastName ? [
                  { deliveryRecipientFirstName: { contains: potentialFirstName, mode: 'insensitive' } },
                  { deliveryRecipientLastName: { contains: potentialFirstName, mode: 'insensitive' } },
                ] : undefined,
              },
            ],
          },
        }],
      }
    }

    return query;
  }

  /**
   * Order interactions by a "created-at".
   * @param filter
   */
  buildOrderByQuery = (filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    let orderByQuery: Prisma.SessionOrderByInput[] = [];

    if (filter?.orderBy?.by === 'createdAt') {
      orderByQuery.push({
        createdAt: filter.orderBy.desc ? 'desc' : 'asc',
      })
    }

    return orderByQuery;
  }

  findSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.prisma.session.findMany({
      where: this.buildFindSessionsQuery(dialogueId, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter),
      include: { delivery: { include: { campaignVariant: true } } },
    });

    return sessions;
  }

  countSessions = async (dialogueId: string, filter?: NexusGenInputs['SessionConnectionFilterInput'] | null) => {
    return this.prisma.session.count({
      where: this.buildFindSessionsQuery(dialogueId, filter),
    });
  }

  updateDelivery(sessionId: string, deliveryId: string) {
    return this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        delivery: { connect: { id: deliveryId } },
      },
    });
  };

  /**
   * Creates a session in the database.
   * */
  createSession(data: CreateSessionInput) {
    const { device, originUrl, dialogueId, entries, totalTimeInSec } = data;
    return this.prisma.session.create({
      data: {
        originUrl,
        device,
        totalTimeInSec,
        nodeEntries: {
          create: entries.map((entry) => NodeEntryService.constructCreateNodeEntryFragment(entry)),
        },
        dialogue: {
          connect: {
            id: dialogueId,
          },
        },
      },
      include: {
        nodeEntries: {
          // TODO: Can we define these fields in one place (right now, it exists everywhere).
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            textboxNodeEntry: true,
            relatedNode: true,
            formNodeEntry: { include: { values: true } },
            videoNodeEntry: true,
            sliderNodeEntry: true,
          },
        },
      },
    });
  };

  /**
   * Fetches single session from database.
   *
   * Notes:
   * - Includes node-entries
  */
  findSessionById(sessionId: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        nodeEntries: {
          orderBy: { depth: 'asc' },
          include: {
            choiceNodeEntry: true,
            linkNodeEntry: true,
            registrationNodeEntry: true,
            relatedNode: true,
            sliderNodeEntry: true,
          },
        },
      },
    });
  };

  async deleteMany(sessionIds: string[]) {
    return this.prisma.session.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
      },
    });
  };

  createFakeSession(data: (
    {
      createdAt: Date;
      dialogueId: string;
      rootNodeId: string;
      simulatedRootVote: number;
      simulatedChoiceNodeId: string;
      simulatedChoiceEdgeId?: string;
      simulatedChoice: string;
    })) {

    return this.prisma.session.create({
      data: {
        nodeEntries: {
          create: [{
            depth: 0,
            creationDate: data.createdAt,
            relatedNode: {
              connect: { id: data.rootNodeId },
            },
            sliderNodeEntry: {
              create: { value: data.simulatedRootVote },
            },
            inputSource: 'INIT_GENERATED',
          },
          {
            depth: 1,
            creationDate: data.createdAt,
            relatedNode: { connect: { id: data.simulatedChoiceNodeId } },
            relatedEdge: { connect: { id: data.simulatedChoiceEdgeId } },
            choiceNodeEntry: {
              create: { value: data.simulatedChoice },
            },
          },
          ],
        },
        dialogue: {
          connect: { id: data.dialogueId },
        },
      },
    });
  };
};

export default SessionPrismaAdapter;
