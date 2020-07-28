/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CustomerFragment
// ====================================================

export interface CustomerFragment_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
  secondary: string | null;
}

export interface CustomerFragment_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: CustomerFragment_settings_colourSettings | null;
}

export interface CustomerFragment_dialogues {
  __typename: "Dialogue";
  id: string;
  description: string;
  title: string;
  publicTitle: string | null;
}

export interface CustomerFragment {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: CustomerFragment_settings | null;
  dialogues: CustomerFragment_dialogues[] | null;
}
