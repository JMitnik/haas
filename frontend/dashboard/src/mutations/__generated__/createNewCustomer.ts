/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerCreateOptions } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createNewCustomer
// ====================================================

export interface createNewCustomer_createCustomer {
  __typename: "Customer";
  name: string;
}

export interface createNewCustomer {
  createCustomer: createNewCustomer_createCustomer;
}

export interface createNewCustomerVariables {
  name: string;
  options?: CustomerCreateOptions | null;
}
