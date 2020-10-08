/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsers
// ====================================================

export interface getUsers_customer_users_role {
  __typename: "RoleType";
  id: string;
  name: string;
}

export interface getUsers_customer_users {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: getUsers_customer_users_role | null;
}

export interface getUsers_customer {
  __typename: "Customer";
  id: string;
  users: getUsers_customer_users[] | null;
}

export interface getUsers {
  customer: getUsers_customer | null;
}

export interface getUsersVariables {
  customerSlug: string;
}
