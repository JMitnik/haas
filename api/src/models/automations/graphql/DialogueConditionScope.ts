import { objectType } from "@nexus/schema";
import { ConditionPropertyAggregate } from "./ConditionPropertyAggregate";
import { DialogueAspectType } from "./DialogueAspectType";

export const DialogueConditionScopeModel = objectType({
  name: 'DialogueConditionScopeModel',
  description: 'DialogueConditionScope',
  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');

    t.field('aspect', {
      type: DialogueAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
    });
  },
});