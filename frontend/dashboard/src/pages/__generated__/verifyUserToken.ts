/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SystemPermission } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: verifyUserToken
// ====================================================

export interface verifyUserToken_verifyUserToken_userData_userCustomers_role {
  __typename: "RoleType";
  permissions: SystemPermission[] | null;
}

export interface verifyUserToken_verifyUserToken_userData_userCustomers_customer {
  __typename: "Customer";
  id: string;
  slug: string;
}

export interface verifyUserToken_verifyUserToken_userData_userCustomers {
  __typename: "UserCustomer";
  role: verifyUserToken_verifyUserToken_userData_userCustomers_role;
  customer: verifyUserToken_verifyUserToken_userData_userCustomers_customer;
}

export interface verifyUserToken_verifyUserToken_userData {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userCustomers: verifyUserToken_verifyUserToken_userData_userCustomers[];
}

export interface verifyUserToken_verifyUserToken {
  __typename: "VerifyUserTokenOutput";
  accessToken: string;
  accessTokenExpiry: number;
  userData: verifyUserToken_verifyUserToken_userData;
}

export interface verifyUserToken {
  /**
   * Given a token, checks in the database whether token has been set and has not expired yet
   */
  verifyUserToken: verifyUserToken_verifyUserToken;
}

export interface verifyUserTokenVariables {
  token: string;
}
