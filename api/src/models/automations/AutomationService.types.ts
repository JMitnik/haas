export type DayType = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export enum CustomRecurringType {
  YEARLY = '1 JAN *',
  MONTHLY = '1 * *',
  WEEKLY = '* * MON',
  DAILY = '* *',
}
