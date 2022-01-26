import { enumType } from "@nexus/schema";

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