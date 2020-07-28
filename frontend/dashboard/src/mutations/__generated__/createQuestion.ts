/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OptionsInputType, EdgeConditionInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createQuestion
// ====================================================

export interface createQuestion_createQuestion {
  __typename: "QuestionNode";
  id: string;
}

export interface createQuestion {
  createQuestion: createQuestion_createQuestion | null;
}

export interface createQuestionVariables {
  customerSlug: string;
  dialogueSlug: string;
  title: string;
  type: string;
  overrideLeafId: string;
  parentQuestionId: string;
  optionEntries?: OptionsInputType | null;
  edgeCondition?: EdgeConditionInputType | null;
}
