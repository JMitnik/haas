/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CTALinksInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updateCTA
// ====================================================

export interface updateCTA_updateCTA {
  __typename: "QuestionNode";
  id: string;
}

export interface updateCTA {
  updateCTA: updateCTA_updateCTA;
}

export interface updateCTAVariables {
  id: string;
  title: string;
  type: string;
  links?: CTALinksInputType | null;
}
