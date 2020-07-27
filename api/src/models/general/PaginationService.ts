import { subDays } from 'date-fns';

import { NexusGenInputs } from '../../generated/nexus';

class PaginationService {
  static formatDate(date: string): Date {
    return new Date(date);
  }

  static formatOrderBy(orderByArray: NexusGenInputs['PaginationSortInput'][]) {
    if (orderByArray.length) return orderByArray[0];

    return undefined;
  }
}

export default PaginationService;

