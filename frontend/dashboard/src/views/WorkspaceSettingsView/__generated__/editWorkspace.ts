/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditWorkspaceInput } from "../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: editWorkspace
// ====================================================

export interface editWorkspace_editWorkspace_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
}

export interface editWorkspace_editWorkspace_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: editWorkspace_editWorkspace_settings_colourSettings | null;
}

export interface editWorkspace_editWorkspace {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: editWorkspace_editWorkspace_settings | null;
}

export interface editWorkspace {
  editWorkspace: editWorkspace_editWorkspace;
}

export interface editWorkspaceVariables {
  input?: EditWorkspaceInput | null;
}
