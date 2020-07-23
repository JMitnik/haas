/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TagTypeEnum } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getTags
// ====================================================

export interface getTags_tags {
  __typename: "Tag";
  name: string;
  id: string;
  customerId: string;
  type: TagTypeEnum;
}

export interface getTags {
  tags: getTags_tags[];
}

export interface getTagsVariables {
  customerSlug?: string | null;
}
