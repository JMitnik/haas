/* eslint-disable import/no-cycle */
import {
  NodeEntry, Session, SessionOrderByInput, SessionWhereInput,
} from '@prisma/client';
import { isPresent } from 'ts-is-present';

import { sortBy } from 'lodash';
import { Nullable, PaginationProps } from '../../types/generic';
import { SessionWithEntries } from './SessionTypes';
// eslint-disable-next-line import/no-cycle
import { TEXT_NODES } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { NexusGenInputs, NexusGenRootTypes } from '../../generated/nexus';
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
// eslint-disable-next-line import/no-cycle
import PaginationService from '../general/PaginationService';
import TriggerService from '../trigger/TriggerService';
import prisma from '../../config/prisma';

class SessionService {
  /**
   * Create a user-session from the client
   * @param obj
   * @param args
   * @param ctx
   */
  static async createSession(sessionInput: any, ctx: any) {
    const { dialogueId, entries } = sessionInput;

    const session = await prisma.session.create({
      data: {
        dialogue: {
          connect: { id: dialogueId },
        },
        nodeEntries: {
          create: entries.map((entry: any) => NodeEntryService.constructCreateNodeEntryFragment(entry)),
        },
      },
      include: {
        nodeEntries: {
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

    try {
      await TriggerService.tryTriggers(session.nodeEntries, ctx.services.triggerSMSService);
    } catch (e) {
      console.log('Something went wrong while handling sms triggers: ', e);
    }

    // TODO: Replace this with email associated to dialogue (or fallback to company)
    // const dialogueAgentMail = 'jmitnik@gmail.com';

    // // TODO: Roundabout way, needs to be done in Prisma2 better
    // const nodeEntries = await SessionService.getSessionEntries(session);
    // const questionnaire = await prisma.dialogue.findOne({ where: { id: dialogueId } });

    // ctx.services.triggerMailService.sendTrigger({
    //   to: dialogueAgentMail,
    //   userSession: {
    //     id: session.id,
    //     nodeEntries,
    //     questionnaire,
    //   },
    // });

    return session;
  }

  /**
   * Get scoring entries from a list of sessions
   * @param sessions
   */
  static getScoringEntriesFromSessions(
    sessions: SessionWithEntries[],
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
  }

  static getScoreFromSession(session: SessionWithEntries): number | null {
    const entry = SessionService.getScoringEntryFromSession(session);

    return entry?.sliderNodeEntry?.value || null;
  }

  /**
   * Get text entries from a list of sessions
   * @param sessions
   */
  static getTextEntriesFromSessions(
    sessions: SessionWithEntries[],
  ): (NodeEntryWithTypes | undefined | null)[] {
    if (!sessions.length) {
      return [];
    }

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
  }

  static async getSessionScore(sessionId: string): Promise<number | undefined | null> {
    const session = await prisma.session.findOne({
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
  }

  static formatOrderBy(orderByArray?: NexusGenInputs['PaginationSortInput'][]): (SessionOrderByInput|undefined) {
    if (!orderByArray?.length) return undefined;

    const orderBy = orderByArray[0];

    return {
      id: orderBy.by === 'id' ? orderBy.desc ? 'desc' : 'asc' : undefined,
      createdAt: orderBy.by === 'createdAt' ? orderBy.desc ? 'desc' : 'asc' : undefined,
      // dialogueId: orderBy.by === 'dialogueId' ? orderBy.desc ? 'desc' : 'asc' : undefined,
    };
  }

  /**
   * Fetches all sessions of dialogue using dialogueId {dialogueId}
   * @param dialogueId
   * @param paginationOpts
   */
  static async fetchSessionsByDialogue(
    dialogueId: string,
    paginationOpts?: Nullable<PaginationProps>,
  ): Promise<Array<SessionWithEntries> | null | undefined> {
    const dialougeWithSessionWithEntries = await prisma.dialogue.findOne({
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
                some: {
                  sliderNodeEntry: {
                    value: { gt: 0 },
                  },
                },
              },
            }],
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            nodeEntries: {
              include: {
                choiceNodeEntry: true,
                linkNodeEntry: true,
                registrationNodeEntry: true,
                sliderNodeEntry: true,
                textboxNodeEntry: true,
                relatedNode: true,
              },
              orderBy: {
                depth: 'asc',
              },
            },
          },
        },
      },
    });

    const sessions = dialougeWithSessionWithEntries?.sessions;
    if (!sessions) return [];

    if (!paginationOpts) return sessions;

    // We need to manually sort and slice it due to lack of support for aggregated sorts.
    const sortedSessions = SessionService.sortSessions(sessions, paginationOpts);
    const slicedSessions = PaginationService.getItemsByIndex(
      sortedSessions,
      paginationOpts?.offset || 0,
      paginationOpts?.limit || undefined,
      paginationOpts?.pageIndex || 0,
    );

    return slicedSessions;
  }

  static sortSessions(
    sessions: SessionWithEntries[],
    paginationOpts?: Nullable<PaginationProps>,
  ): SessionWithEntries[] {
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
    }

    if (paginationOpts?.orderBy?.[0].desc) return sorted.reverse();

    return sorted;
  }

  static getSessionConnection = async (
    dialogueId: string,
    paginationOpts?: Nullable<PaginationProps>,
  ): Promise<NexusGenRootTypes['SessionConnection']> => {
    // TODO: Do we need this?
    // const needPageReset = false;
    const sessions = await SessionService.fetchSessionsByDialogue(dialogueId, paginationOpts);
    const totalNrOfSessions = (await SessionService.fetchSessionsByDialogue(dialogueId, {
      searchTerm: paginationOpts?.searchTerm,
      startDate: paginationOpts?.startDate,
      endDate: paginationOpts?.endDate,
    }))?.length;

    if (totalNrOfSessions === undefined) {
      throw new Error('Unable to get total nr of Sessions, something went wrong');
    }

    if (!sessions?.length) {
      return {
        sessions: [],
        limit: 0,
        offset: 0,
        startDate: null,
        pageInfo: {
          pageIndex: 0,
          nrPages: 0,
        },
      };
    }

    const totalPages = paginationOpts?.limit ? Math.ceil(totalNrOfSessions / paginationOpts?.limit) : 1;

    const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
      nrPages: totalPages || 1,
      pageIndex: (paginationOpts?.pageIndex !== undefined && paginationOpts?.pageIndex !== null)
        ? paginationOpts.pageIndex : 0,
    };

    return {
      sessions,
      offset: paginationOpts?.offset || 0,
      limit: paginationOpts?.limit || 0,
      startDate: paginationOpts?.startDate?.toString(),
      endDate: paginationOpts?.endDate?.toString(),
      pageInfo,
    };
  };

  static async getSessionEntries(session: Session): Promise<NodeEntry[] | []> {
    const sessionWithEntries = await prisma.session.findOne({
      where: { id: session.id },
      include: {
        nodeEntries: {
          include: {
            choiceNodeEntry: true,
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
  static constructDateRangeWhereInput(startDate?: Date, endDate?: Date): SessionWhereInput[] | [] {
    let dateRange: SessionWhereInput[] | [] = [];

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
    }

    return dateRange;
  }
}

export default SessionService;
