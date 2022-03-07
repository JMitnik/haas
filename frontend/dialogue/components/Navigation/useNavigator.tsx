import { useNavigate } from 'react-router';

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

  /**
   * The transition function dictates where to go next based on the input parameters and available state.
   * @param currentStateType State type: Node, CTA or FINISHER
   */
  const transition = ({ state }: SessionEvent) => {
    // If we have a child node, navigate to it.
    if (state.nodeId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${state.nodeId}`);
      return;
    }

    const activeCallToActionId = state.activeCallToActionId;

    // If we have no active call to action, go to the finisher.
    if (!activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
      return;
    }

    // If we are on the active Call-to-action already, go to the finisher
    if (activeCallToActionId && state.nodeId === activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
      return;
    }

    // If we go to the activeCallToAction, go to the activeCallToAction.
    if (activeCallToActionId && state.nodeId !== activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${activeCallToActionId}`);
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
