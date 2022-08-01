import { enumType } from 'nexus';

export const AutomationConditionBuilderType = enumType({
  name: 'AutomationConditionBuilderType',
  members: ['AND', 'OR'],
});
