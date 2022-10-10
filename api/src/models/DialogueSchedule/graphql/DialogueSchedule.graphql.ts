import { objectType } from 'nexus';

export const DialogueSchedule = objectType({
  name: 'DialogueSchedule',
  description: `
    A dialogue schedule defines the data period (period of time whilst data is good),
    and evaluation period (period of time when a dialogue may be enabled).
  `,

  definition(t) {
    t.id('id');
  }
})
