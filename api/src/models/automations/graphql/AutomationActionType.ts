import { enumType } from 'nexus';

export const AutomationActionType = enumType({
  name: 'AutomationActionType',
  members: [
    'SEND_SMS',
    'SEND_EMAIL',
    'API_CALL',
    'SEND_DIALOGUE_LINK',
    'WEEK_REPORT',
    'MONTH_REPORT',
    'YEAR_REPORT',
    'CUSTOM_REPORT',
    'WEBHOOK',
  ],
});