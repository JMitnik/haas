import { enumType } from "@nexus/schema";

export const AutomationConditionScopeType = enumType({
  name: 'AutomationConditionScopeType',
  members: [
    'QUESTION',
    'DIALOGUE',
    'WORKSPACE'
  ]
})