export interface DialogueTreePath {
  edges: DialogueTreeEdgeNode[];
  nodes: DialogueTreeNode[];
  callToActionId?: string | null;
}
interface Edge {
  childNodeId: string;
  parentNodeId: string;
  conditions: EdgeCondition[];
}

interface EdgeCondition {
  renderMin?: number | null;
  renderMax?: number | null;
  matchValue?: string | null;
}

interface Node {
  id: string;
  isRoot: boolean;
  isParentNodeOf?: Edge[];
  overrideLeafId?: string | null;
}

export interface DialogueTreeNode {
  id: string;
  layer: number;
  isRoot?: boolean;
  children: DialogueTreeEdgeNode[];
  overrideLeafId?: string | null;
}

export interface DialogueTreeEdgeNode {
  childNode: DialogueTreeNode | undefined;
  conditions: EdgeCondition[];
}

export const buildTree = (nodes: Node[]) => {
  const recursiveGetChildren = (
    currentNode: Node,
    layer: number,
  ): DialogueTreeNode => {
    return {
      ...currentNode,
      layer,
      children: currentNode?.isParentNodeOf ? (
        currentNode?.isParentNodeOf.map(childEdge => {
          const childNode = nodes.find(node => node.id === childEdge.childNodeId);

          if (!childNode) {
            return { parentNodeId: currentNode.id, childNode: undefined, conditions: [] };
          }

          return {
            parentNodeId: currentNode.id,
            childNode: recursiveGetChildren(childNode, layer + 1),
            conditions: childEdge.conditions,
          }
        })
      ): []
    };
  };

  const rootNode = nodes.find(node => node.isRoot);

  if (!rootNode) {
    throw new Error('Root node not found in nodes');
  }

  const dialogueTree = recursiveGetChildren(rootNode, 0);
  return dialogueTree;
}
