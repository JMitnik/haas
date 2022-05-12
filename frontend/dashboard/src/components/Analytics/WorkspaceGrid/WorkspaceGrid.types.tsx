import { GetDialogueTopics, GetSessionPaths, GetWorkspaceDialogueStatistics } from 'types/generated-types';

export type Topic = GetDialogueTopics.Topic;
export type Dialogue = GetWorkspaceDialogueStatistics.Dialogues;
export type Session = GetSessionPaths.PathedSessions;

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
export type HexagonTopicNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Topic;
  topic: Topic;
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

export type HexagonNode = HexagonDialogueNode | HexagonTopicNode | HexagonGroupNode | HexagonSessionNode;

export interface HexagonState {
  currentNode?: HexagonNode;
  selectedNode?: HexagonNode;
  childNodes: HexagonNode[];
  viewMode: HexagonViewMode;
}

export enum HexagonNodeType {
  Group = 'Group',
  Dialogue = 'Dialogue',
  Topic = 'Topic',
  Session = 'Individual',
}

export enum HexagonViewMode {
  Group = 'Group',
  Dialogue = 'Dialogue',
  Topic = 'Topic',
  Session = 'Individual',
  Final = 'Final',
}
