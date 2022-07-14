import { NexusGenFieldTypes, NexusGenInputs } from '../../generated/nexus';

type Modify<T, R> = Omit<T, keyof R> & R;

export type Issue = NexusGenFieldTypes['Issue'];
export type IssueFilterInput = Modify<NexusGenInputs['IssueFilterInput'], {
  startDate: Date;
  endDate: Date;
}>;
