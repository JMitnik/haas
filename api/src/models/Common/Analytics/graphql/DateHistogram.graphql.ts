import { objectType } from 'nexus';

export const DateHistogramItem = objectType({
  name: 'DateHistogramItem',
  description: 'A histogram item contains a date',

  definition(t) {
    t.id('id');
    t.date('date');
    t.nonNull.int('frequency');
  },
});

export const DateHistogram = objectType({
  name: 'DateHistogram',
  description: 'A histogram contains a list of entries sorted typically by date, along with their frequency.',

  definition(t) {
    t.id('id');

    t.nonNull.list.nonNull.field('items', { type: DateHistogramItem });
  },
})
