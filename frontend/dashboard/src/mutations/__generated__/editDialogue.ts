/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagsInputObjectType } from "./../../../__generated__/globalTypes";

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
  dialogueId?: string | null;
  title?: string | null;
  description?: string | null;
  publicTitle?: string | null;
  tags?: TagsInputObjectType | null;
}
