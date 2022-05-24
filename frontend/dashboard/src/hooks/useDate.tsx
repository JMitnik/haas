import { format as dateFormat, sub } from 'date-fns';

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
  /** Example: Monday 16th */
  HumanGlobalWeekDayFormat = 'EEEE do',
}

export const useDate = () => ({
  format: (date: Date, format: DateFormat = DateFormat.DayFormat) => dateFormat(date, format),
  getNow: () => new Date(),
  getTomorrow: () => sub(new Date(), { days: -1 }),
  getStartOfWeek: () => sub(new Date(), { weeks: 1 }),
});
