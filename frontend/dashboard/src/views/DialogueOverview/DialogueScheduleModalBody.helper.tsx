import { addMinutes, differenceInMinutes } from 'date-fns';

import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';
import { Day, days } from 'components/Common/DatePicker/DayPicker';

export interface Period {
  day?: Day;
  time?: string;
}

export const parseCronToRecurring = (cronExpression: string): CustomRecurringType => {
  if (!cronExpression) return CustomRecurringType.WEEKLY;
  if (cronExpression === '0 8 * * *') {
    return CustomRecurringType.DAILY;
  }

  if (cronExpression === '0 8 * * 1') {
    return CustomRecurringType.WEEKLY;
  }

  if (cronExpression === '0 8 1 * *') {
    return CustomRecurringType.MONTHLY;
  }

  if (cronExpression === '0 8 1 1 *') {
    return CustomRecurringType.YEARLY;
  }

  return CustomRecurringType.WEEKLY;
};

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
export const parseTimeToCron = (time: string) => {
  const hour = parseInt(time.slice(0, 2), 10) ?? '*';
  const minute = parseInt(time.slice(3, 5), 10) ?? '*';

  return `${minute} ${hour}`;
};

/**
 * Extract Period from cron
 */
export const parseCronToPeriod = (cronExpression: string) => {
  const cronCharacters = cronExpression.split(' ');

  const minute = cronCharacters[0].padStart(2, '0');
  const hour = cronCharacters[1].padStart(2, '0');
  const med = parseInt(cronCharacters[1], 10) >= 12 ? 'PM' : 'AM';
  const time = `${hour}:${minute}${med}`;

  const dayIndex = parseInt(cronCharacters[cronCharacters.length - 1], 10) - 1;
  const day = days[dayIndex];

  return { time, day };
};

export const parseDateToCron = (date: Date) => {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDay();

  return `${minute} ${hour} * * ${day}`;
};

/**
 * Parse a period to a cron format.
 */
export const parsePeriodToCron = (period: Period) => {
  const dayCron = period.day !== undefined ? parseCronDay(period.day) : '*';
  const timeCron = period.time !== undefined ? parseTimeToCron(period.time) : '* *';

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

  const date = new Date(Date.UTC(2022, 7, dayIndex, hour, minute) + new Date().getTimezoneOffset() * 60 * 1000);
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

/**
 * Calculates the absolute difference between two periods, in minutes.
 */
export const addMinutesToPeriod = (periodA: Period, minutes: number): Period => {
  const dateA = parseDate(periodA);
  const dateB = addMinutes(dateA, minutes);

  return parseCronToPeriod(parseDateToCron(dateB));
};
