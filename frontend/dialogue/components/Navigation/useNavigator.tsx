import { useNavigate } from 'react-router';

import { useSession } from '../Session/SessionProvider';
import { QuestionNode } from '../../types/helper-types';

export type StateType = 'Question' | 'CTA' | 'FINISHER';

export interface TransitionInput {
  currentStateType: StateType;
  currentNode: QuestionNode;
  childNodeId: string;
  activeCallToActionId: string;
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
  const { sessionId } = useSession();

  const transition = ({ currentStateType, currentNode, childNodeId, activeCallToActionId }: TransitionInput) => {
    if (input.event.toNodeId) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${input.event.toNodeId}`);
    } else if (activeCallToAction) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/${activeCallToAction.id}`);
      // TODO: Account for the fact
    } else if (currentNode.id === activeCallToAction.id) {
      navigate(`/${workspaceSlug}/${dialogueSlug}/n/finisher`);
    }
  };

  return {
    transition,
  }
}
