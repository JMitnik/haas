/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagTypeEnum } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getEditDialogue
// ====================================================

export interface getEditDialogue_customer_dialogue_tags {
  __typename: "Tag";
  id: string;
  name: string;
  type: TagTypeEnum;
}

export interface getEditDialogue_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  title: string;
  slug: string;
  publicTitle: string | null;
  description: string;
  tags: getEditDialogue_customer_dialogue_tags[] | null;
}

export interface getEditDialogue_customer {
  __typename: "Customer";
  id: string;
  dialogue: getEditDialogue_customer_dialogue | null;
}

export interface getEditDialogue {
  customer: getEditDialogue_customer | null;
}

export interface getEditDialogueVariables {
  customerSlug: string;
  dialogueSlug: string;
}
