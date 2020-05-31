import { Instance, types } from 'mobx-state-tree';
// eslint-disable-next-line import/no-cycle
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import TreeNodeOptionModel from './TreeNodeOptionModel';

export const TreeNodeModel = types
  .model('TreeNode', {
    id: types.identifier,
    title: types.string,
    isRoot: types.boolean,
    type: types.string,
    children: types.array(types.maybe(types.reference(types.late(() => TreeEdgeModel)))),
    // TODO: How to do overrideLeaf?
    options: types.array(TreeNodeOptionModel),
  })
  .actions((self) => ({
    getNextEdgeFromKey(key: any) {
      console.log(self.children[0]?.childNode?.type);

      const candidateEdges = self.children.filter((child: TreeEdgeProps) => child.matchesKeyByCondition(key));

      if (candidateEdges.length === 0) {
        console.log('We should probably do leafs now');
        return self;
      }

      if (candidateEdges.length > 1) {
        console.log('We should probably do first only, but thats a problem');
      }

      const candidateEdge = candidateEdges[0];

      return candidateEdge;
    },
  }));

export interface TreeNodeProps extends Instance<typeof TreeNodeModel>{}

export default TreeNodeModel;
