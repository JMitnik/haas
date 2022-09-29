import { PrismaClient } from 'prisma/prisma-client';

import { convertDatesToHistogramItems } from '../Common/Analytics/Analytics.helpers';
import { DateHistogram } from '../Common/Analytics/Analytics.types';
import SessionPrismaAdapter from '../session/SessionPrismaAdapter';
import { WorkspaceStatisticsFilterInput } from './Workspace.types';

export class WorkspaceStatisticsService {
  private sessionPrismaAdapter: SessionPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.sessionPrismaAdapter = new SessionPrismaAdapter(prisma);
  }

  /**
   * Calculate or retrieve the histogram of a workspace's responses.
   */
  public async getResponseHistogram(
    workspaceId: string,
    filter: WorkspaceStatisticsFilterInput
  ): Promise<DateHistogram> {
    const sessions = await this.sessionPrismaAdapter.findCustomerSessions(
      workspaceId,
      filter.startDate,
      filter.endDate
    );

    const items = convertDatesToHistogramItems(sessions.map(session => session.createdAt)).map(item => ({
      ...item,
      id: `response-hist-${item.id}`,
    }));

    return {
      id: `${workspaceId}-histogram`,
      items,
    };
  }

  /**
   * Calculate or retrieve the histogram of an issue's response.
   */
  public async getIssueHistogram(
    workspaceId: string,
    filter: WorkspaceStatisticsFilterInput
  ): Promise<DateHistogram> {
    const sessions = await this.sessionPrismaAdapter.findCustomerSessions(
      workspaceId,
      filter.startDate,
      filter.endDate
    );

    const problemSessions = sessions.filter(session => session.mainScore <= 55);

    const items = convertDatesToHistogramItems(problemSessions.map(session => session.createdAt)).map(item => ({
      ...item,
      id: `issue-hist-${item.id}`,
    }));

    return {
      id: `${workspaceId}-issue-histogram`,
      items,
    };
  }
}
