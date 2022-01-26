import { objectType } from "@nexus/schema";
import { ConditionPropertyAggregateType } from "./ConditionPropertyAggregateType";

export const ConditionPropertyAggregate = objectType({
  name: 'ConditionPropertyAggregate',
  definition(t) {
    t.id('id');
    t.string('createdAt');

    t.string('startDate', { nullable: true });
    t.string('endDate', { nullable: true });
    t.int('latest', { nullable: true });

    t.field('type', {
      type: ConditionPropertyAggregateType,
    });
  }
})