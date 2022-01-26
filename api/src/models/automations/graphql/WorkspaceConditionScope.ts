import { objectType } from "@nexus/schema";
import { ConditionPropertyAggregate } from "./ConditionPropertyAggregate";
import { WorkspaceAspectType } from "./WorkspaceAspectType";

export const WorkspaceConditionScopeModel = objectType({
  name: 'WorkspaceConditionScopeModel',
  description: 'WorkspaceConditionScope',
  definition(t) {
    t.id('id');
    t.date('createdAt');
    t.date('updatedAt');

    t.field('aspect', {
      type: WorkspaceAspectType,
    });

    t.field('aggregate', {
      type: ConditionPropertyAggregate,
      nullable: true,
    });
  },
});