import {
  NodeEntry, Session, Prisma, PrismaClient, ChoiceNodeEntry, QuestionNode, SliderNodeEntry, VideoNodeEntry,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { sortBy } from 'lodash';
import { addDays, differenceInHours } from 'date-fns';

import { offsetPaginate } from '../general/PaginationHelpers';
import { TEXT_NODES } from '../questionnaire/Dialogue';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';
import NodeEntryService from '../node-entry/NodeEntryService';
import { NodeEntryWithTypes } from '../node-entry/NodeEntryServiceType';
import { Nullable, PaginationProps } from '../../types/generic';
import { SessionActionType, SessionConnection, SessionConnectionFilterInput, SessionWithEntries } from './Session.types';
import { TopicByString, TopicStatistics, TopicStatisticsByDialogueId } from '../Topic/Topic.types';
import TriggerService from '../trigger/TriggerService';
import prisma from '../../config/prisma';
import Sentry from '../../config/sentry';
import SessionPrismaAdapter from './SessionPrismaAdapter';
import AutomationService from '../automations/AutomationService';
import { CustomerService } from '../customer/CustomerService';

class SessionService {
  private sessionPrismaAdapter: SessionPrismaAdapter;
  private triggerService: TriggerService;
  private automationService: AutomationService;
  private workspaceService: CustomerService;

  constructor(prismaClient: PrismaClient) {
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prismaClient);
    this.triggerService = new TriggerService(prismaClient);
    this.automationService = new AutomationService(prismaClient);
    this.workspaceService = new CustomerService(prismaClient);
  };

  /**
   * Given a list of sessions with node-entries, return an object which maps negative dialogue interactions to their "frequency".
   *
   * Note: this can be applied both within a workspace as well as outside.
   *
   * Precondition: Sessions are sorted by createdAt.
   */
  public extractNegativeScoresByDialogue(sessions: SessionWithEntries[]): TopicStatisticsByDialogueId {
    const negativeDialogueScoresExtracted = sessions.reduce((acc, session) => {
      // Only add negative sessions
      if (session.mainScore < 55) {
        // Check if topic exists in acc.
        // If not, create a unique entry for ${dialogueId}
        if (!acc?.hasOwnProperty(session.dialogueId)) {
          acc[session.dialogueId] = this.makeTopicStatistics('', [], session);
          return acc;
        }
        // Else, add negative interaction info to the dialogue.
        acc[session.dialogueId] = {
          dates: [...acc[session.dialogueId].dates, session.createdAt],
          dialogueIds: [],
          count: acc[session.dialogueId].count + 1,
          score: acc[session.dialogueId].score + session.mainScore,
          relatedTopics: [],
          topic: '',
          followUpActions: [...acc[session.dialogueId].followUpActions, this.getActionFromSession(session)],
        };
      }
      return acc;
    }, {} as TopicStatisticsByDialogueId);

    return negativeDialogueScoresExtracted;
  }

  /**
   * Given a list of sessions with node-entries, return an object which maps topics to their "frequency".
   *
   * Note: this can be applied both within a workspace as well as outside.
   *
   * Precondition: Sessions are sorted by createdAt.
   */
  public extractTopics(sessions: SessionWithEntries[]): TopicByString {
    const topicsByString = sessions.reduce((acc, session) => {
      const topics = session.nodeEntries.map(nodeEntry => nodeEntry.choiceNodeEntry?.value).filter(isPresent);

      topics.forEach((topic) => {
        // Check if topic exists in acc.
        // If not, create a unique entry for ${dialogueId}
        if (!acc.hasOwnProperty(topic)) {
          acc[topic] = {
            [session.dialogueId]: this.makeTopicStatistics(topic, topics, session),
          }

          return;
        }

        // Check if topic also check if it exists for this dialogue
        // If not, create a unique entry for dialogue
        if (!acc[topic].hasOwnProperty(session.dialogueId)) {
          acc[topic][session.dialogueId] = this.makeTopicStatistics(topic, topics, session);
          return;
        }

        // Else, add it to the dialogue-topic combination.
        acc[topic][session.dialogueId] = {
          dates: [...acc[topic][session.dialogueId].dates, session.createdAt],
          dialogueIds: [...acc[topic][session.dialogueId].dialogueIds, session.dialogueId],
          count: acc[topic][session.dialogueId].count + 1,
          score: acc[topic][session.dialogueId].score + session.mainScore,
          relatedTopics: [...acc[topic][session.dialogueId].relatedTopics, ...topics],
          topic: topic,
          followUpActions: [...acc[topic][session.dialogueId].followUpActions, this.getActionFromSession(session)],
        }
      });

      return acc;
    }, {} as TopicByString);

    // Normalize the topic counts (by averaging the cumulative `score`)
    Object.entries(topicsByString).forEach(([topic]) => {
      Object.entries(topicsByString[topic]).forEach(([dialogueId, topicStatistics]) => {
        topicsByString[topic][dialogueId].score = topicStatistics.score / topicStatistics.count;
      });
    });

    return topicsByString;
  }

  /**
   * Finds all sessions where all pathEntry answers exist in the session's node entries
   * @param dialogueId
   * @param path
   * @param startDateTime
   * @param endDateTime
   * @returns
   */
  findPathMatchedSessions = async (
    dialogueId: string,
    path: string[],
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false,
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime as Date, 7) : endDateTime;

    const prevStatistics = await this.sessionPrismaAdapter.findPathedSessionsCache(
      dialogueId,
      startDateTime,
      endDateTimeSet,
      path,
    );

    // Only if more than hour difference between last cache entry and now should we update cache
    if (prevStatistics) {
      if (differenceInHours(Date.now(), prevStatistics.updatedAt) == 0 && !refresh) {
        return prevStatistics;
      }
    }

    const pathEntries = path.length ? path.map((entry) => ({
      nodeEntries: {
        some: {
          choiceNodeEntry: {
            value: entry,
          },
        },
      },
    })) : [];

    const pathedSessions = await this.sessionPrismaAdapter.findPathMatchedSessions(
      pathEntries,
      startDateTime,
      endDateTimeSet,
      dialogueId
    );

    // Create a pathed session cache object
    void this.sessionPrismaAdapter.upsertPathedSessionCache(
      prevStatistics?.id || '-1',
      dialogueId,
      startDateTime,
      endDateTimeSet,
      path,
      pathedSessions,
    );

    return {
      path,
      startDateTime: startDateTime as Date,
      endDateTime: endDateTimeSet as Date,
      pathedSessions: pathedSessions || [],
    };;
  }

  /**
   * Finds all relevant node entries based on session IDs and (optionally) depth
   * @param sessionIds a list of session Ids
   * @param depth OPTIONAL: a number to fetch a specific depth layer
   * @returns a list of node entries
   */
  findNodeEntriesBySessionIds = async (sessionIds: string[], depth?: number) => {
    return this.sessionPrismaAdapter.findNodeEntriesBySessionIds(sessionIds, depth);
  }

  /**
   * Gets all sessions for all dialogues, between certain dates
   */
  findSessionsForDialogues = async (
    dialogueIds: string[],
    startDateTime: Date,
    endDateTime: Date,
    where?: Prisma.SessionWhereInput,
    include?: Prisma.SessionInclude
  ) => {
    return this.sessionPrismaAdapter.prisma.session.findMany({
      include: include ? { ...include } : undefined,
      where: {
        dialogueId: {
          in: dialogueIds,
        },
        createdAt: {
          gte: startDateTime,
          lte: endDateTime,
        },
        ...where,
      },
    });
  }

  /**
   * Finds all sessions of a dialogue based on performance treshold
   * @param dialogueId the ID of a dialogue
   * @param startDateTime the start date from when sessions should be found
   * @param endDateTime the end date until sessions should be found
   * @param performanceThreshold the treshold until where sessions should be filtered out
   * @returns a list of sessions
   */
  findSessionsBetweenDates = async (
    dialogueId: string,
    startDateTime: Date,
    endDateTime: Date,
    performanceThreshold?: number
  ) => {
    return this.sessionPrismaAdapter.findSessionsBetweenDates(
      dialogueId,
      startDateTime,
      endDateTime,
      performanceThreshold
    );
  }

  /**
  * Finds single session by passed ID.
  * */
  findSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionPrismaAdapter.findSessionById(sessionId);
  };

  /**
  * Create a user-session from the client.
  */
  async createSession(sessionInput: any) {
    const { dialogueId, entries } = sessionInput;
    const sliderNode = entries.find((entry: any) => entry?.data?.slider && entry?.depth === 0);
    const mainScore = sliderNode?.data?.slider?.value;
    const session = await this.sessionPrismaAdapter.createSession({
      device: sessionInput.device || '',
      totalTimeInSec: sessionInput.totalTimeInSec,
      originUrl: sessionInput.originUrl || '',
      entries,
      dialogueId,
      createdAt: sessionInput?.createdAt,
      mainScore,
    });

    try {
      if (sessionInput.deliveryId) {
        const deliveryUpdate = prisma.delivery.update({
          where: { id: sessionInput.deliveryId },
          data: { currentStatus: 'FINISHED' },
        });

        const deliveryEventCreation = prisma.deliveryEvents.create({
          data: {
            Delivery: { connect: { id: sessionInput.deliveryId } },
            status: 'FINISHED',
          },
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

    try {
      await this.automationService.handleTriggerAutomations(dialogueId);
    } catch (error) {
      console.log('Something went wrong checking automation triggers: ', error);
    }

    return session;
  }

  /**
  * Get scoring entries from a list of sessions.
  * @param sessions
  */
  static getScoringEntriesFromSessions(
    sessions: (Session & {
      nodeEntries: (NodeEntry & {
        choiceNodeEntry: ChoiceNodeEntry | null;
        sliderNodeEntry: SliderNodeEntry | null;
        relatedNode: QuestionNode | null;
        videoNodeEntry: VideoNodeEntry | null;
      })[];
    })[],
  ) {
    if (!sessions.length) return [];

    const entries = sessions.map((session) => SessionService.getScoringEntryFromSession(session));
    const nonNullEntries = entries.filter(isPresent);

    return nonNullEntries;
  }

  /**
  * Get the sole scoring entry a single session.
  * @param session
  */
  static getScoringEntryFromSession(session: (Session & {
    nodeEntries: (NodeEntry & {
      choiceNodeEntry: ChoiceNodeEntry | null;
      sliderNodeEntry: SliderNodeEntry | null;
      relatedNode: QuestionNode | null;
      videoNodeEntry: VideoNodeEntry | null;
    })[];
  })) {
    return session.nodeEntries.find((entry) => entry.sliderNodeEntry?.value) || null;
  };

  static getScoreFromSession(session: (Session & {
    nodeEntries: (NodeEntry & {
      choiceNodeEntry: ChoiceNodeEntry | null;
      sliderNodeEntry: SliderNodeEntry | null;
      relatedNode: QuestionNode | null;
      videoNodeEntry: VideoNodeEntry | null;
    })[];
  })): number | null {
    const entry = SessionService.getScoringEntryFromSession(session);

    return entry?.sliderNodeEntry?.value || null;
  };

  /**
  * Get text entries from a list of sessions
  * @param sessions
  */
  static getTextEntriesFromSessions(
    sessions: (Session & {
      nodeEntries: (NodeEntry & {
        choiceNodeEntry: ChoiceNodeEntry | null;
        sliderNodeEntry: SliderNodeEntry | null;
        relatedNode: QuestionNode | null;
        videoNodeEntry: VideoNodeEntry | null;
      })[];
    })[],
  ) {
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

  static formatOrderBy(orderByArray?: NexusGenInputs['PaginationSortInput'][]): (Prisma.SessionOrderByWithRelationInput | undefined) {
    if (!orderByArray?.length) return undefined;

    const orderBy = orderByArray[0];

    return {
      id: orderBy.by === 'id' ? orderBy.desc ? 'desc' : 'asc' : undefined,
      createdAt: orderBy.by === 'createdAt' ? orderBy.desc ? 'desc' : 'asc' : undefined,
    };
  };

  /**
  * Fetches all sessions of dialogue using dialogueId {dialogueId}
  * @param dialogueId
  * @param paginationOpts
  */
  static async fetchSessionsByDialogue(
    dialogueId: string,
    paginationOpts?: Nullable<PaginationProps>,
    take?: number | null,
  ) {
    const sessions = await prisma.session.findMany({
      take: take || undefined,
      where: {
        dialogueId,
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
        ],
      },
      include: {
        nodeEntries: {
          include: {
            choiceNodeEntry: true,
            sliderNodeEntry: true,
            relatedNode: true,
            videoNodeEntry: true,
          },
          orderBy: {
            depth: 'asc',
          },
        },
      },

    })

    if (!paginationOpts) return sessions;

    // We need to manually sort
    const sortedSessions = SessionService.sortSessions(sessions, paginationOpts);

    return sortedSessions;
  }

  static sortSessions(
    sessions: (Session & {
      nodeEntries: (NodeEntry & {
        choiceNodeEntry: ChoiceNodeEntry | null;
        sliderNodeEntry: SliderNodeEntry | null;
        relatedNode: QuestionNode | null;
        videoNodeEntry: VideoNodeEntry | null;
      })[];
    })[],
    paginationOpts?: Nullable<PaginationProps>,
  ) {
    const sessionsWithScores = sessions.map((session) => ({
      score: session.mainScore,
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
   * Finds a subset of workspace-wide sessions based on a filter.
   * @param workspaceId
   * @param filter
   * @returns a list of sessions
   */
  getWorkspaceSessionConnection = async (
    workspaceId: string,
    filter?: SessionConnectionFilterInput | null
  ): Promise<SessionConnection | null> => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;
    let dialogueIds = filter?.dialogueIds;

    if (!dialogueIds?.length) {
      const dialogues = await this.workspaceService.getDialogues(workspaceId);
      dialogueIds = dialogues.map((dialogue) => dialogue.id);
    }

    const sessions = await this.sessionPrismaAdapter.findWorkspaceSessions(dialogueIds, filter);

    const sessionWithFollowUpAction = sessions.map((session) => {
      const followUpAction = session.nodeEntries.find((nodeEntry) => nodeEntry.formNodeEntry);

      return { ...session, followUpAction: followUpAction?.formNodeEntry || null };
    });

    const totalSessions = await this.sessionPrismaAdapter.countWorkspaceSessions(dialogueIds, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalSessions, offset, perPage);

    return {
      sessions: sessionWithFollowUpAction,
      totalPages,
      pageInfo,
    };
  };


  getSessionConnection = async (
    dialogueId: string,
    filter?: SessionConnectionFilterInput | null
  ): Promise<NexusGenFieldTypes['SessionConnection'] | null> => {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const sessions = await this.sessionPrismaAdapter.findSessions(dialogueId, filter);
    const totalSessions = await this.sessionPrismaAdapter.countSessions(dialogueId, filter);

    const {
      totalPages, hasPrevPage, hasNextPage, nextPageOffset, pageIndex, prevPageOffset,
    } = offsetPaginate(totalSessions, offset, perPage);

    return {
      sessions,
      totalPages,
      pageInfo: {
        hasPrevPage,
        hasNextPage,
        prevPageOffset,
        nextPageOffset,
        pageIndex,
      },
    };
  };

  static async getSessionEntries(session: Session): Promise<NodeEntry[] | []> {
    const sessionWithEntries = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        nodeEntries: {
          include: {
            choiceNodeEntry: true,
            formNodeEntry: {
              include: {
                values: {
                  include: { relatedField: true },
                },
              },
            },
            linkNodeEntry: true,
            registrationNodeEntry: true,
            sliderNodeEntry: true,
            textboxNodeEntry: true,
            relatedNode: true,
            relatedEdge: true,
          },
        },
      },
    });

    return sessionWithEntries?.nodeEntries || [];
  }

  // TODO: Make Utils script
  static constructDateRangeWhereInput(startDate?: Date, endDate?: Date): Prisma.SessionWhereInput[] | [] {
    let dateRange: Prisma.SessionWhereInput[] | [] = [];

    if (startDate && !endDate) {
      dateRange = [
        { createdAt: { gte: startDate } },
      ];
    } else if (!startDate && endDate) {
      dateRange = [
        { createdAt: { lte: endDate } },
      ];
    } else if (startDate && endDate) {
      dateRange = [
        { createdAt: { gte: startDate } },
        { createdAt: { lte: endDate } },
      ];
    };

    return dateRange;
  };

  /**
   * Get the action a Session requires.
   * @param session Session with node-entries
   * @returns Which type the session alludes to
   */
  private getActionFromSession(session: SessionWithEntries): SessionActionType | null {
    const contactAction = session.nodeEntries.find((nodeEntry) => (
      nodeEntry.formNodeEntry?.values.find(
        (val) => !!val.email || !!val.phoneNumber || !!val.shortText
      )
    ));

    if (contactAction) return 'CONTACT';

    return null;
  }

  /**
   * Converts a session with topic-string to TopicStatistics
   * @param topicName
   * @param relatedTopics
   * @param session
   * @returns
   */
  private makeTopicStatistics(
    topicName: string,
    relatedTopics: string[],
    session: SessionWithEntries
  ): TopicStatistics {
    return {
      count: 1,
      dates: [session.createdAt],
      dialogueIds: [],
      relatedTopics: relatedTopics,
      score: session.mainScore,
      topic: topicName,
      followUpActions: [this.getActionFromSession(session)],
    };
  }
};

export default SessionService;
