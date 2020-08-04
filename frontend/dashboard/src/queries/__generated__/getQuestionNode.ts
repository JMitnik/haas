/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionNodeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getQuestionNode
// ====================================================

export interface getQuestionNode_questionNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
  type: QuestionNodeTypeEnum;
}

export interface getQuestionNode {
  questionNode: getQuestionNode_questionNode | null;
}

export interface getQuestionNodeVariables {
  id: string;
}
