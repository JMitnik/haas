/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestInviteInput } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: requestInvite
// ====================================================

export interface requestInvite_requestInvite {
  __typename: "RequestInviteOutput";
  didInvite: boolean;
}

export interface requestInvite {
  requestInvite: requestInvite_requestInvite;
}

export interface requestInviteVariables {
  input?: RequestInviteInput | null;
}
