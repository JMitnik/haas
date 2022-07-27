import { enumType } from "nexus";

export const AutomationActionChannelType = enumType({
  name: 'AutomationActionChannelType',
  members: [
    'SMS',
    'EMAIL',
    'SLACK'
  ],
});