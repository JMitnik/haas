import { objectType } from 'nexus';
import { ConditionPropertyAggregateType } from './ConditionPropertyAggregateType';

export const ConditionPropertyAggregate = objectType({
  name: 'ConditionPropertyAggregate',
  definition(t) {
    t.id('id');
    t.string('createdAt');

    t.string('startDate');
    t.string('endDate');
    t.int('latest');

    t.field('type', {
      type: ConditionPropertyAggregateType,
    });
  },
})