import { Prisma } from 'prisma/prisma-client';

const automation = Prisma.validator<Prisma.AutomationArgs>()({
  include: {
    automationScheduled: {
      include: {
        actions: true,
      },
    },
  },
});

export type AutomationWithSchedule = Prisma.AutomationGetPayload<typeof automation>;

const workspace = Prisma.validator<Prisma.CustomerArgs>()({
  include: {
    roles: true,
  },
});

export type WorkspaceWithRoles = Prisma.CustomerGetPayload<typeof workspace>;

export enum DateFormat {
  /** Example: 02-12-2021 */
  DayFormat = 'dd-MM-yyyy',
  DayTimeFormat = 'dd-MM-yyyy HH:mm',
  /** Example: Monday, June 16th */
  HumanGlobalWeekDayFormat = 'EEEE, MMMM do',

  /** Example: Monday 16 July, 20:00 */
  HumanDateTime = 'EEEE do, HH:mm',

  /** Example: Monday 16 of July, 20:00 (GMT+1) */
  HumanMonthDateTimeUTC = 'EEEE do \'of\' LLLL, \'at\' HH:mm \'(\'zzzz\')\'',

  /** Example: Monday 16 of July, 20:00 */
  HumanMonthDateTime = 'EEEE do \'of\' LLLL, \'at\' HH:mm',

  /** Example: Monday 16 of July */
  MonthDate = 'EEEE do \'of\' LLLL',

  /** Example: 13:37 */
  Time = 'HH:mm',
}

export type DayType = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export enum CustomRecurringType {
  YEARLY = '1 JAN *',
  MONTHLY = '1 * *',
  WEEKLY = '* * MON',
  DAILY = '* *',
}

export const DAYS: { index: number; label: DayType }[] = [
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

export interface GenerateReportLambdaParams {
  USER_ID: string;
  AUTOMATION_ACTION_ID: string;
  DASHBOARD_URL: string;
  REPORT_URL: string;
  API_URL: string;
  WORKSPACE_EMAIL: string;
  WORKSPACE_SLUG: string;
  AUTHENTICATE_EMAIL: string;
};

export interface SendDialogueLinkLambdaParams {
  AUTOMATION_SCHEDULE_ID: string;
  AUTHENTICATE_EMAIL: string;
  API_URL: string;
  WORKSPACE_EMAIL: string;
  WORKSPACE_SLUG: string;
}