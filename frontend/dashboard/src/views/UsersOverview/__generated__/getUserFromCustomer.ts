/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserFromCustomer
// ====================================================

export interface getUserFromCustomer_customer_userCustomer_user {
  __typename: "UserType";
  id: string;
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface getUserFromCustomer_customer_userCustomer_role {
  __typename: "RoleType";
  name: string;
  id: string;
}

export interface getUserFromCustomer_customer_userCustomer {
  __typename: "UserCustomer";
  user: getUserFromCustomer_customer_userCustomer_user;
  role: getUserFromCustomer_customer_userCustomer_role;
}

export interface getUserFromCustomer_customer {
  __typename: "Customer";
  id: string;
  userCustomer: getUserFromCustomer_customer_userCustomer | null;
}

export interface getUserFromCustomer {
  customer: getUserFromCustomer_customer | null;
}

export interface getUserFromCustomerVariables {
  userId: string;
  customerId: string;
}
