import {
  Customer as GeneratedWorkspace,
  CustomerSettings,
  Dialogue as GeneratedDialogue,
  Edge as GeneratedEdge,
  LinkType,
  QuestionNode as GeneratedQuestionNode,
  QuestionOption as GeneratedQuestionOption,
  SessionEventInput as GeneratedSessionEventInput,
  SessionStateInput as GeneratedSessionStateInput,
} from './generated-types';

export { QuestionNodeTypeEnum } from './generated-types';
export { SessionActionType } from './generated-types';

export type SessionAction = SessionActionInput;

export interface SessionReward {
  /** The optional child-edge that is derived based on the state+action of the current event */
  toEdge?: string;
  /** The resulting node based on `toEdge`.  */
  toNode?: string;

  /** Which call to action was set on this session-reward. */
  overrideCallToActionId?: string;
}

export interface SessionState extends GeneratedSessionStateInput {
  activeCallToActionId?: string;
}

export interface SessionEvent extends GeneratedSessionEventInput {
  reward?: SessionReward;
  state?: SessionState;
}

export type WorkspaceSettings = CustomerSettings;

export type LinkItemType = LinkType;

export type SessionActionInput = GeneratedSessionEventInput;

export type Dialogue = GeneratedDialogue;

export type Workspace = GeneratedWorkspace;

export interface QuestionNode extends GeneratedQuestionNode {
  postLeafBody?: string;
}

export type Edge = GeneratedEdge;

export type Choice = GeneratedQuestionOption;

