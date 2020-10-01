/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditUserInput, SystemPermission } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: EditMe
// ====================================================

export interface EditMe_editUser_userCustomers_role {
  __typename: "RoleType";
  permissions: SystemPermission[] | null;
}

export interface EditMe_editUser_userCustomers_customer {
  __typename: "Customer";
  id: string;
  slug: string;
}

export interface EditMe_editUser_userCustomers {
  __typename: "UserCustomer";
  role: EditMe_editUser_userCustomers_role;
  customer: EditMe_editUser_userCustomers_customer;
}

export interface EditMe_editUser {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userCustomers: EditMe_editUser_userCustomers[];
}

export interface EditMe {
  editUser: EditMe_editUser;
}

export interface EditMeVariables {
  userId: string;
  input?: EditUserInput | null;
}
