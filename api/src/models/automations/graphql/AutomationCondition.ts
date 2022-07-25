import { objectType } from 'nexus';

import { AutomationConditionScopeType } from './AutomationConditionScopeType';
import { AutomationConditionOperatorType } from './AutomationConditionOperatorType';
import { AutomationConditionOperandModel } from './AutomationConditionOperandModel';
import { QuestionConditionScope } from './QuestionConditionScope';
import { DialogueConditionScopeModel } from './DialogueConditionScope';
import { WorkspaceConditionScopeModel } from './WorkspaceConditionScope';
import { QuestionNodeType } from '../../QuestionNode/QuestionNode';
import { DialogueType } from '../../questionnaire/Dialogue';

export const AutomationConditionModel = objectType({
  name: 'AutomationConditionModel',
  description: 'AutomationCondition',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('scope', {
      type: AutomationConditionScopeType,
    });

    t.field('operator', {
      type: AutomationConditionOperatorType,
    });

    t.list.field('operands', { type: AutomationConditionOperandModel });

    t.field('questionScope', {
      type: QuestionConditionScope,

    });

    t.field('dialogueScope', {
      type: DialogueConditionScopeModel,

    });

    t.field('workspaceScope', {
      type: WorkspaceConditionScopeModel,

    });

    t.field('question', {
      type: QuestionNodeType,

    });

    t.field('dialogue', {
      type: DialogueType,

    });
  },
});