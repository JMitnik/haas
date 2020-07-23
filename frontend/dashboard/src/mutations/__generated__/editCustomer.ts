/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerEditOptions } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: editCustomer
// ====================================================

export interface editCustomer_editCustomer {
  __typename: "Customer";
  id: string;
}

export interface editCustomer {
  editCustomer: editCustomer_editCustomer;
}

export interface editCustomerVariables {
  id: string;
  options?: CustomerEditOptions | null;
}
