import { objectType } from "@nexus/schema";
import { AutomationConditionModel } from './AutomationCondition';
import { AutomationConditionBuilderType } from "./AutomationConditionBuilderType";

export const AutomationConditionBuilderModel = objectType({
  name: 'AutomationConditionBuilderModel',
  description: 'AutomationConditionBuilder',
  definition(t) {
    t.id('id');

    t.string('childConditionBuilderId', { nullable: true });

    t.field('type', {
      type: AutomationConditionBuilderType,
    });

    t.list.field('conditions', {
      type: AutomationConditionModel,
    });

    t.field('childConditionBuilder', {
      type: AutomationConditionBuilderModel,
      nullable: true,
      resolve(parent, args, ctx) {
        if (!parent.childConditionBuilderId) return null;
        return ctx.services.automationService.findAutomationConditionBuilder(parent.childConditionBuilderId) as any;
      }
    });

  },
});