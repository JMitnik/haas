/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateQuestionNodeInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateQuestion
// ====================================================

export interface updateQuestion_updateQuestion {
  __typename: "QuestionNode";
  id: string;
}

export interface updateQuestion {
  updateQuestion: updateQuestion_updateQuestion;
}

export interface updateQuestionVariables {
  input?: UpdateQuestionNodeInputType | null;
}
