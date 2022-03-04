import { QuestionNode, SessionEvent } from '../../types/core-types';

export interface QuestionNodeProps {
  node: QuestionNode;
  onRunAction: (input: SessionEvent) => void;
}
