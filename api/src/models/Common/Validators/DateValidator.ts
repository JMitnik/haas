import { format, parse } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const DateValidator = {
  resolveToString: (date: Date) => {
    return format(date, 'dd-MM-yyyy HH:mm');
  },
  resolveFromString: (dateString: string): Date => {
    try {
      const date = new Date(Date.parse(dateString));
      const isoString = date.toISOString() === dateString;

      if (isoString) {
        return date;
      }
    } catch (error) {

    }

    let formatString = dateString.split(':').length > 1 ? 'dd-MM-yyyy HH:mm' : 'dd-MM-yyyy';
    const dateObject = zonedTimeToUtc(parse(dateString, formatString, new Date()), 'UTC');

    return dateObject;
  },
}
