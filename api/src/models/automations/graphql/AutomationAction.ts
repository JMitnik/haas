import { objectType } from "@nexus/schema";
import { AutomationActionType } from './AutomationActionType';

export const AutomationActionModel = objectType({
  name: 'AutomationActionModel',
  description: 'AutomationAction',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('type', {
      type: AutomationActionType,
    });
  },
});