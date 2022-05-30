import { objectType } from '@nexus/schema';
import { AutomationEventModel } from './AutomationEvent';
import { AutomationActionModel } from './AutomationAction'
import { AutomationConditionBuilderModel } from './AutomationConditionBuilder';

export const AutomationTriggerModel = objectType({
  name: 'AutomationTriggerModel',
  description: 'AutomationTrigger',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('event', {
      type: AutomationEventModel,
    });

    t.field('conditionBuilder', {
      type: AutomationConditionBuilderModel,
      nullable: true,
    });

    t.list.field('actions', {
      type: AutomationActionModel,
    });
  },
});
