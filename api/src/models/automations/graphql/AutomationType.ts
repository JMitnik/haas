import { enumType } from 'nexus';

export const AutomationType = enumType({
  name: 'AutomationType',
  members: ['TRIGGER', 'CAMPAIGN', 'SCHEDULED'],
});