import { enumType } from "@nexus/schema";

export const AutomationActionChannelType = enumType({
  name: 'AutomationActionChannelType',
  members: [
    'SMS',
    'EMAIL',
    'SLACK'
  ],
});