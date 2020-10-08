/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCTAInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createCTA
// ====================================================

export interface createCTA_createCTA {
  __typename: "QuestionNode";
  id: string;
}

export interface createCTA {
  /**
   * Create Call to Actions
   */
  createCTA: createCTA_createCTA;
}

export interface createCTAVariables {
  input?: CreateCTAInputType | null;
}
