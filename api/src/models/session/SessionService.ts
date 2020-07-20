import {
  NodeEntry, PrismaClient, Session, SessionWhereInput,
} from '@prisma/client';
import { isDefined, isFilled, isPresent } from 'ts-is-present';

import { Nullable, PaginationProps, notEmpty } from '../../types/generic';
import { SessionWithEntries } from './SessionTypes';
// eslint-disable-next-line import/no-cycle
import { TEXT_NODES } from '../questionnaire/Dialogue';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle
import { NexusGenRootTypes } from '../../generated/nexus';
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
// eslint-disable-next-line import/no-cycle
import TriggerService from '../trigger/TriggerService';
import prisma from '../../prisma';

// TODO: Rename Session to Interaction
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
    });

    try {
      await TriggerService.tryTriggers(entries, ctx.services.triggerSMSService);
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
    if (!sessions.length) {
      return [];
    }

    const entries = sessions.map((session) => SessionService.getScoringEntryFromSession(session));
    const nonNullEntries = entries.filter(isPresent);

    return nonNullEntries;
  }

  /**
   * Get the sole scoring entry a single session.
   * @param session
   */
  static getScoringEntryFromSession(session: SessionWithEntries): NodeEntryWithTypes | null {
    return session.nodeEntries.find((entry) => entry.slideNodeEntry?.value) || null;
  }

  /**
   * Get text entries from a list of sessions
   * @param sessions
   */
  static async getTextEntriesFromSessions(
    sessions: SessionWithEntries[],
  ): Promise<(NodeEntryWithTypes | undefined | null)[]> {
    if (!sessions.length) {
      return [];
    }

    return sessions.flatMap((session) => session.nodeEntries).filter((entry) => {
      const isTextEntry = entry?.relatedNode?.type && entry?.relatedNode?.type in TEXT_NODES;
      return isTextEntry;
    });
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

  /**
   * Fetches all sessions of dialogue using dialogueId {dialogueId}
   * @param dialogueId
   * @param paginationArgs
   */
  static async getDialogueSessions(
    dialogueId: string,
    paginationArgs?: Nullable<PaginationProps>,
  ): Promise<Array<SessionWithEntries> | null | undefined> {
    // TODO AND IMPORTANT: Will the resolvers for session subchildren get called
    //  if the objects already include the props (aka double work?)
    // - It seems not?

    // TODO: Only include node entries if it is required

    const dialougeWithSessionWithEntries = await prisma.dialogue.findOne({
      where: {
        id: dialogueId,
      },
      include: {
        sessions: {
          where: {
            AND: [{
              nodeEntries: {
                some: paginationArgs?.searchTerm
                  ? NodeEntryService.constructFindWhereTextNodeEntryFragment(paginationArgs?.searchTerm)
                  : undefined,
              },
            }, {
              createdAt: (paginationArgs?.startDate && {
                lte: paginationArgs?.startDate,
              }) || undefined,
            }],
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: paginationArgs?.offset || undefined,
          take: paginationArgs?.limit || undefined,
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

    return dialougeWithSessionWithEntries?.sessions || null;
  }

  static getSessionConnection = async (
    dialogueId: string,
    paginationArgs?: Nullable<PaginationProps>,
  ): Promise<NexusGenRootTypes['SessionConnection']> => {
    // TODO: Do we need this?
    // const needPageReset = false;

    const sessions = await SessionService.getDialogueSessions(dialogueId, paginationArgs);
    const totalNrOfSessions = (await SessionService.getDialogueSessions(dialogueId))?.length;

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

    const totalPages = paginationArgs?.limit ? Math.ceil(totalNrOfSessions / paginationArgs?.limit) : 1;

    // If search term, filter out grouped representations which don't have
    // at least on`e entry which fits criteria and calculate new # of pages

    // Set offset to 0
    // If due to filters option current queried page doesn't exist (e.g. page 3/2),
    // query first subset (offset = 0 -> limit) and set pageIndex to 0
    // TODO: Test if necessary
    // if (pageIndex && pageIndex + 1 > totalPages) {
    //   offset = 0;
    //   needPageReset = true;
    // }

    // Slice / Select X entries
    // TODO: Test if necessary
    // const pageNodeEntries = NodeEntryService.sliceNodeEntries(
    //   orderedNodeEntriesScore, (offset || 0), (limit || 0), (pageIndex || 0),
    // );

    const sessionsWithScores = sessions.map((session) => ({
      ...session,
      score: SessionService.getScoringEntryFromSession(session)?.slideNodeEntry?.value,
      paths: session.nodeEntries.length,
    }));

    // TODO: Type-hint this
    const pageInfo: NexusGenRootTypes['PaginationPageInfo'] = {
      nrPages: totalPages || 1,
      pageIndex: paginationArgs?.pageIndex || 1,
    };

    return {
      sessions: sessionsWithScores,
      offset: paginationArgs?.offset || 0,
      limit: paginationArgs?.limit || 0,
      startDate: paginationArgs?.startDate?.toString(),
      endDate: paginationArgs?.endDate?.toString(),
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
