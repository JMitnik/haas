/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSessionAnswerFlow
// ====================================================

export interface getSessionAnswerFlow_session_nodeEntries_relatedNode {
  __typename: "QuestionNode";
  title: string;
  type: string;
}

export interface getSessionAnswerFlow_session_nodeEntries_value {
  __typename: "NodeEntryValue";
  sliderNodeEntry: number | null;
  textboxNodeEntry: string | null;
  registrationNodeEntry: string | null;
  linkNodeEntry: string | null;
  choiceNodeEntry: string | null;
}

export interface getSessionAnswerFlow_session_nodeEntries {
  __typename: "NodeEntry";
  id: string | null;
  depth: number | null;
  relatedNode: getSessionAnswerFlow_session_nodeEntries_relatedNode | null;
  /**
   * The core scoring value associated with the node entry.
   */
  value: getSessionAnswerFlow_session_nodeEntries_value | null;
}

export interface getSessionAnswerFlow_session {
  __typename: "Session";
  id: string;
  nodeEntries: getSessionAnswerFlow_session_nodeEntries[];
}

export interface getSessionAnswerFlow {
  session: getSessionAnswerFlow_session | null;
}

export interface getSessionAnswerFlowVariables {
  sessionId: string;
}
