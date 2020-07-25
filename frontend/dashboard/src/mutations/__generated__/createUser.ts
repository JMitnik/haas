/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createUser
// ====================================================

export interface createUser_createUser {
  __typename: "UserType";
  id: string;
}

export interface createUser {
  createUser: createUser_createUser;
}

export interface createUserVariables {
  customerSlug: string;
  input?: UserInput | null;
}
