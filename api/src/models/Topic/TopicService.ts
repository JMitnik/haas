import { Prisma, PrismaClient } from '@prisma/client';

import { SessionWithEntries } from '../session/SessionTypes';
import SessionService from '../session/SessionService';
import { CustomerService as WorkspaceService } from '../customer/CustomerService';
import { TopicFilterInput, TopicByString } from './Topic.types';

export class TopicService {
  private prisma: PrismaClient;
  private sessionService: SessionService;
  private workspaceService: WorkspaceService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.sessionService = new SessionService(prisma);
    this.workspaceService = new WorkspaceService(prisma);
  }

  private buildSessionFilter(topicFilter?: TopicFilterInput): Prisma.SessionWhereInput {
    let query: Prisma.SessionWhereInput = {};

    if (topicFilter?.topicStrings?.length) {
      query.nodeEntries = {
        some: {
          choiceNodeEntry: {
            value: {
              in: topicFilter.topicStrings,
            },
          },
        },
      };
    }

    if (topicFilter?.relatedSessionScoreLowerThreshold) {
      query.mainScore = {
        lte: topicFilter.relatedSessionScoreLowerThreshold,
      }
    }

    return query;
  }

  /**
   * Count topics and their frequencies for a given topic.
   */
  async countWorkspaceTopics(
    workspaceId: string,
    startDate: Date,
    endDate: Date,
    topicFilter?: TopicFilterInput
  ): Promise<TopicByString> {
    const dialogueIds = (
      await this.workspaceService.getDialogues(workspaceId, topicFilter?.dialogueStrings || undefined)
    ).map(dialogue => dialogue.id);

    // Fetch all sessions for the dialogues.
    const sessions = await this.sessionService.findSessionsForDialogues(
      dialogueIds,
      startDate,
      endDate,
      this.buildSessionFilter(topicFilter),
      { nodeEntries:
        { include:
          { choiceNodeEntry: true, formNodeEntry: { include: {  values: { include: { relatedField: true } }} } },
        },
      }
    ) as unknown as SessionWithEntries[];

    // Calculate all the candidate topic-counts.
    const topicByStatistics = this.sessionService.extractTopics(sessions);

    return topicByStatistics;
  }
}
