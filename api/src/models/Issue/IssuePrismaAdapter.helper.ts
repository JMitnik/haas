import { Prisma } from '@prisma/client';
import { IssueFilterInput } from './Issue.types';

export const buildFindIssuesWhereInput = (workspaceId: string, filter?: IssueFilterInput): Prisma.IssueWhereInput => {
  return {
    workspaceId,
    actionables: {
      some: {
        createdAt: {
          gte: filter?.startDate,
          lte: filter?.endDate,
        },
      },
    },
    topic: filter?.topicStrings?.length ? {
      name: {
        in: filter?.topicStrings || [],
      },
    } : undefined,
  }
}