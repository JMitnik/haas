import {
  Edge as GeneratedEdge,
  Dialogue as GeneratedDialogue,
  Customer as GeneratedWorkspace,
  QuestionNode as GeneratedQuestionNode,
  QuestionOption as GeneratedQuestionOption,
  SessionEventInput as GeneratedSessionEventInput,
  CustomerSettings,
  LinkType,
} from './generated-types';

export { QuestionNodeTypeEnum } from './generated-types';

export type WorkspaceSettings = CustomerSettings;

export type LinkItemType = LinkType;

export type SessionEventInput = GeneratedSessionEventInput;

export type Dialogue = GeneratedDialogue;

export type Workspace = GeneratedWorkspace;

export interface QuestionNode extends GeneratedQuestionNode {
  postLeafBody?: string;
}

export type Edge = GeneratedEdge;

export type Choice = GeneratedQuestionOption;
