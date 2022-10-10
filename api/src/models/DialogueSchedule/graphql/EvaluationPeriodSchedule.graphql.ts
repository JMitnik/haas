import { objectType } from 'nexus';

export const EvaluationPeriodSchedule = objectType({
  name: 'EvaluationPeriodSchedule',
  description: `
    The Evaluation Period Schedule is used to define an opening and closing range for our dialogues.

    Currently workspace-wide.
  `,

  definition(t) {
    t.id('id');

    t.string('startDateExpression');
    t.int('endInDeltaMinutes');
  },
})
