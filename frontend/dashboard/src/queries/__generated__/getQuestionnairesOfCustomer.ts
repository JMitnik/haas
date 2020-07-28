/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DialogueFilterInputType, TagTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getQuestionnairesOfCustomer
// ====================================================

export interface getQuestionnairesOfCustomer_customer_dialogues_customer {
  __typename: "Customer";
  slug: string;
}

export interface getQuestionnairesOfCustomer_customer_dialogues_tags {
  __typename: "Tag";
  id: string;
  type: TagTypeEnum;
  name: string;
}

export interface getQuestionnairesOfCustomer_customer_dialogues {
  __typename: "Dialogue";
  id: string;
  title: string;
  slug: string;
  publicTitle: string | null;
  creationDate: string | null;
  updatedAt: string | null;
  customerId: string;
  averageScore: number;
  customer: getQuestionnairesOfCustomer_customer_dialogues_customer | null;
  tags: getQuestionnairesOfCustomer_customer_dialogues_tags[] | null;
}

export interface getQuestionnairesOfCustomer_customer {
  __typename: "Customer";
  id: string;
  dialogues: getQuestionnairesOfCustomer_customer_dialogues[] | null;
}

export interface getQuestionnairesOfCustomer {
  customer: getQuestionnairesOfCustomer_customer | null;
}

export interface getQuestionnairesOfCustomerVariables {
  customerSlug: string;
  filter?: DialogueFilterInputType | null;
}
