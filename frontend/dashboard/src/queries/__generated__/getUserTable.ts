/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getUserTable
// ====================================================

export interface getUserTable_userTable_users_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getUserTable_userTable_users {
  __typename: "UserType";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: getUserTable_userTable_users_role | null;
}

export interface getUserTable_userTable {
  __typename: "UserTable";
  users: getUserTable_userTable_users[];
  totalPages: number | null;
  pageIndex: number | null;
}

export interface getUserTable {
  userTable: getUserTable_userTable | null;
}

export interface getUserTableVariables {
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
