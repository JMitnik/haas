import { parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const DateValidator = {
  resolveFromString: (dateString: string): Date => {
    const formatString = dateString.split(':').length > 1 ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy';
    const dateObject = zonedTimeToUtc(
      parse(dateString, formatString, new Date(),
      ), 'UTC');

    return dateObject;
  },
}
