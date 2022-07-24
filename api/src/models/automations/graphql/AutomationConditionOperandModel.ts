import { objectType } from 'nexus';
import { OperandType } from './OperandType'

export const AutomationConditionOperandModel = objectType({
  name: 'AutomationConditionOperandModel',
  description: 'AutomationConditionOperand',

  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', { type: OperandType });

    t.nullable.int('numberValue');
    t.nullable.string('textValue'); // TODO: Reference an actual choice option instead of raw text here eventually
    t.nullable.string('dateTimeValue');
  },
});
