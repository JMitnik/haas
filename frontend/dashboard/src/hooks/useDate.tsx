import { format as dateFormat, sub } from 'date-fns';

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
}

export const useDate = () => ({
  format: (date: Date, format: DateFormat = DateFormat.DayFormat) => dateFormat(date, format),
  getNow: () => new Date(),
  getStartOfWeek: () => sub(new Date(), { weeks: 1 }),
});
