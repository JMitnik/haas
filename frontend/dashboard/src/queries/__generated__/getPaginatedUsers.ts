/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getPaginatedUsers
// ====================================================

export interface getPaginatedUsers_customer_usersConnection_userCustomers_user {
  __typename: "UserType";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface getPaginatedUsers_customer_usersConnection_userCustomers_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getPaginatedUsers_customer_usersConnection_userCustomers {
  __typename: "UserCustomer";
  user: getPaginatedUsers_customer_usersConnection_userCustomers_user;
  role: getPaginatedUsers_customer_usersConnection_userCustomers_role;
}

export interface getPaginatedUsers_customer_usersConnection {
  __typename: "UserConnection";
  userCustomers: getPaginatedUsers_customer_usersConnection_userCustomers[];
  totalPages: number | null;
  pageIndex: number | null;
}

export interface getPaginatedUsers_customer {
  __typename: "Customer";
  id: string;
  usersConnection: getPaginatedUsers_customer_usersConnection | null;
}

export interface getPaginatedUsers {
  customer: getPaginatedUsers_customer | null;
}

export interface getPaginatedUsersVariables {
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
