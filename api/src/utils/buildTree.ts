interface Edge {
  childNodeId: string;
  parentNodeId: string;
}

interface Node {
  id: string;
  isRoot: boolean;
  children?: Edge[];
}

interface NodeEntry {
  relatedNodeId?: string;
}

export const buildTree = (nodes: Node[]) => {
  const recursiveGetChildren = (
    currentNode: Node,
  ) => {
    return {
      ...currentNode,
      children: currentNode?.children > 0 ? (
        currentNode?.children.map(childEdge => ({
        ...childEdge,
        childNode: nodes.find(node => node.id === childEdge.childNodeId),
      }))): undefined,
    }
  };

  const rootNode = nodes.find(node => node.isRoot);

  return recursiveGetChildren(rootNode);
}
