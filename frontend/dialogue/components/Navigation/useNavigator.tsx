import { useNavigate, useNavigationType, useParams } from 'react-router';

export type StateType = 'Question' | 'CTA' | 'FINISHER';

export interface NavigationState {

  currentStateType: StateType;
  currentNodeId?: string;
  childNodeId?: string;
  activeCallToActionId?: string;
}

/**
 * Navigate the user to a new node based on an action event.
 * @returns
 */
export const useNavigator = () => {
  const navigate = useNavigate();

  const goToNextState = ({ childNodeId }: NavigationState) => {

  }

  return {
    goToNextState,
  }
}
