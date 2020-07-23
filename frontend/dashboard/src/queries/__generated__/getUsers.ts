/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsers
// ====================================================

export interface getUsers_users_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getUsers_users {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: getUsers_users_role | null;
}

export interface getUsers {
  users: getUsers_users[];
}

export interface getUsersVariables {
  customerSlug: string;
}
