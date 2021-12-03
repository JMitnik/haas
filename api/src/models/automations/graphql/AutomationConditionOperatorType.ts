import { enumType } from "@nexus/schema";

export const AutomationConditionOperatorType = enumType({
  name: 'AutomationConditionOperatorType',
  members: [
    'SMALLER_THAN',
    'SMALLER_OR_EQUAL_THAN',
    'GREATER_THAN',
    'GREATER_OR_EQUAL_THAN',
    'INNER_RANGE',
    'OUTER_RANGE',
    'IS_EQUAL',
    'IS_NOT_EQUAL',
    'IS_TRUE',
    'IS_FALSE',
    'EVERY_N_TH_TIME',
  ],
});