import { PrismaClient } from '@prisma/client';

import { SessionWithEntries, TopicCount } from '../session/SessionTypes';
import SessionService from '../session/SessionService';
import { CustomerService as WorkspaceService } from '../customer/CustomerService';

export class TopicService {
  prisma: PrismaClient;
  sessionService: SessionService;
  workspaceService: WorkspaceService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.sessionService = new SessionService(prisma);
    this.workspaceService = new WorkspaceService(prisma);
  }

  /**
   * Count topics and their frequencies for a given topic.
   */
  async countWorkspaceTopics(workspaceId: string, startDate: Date, endDate: Date): Promise<Record<string, TopicCount>> {
    const dialogueIds = (await this.workspaceService.getDialogues(workspaceId)).map(dialogue => dialogue.id);

    // Fetch all sessions for the dialogues.
    const sessions = await this.sessionService.findSessionsForDialogues(dialogueIds, startDate, endDate, {
    }, {
      nodeEntries: { include: { choiceNodeEntry: true } },
    }) as unknown as SessionWithEntries[];

    // Calculate all the candidate topic-counts.
    const topicCounts = this.sessionService.countTopicsFromSessions(sessions);

    return topicCounts;
  }
}
