import { DialogueTreeEdge, DialogueTreeNode } from '../models/questionnaire/entities/DialogueTreeTypes';
import { DialogueTreePath } from '../models/questionnaire/entities/DialoguePath';

export const traverseTree = (
  dialogueTree: DialogueTreeNode | undefined,
  decisionCallback: (dialogueTreeNode: DialogueTreeNode) => DialogueTreeEdge | undefined,
): DialogueTreePath => {
  if (!dialogueTree) throw new Error('No node');
  let nodes = [dialogueTree];
  let edges = [];
  let callToActionId: string | undefined = undefined;

  let isTraversing = true;
  let currentNode = dialogueTree;

  while (isTraversing) {
    if (!currentNode.isParentNodeOf) {
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

  return new DialogueTreePath(
    nodes,
    edges,
    callToActionId,
  );
}
