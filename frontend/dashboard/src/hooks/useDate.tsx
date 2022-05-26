import { format as dateFormat, isValid, parse, startOfWeek, sub } from 'date-fns';

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
  /** Example: Monday 16th */
  HumanGlobalWeekDayFormat = 'EEEE do',
}

export const useDate = () => ({
  isValid: (date: Date) => isValid(date),
  parse: (date: string, format: DateFormat) => parse(date, format, new Date()),
  parseRangeString: (date: string, format: DateFormat) => {
    const [start, end] = date.split(' - ');
    console.log(start);
    return [parse(start, format, new Date()), parse(end, format, new Date())];
  },
  format: (date: Date, format: DateFormat = DateFormat.DayFormat) => dateFormat(date, format),
  getNow: () => new Date(),
  getTomorrow: () => sub(new Date(), { days: -1 }),
  getStartOfWeek: (date = new Date()) => startOfWeek(date, {
    weekStartsOn: 1,
  }),
});
