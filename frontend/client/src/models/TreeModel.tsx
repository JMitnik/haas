import { Instance, types } from 'mobx-state-tree';
import TreeEdgeModel, { TreeEdgeProps } from './TreeEdgeModel';
import TreeNode, { TreeNodeProps } from './TreeNodeModel';

const TreeModel = types
  .model({
    nodes: types.optional(types.array(TreeNode), []),
    edges: types.optional(types.array(TreeEdgeModel), []),
  })
  .actions((self) => ({
    setNodes(nodes: TreeNodeProps[]) {
      self.nodes.replace(nodes);
    },
    setInitialNodes(nodes: TreeNodeProps[]) {
      nodes.forEach((node) => {
        const newNode = TreeNode.create({
          id: node.id,
          isRoot: node.isRoot,
          title: node.title,
          children: node.children.map((edge) => edge.id),
        });

        self.nodes.push(newNode);
      });
    },
    setInitialEdges(edges: TreeEdgeProps[]) {
      edges.forEach((edge) => {
        const newEdge = TreeEdgeModel.create({
          id: edge.id,
          parentNode: edge.parentNode.id,
          childNode: edge.childNode.id,
        });

        self.edges.push(newEdge);
      });
    },
  }))
  .views((self) => ({
    get rootNode(): TreeNodeProps {
      return self.nodes?.filter((node) => node.isRoot)[0];
    },
  }));

export interface TreeModelProps extends Instance<typeof TreeModel>{}

export default TreeModel;
