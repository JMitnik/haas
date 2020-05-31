import { Instance, types } from 'mobx-state-tree';

// eslint-disable-next-line import/no-cycle
import { TreeNodeModel } from './TreeNodeModel';

export const TreeEdgeModel: any = types
  .model({
    id: types.identifier,
    parentNode: types.maybe(types.reference(types.late(() => TreeNodeModel))),
    childNode: types.maybe(types.reference(types.late(() => TreeNodeModel))),
  });

export interface TreeEdgeProps extends Instance<typeof TreeEdgeModel>{}

export default TreeEdgeModel;
