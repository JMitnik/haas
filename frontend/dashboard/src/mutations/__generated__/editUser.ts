/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditUserInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: editUser
// ====================================================

export interface editUser_editUser {
  __typename: "UserType";
  id: string;
}

export interface editUser {
  editUser: editUser_editUser;
}

export interface editUserVariables {
  id: string;
  input?: EditUserInput | null;
}
