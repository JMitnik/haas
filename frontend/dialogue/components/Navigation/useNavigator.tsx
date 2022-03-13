import { useNavigate } from 'react-router';
import { useLogger } from '@haas/tools';

import { POSTLEAFNODE_ID } from '../PostLeafNode/PostLeafNode';
import { SessionEvent } from '../../types/core-types';

export type StateType = 'Question' | 'CTA' | 'FINISHER';

export interface TransitionInput {
  currentNodeId: string;
  childNodeId?: string;
  incomingEdgeId?: string;
  activeCallToActionId?: string;
}

export interface NavigationState {
  currentStateType: StateType;
  currentNodeId?: string;
  childNodeId?: string;
  activeCallToActionId?: string;
}

export interface UseNavigatorProps {
  dialogueSlug: string;
  workspaceSlug: string;
  fromNode?: string;
}

/**
 * Navigate the user to a new node based on an action event.
 * @returns
 */
export const useNavigator = ({ dialogueSlug, workspaceSlug }: UseNavigatorProps) => {
  const navigate = useNavigate();
  const { logger } = useLogger();

  /**
   * The transition function dictates where to go next based on the input parameters and available state.
   * @param currentStateType State type: Node, CTA or FINISHER
   */
  const transition = ({ state }: SessionEvent) => {
    // If we have a node-id in the state, go there (can be regular question-node, CTA or FINISHER)
    if (state.nodeId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${state.nodeId}`);
      return;
    }

    // If we don't have any node to go to, we default to the FINISHER. This is however a bug, as the `applyEvent`,
    // should ensure that a state.nodeID is always present, even if it is FINISHER.
    if (!state.nodeId) {
      logger.error('No nodeId in state, defaulting to FINISHER. This should not happen.');
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
      return;
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const goToStart = () => {
    navigate(`/${workspaceSlug}/${dialogueSlug}`);
  }

  const goToNotFound = () => {
    return navigate(`/${workspaceSlug}/${dialogueSlug}/404/`);
  }

  return {
    transition,
    goBack,
    goToNotFound,
    goToStart,
  }
}
