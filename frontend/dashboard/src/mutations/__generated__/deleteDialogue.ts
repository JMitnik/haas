/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteDialogueInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: deleteDialogue
// ====================================================

export interface deleteDialogue_deleteDialogue {
  __typename: "Dialogue";
  id: string;
}

export interface deleteDialogue {
  deleteDialogue: deleteDialogue_deleteDialogue;
}

export interface deleteDialogueVariables {
  input?: DeleteDialogueInputType | null;
}
