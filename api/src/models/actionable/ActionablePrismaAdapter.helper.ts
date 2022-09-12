import { Prisma } from '@prisma/client';
import { ActionableFilterInput } from './Actionable.types';

export const buildFindActionablesWhereInput = (
  issueId: string,
  filter?: ActionableFilterInput
): Prisma.ActionableWhereInput => {
  console.log('Filter: ', filter);
  return {
    issueId,
    createdAt: {
      gte: filter?.startDate,
      lte: filter?.endDate,
    },
    assigneeId: filter?.assigneeId,
    status: filter?.status || undefined,
  }
}