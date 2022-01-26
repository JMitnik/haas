import { enumType } from '@nexus/schema';

export const AutomationConditionBuilderType = enumType({
  name: 'AutomationConditionBuilderType',
  members: ['AND', 'OR'],
});
