/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getPaginatedUsers
// ====================================================

export interface getPaginatedUsers_customer_usersConnection_users_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getPaginatedUsers_customer_usersConnection_users {
  __typename: "UserType";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: getPaginatedUsers_customer_usersConnection_users_role | null;
}

export interface getPaginatedUsers_customer_usersConnection {
  __typename: "UserConnection";
  users: getPaginatedUsers_customer_usersConnection_users[];
  totalPages: number | null;
  pageIndex: number | null;
}

export interface getPaginatedUsers_customer {
  __typename: "Customer";
  usersConnection: getPaginatedUsers_customer_usersConnection | null;
}

export interface getPaginatedUsers {
  customer: getPaginatedUsers_customer | null;
}

export interface getPaginatedUsersVariables {
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
