import { objectType } from '@nexus/schema';
import { AutomationActionModel } from './AutomationAction'
import { RecurringPeriodType } from './RecurringPeriodType';

export const AutomationScheduledModel = objectType({
  name: 'AutomationScheduledModel',
  description: 'AutomationScheduled',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', { type: RecurringPeriodType });
    t.string('minutes');
    t.string('hours');
    t.string('dayOfMonth');
    t.string('month');
    t.string('dayOfWeek');
    t.string('dialogueId');

    t.list.field('actions', {
      type: AutomationActionModel,
      nullable: true,
    });

    t.field('activeDialogue', {
      type: 'Dialogue',
      nullable: true,
      async resolve(parent, args, ctx) {
        if (!parent.dialogueId) return null;

        return ctx.services.dialogueService.getDialogueById(parent.dialogueId);
      },
    })
  },
});
