/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagsInputObjectType } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: editDialogue
// ====================================================

export interface editDialogue_editDialogue {
  __typename: "Dialogue";
  title: string;
}

export interface editDialogue {
  editDialogue: editDialogue_editDialogue;
}

export interface editDialogueVariables {
  customerSlug?: string | null;
  dialogueSlug?: string | null;
  title?: string | null;
  description?: string | null;
  publicTitle?: string | null;
  tags?: TagsInputObjectType | null;
  isWithoutGenData?: boolean | null;
}
