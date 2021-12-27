import { Instance, types } from 'mobx-state-tree';

import { SpecialEdge, TreeNodeModel, TreeNodeProps, createDefaultPostLeafNode } from './TreeNodeModel';
import { TreeEdgeModel, TreeEdgeProps } from './TreeEdgeModel';
import { TreeNodeOptionProps } from './TreeNodeOptionModel';
import TreeDialogueFinisherModel from './TreeDialogueFinisherModel';

const TreeModel = types
  .model({
    id: types.identifier,
    slug: types.string,
    title: types.string,
    publicTitle: types.maybeNull(types.string),
    nodes: types.array(TreeNodeModel),
    edges: types.array(TreeEdgeModel),
    leaves: types.array(TreeNodeModel),
    activeLeaf: types.reference(TreeNodeModel),
    dialogueFinisher: types.maybe(TreeDialogueFinisherModel),
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
        extraContent: node.extraContent,
        children: node.children.map((edge) => edge.id),
        type: node.type,
        options: node.options.map((option) => ({
          id: option.id,
          value: option.value,
          publicValue: option.publicValue,
          overrideLeaf: option.overrideLeaf?.id,
        })),
        overrideLeaf: node.overrideLeaf?.id,
        sliderNode: node.sliderNode,
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
        links: leaf.links,
        share: leaf?.share || undefined,
        form: leaf?.form || undefined,
      }));

      const defaultPostLeafNode = createDefaultPostLeafNode();

      self.leaves.replace([defaultPostLeafNode, ...newLeaves]);
      self.activeLeaf = defaultPostLeafNode;
    },

    /**
     * Extract Node by passing edge
     * @param edgeId
     */
    getChildNodeByEdge(edgeId: string | undefined): TreeNodeProps | null {
      if (!edgeId) return null;

      const edge: TreeEdgeProps | null = self.edges.find((edgeItem: TreeEdgeProps) => edgeItem.id === edgeId);

      if (edgeId === SpecialEdge.POST_LEAF_EDGE_ID) {
        return createDefaultPostLeafNode();
      }

      if (edgeId === SpecialEdge.LEAF_EDGE_ID) {
        return self.activeLeaf;
      }

      if (!edge) {
        throw new Error('Unable to find relevant edge');
      }

      return edge.childNode;
    },

    getNodeById(nodeId: string | undefined): TreeNodeProps | null {
      if (!nodeId) return null;

      const node = self.nodes.find((nodeItem) => nodeItem.id === nodeId);
      const leaf = self.leaves.find((nodeItem) => nodeItem.id === nodeId);

      return node || leaf || null;
    },

    /**
     * Sets the current active leaf on the tree.
     * @param node
     */
    setActiveLeafFromNode(node: TreeNodeProps): void {
      if (node.overrideLeaf) {
        self.activeLeaf = node.overrideLeaf;
      }
    },

    /**
     * Sets the current active leaf on the tree based on a choice selected.
     */
    setActiveLeafFromChoice(choice: TreeNodeOptionProps): void {
      if (choice.overrideLeaf) {
        self.activeLeaf = choice.overrideLeaf;
      }
    },

    /**
     * Sets the current active leaf.
     */
    setOverrideLeaf(overrideLeaf: TreeNodeProps): void {
      self.activeLeaf = overrideLeaf;
    },
  }))
  .views((self) => ({
    get rootNode(): TreeNodeProps {
      return self.nodes?.filter((node) => node.isRoot)?.[0];
    },
  }));

export interface TreeModelProps extends Instance<typeof TreeModel> { }

export default TreeModel;