import { enumType } from 'nexus';

export const RecurringPeriodType = enumType({
  name: 'RecurringPeriodType',
  members: [
    'EVERY_YEAR',
    'EVERY_MONTH',
    'EVERY_WEEK',
    'EVERY_DAY',
    'START_OF_DAY',
    'END_OF_DAY',
    'START_OF_WEEK',
    'END_OF_WEEK',
    'CUSTOM',
  ],
})