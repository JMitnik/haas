import { objectType } from '@nexus/schema';
import { AutomationType } from './AutomationType';
import { AutomationTriggerModel } from './AutomationTrigger'

export const AutomationModel = objectType({
  name: 'AutomationModel',
  description: 'Automation',

  definition(t) {
    t.id('id');
    t.string('createdAt');
    t.string('updatedAt');
    t.boolean('isActive');
    t.string('label');

    t.string('description', { nullable: true })

    t.field('type', {
      type: AutomationType,
    });

    t.field('automationTrigger', {
      type: AutomationTriggerModel,
      nullable: true,
    });
  },
});