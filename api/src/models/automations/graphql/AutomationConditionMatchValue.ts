import { objectType } from "@nexus/schema";
import { MatchValueType } from './MatchValueType'

export const AutomationConditionMatchValueModel = objectType({
  name: 'AutomationConditionMatchValueModel',
  description: 'AutomationConditionMatchValue',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', {
      type: MatchValueType,
    });

    t.int('numberValue', { nullable: true });
    t.string('textValue', { nullable: true }); // TODO: Reference an actual choice option instead of raw text here eventually
    t.string('dateTimeValue', { nullable: true });


  }
})