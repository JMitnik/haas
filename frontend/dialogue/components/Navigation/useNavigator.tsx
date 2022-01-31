import { useNavigate } from 'react-router';

import { POSTLEAFNODE_ID } from '../PostLeafNode/PostLeafNode';

export type StateType = 'Question' | 'CTA' | 'FINISHER';

export interface TransitionInput {
  currentNodeId: string;
  childNodeId?: string;
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
  const transition = ({ currentNodeId, childNodeId, activeCallToActionId }: TransitionInput) => {
    // If we have a child node, navigate to it.
    if (childNodeId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${childNodeId}`);
      return;
    }

    // If we have no active call to action, go to the finisher.
    if (!activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
      return;
    }

    // If we are on the active Call-to-action already, go to the finisher
    if (activeCallToActionId && currentNodeId === activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${POSTLEAFNODE_ID}`);
      return;
    }

    // If we go to the activeCallToAction, go to the activeCallToAction.
    if (activeCallToActionId && currentNodeId !== activeCallToActionId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${activeCallToActionId}`);
      return;
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    transition,
    goBack,
  }
}
