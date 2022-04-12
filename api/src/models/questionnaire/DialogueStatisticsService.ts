import { DialogueImpactScore, NodeEntry, PrismaClient, Session, SliderNodeEntry } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { mean, meanBy } from 'lodash';

import SessionService from '../session/SessionService';
import NodeService from '../QuestionNode/NodeService';
import DialoguePrismaAdapter from './DialoguePrismaAdapter';
import { addDays, differenceInHours } from 'date-fns';

class DialogueStatisticsService {
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  sessionService: SessionService;
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.sessionService = new SessionService(prismaClient);
    this.prisma = prismaClient;
  }

  /**
   * Finds sessions and number of votes based on provided start/end date
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @param refresh Boolean - if set to true will update cached version within database 
   * @returns 
   */
  initiate = async (
    dialogueId: string,
    type: DialogueImpactScore,
    startDateTime: Date,
    endDateTime?: Date,
    refresh: boolean = false
  ) => {
    const endDateTimeSet = !endDateTime ? addDays(startDateTime, 7) : endDateTime;

    const prevStatistics = await this.dialoguePrismaAdapter.findDialogueStatisticsSummaryByDialogueId(
      dialogueId,
      startDateTime,
      endDateTimeSet,
      type,
    );

    // Only if more than hour difference between last cache entry and now should we update cache
    if (prevStatistics) {
      if (differenceInHours(Date.now(), prevStatistics.updatedAt) == 0 && !refresh) return prevStatistics;
    }

    const scopedSessions = await this.sessionService.findSessionsBetweenDates(
      dialogueId,
      startDateTime,
      endDateTimeSet
    );

    const impactScore = await this.calculateImpactScore(type, scopedSessions);

    const statisticsSummary = await this.dialoguePrismaAdapter.upsertDialogueStatisticsSummary(
      prevStatistics?.id || '-1',
      {
        dialogueId: dialogueId,
        impactScore: impactScore || 0,
        nrVotes: scopedSessions.length,
        impactScoreType: type,
        startDateTime: startDateTime,
        endDateTime: endDateTimeSet,
      });

    return statisticsSummary;
  }

  /**
   * Calculates impact score of a list of sessions
   * @param type an impact score type 
   * @param sessions a list of sessions
   * @returns an impact score or null if no sessions/type are provided
   */
  calculateImpactScore = async (type: DialogueImpactScore, sessions: Session[]) => {
    switch (type) {
      case DialogueImpactScore.AVERAGE:
        const sessionIds = sessions.map((session) => session.id);
        const nodeEntries = await this.sessionService.findNodeEntriesBySessionIds(sessionIds, 0);
        const sliderValues = nodeEntries.map((entry) => entry.sliderNodeEntry?.value).filter(isPresent);
        const average = mean(sliderValues);
        return average;

      default:
        return null;
    }
  }

  calculateNodeEntriesImpactScore = (
    type: DialogueImpactScore,
    nodeEntries: (NodeEntry & {
      sliderNodeEntry: SliderNodeEntry | null;
      session: {
        dialogueId: string;
      } | null;
    })[]
  ) => {
    switch (type) {
      case DialogueImpactScore.AVERAGE:
        const average = meanBy(nodeEntries, (entry) => entry?.sliderNodeEntry?.value);
        return average;

      default:
        return 0;
    }
  }

}

export default DialogueStatisticsService;
