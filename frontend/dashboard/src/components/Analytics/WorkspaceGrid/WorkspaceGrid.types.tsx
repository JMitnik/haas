import { ProvidedZoom, TransformMatrix } from '@visx/zoom/lib/types';

import { GetDialogueTopics, GetSessionPaths, GetWorkspaceDialogueStatistics, WorkspaceStatistics } from 'types/generated-types';

export type Topic = GetDialogueTopics.Topic;
export type Dialogue = GetWorkspaceDialogueStatistics.Dialogues;
export type Session = GetSessionPaths.PathedSessions;

export type ZoomProps = ProvidedZoom<SVGElement> & {
  transformMatrix: TransformMatrix;
  isDragging: boolean;
};

export enum HexagonNodeType {
  Group = 'Group',
  Dialogue = 'Dialogue',
  Topic = 'Topic',
  Session = 'Individual',
  Workspace = 'Workspace',
}

export enum HexagonViewMode {
  Workspace = 'Workspace',
  Group = 'Group',
  Dialogue = 'Dialogue',
  Topic = 'Topic',
  Session = 'Individual',
  Final = 'Final',
}

export interface DialogueGroup {
  groupFragments: string[];
  dialogueTitle: string;
}

export interface HexagonGroupNodeStatics {
  voteCount: number;
  score: number;
}

export type HexagonWorkspaceNode = {
  id: string;
  label: string;
  type: HexagonNodeType.Workspace;
  score: number;
  statistics?: WorkspaceStatistics;
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

/** Hexagon representing a Group node (layer above Dialogue) */
export type HexagonGroupNode = {
  id: string;
  score: number;
  type: HexagonNodeType.Group;
  label: string;
  subGroups: HexagonGroupNode[] | HexagonDialogueNode[];
  subGroupType: HexagonNodeType;
  statistics?: HexagonGroupNodeStatics;
  points?: string;
};

/** Hexagon representing a Topic */
export type HexagonTopicNode = {
  id: string;
  label: string;
  score: number;
  type: HexagonNodeType.Topic;
  topic: Topic;
  points?: string;
};

/** Hexagon representing a Session */
export type HexagonSessionNode = {
  id: string;
  label: string;
  score: number;
  session: Session;
  type: HexagonNodeType.Session;
  points?: string;
};

export type HexagonNode = (
  HexagonDialogueNode | HexagonTopicNode | HexagonGroupNode | HexagonSessionNode | HexagonWorkspaceNode
);

export interface HexagonState {
  currentNode?: HexagonNode;
  selectedNode?: HexagonNode;
  childNodes: HexagonNode[];
  viewMode: HexagonViewMode;
}
