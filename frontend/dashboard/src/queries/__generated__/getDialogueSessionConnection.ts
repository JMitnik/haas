/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput, QuestionNodeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getDialogueSessionConnection
// ====================================================

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_relatedNode {
  __typename: "QuestionNode";
  title: string;
  type: QuestionNodeTypeEnum;
}

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_value {
  __typename: "NodeEntryValue";
  sliderNodeEntry: number | null;
  textboxNodeEntry: string | null;
  registrationNodeEntry: string | null;
  choiceNodeEntry: string | null;
  linkNodeEntry: string | null;
}

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries {
  __typename: "NodeEntry";
  id: string | null;
  depth: number | null;
  relatedNode: getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_relatedNode | null;
  /**
   * The core scoring value associated with the node entry.
   */
  value: getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries_value | null;
}

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions {
  __typename: "Session";
  id: string;
  createdAt: string;
  paths: number;
  score: number;
  nodeEntries: getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions_nodeEntries[];
}

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection_pageInfo {
  __typename: "PaginationPageInfo";
  pageIndex: number;
  nrPages: number;
}

export interface getDialogueSessionConnection_customer_dialogue_sessionConnection {
  __typename: "SessionConnection";
  sessions: getDialogueSessionConnection_customer_dialogue_sessionConnection_sessions[];
  pageInfo: getDialogueSessionConnection_customer_dialogue_sessionConnection_pageInfo;
  startDate: string | null;
  endDate: string | null;
}

export interface getDialogueSessionConnection_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  sessionConnection: getDialogueSessionConnection_customer_dialogue_sessionConnection | null;
}

export interface getDialogueSessionConnection_customer {
  __typename: "Customer";
  id: string;
  dialogue: getDialogueSessionConnection_customer_dialogue | null;
}

export interface getDialogueSessionConnection {
  customer: getDialogueSessionConnection_customer | null;
}

export interface getDialogueSessionConnectionVariables {
  dialogueSlug: string;
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
