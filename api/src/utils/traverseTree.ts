import { DialogueTreeEdgeNode, DialogueTreeNode, DialogueTreePath } from './buildTree';

export const traverseTree = (
  dialogueTree: DialogueTreeNode,
  decisionCallback: (dialogueTreeNode: DialogueTreeNode) => DialogueTreeEdgeNode | undefined,
): DialogueTreePath => {
  let nodes = [dialogueTree];
  let edges = [];
  let callToActionId: string | undefined = undefined;

  let isTraversing = true;
  let currentNode = dialogueTree;

  while (isTraversing) {
    if (!currentNode.children) {
      isTraversing = false;
      break;
    }

    const nextEdge = decisionCallback(currentNode);

    if (!nextEdge?.childNode) {
      isTraversing = false;
      break;
    }

    const nextNode = nextEdge.childNode;
    if (nextNode?.overrideLeafId) {
      callToActionId = nextNode?.overrideLeafId;
    }


    edges.push(nextEdge);
    nodes.push(nextNode);
    currentNode = nextEdge?.childNode;
  }

  return {
    nodes,
    edges,
    callToActionId,
  };
}
