/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionNodeTypeEnum, FormNodeFieldTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getCTANodesOfDialogue
// ====================================================

export interface getCTANodesOfDialogue_customer_dialogue_leafs_links {
  __typename: "LinkType";
  id: string;
  url: string;
  title: string | null;
  iconUrl: string | null;
  backgroundColor: string | null;
  type: string;
}

export interface getCTANodesOfDialogue_customer_dialogue_leafs_share {
  __typename: "ShareNodeType";
  id: string;
  title: string;
  url: string;
  tooltip: string | null;
}

export interface getCTANodesOfDialogue_customer_dialogue_leafs_form_fields {
  __typename: "FormNodeField";
  id: string;
  label: string;
  type: FormNodeFieldTypeEnum;
  isRequired: boolean;
  position: number;
}

export interface getCTANodesOfDialogue_customer_dialogue_leafs_form {
  __typename: "FormNodeType";
  id: string | null;
  fields: getCTANodesOfDialogue_customer_dialogue_leafs_form_fields[];
}

export interface getCTANodesOfDialogue_customer_dialogue_leafs {
  __typename: "QuestionNode";
  id: string;
  title: string;
  type: QuestionNodeTypeEnum;
  links: getCTANodesOfDialogue_customer_dialogue_leafs_links[];
  share: getCTANodesOfDialogue_customer_dialogue_leafs_share | null;
  /**
   * FormNode resolver
   */
  form: getCTANodesOfDialogue_customer_dialogue_leafs_form | null;
}

export interface getCTANodesOfDialogue_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  slug: string;
  title: string;
  leafs: getCTANodesOfDialogue_customer_dialogue_leafs[];
}

export interface getCTANodesOfDialogue_customer {
  __typename: "Customer";
  id: string;
  dialogue: getCTANodesOfDialogue_customer_dialogue | null;
}

export interface getCTANodesOfDialogue {
  customer: getCTANodesOfDialogue_customer | null;
}

export interface getCTANodesOfDialogueVariables {
  customerSlug: string;
  dialogueSlug: string;
  searchTerm?: string | null;
}
