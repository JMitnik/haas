/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteQuestion
// ====================================================

export interface deleteQuestion_deleteQuestion {
  __typename: "QuestionNode";
  id: string;
}

export interface deleteQuestion {
  deleteQuestion: deleteQuestion_deleteQuestion;
}

export interface deleteQuestionVariables {
  id: string;
  customerSlug: string;
  dialogueSlug: string;
}
