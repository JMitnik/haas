/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OptionsInputType, EdgeConditionInputType } from "./../../types/globalTypes";

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
  id: string;
  title: string;
  type: string;
  overrideLeafId: string;
  edgeId?: string | null;
  optionEntries?: OptionsInputType | null;
  edgeCondition?: EdgeConditionInputType | null;
}
