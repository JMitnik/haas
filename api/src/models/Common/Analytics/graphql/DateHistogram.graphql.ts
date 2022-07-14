import { objectType } from '@nexus/schema';

export const DateHistogramItem = objectType({
  name: 'DateHistogramItem',
  description: 'A histogram item contains a date',

  definition(t) {
    t.id('id');
    t.date('date');
    t.int('frequency');
  },
});

export const DateHistogram = objectType({
  name: 'DateHistogram',
  description: 'A histogram contains a list of entries sorted typically by date, along with their frequency.',

  definition(t) {
    t.id('id');

    t.list.field('items', { type: DateHistogramItem });
  },
})
