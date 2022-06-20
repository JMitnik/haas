import { POSTLEAFNODE_ID } from 'modules/PostLeafNode/PostLeafNode';
import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface Params {
  nodeId: string;
  workspaceSlug: string;
  dialogueSlug: string;
}

export const useNavigator = () => {
  const { nodeId, workspaceSlug, dialogueSlug } = useParams<Params>();
  const history = useHistory();

  const transition = useCallback((toNodeId?: string) => {
    if (!workspaceSlug && !dialogueSlug) return;

    console.log(workspaceSlug, dialogueSlug);
    // / If we have a node-id in the state, go there (can be regular question-node, CTA or FINISHER)
    if (toNodeId) {
      history.push(`/${workspaceSlug}/${dialogueSlug}/n/${toNodeId}`);
      return;
    }

    // If we don't have any node to go to, we default to the FINISHER. This is however a bug, as the `applyEvent`,
    // should ensure that a state.nodeID is always present, even if it is FINISHER.
    if (!toNodeId) {
      // logger.error('No nodeId in state, defaulting to FINISHER. This should not happen.');
      history.push(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
    }
  }, [workspaceSlug, dialogueSlug, history]);

  return {
    nodeId,
    workspaceSlug,
    dialogueSlug,
    transition,
  };
};
