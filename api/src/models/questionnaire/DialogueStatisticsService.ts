import { DialogueImpactScore, PrismaClient, Session } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { mean } from 'lodash';

import SessionService from '../session/SessionService';
import NodeService from '../QuestionNode/NodeService';
import DialoguePrismaAdapter from './DialoguePrismaAdapter';

class DialogueStatisticsService {
  dialoguePrismaAdapter: DialoguePrismaAdapter;
  nodeService: NodeService;
  sessionService: SessionService;

  constructor(prismaClient: PrismaClient) {
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prismaClient);
    this.nodeService = new NodeService(prismaClient);
    this.sessionService = new SessionService(prismaClient);
  }

  /**
   * Finds sessions and number of votes based on provided start/end date
   * @param dialogueId 
   * @param startDateTime 
   * @param endDateTime 
   * @param refetch Boolean - if set to true will update cached version within database 
   * @returns 
   */
  initiateDialogueStatisticsSummary = async (
    dialogueId: string,
    startDateTime?: string,
    endDateTime?: string,
    refetch: boolean = false
  ) => {
    const scopedSessions = await this.sessionService.findScopedSessions(dialogueId, startDateTime, endDateTime);

    return { sessions: scopedSessions, nrVotes: scopedSessions.length };
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

}

export default DialogueStatisticsService;
