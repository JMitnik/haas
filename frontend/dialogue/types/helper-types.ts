import {
  Edge as GeneratedEdge,
  Dialogue as GeneratedDialogue,
  Customer as GeneratedWorkspace,
  QuestionNode as GeneratedQuestionNode,
  QuestionOption as GeneratedQuestionOption,
  SessionEventInput as GeneratedSessionEventInput,
  LinkType,
} from './generated-types';

export type LinkItemType = LinkType;

export type SessionEventInput = GeneratedSessionEventInput;

export type Dialogue = GeneratedDialogue;

export type Workspace = GeneratedWorkspace;

export type QuestionNode = GeneratedQuestionNode;

export type Edge = GeneratedEdge;

export type Choice = GeneratedQuestionOption;
