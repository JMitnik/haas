import { objectType } from "@nexus/schema";
import { AutomationEventModel } from './AutomationEvent';
import { AutomationConditionModel } from './AutomationCondition';
import { AutomationActionModel } from './AutomationAction'

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

    t.list.field('conditions', {
      type: AutomationConditionModel,
    });

    t.list.field('actions', {
      type: AutomationActionModel,
    });

  },
});