import { format as dateFormat, isValid, parse, startOfWeek, sub } from 'date-fns';

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
  /** Example: Monday, June 16th */
  HumanGlobalWeekDayFormat = 'EEEE, MMMM do',

  /** Example: Monday 16 July, 20:00 */
  HumanDateTime = 'EEEE do, HH:mm',
}

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
  getNow: () => new Date(),
  getTomorrow: () => sub(new Date(), { days: -1 }),
  getStartOfWeek: (date = new Date()) => startOfWeek(date, {
    weekStartsOn: 1,
  }),
});
