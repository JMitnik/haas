/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagsInputObjectType } from "./../../types/globalTypes";

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
  customerSlug?: string | null;
  dialogueSlug?: string | null;
  title?: string | null;
  description?: string | null;
  publicTitle?: string | null;
  contentType?: string | null;
  templateDialogueId?: string | null;
  tags?: TagsInputObjectType | null;
}
