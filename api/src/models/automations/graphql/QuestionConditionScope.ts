import { objectType } from "nexus";
import { ConditionPropertyAggregate } from "./ConditionPropertyAggregate";
import { QuestionAspectType } from './QuestionAspectType';

export const QuestionConditionScope = objectType({
  name: 'QuestionConditionScopeModel',
  description: 'QuestionConditionScope',
  definition(t) {
    t.id('id');
    t.date('createdAt');

    t.field('aspect', {
      type: QuestionAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
      nullable: true,
    });

  },
});