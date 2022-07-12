import { format as dateFormat, isValid, parse, startOfWeek, sub } from 'date-fns';
import { format as tzFormat, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
  /** Example: Monday, June 16th */
  HumanGlobalWeekDayFormat = 'EEEE, MMMM do',

  /** Example: Monday 16 July, 20:00 */
  HumanDateTime = 'EEEE do, HH:mm',

  /** Example: Monday 16 July, 20:00 (GMT+1) */
  HumanMonthDateTimeUTC = "EEEE do 'of' LLLL, 'at' HH:mm '('zzzz')'",

  /** Example: Monday 16 July, 20:00 */
  HumanMonthDateTime = "EEEE do 'of' LLLL, 'at' HH:mm",
}

const formatInTimeZone = (date: Date, format: DateFormat, tz: string) => tzFormat(utcToZonedTime(date, tz),
  format,
  { timeZone: tz });

export const useDate = () => ({
  isValid: (date: Date) => isValid(date),
  parse: (date: string, format: DateFormat) => parse(date, format, new Date()),
  parseRangeString: (date: string, format: DateFormat) => {
    const [start, end] = date.split(' - ');
    return [parse(start, format, new Date()), parse(end, format, new Date())];
  },
  format: (date: Date, format: DateFormat = DateFormat.DayFormat) => {
    try {
      return dateFormat(date, format);
    } catch (e) {
      return '';
    }
  },
  formatUTC: (date: Date, format: DateFormat = DateFormat.DayFormat) => {
    try {
      return formatInTimeZone(date, format, 'UTC');
    } catch (e) {
      return '';
    }
  },
  getNow: () => new Date(),
  getOneWeekAgo: () => sub(new Date(), { days: 7 }),
  getTomorrow: () => sub(new Date(), { days: -1 }),
  getStartOfWeek: (date = new Date()) => startOfWeek(date, {
    weekStartsOn: 1,
  }),
  toUTC: (date: Date): Date => zonedTimeToUtc(date, 'UTC'),
  toZonedTime: (date: Date, timeZone: string): Date => utcToZonedTime(date, timeZone),
});
