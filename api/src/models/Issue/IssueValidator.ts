import { NexusGenInputs } from '../../generated/nexus';
import { DateValidator } from '../Common/Validators/DateValidator';
import { MissingFieldError } from '../Common/Errors/MissingFieldError';
import { IssueConnectionFilterInput, IssueFilterInput } from './Issue.types';

export const IssueValidator = {
  resolveFilter: (filter?: NexusGenInputs['IssueFilterInput'] | null): IssueFilterInput => {
    if (!filter) throw new MissingFieldError('Filter is required.');

    return {
      ...filter,
      startDate: DateValidator.resolveFromString(filter.startDate as string),
      endDate: DateValidator.resolveFromString(filter.endDate as string),
    }
  },
  resolveIssueConnectionFilter: (filter?: NexusGenInputs['IssueConnectionFilterInput'] | null): IssueConnectionFilterInput => {
    if (!filter) throw new MissingFieldError('Filter is required.');

    return {
      ...filter,
      startDate: DateValidator.resolveFromString(filter.startDate as string),
      endDate: DateValidator.resolveFromString(filter.endDate as string),
    }
  },
}
