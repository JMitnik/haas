import { objectType } from 'nexus';
import { AutomationConditionModel } from './AutomationCondition';
import { AutomationConditionBuilderType } from './AutomationConditionBuilderType';

export const AutomationConditionBuilderModel = objectType({
  name: 'AutomationConditionBuilderModel',
  description: 'AutomationConditionBuilder',
  definition(t) {
    t.id('id');

    t.nullable.string('childConditionBuilderId');

    t.field('type', {
      type: AutomationConditionBuilderType,
    });

    t.list.field('conditions', {
      type: AutomationConditionModel,
    });

    t.field('childConditionBuilder', {
      type: AutomationConditionBuilderModel,
      resolve(parent, args, ctx) {
        if (!parent.childConditionBuilderId) return null;
        // Show up in merge
        return ctx.services.triggerAutomationService.findAutomationConditionBuilder(
          parent.childConditionBuilderId
        ) as any;
      },
    });
  },
});
