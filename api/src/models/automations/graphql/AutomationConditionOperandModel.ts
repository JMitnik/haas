import { objectType } from '@nexus/schema';
import { OperandType } from './OperandType'

export const AutomationConditionOperandModel = objectType({
  name: 'AutomationConditionOperandModel',
  description: 'AutomationConditionOperand',

  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', { type: OperandType });

    t.int('numberValue', { nullable: true });
    t.string('textValue', { nullable: true }); // TODO: Reference an actual choice option instead of raw text here eventually
    t.string('dateTimeValue', { nullable: true });
  },
});
