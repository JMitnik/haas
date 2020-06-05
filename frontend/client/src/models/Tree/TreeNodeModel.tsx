import { IAnyModelType, Instance, types } from 'mobx-state-tree';
// eslint-disable-next-line import/no-cycle
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import TreeNodeOptionModel from './TreeNodeOptionModel';

export enum SpecialEdge {
  LEAF_EDGE_ID = '-1',
  POST_LEAF_EDGE_ID = '-2',
}

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
      // If we already are at leaf, go to POST-LEAF-EDGE
      if (self.isLeaf) { return SpecialEdge.POST_LEAF_EDGE_ID; }

      const candidateEdge = self.children.find((child: TreeEdgeProps) => child.matchesKeyByCondition(key));

      // If there are no edges (but we are not at leaf yet) => Return Leaf ID
      if (!candidateEdge) return SpecialEdge.LEAF_EDGE_ID;

      return candidateEdge.id;
    },
  }));

export const createDefaultPostLeafNode = () => {
  const node = TreeNodeModel.create({
    id: SpecialEdge.POST_LEAF_EDGE_ID,
    title: 'Thank you for participating',
    type: 'POST_LEAF',
    isLeaf: true,
  });

  return node;
};

export interface TreeNodeProps extends Instance<typeof TreeNodeModel>{}

export default TreeNodeModel;
