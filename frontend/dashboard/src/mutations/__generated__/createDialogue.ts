/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDialogueInputType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createDialogue
// ====================================================

export interface createDialogue_createDialogue {
  __typename: "Dialogue";
  id: string;
  title: string;
}

export interface createDialogue {
  createDialogue: createDialogue_createDialogue;
}

export interface createDialogueVariables {
  input?: CreateDialogueInputType | null;
}
