import { objectType } from 'nexus';

import { EvaluationPeriodSchedule } from './EvaluationPeriodSchedule.graphql';
import { DataPeriodSchedule } from './DataPeriodSchedule.graphql';

export const DialogueSchedule = objectType({
  name: 'DialogueSchedule',
  description: `
    A dialogue schedule defines the data period (period of time whilst data is good),
    and evaluation period (period of time when a dialogue may be enabled).
  `,

  definition(t) {
    t.id('id');

    t.field('evaluationPeriodSchedule', { type: EvaluationPeriodSchedule });
    t.field('dataPeriodSchedule', { type: DataPeriodSchedule });
  },
})
