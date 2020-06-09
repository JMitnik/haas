import { Instance, types } from 'mobx-state-tree';

// eslint-disable-next-line import/no-cycle
import { TreeNodeModel } from './TreeNodeModel';
import TreeEdgeConditionModel, { TreeEdgeConditionProps } from './TreeEdgeConditionModel';

export const TreeEdgeModel: any = types
  .model({
    id: types.identifier,
    parentNode: types.maybe(types.reference(types.late(() => TreeNodeModel))),
    childNode: types.maybe(types.reference(types.late(() => TreeNodeModel))),
    conditions: types.maybe(types.array(TreeEdgeConditionModel)),
  })
  .actions((self) => ({
    matchesKeyByCondition(key: any): boolean {
      // TODO: Silly assumption that only first matters
      if (self.conditions && self.conditions[0]) {
        const conditionSelection: TreeEdgeConditionProps = self.conditions[0];

        if (conditionSelection?.renderMin && key < conditionSelection.renderMin) {
          return false;
        }

        if (conditionSelection?.renderMax && key > conditionSelection.renderMax) {
          return false;
        }

        if (conditionSelection?.matchValue) {
          return conditionSelection.matchValue === key;
        }
      }

      return true;
    },
  }));

export interface TreeEdgeProps extends Instance<typeof TreeEdgeModel>{}

export default TreeEdgeModel;
