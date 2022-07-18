import { AutomationScheduled } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import { CustomRecurringType, DayType } from './AutomationService.types';

const DAYS: { index: number; label: DayType }[] = [
  {
    index: 0,
    label: 'SUN',
  },
  {
    index: 1,
    label: 'MON',
  },
  {
    index: 2,
    label: 'TUE',
  },
  {
    index: 3,
    label: 'WED',
  },
  {
    index: 4,
    label: 'THU',
  },
  {
    index: 5,
    label: 'FRI',
  },
  {
    index: 6,
    label: 'SAT',
  },
];

export const getDayRange = (dayOfWeek: string) => {
  const isWildcard = dayOfWeek.length === 1;
  if (isWildcard) return [];

  const splittedDays = dayOfWeek.split('-')
  const mappedToDayRange = splittedDays.map(
    (dayLabel) => DAYS.find((day) => day.label === dayLabel)
  ).filter(isPresent);
  return mappedToDayRange;
}

export const buildFrequencyCronString = (scheduledAutomation: AutomationScheduled) => {
  const frequency = `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}`;
  if (frequency === CustomRecurringType.YEARLY
    || frequency === CustomRecurringType.MONTHLY
    || frequency === CustomRecurringType.WEEKLY
  ) {
    return `${scheduledAutomation.dayOfMonth} ${scheduledAutomation.month} ${scheduledAutomation.dayOfWeek}`;
  }
  return '* *';
}