import { Instance, getSnapshot, types } from 'mobx-state-tree';
import { TreeEdgeConditionProps } from './TreeEdgeConditionModel';
import TreeEdgeModel, { TreeEdgeProps } from './TreeEdgeModel';
import TreeNode, { TreeNodeProps } from './TreeNodeModel';

const TreeModel = types
  .model({
    nodes: types.optional(types.array(TreeNode), []),
    edges: types.optional(types.array(TreeEdgeModel), []),
  })
  .actions((self) => ({
    /**
     * Store nodes on tree-init
     */
    setInitialNodes(nodes: TreeNodeProps[]) {
      const newNodes = nodes.map((node) => TreeNode.create({
        id: node.id,
        isRoot: node.isRoot,
        title: node.title,
        children: node.children.map((edge) => edge.id),
        type: node.type,
      }));

      self.nodes.replace(newNodes);
    },

    /**
     * Store edge on tree init
     * @param edges
     */
    setInitialEdges(edges: TreeEdgeProps[]) {
      const newEdges = edges.map((edge) => TreeEdgeModel.create({
        id: edge.id,
        parentNode: edge.parentNode.id,
        childNode: edge.childNode.id,
        conditions: edge.conditions,
      }));

      self.edges.replace(newEdges);
    },

    /**
     * Extract Node by passing edge
     * @param edgeId
     */
    getChildNodeByEdge(edgeId: string | undefined) {
      const edge: TreeEdgeProps | null = self.edges.find((edge: TreeEdgeProps) => edge.id === edgeId);

      if (!edge) {
        throw new Error('Unable to find relevant edge');
      }

      return edge.childNode;
    },
  }))
  .views((self) => ({
    get rootNode(): TreeNodeProps {
      return self.nodes?.filter((node) => node.isRoot)[0];
    },
  }));

export interface TreeModelProps extends Instance<typeof TreeModel>{}

export default TreeModel;
