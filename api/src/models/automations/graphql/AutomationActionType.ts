import { enumType } from 'nexus';

export const AutomationActionType = enumType({
  name: 'AutomationActionType',
  members: [
    'SEND_SMS',
    'SEND_EMAIL',
    'API_CALL',
    'GENERATE_REPORT',
    'WEBHOOK',
  ],
});