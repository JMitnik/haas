import { Prisma } from '@prisma/client';
import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

const issue = Prisma.validator<Prisma.IssueArgs>()({
  include: {
    topic: true,
    actionables: {
      include: {
        assignee: true,
        comments: true,
        dialogue: true,
        session: true,
      },
    },
  },
})

export type IssueWithActionables = Prisma.IssueGetPayload<typeof issue>;

type Modify<T, R> = Omit<T, keyof R> & R;

export type GetIssueResolverInput = NexusGenInputs['GetIssueResolverInput'];

export type Issue = NexusGenFieldTypes['Issue'];
export type IssueFilterInput = Modify<NexusGenInputs['IssueFilterInput'], {
  startDate: Date;
  endDate: Date;
}>;
