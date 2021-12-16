import { QuestionNode as QuestionNodeType, SessionEventInput } from 'types/helper-types';

export interface RunActionInput {
  event: SessionEventInput;
  activeCallToAction?: QuestionNodeType;
}

export interface QuestionNodeProps {
  node: QuestionNodeType;
  onRunAction: (input: RunActionInput) => void;
};
