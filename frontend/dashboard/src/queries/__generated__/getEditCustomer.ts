/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEditCustomer
// ====================================================

export interface getEditCustomer_customer_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
}

export interface getEditCustomer_customer_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: getEditCustomer_customer_settings_colourSettings | null;
}

export interface getEditCustomer_customer {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: getEditCustomer_customer_settings | null;
}

export interface getEditCustomer {
  customer: getEditCustomer_customer | null;
}

export interface getEditCustomerVariables {
  customerSlug: string;
}
