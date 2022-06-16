import { zonedTimeToUtc } from 'date-fns-tz';

export const toUTC = (date: Date): Date => zonedTimeToUtc(date, 'UTC');
