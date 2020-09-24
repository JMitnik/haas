/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserOfCustomerInput, SystemPermission } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getCustomerOfUser
// ====================================================

export interface getCustomerOfUser_UserOfCustomer_customer_settings_colourSettings {
  __typename: "ColourSettings";
  primary: string;
}

export interface getCustomerOfUser_UserOfCustomer_customer_settings {
  __typename: "CustomerSettings";
  logoUrl: string | null;
  colourSettings: getCustomerOfUser_UserOfCustomer_customer_settings_colourSettings | null;
}

export interface getCustomerOfUser_UserOfCustomer_customer {
  __typename: "Customer";
  id: string;
  name: string;
  slug: string;
  settings: getCustomerOfUser_UserOfCustomer_customer_settings | null;
}

export interface getCustomerOfUser_UserOfCustomer_role {
  __typename: "RoleType";
  name: string;
  permissions: SystemPermission[] | null;
}

export interface getCustomerOfUser_UserOfCustomer_user {
  __typename: "UserType";
  id: string;
}

export interface getCustomerOfUser_UserOfCustomer {
  __typename: "UserCustomer";
  customer: getCustomerOfUser_UserOfCustomer_customer;
  role: getCustomerOfUser_UserOfCustomer_role;
  user: getCustomerOfUser_UserOfCustomer_user;
}

export interface getCustomerOfUser {
  UserOfCustomer: getCustomerOfUser_UserOfCustomer | null;
}

export interface getCustomerOfUserVariables {
  input?: UserOfCustomerInput | null;
}
