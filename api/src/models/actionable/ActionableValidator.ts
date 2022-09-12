import { NexusGenInputs } from '../../generated/nexus';
import { DateValidator } from '../Common/Validators/DateValidator';
import { MissingFieldError } from '../Common/Errors/MissingFieldError';
import { ActionableFilterInput } from './Actionable.types';

export const ActionableValidator = {
  resolveFilter: (filter?: NexusGenInputs['ActionableFilterInput'] | null): ActionableFilterInput => {
    if (!filter) throw new MissingFieldError('Filter is required.');

    return {
      ...filter,
      startDate: DateValidator.resolveFromString(filter.startDate as string),
      endDate: DateValidator.resolveFromString(filter.endDate as string),
    }
  },
}