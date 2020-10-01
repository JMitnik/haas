/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DialogueFilterInputType, TagTypeEnum } from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getCustomerTriggerData
// ====================================================

export interface getCustomerTriggerData_customer_dialogues_customer {
  __typename: "Customer";
  slug: string;
}

export interface getCustomerTriggerData_customer_dialogues_tags {
  __typename: "Tag";
  id: string;
  type: TagTypeEnum;
  name: string;
}

export interface getCustomerTriggerData_customer_dialogues {
  __typename: "Dialogue";
  id: string;
  title: string;
  slug: string;
  publicTitle: string | null;
  creationDate: string | null;
  updatedAt: string | null;
  customerId: string;
  averageScore: number;
  customer: getCustomerTriggerData_customer_dialogues_customer | null;
  tags: getCustomerTriggerData_customer_dialogues_tags[] | null;
}

export interface getCustomerTriggerData_customer_users_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getCustomerTriggerData_customer_users {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: getCustomerTriggerData_customer_users_role | null;
}

export interface getCustomerTriggerData_customer {
  __typename: "Customer";
  id: string;
  dialogues: getCustomerTriggerData_customer_dialogues[] | null;
  users: getCustomerTriggerData_customer_users[] | null;
}

export interface getCustomerTriggerData {
  customer: getCustomerTriggerData_customer | null;
}

export interface getCustomerTriggerDataVariables {
  customerSlug: string;
  filter?: DialogueFilterInputType | null;
}
