import { Prisma, PrismaClient, Session } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { NexusGenInputs } from '../../generated/nexus';

import NodeEntryService from '../node-entry/NodeEntryService';
import { CreateSessionInput } from './SessionPrismaAdapterType';
import { generateTimeSpent } from './SessionHelpers';
import { SessionConnectionFilterInput } from './SessionTypes';
import { addDays } from 'date-fns';

class SessionPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  };


  /**
   * Builds a where query to filter the sessions in the DB with
   * @param dialogueIds 
   * @param filter 
   * @returns Prisma.SessionWhereInput
   */
  buildFindWorkspaceSessionsQuery = (
    dialogueIds: string[],
    filter?: SessionConnectionFilterInput | null
  ) => {
    let query: Prisma.SessionWhereInput = {
      dialogueId: {
        in: dialogueIds,
      },
    };

    // Optional: filter by score range.
    if (filter?.scoreRange?.min || filter?.scoreRange?.max) {
      query.mainScore = {
        gte: filter?.scoreRange?.min || undefined,
        lte: filter?.scoreRange.max || undefined,
      }
    }

    // Optional: filter by date
    if (filter?.startDate || filter?.endDate) {
      query.createdAt = {
        gte: filter?.startDate || undefined,
        lte: filter?.endDate ? filter.endDate : addDays(filter?.startDate as Date, 7),
      }
    }

    // Add search filter
    if (filter?.search) {
      query = {
        ...cloneDeep(query),
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
      }
    }

    return query;
  }

  /**
   * Finds sessions within a workspace based on a set of filters
   * @param dialogueIds 
   * @param filter 
   * @returns 
   */
  findWorkspaceSessions = async (dialogueIds: string[], filter?: SessionConnectionFilterInput | null) => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.prisma.session.findMany({
      where: this.buildFindWorkspaceSessionsQuery(dialogueIds, filter),
      skip: offset,
      take: perPage,
      orderBy: this.buildOrderByQuery(filter as NexusGenInputs['SessionConnectionFilterInput']),
      include: {
        dialogue: true,
        nodeEntries: {
          orderBy: {
            depth: 'asc',
          },
        },
      },
    });

    return sessions;
  }

  /**
   * Counts sessions within a workspace based on a set of filters
   * @param dialogueIds 
   * @param filter 
   * @returns 
   */
  countWorkspaceSessions = async (dialogueIds: string[], filter?: SessionConnectionFilterInput | null) => {
    return this.prisma.session.count({
      where: this.buildFindWorkspaceSessionsQuery(dialogueIds, filter),
    });
  }

  /**
   * Finds sessions by customer ID between two dates
   * @param customerId 
   * @param startDateTime 
   * @param endDateTime 
   * @returns 
   */
  findCustomerSessions = async (
    customerId: string,
    startDateTime: Date,
    endDateTime: Date,
  ) => {
    return this.prisma.session.findMany({
      where: {
        dialogue: {
          customerId,
        },
        createdAt: {
          gte: startDateTime as Date,
          lte: endDateTime,
        },
      },
      include: {
        nodeEntries: {
          include: {
            sliderNodeEntry: true,
            choiceNodeEntry: true,
          },
        },
      },
    });
  }

  /**
   * Finds sessions by dialogue ID between two dates
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @returns 
   */
  findDialogueSessions = async (
    dialogueId: string,
    startDateTime: Date,
    endDateTime: Date
  ) => {
    return this.prisma.session.findMany({
      where: {
        dialogueId: dialogueId,
        createdAt: {
          gte: startDateTime as Date,
          lte: endDateTime,
        },
      },
      include: {
        nodeEntries: {
          include: {
            sliderNodeEntry: true,
            choiceNodeEntry: true,
          },
        },
      },
    });
  }

  /**
   * Upserts a pathed sessions cache
   * @param cacheId 
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @param path 
   * @param pathedSessions 
   * @returns 
   */
  upsertPathedSessionCache = async (
    cacheId: string,
    dialogueId: string,
    startDateTime: Date,
    endDateTime: Date,
    path: string[],
    pathedSessions: Session[],
  ) => {
    return this.prisma.pathedSessionsCache.upsert({
      where: {
        id: cacheId || '-1',
      },
      create: {
        dialogueId,
        startDateTime,
        endDateTime,
        path,
        pathedSessions: {
          connect: pathedSessions.map((session) => ({ id: session.id })),
        },
      },
      update: {
        dialogueId,
        startDateTime,
        endDateTime,
        path,
        pathedSessions: {
          connect: pathedSessions.map((session) => ({ id: session.id })),
        },
      },
      include: {
        pathedSessions: true,
      },
    });
  };

  /**
   * Finds a cache for a pathed sessions entry
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @param path 
   * @returns 
   */
  findPathedSessionsCache = async (
    dialogueId: string,
    startDateTime: Date,
    endDateTime: Date,
    path: string[],
  ) => {
    return this.prisma.pathedSessionsCache.findFirst({
      where: {
        dialogueId,
        startDateTime: {
          equals: startDateTime,
        },
        endDateTime: {
          equals: endDateTime,
        },
        path: {
          equals: path,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        pathedSessions: true,
      },
    });
  };

  /**
   * Finds all sessions where all pathEntry answers exist in the session's node entries
   * @param pathEntries
   * @param startDateTime
   * @param endDateTime
   * @param dialogueId
   * @returns a list of sessions
   */
  findPathMatchedSessions = async (
    pathEntries: {
      nodeEntries: {
        some: {
          choiceNodeEntry: {
            value: string;
          };
        };
      };
    }[],
    startDateTime: Date,
    endDateTime: Date,
    dialogueId: string,
  ) => {
    const sessions = await this.prisma.session.findMany({
      where: {
        AND: [
          ...pathEntries,
          {
            createdAt: {
              gte: startDateTime as Date,
              lte: endDateTime,
            },
            dialogueId,
          },
        ],
      },
    });
    return sessions;
  }

  /**
   * Finds all sessions of a dialogue within provided dates
   * @param dialogueId the ID of a dialogue
   * @param startDateTime the start date from when sessions should be found
   * @param endDateTime the end date until sessions should be found
   * @returns a list of sessions
   */
  findSessionsBetweenDates = async (
    dialogueId: string,
    startDateTime?: Date,
    endDateTime?: Date,
    performanceThreshold?: number
  ) => {
    const sessionWhereInput: Prisma.SessionWhereInput = {
      createdAt: {
        gte: startDateTime,
        lte: endDateTime,
      },
    }

    if (performanceThreshold) {
      sessionWhereInput.nodeEntries = {
        some: {
          sliderNodeEntry: {
            value: {
              lte: performanceThreshold,
            },
          },
        },
      };
    };

    const dialogueWithSessions = await this.prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: {
        sessions: {
          where: sessionWhereInput,
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
    let orderByQuery: Prisma.SessionOrderByWithRelationInput[] = [];

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
      include: {
        delivery: {
          include: {
            campaignVariant: true,
          },
        },
        nodeEntries: {
          orderBy: {
            depth: 'asc',
          },
        },
      },
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
    const { device, originUrl, dialogueId, entries, totalTimeInSec, createdAt, mainScore } = data;
    return this.prisma.session.create({
      data: {
        mainScore,
        createdAt,
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
        createdAt: data.createdAt,
        totalTimeInSec: generateTimeSpent(),
        mainScore: data.simulatedRootVote,
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

  massSeedFakeSession = async (data: (
    {
      createdAt: Date;
      dialogueId: string;
      rootNodeId: string;
      simulatedRootVote: number;
      simulatedChoiceNodeId: string;
      simulatedChoiceEdgeId?: string;
      simulatedChoice: string;
      simulatedSubChoiceNodeId: string;
      simulatedSubChoiceEdgeId?: string;
      simulatedSubChoice: string;
    })) => {

    const session = await this.prisma.session.create({
      data: {
        totalTimeInSec: generateTimeSpent(),
        createdAt: data.createdAt,
        mainScore: data.simulatedRootVote,
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
            inputSource: 'INIT_GENERATED',
          }],
        },
        dialogue: {
          connect: { id: data.dialogueId },
        },
      },
    });

    if (data.simulatedSubChoice) {
      await this.prisma.nodeEntry.create({
        data: {
          depth: 2,
          creationDate: data.createdAt,
          relatedNode: { connect: { id: data.simulatedSubChoiceNodeId } },
          relatedEdge: data.simulatedSubChoiceEdgeId ? { connect: { id: data.simulatedSubChoiceEdgeId } } : undefined,
          choiceNodeEntry: {
            create: { value: data.simulatedSubChoice },
          },
          inputSource: 'INIT_GENERATED',
          session: {
            connect: {
              id: session.id,
            },
          },
        },
      })
    }
    return session;
  };

};



export default SessionPrismaAdapter;
