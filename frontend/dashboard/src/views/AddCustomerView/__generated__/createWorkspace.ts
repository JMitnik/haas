/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWorkspaceInput } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createWorkspace
// ====================================================

export interface createWorkspace_createWorkspace {
  __typename: "Customer";
  name: string;
}

export interface createWorkspace {
  createWorkspace: createWorkspace_createWorkspace;
}

export interface createWorkspaceVariables {
  input?: CreateWorkspaceInput | null;
}
