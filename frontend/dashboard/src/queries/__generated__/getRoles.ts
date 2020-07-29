/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoles
// ====================================================

export interface getRoles_roles {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getRoles {
  roles: getRoles_roles[] | null;
}

export interface getRolesVariables {
  customerSlug: string;
}
