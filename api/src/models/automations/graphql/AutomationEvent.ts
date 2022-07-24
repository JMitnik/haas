import { objectType } from 'nexus';
import { AutomationEventType } from './AutomationEventType';
import { QuestionNodeType } from '../../QuestionNode/QuestionNode';
import { DialogueType } from '../../questionnaire/Dialogue';
import { RecurringPeriodType } from './RecurringPeriodType';

export const AutomationEventModel = objectType({
  name: 'AutomationEventModel',
  description: 'AutomationEvent',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.string('startDate', {

    });
    t.string('endDate', {

    });

    t.field('type', {
      type: AutomationEventType,
    });

    t.field('question', {
      type: QuestionNodeType,

    });

    t.field('dialogue', {
      type: DialogueType,

    });

    t.field('periodType', {
      type: RecurringPeriodType,

    });
  },
})