import { PrismaClient } from '@prisma/client';

import { TopicService } from '../Topic/TopicService';
import { Issue, IssueFilterInput } from './Issue.types';

export class IssueService {
  private prisma: PrismaClient;
  private topicService: TopicService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.topicService = new TopicService(prisma);
  }

  /**
   * Retrieves all workspace issues. This can be filtered, based on the required filter (startDate, endDate).
   * @param workspaceId Workspace ID
   */
  async getWorkspaceIssues(workspaceId: string, filter: IssueFilterInput): Promise<Issue[]> {
    const topics = await this.topicService.countWorkspaceTopics(workspaceId, filter.startDate, filter.endDate, filter);

    console.log({ topics });
    return [];
  }
}
