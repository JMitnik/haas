import { objectType } from "@nexus/schema";
import { ConditionPropertyAggregate } from "./ConditionPropertyAggregate";
import { QuestionAspectType } from './QuestionAspectType';

export const QuestionConditionScope = objectType({
  name: 'QuestionConditionScope',
  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');

    t.field('aspect', {
      type: QuestionAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
    });

  },
});