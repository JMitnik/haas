import { objectType } from "@nexus/schema";

import { AutomationConditionScopeType } from './AutomationConditionScopeType';
import { AutomationConditionOperatorType } from './AutomationConditionOperatorType';
import { AutomationConditionMatchValueModel } from './AutomationConditionMatchValue';
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
    t.string('createdAt');
    t.string('updatedAt');

    t.field('scope', {
      type: AutomationConditionScopeType,
    });

    t.field('operator', {
      type: AutomationConditionOperatorType,
    });

    t.field('matchValue', {
      type: AutomationConditionMatchValueModel,
    });

    t.field('questionScope', {
      type: QuestionConditionScope,
      nullable: true,
    });

    t.field('dialogueScope', {
      type: DialogueConditionScopeModel,
      nullable: true,
    });

    t.field('workspaceScope', {
      type: WorkspaceConditionScopeModel,
      nullable: true,
    });

    t.field('question', {
      type: QuestionNodeType,
      nullable: true,
    });

    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
    });
  },
});