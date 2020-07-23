/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagTypeEnum } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: sharedDialogueLayoutProps
// ====================================================

export interface sharedDialogueLayoutProps_customer_dialogue_tags {
  __typename: "Tag";
  type: TagTypeEnum;
}

export interface sharedDialogueLayoutProps_customer_dialogue {
  __typename: "Dialogue";
  title: string;
  tags: sharedDialogueLayoutProps_customer_dialogue_tags[] | null;
}

export interface sharedDialogueLayoutProps_customer {
  __typename: "Customer";
  id: string;
  dialogue: sharedDialogueLayoutProps_customer_dialogue | null;
}

export interface sharedDialogueLayoutProps {
  customer: sharedDialogueLayoutProps_customer | null;
}

export interface sharedDialogueLayoutPropsVariables {
  customerSlug: string;
  dialogueSlug: string;
}
