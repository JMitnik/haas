/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemPermission } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_userCustomers_customer {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
}

export interface me_me_userCustomers_role {
  __typename: "RoleType";
  name: string;
  permissions: SystemPermission[] | null;
}

export interface me_me_userCustomers {
  __typename: "UserCustomer";
  customer: me_me_userCustomers_customer;
  role: me_me_userCustomers_role;
}

export interface me_me {
  __typename: "UserType";
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  globalPermissions: SystemPermission[] | null;
  userCustomers: me_me_userCustomers[];
}

export interface me {
  me: me_me;
}
