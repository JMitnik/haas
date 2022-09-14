import { Prisma } from '@prisma/client';
import { IssueConnectionFilterInput, IssueFilterInput } from './Issue.types';

export const buildOrderByQuery = (filter: IssueConnectionFilterInput) => {
  let orderByQuery: Prisma.IssueOrderByWithRelationInput[] = [];

  if (filter?.orderBy?.by === 'issue') {
    orderByQuery.push({
      topic: {
        name: filter.orderBy.desc ? 'desc' : 'asc',
      },
    });
  }

  return orderByQuery;
};

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