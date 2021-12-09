import { ActionEvent, ActionType } from 'components/Dialogue/DialogueRouter';
import { QuestionNode as QuestionNodeType } from 'types/helper-types';

export interface RunActionInput {
  event: ActionEvent;
  activeCallToAction?: QuestionNodeType;
}

export interface QuestionNodeProps {
  node: QuestionNodeType;
  onRunAction: (input: RunActionInput) => void;
  // onNavigate: (node: string | null) => void;
};
