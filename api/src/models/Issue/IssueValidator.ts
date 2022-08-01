import { NexusGenInputs } from '../../generated/nexus';
import { DateValidator } from '../Common/Validators/DateValidator';
import { IssueFilterInput } from './Issue.types';
import { UserInputError } from '../Common/Errors/UserInputError';

export const IssueValidator = {
  resolveFilter: (filter?: NexusGenInputs['IssueFilterInput'] | null): IssueFilterInput => {
    if (!filter) throw new UserInputError('Filter is required.');

    return {
      ...filter,
      startDate: DateValidator.resolveFromString(filter.startDate as string),
      endDate: DateValidator.resolveFromString(filter.endDate as string),
    }
  },
}
