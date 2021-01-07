/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateCampaignInputType } from "./../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createCampaignMutation
// ====================================================

export interface createCampaignMutation_createCampaign {
  __typename: "Campaign";
  id: string;
}

export interface createCampaignMutation {
  createCampaign: createCampaignMutation_createCampaign;
}

export interface createCampaignMutationVariables {
  input?: CreateCampaignInputType | null;
}
