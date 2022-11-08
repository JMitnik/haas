import { AutomationActionType } from 'types/generated-types';

export const DEPTH_BACKGROUND_COLORS = [
  '#fbfcff',
  '#f5f8fa',
];

export const ACTION_OPTIONS = [
  {
    label: 'Stale request reminder',
    description: 'Sending out a reminder when action requests hav not been updated for a week',
    value: AutomationActionType.SendStaleActionRequestReminder,
  },
  {
    label: 'Customizable report',
    description: 'Sending out a report based on a customer schedule to requested stakeholder',
    value: AutomationActionType.CustomReport,
  },
  {
    label: 'Weekly report',
    description: 'Sending out a weekly report to requested stakeholders',
    value: AutomationActionType.WeekReport,
  },
  {
    label: 'Monthly report',
    description: 'Sending out a monthly report to requested stakeholders',
    value: AutomationActionType.MonthReport,
  },
  {
    label: 'Yearly report',
    description: 'Sending out a yearly report to requested stakeholders',
    value: AutomationActionType.YearReport,
  },
  {
    label: 'Send dialogue link',
    description: 'Sending out a new unique dialogue link to each team representative',
    value: AutomationActionType.SendDialogueLink,
  },
];
