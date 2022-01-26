import { enumType } from "@nexus/schema";

export const ConditionPropertyAggregateType = enumType({
  name: 'ConditionPropertyAggregateType',
  members: [
    'COUNT',
    'MIN',
    'MAX',
    'AVG',
  ],
});