import { objectType } from 'nexus';

export const DataPeriodSchedule = objectType({
  name: 'DataPeriodSchedule',
  description: `
    A data period schedule defines the general
  `,

  definition(t) {
    t.id('id');

    t.dateString('activeStartDate');
    t.dateString('activeEndDate');
    t.string('startDateExpression');
    t.int('endInDeltaMinutes');
  },
})