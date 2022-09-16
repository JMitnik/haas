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
  filter?: ActionableFilterInput
): Prisma.ActionableWhereInput => {
  return {
    dialogue: {
      customerId: workspaceId,
    },
    createdAt: {
      gte: filter?.startDate,
      lte: filter?.endDate,
    },
    assigneeId: filter?.assigneeId,
    status: filter?.status || undefined,
  }
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
): Prisma.UserUpdateOneWithoutActionablesInput => {
  return {
    disconnect: input.assigneeId ? undefined : true,
    connect: input.assigneeId ? {
      id: input.assigneeId,
    } : undefined,
  }
}