import { enumType } from "@nexus/schema";

export const AutomationType = enumType({
  name: 'AutomationType',
  members: ['TRIGGER', 'CAMPAIGN'],
});