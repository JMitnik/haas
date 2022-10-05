import { Prisma } from '@prisma/client';
import {
  ActionRequestConnectionFilterInput,
  ActionRequestFilterInput,
  AssignUserToActionRequestInput,
} from './ActionRequest.types';

export const buildOrderByQuery = (filter?: ActionRequestConnectionFilterInput) => {
  let orderByQuery: Prisma.ActionRequestOrderByWithRelationInput[] = [];

  if (filter?.orderBy?.by === 'createdAt') {
    orderByQuery.push({
      createdAt: filter.orderBy.desc ? 'desc' : 'asc',
    });
  }

  return orderByQuery;
};

export const buildFindActionRequestsByWorkspaceWhereInput = (
  workspaceId: string,
  userId: string,
  canAccessAllActionables: boolean,
  filter?: ActionRequestConnectionFilterInput
): Prisma.ActionRequestWhereInput => {
  const whereInput: Prisma.ActionRequestWhereInput = {
    dialogue: {
      customerId: workspaceId,
    },
    createdAt: {
      gte: filter?.startDate,
      lte: filter?.endDate,
    },
    isVerified: filter?.isVerified || undefined,
    dialogueId: filter?.dialogueId || undefined,
    requestEmail: filter?.requestEmail,
    assigneeId: filter?.assigneeId
      ? filter?.assigneeId
      : canAccessAllActionables ? undefined : userId,
    issue: filter?.topic ? {
      topic: {
        name: filter?.topic,
      },
    } : undefined,
    status: filter?.status || undefined,
  }

  if (filter?.search) {
    whereInput.AND = {
      OR: [
        {
          assignee: {
            email: {
              mode: 'insensitive',
              contains: filter.search,
            },
          },
        },
        {
          requestEmail: {
            mode: 'insensitive',
            contains: filter.search,
          },
        },
        {
          dialogue: {
            title: {
              mode: 'insensitive',
              contains: filter.search,
            },
          },
        },
        {
          issue: {
            topic: {
              name: {
                mode: 'insensitive',
                contains: filter.search,
              },
            },
          },
        },
      ],
    }
  }
  return whereInput;
};

export const buildFindActionRequestsWhereInput = (
  issueId: string,
  filter?: ActionRequestFilterInput
): Prisma.ActionRequestWhereInput => {
  return {
    issueId,
    createdAt: {
      gte: filter?.startDate,
      lte: filter?.endDate,
    },
    assigneeId: filter?.assigneeId,
    status: filter?.status || undefined,
  }
};

export const buildupdateActionRequestAssignee = (
  input: AssignUserToActionRequestInput
): Prisma.UserUpdateOneWithoutActionRequestsNestedInput => {
  return {
    disconnect: input.assigneeId ? undefined : true,
    connect: input.assigneeId ? {
      id: input.assigneeId,
    } : undefined,
  }
}