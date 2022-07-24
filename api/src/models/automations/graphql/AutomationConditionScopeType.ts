import { enumType } from 'nexus';

export const AutomationConditionScopeType = enumType({
  name: 'AutomationConditionScopeType',
  members: [
    'QUESTION',
    'DIALOGUE',
    'WORKSPACE',
  ],
})