/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CTALinksInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createCTA
// ====================================================

export interface createCTA_createCTA {
  __typename: "QuestionNode";
  id: string;
}

export interface createCTA {
  createCTA: createCTA_createCTA;
}

export interface createCTAVariables {
  customerSlug: string;
  dialogueSlug: string;
  title: string;
  type: string;
  links?: CTALinksInputType | null;
}
