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

export type HexagonNode = HexagonDialogueNode | HexagonQuestionNodeNode | HexagonGroupNode;

export enum HexagonNodeType {
  Group = 'Group',
  Dialogue = 'Dialogue',
  QuestionNode = 'QuestionNode',
}
