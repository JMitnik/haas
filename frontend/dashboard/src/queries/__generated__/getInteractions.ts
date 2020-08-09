/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getInteractions
// ====================================================

export interface getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries_relatedNode {
  __typename: "QuestionNode";
  title: string;
  type: string;
}

export interface getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries_value {
  __typename: "NodeEntryValue";
  sliderNodeEntry: number | null;
  textboxNodeEntry: string | null;
  registrationNodeEntry: string | null;
  choiceNodeEntry: string | null;
  linkNodeEntry: string | null;
}

export interface getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries {
  __typename: "NodeEntry";
  id: string | null;
  depth: number | null;
  relatedNode: getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries_relatedNode | null;
  /**
   * The core scoring value associated with the node entry.
   */
  value: getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries_value | null;
}

export interface getInteractions_customer_dialogue_sessionConnection_sessions {
  __typename: "Session";
  id: string;
  createdAt: string;
  paths: number;
  score: number;
  nodeEntries: getInteractions_customer_dialogue_sessionConnection_sessions_nodeEntries[];
}

export interface getInteractions_customer_dialogue_sessionConnection_pageInfo {
  __typename: "PaginationPageInfo";
  pageIndex: number;
  nrPages: number;
}

export interface getInteractions_customer_dialogue_sessionConnection {
  __typename: "SessionConnection";
  sessions: getInteractions_customer_dialogue_sessionConnection_sessions[];
  pageInfo: getInteractions_customer_dialogue_sessionConnection_pageInfo;
  startDate: string | null;
  endDate: string | null;
}

export interface getInteractions_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  sessionConnection: getInteractions_customer_dialogue_sessionConnection | null;
}

export interface getInteractions_customer {
  __typename: "Customer";
  id: string;
  dialogue: getInteractions_customer_dialogue | null;
}

export interface getInteractions {
  customer: getInteractions_customer | null;
}

export interface getInteractionsVariables {
  dialogueSlug: string;
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
