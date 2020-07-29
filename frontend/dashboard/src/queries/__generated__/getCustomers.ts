/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCustomers
// ====================================================

export interface getCustomers_customers_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
  secondary: string | null;
}

export interface getCustomers_customers_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: getCustomers_customers_settings_colourSettings | null;
}

export interface getCustomers_customers_dialogues {
  __typename: "Dialogue";
  id: string;
  description: string;
  title: string;
  publicTitle: string | null;
}

export interface getCustomers_customers {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: getCustomers_customers_settings | null;
  dialogues: getCustomers_customers_dialogues[] | null;
}

export interface getCustomers {
  customers: getCustomers_customers[];
}
