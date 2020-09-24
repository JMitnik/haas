/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditUserInput, SystemPermission } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: FirstTimeEditUser
// ====================================================

export interface FirstTimeEditUser_editUser_userCustomers_role {
  __typename: "RoleType";
  permissions: SystemPermission[] | null;
}

export interface FirstTimeEditUser_editUser_userCustomers_customer {
  __typename: "Customer";
  id: string;
  slug: string;
}

export interface FirstTimeEditUser_editUser_userCustomers {
  __typename: "UserCustomer";
  role: FirstTimeEditUser_editUser_userCustomers_role;
  customer: FirstTimeEditUser_editUser_userCustomers_customer;
}

export interface FirstTimeEditUser_editUser {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userCustomers: FirstTimeEditUser_editUser_userCustomers[];
}

export interface FirstTimeEditUser {
  editUser: FirstTimeEditUser_editUser;
}

export interface FirstTimeEditUserVariables {
  userId: string;
  input?: EditUserInput | null;
}
