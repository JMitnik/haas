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