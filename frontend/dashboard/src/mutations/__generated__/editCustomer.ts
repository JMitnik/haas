/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerEditOptions } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: editCustomer
// ====================================================

export interface editCustomer_editCustomer_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
}

export interface editCustomer_editCustomer_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: editCustomer_editCustomer_settings_colourSettings | null;
}

export interface editCustomer_editCustomer {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: editCustomer_editCustomer_settings | null;
}

export interface editCustomer {
  editCustomer: editCustomer_editCustomer;
}

export interface editCustomerVariables {
  id: string;
  options?: CustomerEditOptions | null;
}
