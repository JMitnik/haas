import { Prisma } from '@prisma/client';
import { ActionableFilterInput, AssignUserToActionableInput } from './Actionable.types';

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