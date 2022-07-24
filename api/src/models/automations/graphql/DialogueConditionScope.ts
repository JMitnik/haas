import { objectType } from 'nexus';
import { ConditionPropertyAggregate } from './ConditionPropertyAggregate';
import { DialogueAspectType } from './DialogueAspectType';

export const DialogueConditionScopeModel = objectType({
  name: 'DialogueConditionScopeModel',
  description: 'DialogueConditionScope',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('aspect', {
      type: DialogueAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
    });
  },
});