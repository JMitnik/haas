import {
  NodeEntry, PrismaClient, Session, SessionWhereInput,
} from '@prisma/client';

import { PaginationProps } from '../../types/generic';
import { SessionWithEntries } from './SessionTypes';
// eslint-disable-next-line import/no-cycle
import { SessionCreateInput } from '../../generated/resolver-types';
import { TEXT_NODES } from '../questionnaire/Dialogue';
import NodeEntryService, { NodeEntryWithTypes } from '../node-entry/NodeEntryService';
import TriggerService from '../trigger/TriggerService';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

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
          // TODO: Bring it back
          // create: entries.map((entry: any) => NodeEntryService.constructNodeEntry(entry)),
        },
      },
    });

    try {
      await TriggerService.tryTriggers(entries, ctx.services.triggerSMSService);
    } catch (e) {
      console.log('Something went wrong while handling sms triggers: ', e);
    }

    // TODO: Replace this with email associated to dialogue (or fallback to company)
    const dialogueAgentMail = 'jmitnik@gmail.com';

    // TODO: Roundabout way, needs to be done in Prisma2 better
    const nodeEntries = await SessionService.getSessionEntries(session);
    const questionnaire = await prisma.dialogue.findOne({ where: { id: dialogueId } });

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
  static async getScoringEntriesFromSessions(
    sessions: SessionWithEntries[],
  ): Promise<(NodeEntryWithTypes | undefined | null)[]> {
    if (!sessions.length) {
      return [];
    }

    const entries = Promise.all(sessions.map(async (session) => SessionService.getScoringEntryFromSession(session)));
    return entries;
  }

  /**
   * Get the sole scoring entry a single session.
   * @param session
   */
  static async getScoringEntryFromSession(session: SessionWithEntries): Promise<NodeEntryWithTypes | undefined | null> {
    return session.nodeEntries.find((entry) => entry.slideNodeEntry?.value);
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

    const entries = await Promise.all(
      sessions.map(async (session) => SessionService.getTextEntriesFromSession(session)),
    );

    return entries.flatMap((entry) => entry);
  }

  /**
   * Get text entries from a single session
   * @param session
   */
  static async getTextEntriesFromSession(
    session: SessionWithEntries,
  ): Promise<NodeEntryWithTypes[] | undefined | null> {
    return session.nodeEntries.filter((entry) => entry.type in TEXT_NODES);
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
    paginationArgs?: PaginationProps,
  ): Promise<Array<SessionWithEntries> | null | undefined> {
    // TODO AND IMPORTANT: Will the resolvers for session subchildren get called
    //  if the objects already include the props (aka double work?)
    // - It seems not?

    const dialougeWithSessionWithEntries = await prisma.dialogue.findOne({
      where: {
        id: dialogueId,
      },
      include: {
        sessions: {
          where: {
            createdAt: paginationArgs?.startDate && {
              lte: paginationArgs?.startDate,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: paginationArgs?.offset,
          take: paginationArgs?.limit,
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
            },
          },
        },
      },
    });

    return dialougeWithSessionWithEntries?.sessions || null;
  }

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
