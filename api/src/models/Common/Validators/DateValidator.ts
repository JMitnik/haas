import { format, parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const DateValidator = {
  resolveToString: (date: Date) => {
    return format(date, 'dd-MM-yyyy HH:mm');
  },
  resolveFromString: (dateString: string): Date => {
    const formatString = dateString.split(':').length > 1 ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy';
    const dateObject = zonedTimeToUtc(
      parse(dateString, formatString, new Date(),
      ), 'UTC');

    return dateObject;
  },
}
