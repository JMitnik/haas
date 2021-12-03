import { enumType } from "@nexus/schema";

export const AutomationEventType = enumType({
  name: 'AutomationEventType',
  members: ['RECURRING', 'NEW_INTERACTION_QUESTION', 'NEW_INTERACTION_DIALOGUE', 'API_CALL'],
});