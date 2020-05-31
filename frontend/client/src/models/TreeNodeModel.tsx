import { IAnyModelType, Instance, types } from 'mobx-state-tree';
// eslint-disable-next-line import/no-cycle
import { TreeEdgeModel } from './TreeEdgeModel';

export const TreeNodeModel = types
  .model('TreeNode', {
    id: types.identifier,
    title: types.string,
    isRoot: types.boolean,
    children: types.array(types.maybe(types.reference(types.late(() => TreeEdgeModel)))),
    // TODO: How to do overrideLeaf?
    // TODO: Do options
  });

export interface TreeNodeProps extends Instance<typeof TreeNodeModel>{}

export default TreeNodeModel;
