import { QuestionNode, SessionEvent } from 'types/core-types';

export interface GenericQuestionNodeProps {
  node: QuestionNode;
  onRunAction: (input: SessionEvent) => void;
}
