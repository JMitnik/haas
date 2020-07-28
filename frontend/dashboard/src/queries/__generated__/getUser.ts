/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_user_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getUser_user {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: getUser_user_role | null;
}

export interface getUser {
  user: getUser_user | null;
}

export interface getUserVariables {
  id: string;
}
