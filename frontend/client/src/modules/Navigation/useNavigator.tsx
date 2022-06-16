import { POSTLEAFNODE_ID } from 'modules/PostLeafNode/PostLeafNode';
import { useHistory, useParams } from 'react-router-dom';

interface Params {
  nodeId: string;
  workspace: string;
  dialogue: string;
}

export const useNavigator = () => {
  const { nodeId, workspace: workspaceSlug, dialogue: dialogueSlug } = useParams<Params>();
  const history = useHistory();

  const transition = (toNodeId?: string) => {
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
  };

  return {
    nodeId,
    workspaceSlug,
    dialogueSlug,
    transition,
  };
};
