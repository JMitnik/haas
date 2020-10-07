/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditUserInput, SystemPermission } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: editUser
// ====================================================

export interface editUser_editUser_userCustomers_role {
  __typename: "RoleType";
  permissions: SystemPermission[] | null;
}

export interface editUser_editUser_userCustomers_customer {
  __typename: "Customer";
  id: string;
  slug: string;
}

export interface editUser_editUser_userCustomers {
  __typename: "UserCustomer";
  role: editUser_editUser_userCustomers_role;
  customer: editUser_editUser_userCustomers_customer;
}

export interface editUser_editUser {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userCustomers: editUser_editUser_userCustomers[];
}

export interface editUser {
  editUser: editUser_editUser;
}

export interface editUserVariables {
  userId: string;
  input?: EditUserInput | null;
}
