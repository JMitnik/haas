import { Day, days } from 'components/Common/DatePicker/DayPicker';
import { differenceInMinutes } from 'date-fns';

export interface Period {
  day?: Day;
  time?: string;
}

/**
 * Parse a day to a cron format.
 */
export const parseCronDay = (day: Day) => {
  const index = days.findIndex((dayEl) => dayEl === day);
  if (index >= 0) return index + 1;

  return '*';
};

/**
 * Parses time of format 09:00AM (7 characters)
 */
export const parseCronTime = (time: string) => {
  const hour = parseInt(time.slice(0, 2), 10) ?? '*';
  const minute = parseInt(time.slice(3, 5), 10) ?? '*';

  return `${minute} ${hour}`;
};

/**
 * Parse a period to a cron format.
 */
export const parseCronPeriod = (period: Period) => {
  const dayCron = period.day !== undefined ? parseCronDay(period.day) : '*';
  const timeCron = period.time !== undefined ? parseCronTime(period.time) : '* *';

  return `${timeCron} * * ${dayCron}`;
};

/**
 * Parse a period to a Date format.
 *
 * Note: this uses a convenient date, 2022 Aug where the first day of the month coincides with a Monday.
 */
export const parseDate = (period: Period) => {
  const dayIndex = days.findIndex((dayEl) => dayEl === period.day) + 1;
  const hour = period.time ? parseInt(period?.time.slice(0, 2), 10) : 0;
  const minute = period.time ? parseInt(period?.time.slice(3, 5), 10) : 0;

  const date = new Date(Date.UTC(2022, 9, dayIndex, hour, minute));
  return date;
};

/**
 * Calculates the absolute difference between two periods, in minutes.
 */
export const deltaPeriodsInMinutes = (periodA: Period, periodB: Period) => {
  const dateA = parseDate(periodA);
  const dateB = parseDate(periodB);

  return Math.abs(Math.ceil(differenceInMinutes(dateA, dateB)));
};
