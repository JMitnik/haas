import { DialogueStateType, QuestionNode, SessionReward, SessionState } from 'types/core-types';

/**
 * Maps a node ID to a node.
 *
 * Example: { 'NODE_ID_1': {QuestionNode} }
 */
export const makeNodeMap = (nodes: QuestionNode[]): Record<string, QuestionNode> => {
  const idToNode = nodes.reduce((lookup, node) => {
    lookup[node.id] = node;

    return lookup;
  }, {} as Record<string, QuestionNode>);

  return idToNode;
};

/**
 * Calculate the new CallToAction override based on:
 * - An observed reward
 * - The currently active call-to-action
 * - None, if we are on the call-to-action already
 */
export const calculateNewCallToAction = (
  reward?: SessionReward,
  state?: SessionState,
): string | undefined => {
  // If we observe a reward with a new override, set it as new call-to-action. Else, use the state's existing
  // active call-to-action.
  let newCallToActionId = reward?.overrideCallToActionId || state?.activeCallToActionId || undefined;

  // If the new call-to-action is the same as the current node, unset it.
  if (state?.nodeId === newCallToActionId) {
    newCallToActionId = undefined;
  }

  return newCallToActionId;
};

interface StateOutput {
  nodeId: string;
  stateType: DialogueStateType;
}

/**
 * Calculate the next state id based on the reward, call-to-action, or the post-leaf-node.
 */
export const calculateNextState = (
  postLeafNodeId: string,
  reward?: SessionReward,
  callToActionId?: string,
): StateOutput => {
  if (reward?.toNode) {
    return { nodeId: reward.toNode, stateType: DialogueStateType.INVESTIGATING };
  }

  if (callToActionId) {
    return { nodeId: callToActionId, stateType: DialogueStateType.CALL_TO_ACTION };
  }

  return { nodeId: postLeafNodeId, stateType: DialogueStateType.POSTLEAF };
};
