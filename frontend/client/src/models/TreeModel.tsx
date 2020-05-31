import { Instance, types } from 'mobx-state-tree';
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import { TreeNodeModel, TreeNodeProps, defaultTreeLeaf } from './TreeNodeModel';

const TreeModel = types
  .model({
    nodes: types.optional(types.array(TreeNodeModel), []),
    edges: types.optional(types.array(TreeEdgeModel), []),
    leaves: types.optional(types.array(TreeNodeModel), []),
    activeLeaf: types.maybe(types.reference(TreeNodeModel)),
  })
  .actions((self) => ({

    /**
     * Store nodes on tree-init
     */
    setInitialNodes(nodes: TreeNodeProps[]) {
      const newNodes = nodes.map((node) => TreeNodeModel.create({
        id: node.id,
        isRoot: node.isRoot,
        title: node.title,
        children: node.children.map((edge) => edge.id),
        type: node.type,
        options: node.options,
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
     * Store leaves on tree init
     * @param leaves
     */
    setInitialLeaves(leaves: TreeNodeProps[]) {
      const newLeaves = leaves.map((leaf) => TreeNodeModel.create({
        id: leaf.id,
        type: leaf.type,
        title: leaf.title,
        isLeaf: true,
      }));

      self.leaves.replace(newLeaves);
      self.leaves.push(defaultTreeLeaf);
      self.activeLeaf = defaultTreeLeaf;
    },

    /**
     * Extract Node by passing edge
     * @param edgeId
     */
    getChildNodeByEdge(edgeId: string | undefined) {
      const edge: TreeEdgeProps | null = self.edges.find((edge: TreeEdgeProps) => edge.id === edgeId);

      if (edgeId === String(-1)) {
        return self.activeLeaf;
      }

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
