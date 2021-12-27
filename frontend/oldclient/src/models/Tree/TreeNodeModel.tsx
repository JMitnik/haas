import { IAnyModelType, Instance, types } from 'mobx-state-tree';

import FormNodeModel from './FormNodeModel';
import SliderNodeModel from './SliderNodeModel';
// eslint-disable-next-line import/no-cycle
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import TreeLinkModel from './TreeLinkModel';
// eslint-disable-next-line import/no-cycle
import TreeNodeOptionModel from './TreeNodeOptionModel';
import TreeShareModel from './TreeShareModel';

export enum SpecialEdge {
  LEAF_EDGE_ID = '-1',
  POST_LEAF_EDGE_ID = '-2',
}

interface EdgeOutput {
  edgeId: string;
  goesToLeaf: boolean;
  goesToPostLeaf: boolean;
  nextNode?: TreeNodeProps,
}

export const TreeNodeModel = types
  .model('TreeNode', {
    id: types.identifier,
    title: types.string,
    extraContent: types.maybeNull(types.string),
    isRoot: types.optional(types.boolean, false),
    isLeaf: types.optional(types.boolean, false),
    isPostLeaf: types.optional(types.boolean, false),
    type: types.string,
    children: types.array(types.maybe(types.reference(types.late(() => TreeEdgeModel)))),
    overrideLeaf: types.maybe(types.reference(types.late((): IAnyModelType => TreeNodeModel))),
    options: types.array(TreeNodeOptionModel),
    links: types.array(TreeLinkModel),
    share: types.maybe(TreeShareModel),
    form: types.maybe(FormNodeModel),
    sliderNode: types.maybeNull(SliderNodeModel),
  })
  .actions((self) => ({
    /**
     * Finds candidate edge child based on `key`.
     * @param key
     */
    getNextEdgeIdFromKey(key: any): EdgeOutput {
      // If we already are at leaf, go to POST-LEAF-EDGE
      if (self.isLeaf) {
        return {
          goesToLeaf: false,
          goesToPostLeaf: true,
          edgeId: SpecialEdge.POST_LEAF_EDGE_ID,
        };
      }

      const candidateEdge = self.children.find((child: TreeEdgeProps) => child.matchesKeyByCondition(key));

      // If there are no edges (but we are not at leaf yet) => Return Leaf ID
      if (!candidateEdge) {
        return {
          goesToLeaf: true,
          goesToPostLeaf: false,
          edgeId: SpecialEdge.POST_LEAF_EDGE_ID,
        };
      }

      return {
        goesToLeaf: false,
        goesToPostLeaf: false,
        nextNode: candidateEdge?.childNode,
        edgeId: candidateEdge.id,
      };
    },
  }));

export const createDefaultPostLeafNode = () => {
  const node = TreeNodeModel.create({
    id: SpecialEdge.POST_LEAF_EDGE_ID,
    title: 'Thank you for participating',
    type: 'POST_LEAF',
    isLeaf: true,
    isPostLeaf: true,
  });

  return node;
};

export interface TreeNodeProps extends Instance<typeof TreeNodeModel>{}

export default TreeNodeModel;
