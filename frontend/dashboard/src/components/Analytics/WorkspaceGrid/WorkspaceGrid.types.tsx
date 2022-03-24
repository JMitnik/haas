import { GetWorkspaceDialogueStatistics } from 'types/generated-types';

export type Dialogue = GetWorkspaceDialogueStatistics.Dialogues;

export type HexagonGroupNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Group;
  label: string
  groups: HexagonGroupNode[];
  dialogues: Dialogue[];
};

export type HexagonDialogueNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Dialogue;
  dialogue: Dialogue;
  label: string;
};

export type HexagonQuestionNodeNode = {
  id: string;
  score: number;
  type: HexagonNodeType.QuestionNode;
  topic: string;
};

export type HexagonSessionNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Session;
};

export type HexagonNode = HexagonDialogueNode | HexagonQuestionNodeNode | HexagonGroupNode | HexagonSessionNode;

export interface HexagonState {
  parentNode: HexagonNode;
  childNodes: HexagonNode[];
}

export enum HexagonNodeType {
  Group = 'Group',
  Dialogue = 'Dialogue',
  QuestionNode = 'QuestionNode',
  Session = 'Session',
}
