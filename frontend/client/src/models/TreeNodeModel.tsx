import { IAnyModelType, Instance, types } from 'mobx-state-tree';
// eslint-disable-next-line import/no-cycle
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import TreeNodeOptionModel from './TreeNodeOptionModel';

export const TreeNodeModel = types
  .model('TreeNode', {
    id: types.identifier,
    title: types.string,
    isRoot: types.optional(types.boolean, false),
    isLeaf: types.optional(types.boolean, false),
    type: types.string,
    children: types.array(types.maybe(types.reference(types.late(() => TreeEdgeModel)))),
    overrideLeaf: types.maybe(types.reference(types.late((): IAnyModelType => TreeNodeModel))),
    options: types.array(TreeNodeOptionModel),
  })
  .actions((self) => ({

    /**
     * Finds candidate edge child based on `key`.
     * @param key
     */
    getNextEdgeIdFromKey(key: any) {
      const candidateEdges = self.children.filter((child: TreeEdgeProps) => child.matchesKeyByCondition(key));

      if (candidateEdges.length === 0) {
        return -1;
      }

      if (candidateEdges.length > 1) {
        throw new Error('Not possible to have more than 1 candidate at the moment');
      }

      const candidateEdge = candidateEdges[0].id;

      return candidateEdge;
    },
  }));

export const defaultTreeLeaf = TreeNodeModel.create({
  id: '-1',
  title: 'Thank you for participating',
  type: 'FINISH',
  isLeaf: true,
});

export interface TreeNodeProps extends Instance<typeof TreeNodeModel>{}

export default TreeNodeModel;
