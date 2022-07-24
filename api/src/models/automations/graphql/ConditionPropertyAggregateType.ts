import { enumType } from 'nexus';

export const ConditionPropertyAggregateType = enumType({
  name: 'ConditionPropertyAggregateType',
  members: [
    'COUNT',
    'MIN',
    'MAX',
    'AVG',
  ],
});