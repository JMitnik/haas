import { objectType } from "@nexus/schema";
import { AutomationEventType } from "./AutomationEventType";
import { QuestionNodeType } from '../../QuestionNode/QuestionNode';
import { DialogueType } from '../../questionnaire/Dialogue';
import { RecurringPeriodType } from "./RecurringPeriodType";

export const AutomationEventModel = objectType({
  name: 'AutomationEventModel',
  description: 'AutomationEvent',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.string('startDate', {
      nullable: true,
    });
    t.string('endDate', {
      nullable: true,
    });

    t.field('type', {
      type: AutomationEventType,
    });

    t.field('question', {
      type: QuestionNodeType,
      nullable: true,
    });

    t.field('dialogue', {
      type: DialogueType,
      nullable: true,
    });

    t.field('periodType', {
      type: RecurringPeriodType,
      nullable: true,
    });
  },
})