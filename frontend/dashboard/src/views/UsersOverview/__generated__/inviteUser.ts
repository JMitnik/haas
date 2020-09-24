/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InviteUserInput } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: inviteUser
// ====================================================

export interface inviteUser_inviteUser {
  __typename: "InviteUserOutput";
  didInvite: boolean;
  didAlreadyExist: boolean;
}

export interface inviteUser {
  /**
   * Invite a user to a particular customer domain, given an email and role
   */
  inviteUser: inviteUser_inviteUser;
}

export interface inviteUserVariables {
  input?: InviteUserInput | null;
}
