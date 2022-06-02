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

    t.list.field('actions', {
      type: AutomationActionModel,
      nullable: true,
    });
  },
});
