import { Prisma } from '@prisma/client';
import { ActionableConnectionFilterInput, ActionableFilterInput, AssignUserToActionableInput } from './Actionable.types';

export const buildOrderByQuery = (filter?: ActionableConnectionFilterInput) => {
  let orderByQuery: Prisma.ActionableOrderByWithRelationInput[] = [];

  if (filter?.orderBy?.by === 'createdAt') {
    orderByQuery.push({
      createdAt: filter.orderBy.desc ? 'desc' : 'asc',
    });
  }

  return orderByQuery;
};

export const buildFindActionablesByWorkspaceWhereInput = (
  workspaceId: string,
  userId: string,
  canAccessAllActionables: boolean,
  filter?: ActionableConnectionFilterInput
): Prisma.ActionableWhereInput => {
  const whereInput: Prisma.ActionableWhereInput = {
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

export const buildFindActionablesWhereInput = (
  issueId: string,
  filter?: ActionableFilterInput
): Prisma.ActionableWhereInput => {
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

export const buildUpdateActionableAssignee = (
  input: AssignUserToActionableInput
): Prisma.UserUpdateOneWithoutActionablesNestedInput => {
  return {
    disconnect: input.assigneeId ? undefined : true,
    connect: input.assigneeId ? {
      id: input.assigneeId,
    } : undefined,
  }
}