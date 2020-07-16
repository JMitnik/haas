import { subDays } from 'date-fns';

class PaginationService {
  static formatDate(date: string): Date {
    return new Date(date);
  }
}

export default PaginationService;

