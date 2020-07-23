/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TopicDataEntry } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateTopicBuilder
// ====================================================

export interface updateTopicBuilder {
  updateTopicBuilder: string;
}

export interface updateTopicBuilderVariables {
  dialogueSlug: string;
  customerSlug: string;
  topicData?: TopicDataEntry | null;
}
