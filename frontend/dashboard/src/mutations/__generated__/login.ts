/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "UserType";
  id: string;
}

export interface login {
  login: login_login | null;
}

export interface loginVariables {
  input?: LoginInput | null;
}
