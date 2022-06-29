import { PrismaClient } from '@prisma/client';

import { TopicByStatistics } from '../Topic/Topic.types';
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
  public async getWorkspaceIssues(workspaceId: string, filter: IssueFilterInput): Promise<Issue[]> {
    const topics = await this.topicService.countWorkspaceTopics(workspaceId, filter.startDate, filter.endDate, filter);

    // Filter out topics that are candidate issues.

    return [];
  }

  private extractIssues(topics: TopicByStatistics): Issue[] {
    let issues: Issue[] = [];

    Object.entries(topics).filter(([topic, stats]) => {
      if (stats.score > 50) return false;

      stats.

        issues.push({

        })
    });
  }
}
