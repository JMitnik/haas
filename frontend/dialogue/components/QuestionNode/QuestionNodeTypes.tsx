import { QuestionNode as QuestionNodeType, SessionEventInput } from '../../types/core-types';

export interface RunActionInput {
  event: SessionEventInput;
  activeCallToAction?: QuestionNodeType;
}

export interface QuestionNodeProps {
  node: QuestionNodeType;
  onRunAction: (input: RunActionInput) => void;
}
