import {
  NodeEntry, Prisma, PrismaClient,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { sortBy } from 'lodash';

import { offsetPaginate } from '../general/PaginationHelpers';
import { TEXT_NODES } from '../questionnaire/Dialogue';
import { NexusGenFieldTypes, NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import NodeEntryService from '../node-entry/NodeEntryService';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';
import { FindManyCallBackProps, PaginateProps, paginate } from '../../utils/table/pagination';
import { Nullable, PaginationProps } from '../../types/generic';
import { SessionWithEntries } from './SessionTypes';
import TriggerService from '../trigger/TriggerService';
import prisma from '../../config/prisma';
import Sentry from '../../config/sentry';
import SessionPrismaAdapter from './SessionPrismaAdapter';
import { Session, SessionQueryModel } from './SessionQueryModel';

class SessionService {
  sessionPrismaAdapter: SessionPrismaAdapter;
  triggerService: TriggerService;

  constructor(prismaClient: PrismaClient) {
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.triggerService = new TriggerService(prismaClient);
  };

  /**
   * Finds single session by passed ID.
   * */
  findSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionPrismaAdapter.findSessionById(sessionId);
  };

  /**
   * Get scoring entries from a list of sessions.
   * @param sessions
   */
  static getScoringEntriesFromSessions(
    sessions: Session[],
  ): (NodeEntryWithTypes)[] {
    if (!sessions.length) return [];

    const entries = sessions.map((session) => SessionService.getScoringEntryFromSession(session));
    const nonNullEntries = entries.filter(isPresent);

    return nonNullEntries;
  }

  /**
   * Get the sole scoring entry a single session.
   * @param session
   */
  static getScoringEntryFromSession(session: SessionWithEntries): NodeEntryWithTypes | null {
    return session.nodeEntries.find((entry) => entry.sliderNodeEntry?.value) || null;
  };

  static getScoreFromSession(session: SessionWithEntries): number | null {
    const entry = SessionService.getScoringEntryFromSession(session);

    return entry?.sliderNodeEntry?.value || null;
  };

  /**
   * Finds session score in database, based on the provided id.
   * */
  static async findSessionScore(sessionId: string): Promise<number | undefined | null> {
    // TODO: Replace with prismAdapter.findSessionById
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        nodeEntries: {
          include: {
            relatedNode: {
              select: {
                isRoot: true,
              },
            },
            sliderNodeEntry: true,
          },
        },
      },
    });

    const rootedNodeEntry = session?.nodeEntries.find((nodeEntry) => (
      nodeEntry.depth === 0 && nodeEntry.relatedNode?.isRoot
    ));

    return rootedNodeEntry?.sliderNodeEntry?.value;
  };

  /**
   * Fetches all sessions of dialogue using dialogueId {dialogueId}
   * @param dialogueId
   * @param paginationOpts
   */
  static async fetchSessionsByDialogue(
    dialogueId: string,
    paginationOpts?: Nullable<PaginationProps>,
  ): Promise<Array<Session> | null | undefined> {
    const dialogue = await prisma.dialogue.findUnique({
      where: {
        id: dialogueId,
      },
    });

    const dialougeWithSessionWithEntries = await prisma.dialogue.findUnique({
      where: { id: dialogueId },
      include: {
        sessions: {
          where: {
            AND: [{
              nodeEntries: {
                some: paginationOpts?.searchTerm
                  ? NodeEntryService.constructFindWhereTextNodeEntryFragment(paginationOpts?.searchTerm)
                  : undefined,
              },
            }, {
              createdAt: {
                gte: paginationOpts?.startDate || undefined,
                lte: paginationOpts?.endDate || undefined,
              } || undefined,
            },
            {
              nodeEntries: {
                every: dialogue?.isWithoutGenData ? {
                  inputSource: 'CLIENT',
                } : undefined,
              },
            },
            {
              nodeEntries: {
                some: {
                  sliderNodeEntry: {
                    value: { gt: 0 },
                  },
                },
              },
            }, {}],
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: SessionQueryModel.queryFull.include
        },
      },
    });

    const sessions = dialougeWithSessionWithEntries?.sessions;
    if (!sessions) return [];

    if (!paginationOpts) return sessions;

    // We need to manually sort
    const sortedSessions = SessionService.sortSessions(sessions, paginationOpts);

    return sortedSessions;
  }

  async getSessionConnection(
    dialogueId: string,
    filter?: NexusGenInputs['SessionConnectionFilterInput'] | null
  ): Promise<NexusGenFieldTypes['SessionConnection'] | null> {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.sessionPrismaAdapter.findSessions(dialogueId, filter);
    const totalSessions = await this.sessionPrismaAdapter.countSessions(dialogueId, filter);

    const {
      totalPages, hasPrevPage, hasNextPage, nextPageOffset, pageIndex, prevPageOffset
    } = offsetPaginate(totalSessions, offset, perPage);

    return {
      sessions,
      totalPages,
      pageInfo: {
        hasPrevPage,
        hasNextPage,
        prevPageOffset,
        nextPageOffset,
        pageIndex
      }
    };
  };

  static sortSessions(
    sessions: Session[],
    paginationOpts?: Nullable<PaginationProps>,
  ): Session[] {
    const sessionsWithScores = sessions.map((session) => ({
      score: SessionService.getScoreFromSession(session),
      paths: session.nodeEntries.length,
      ...session,
    }));

    let sorted = sessionsWithScores;
    if (paginationOpts?.orderBy?.[0].by === 'score') {
      sorted = sortBy(sessionsWithScores, 'score');
    } else if (paginationOpts?.orderBy?.[0].by === 'paths') {
      sorted = sortBy(sessionsWithScores, 'paths');
    } else {
      sorted = sortBy(sessionsWithScores, 'createdAt');
    };

    if (paginationOpts?.orderBy?.[0].desc) return sorted.reverse();
    return sorted;
  }


  /**
   * Create session-events
   * @param sessionInput
   */
  async addEventsToSession(sessionId: string, events: NexusGenInputs['SessionEventInput'][]) {
    return this.sessionPrismaAdapter.createSessionEvents(sessionId, events);
  };

  async createEmptyDialogueSession(dialogueId: string) {
    return this.sessionPrismaAdapter.createEmptyDialogueSession(dialogueId);
  }

  /**
   * Create a user-session from the client.
   */
  async deprecatedCreateSession(sessionInput: any) {
    const { dialogueId, entries } = sessionInput;
    const session = await this.sessionPrismaAdapter.createSession({
      device: sessionInput.device || '',
      totalTimeInSec: sessionInput.totalTimeInSec,
      originUrl: sessionInput.originUrl || '',
      entries,
      dialogueId,
    });

    try {
      if (sessionInput.deliveryId) {
        const deliveryUpdate = prisma.delivery.update({
          where: { id: sessionInput.deliveryId },
          data: { currentStatus: 'FINISHED' }
        });

        const deliveryEventCreation = prisma.deliveryEvents.create({
          data: {
            Delivery: { connect: { id: sessionInput.deliveryId } },
            status: 'FINISHED'
          }
        });

        await prisma.$transaction([deliveryUpdate, deliveryEventCreation]);
      }
    } catch (error) {
      Sentry.captureException(error);
    };

    try {
      if (sessionInput.deliveryId) {
        await this.sessionPrismaAdapter.updateDelivery(session.id, sessionInput.deliveryId);
      };
    } catch (error) {
      Sentry.captureException(error);
    };

    try {
      await this.triggerService.tryTriggers(session);
    } catch (error) {
      console.log('Something went wrong while handling sms triggers: ', error);
    };

    return session;
  }

  /**
   * Get text entries from a list of sessions
   * @param sessions
   */
    static getTextEntriesFromSessions(
      sessions: Session[],
    ): (NodeEntryWithTypes | undefined | null)[] {
      if (!sessions.length) {
        return [];
      };

      const textEntries = sessions.flatMap((session) => session.nodeEntries).filter((entry) => {
        const isTextEntry = entry?.relatedNode?.type && TEXT_NODES.includes(entry?.relatedNode?.type);
        return isTextEntry;
      });

      return textEntries;
    }

    /**
     * Get text entries from a single session
     * @param session
     */
    static async getTextEntriesFromSession(
      session: SessionWithEntries,
    ): Promise<NodeEntryWithTypes[] | undefined | null> {
      return session.nodeEntries.filter((entry) => entry?.relatedNode?.type && entry?.relatedNode?.type in TEXT_NODES);
    };
};

export default SessionService;
