import { Prisma } from '@prisma/client';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

export const defaultIssueFields = Prisma.validator<Prisma.IssueArgs>()({
  include: {
    topic: true,
    actionRequests: {
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
      },
    },
  },
})

export type IssueWithActionables = Prisma.IssueGetPayload<typeof defaultIssueFields>;

type Modify<T, R> = Omit<T, keyof R> & R;

export type GetIssueResolverInput = NexusGenInputs['GetIssueResolverInput'];

export type Issue = NexusGenFieldTypes['Issue'];
export type IssueFilterInput = Modify<NexusGenInputs['IssueFilterInput'], {
  startDate: Date;
  endDate: Date;
}>;

export type IssueConnectionFilterInput = NexusGenInputs['IssueConnectionFilterInput'];
