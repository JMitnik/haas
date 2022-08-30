import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const formatSimpleDate = (dateString?: string) => {
  if (!dateString) {
    return 'N/A';
  }
  return format(new Date(dateString), 'd MMM yyyy, HH:mm');
};

export const toUTC = (date: Date): Date => zonedTimeToUtc(date, 'UTC');
