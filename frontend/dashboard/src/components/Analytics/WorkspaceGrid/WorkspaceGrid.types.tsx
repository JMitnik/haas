import { GetSessionPaths, GetWorkspaceDialogueStatistics } from 'types/generated-types';

export type Dialogue = GetWorkspaceDialogueStatistics.Dialogues;
export type Session = GetSessionPaths._PathedSessions;

/** Hexagon representing a Group node (layer above Dialogue) */
export type HexagonGroupNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Group;
  label: string;
  subGroups: HexagonGroupNode[] | HexagonDialogueNode[];
  subGroupType: HexagonNodeType;
  depth: number;
  points?: string;
};

/** Hexagon representing a Dialogue */
export type HexagonDialogueNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Dialogue;
  dialogue: Dialogue;
  label: string;
  points?: string;
};

/** Hexagon representing a Topic */
export type HexagonQuestionNodeNode = {
  id: string;
  score: number;
  type: HexagonNodeType.QuestionNode;
  topic: string;
  points?: string;
};

/** Hexagon representing a Session */
export type HexagonSessionNode = {
  id: string;
  score: number;
  session: Session;
  type: HexagonNodeType.Session;
  points?: string;
};

export type HexagonNode = HexagonDialogueNode | HexagonQuestionNodeNode | HexagonGroupNode | HexagonSessionNode;

export interface HexagonState {
  currentNode?: HexagonNode;
  selectedNode?: HexagonNode;
  childNodes: HexagonNode[];
  viewMode: HexagonViewMode;
}

export enum HexagonNodeType {
  Group = 'Group',
  Dialogue = 'Dialogue',
  QuestionNode = 'QuestionNode',
  Session = 'Session',
}

export enum HexagonViewMode {
  Group = 'Group',
  Dialogue = 'Dialogue',
  QuestionNode = 'QuestionNode',
  Session = 'Session',
  Final = 'Final',
}
