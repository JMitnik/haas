import { POSTLEAFNODE_ID } from 'modules/PostLeafNode/PostLeafNode';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Params {
  nodeId: string;
  workspaceSlug: string;
  dialogueSlug: string;
}

export const useNavigator = () => {
  const { nodeId, workspaceSlug, dialogueSlug } = useParams<keyof Params>();
  const navigate = useNavigate();

  const transition = useCallback((toNodeId?: string) => {
    if (!workspaceSlug && !dialogueSlug) return;

    // / If we have a node-id in the state, go there (can be regular question-node, CTA or FINISHER)
    if (toNodeId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${toNodeId}`);
      return;
    }

    // If we don't have any node to go to, we default to the FINISHER. This is however a bug, as the `applyEvent`,
    // should ensure that a state.nodeID is always present, even if it is FINISHER.
    if (!toNodeId) {
      // logger.error('No nodeId in state, defaulting to FINISHER. This should not happen.');
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
    }
  }, [workspaceSlug, dialogueSlug, navigate]);

  return {
    nodeId,
    workspaceSlug,
    dialogueSlug,
    transition,
  };
};
