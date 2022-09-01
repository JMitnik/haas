import { NexusGenInputs } from '../../generated/nexus';
import { MissingFieldError } from '../Common/Errors/MissingFieldError';
import { DateValidator } from '../Common/Validators/DateValidator';
import { WorkspaceStatisticsFilterInput } from './Workspace.types';

export const WorkspaceStatisticsValidator = {
  resolveFilter(filter?: NexusGenInputs['DialogueStatisticsSummaryFilterInput'] | null): WorkspaceStatisticsFilterInput {
    if (!filter) throw new MissingFieldError('Filter is required.');

    return {
      ...filter,
      startDate: DateValidator.resolveFromString(filter.startDateTime as string),
      endDate: DateValidator.resolveFromString(filter.endDateTime as string),
    }
  }
}
