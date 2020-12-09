/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionNodeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getTopicBuilder
// ====================================================

export interface getTopicBuilder_customer_dialogue_leafs {
  __typename: "QuestionNode";
  id: string;
  title: string;
  type: QuestionNodeTypeEnum;
}

export interface getTopicBuilder_customer_dialogue_questions_overrideLeaf {
  __typename: "QuestionNode";
  id: string;
  type: QuestionNodeTypeEnum;
  title: string;
}

export interface getTopicBuilder_customer_dialogue_questions_sliderNode_markers_range {
  __typename: "SliderNodeRangeType";
  start: number | null;
  end: number | null;
}

export interface getTopicBuilder_customer_dialogue_questions_sliderNode_markers {
  __typename: "SliderNodeMarkerType";
  id: string;
  label: string;
  subLabel: string;
  range: getTopicBuilder_customer_dialogue_questions_sliderNode_markers_range | null;
}

export interface getTopicBuilder_customer_dialogue_questions_sliderNode {
  __typename: "SliderNodeType";
  markers: getTopicBuilder_customer_dialogue_questions_sliderNode_markers[] | null;
}

export interface getTopicBuilder_customer_dialogue_questions_children_conditions {
  __typename: "EdgeCondition";
  id: number;
  conditionType: string;
  matchValue: string | null;
  renderMin: number | null;
  renderMax: number | null;
}

export interface getTopicBuilder_customer_dialogue_questions_children_parentNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
}

export interface getTopicBuilder_customer_dialogue_questions_children_childNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
}

export interface getTopicBuilder_customer_dialogue_questions_children {
  __typename: "Edge";
  id: string;
  conditions: getTopicBuilder_customer_dialogue_questions_children_conditions[] | null;
  parentNode: getTopicBuilder_customer_dialogue_questions_children_parentNode | null;
  childNode: getTopicBuilder_customer_dialogue_questions_children_childNode | null;
}

export interface getTopicBuilder_customer_dialogue_questions_options {
  __typename: "QuestionOption";
  id: number;
  value: string;
  publicValue: string | null;
}

export interface getTopicBuilder_customer_dialogue_questions {
  __typename: "QuestionNode";
  id: string;
  title: string;
  creationDate: string | null;
  updatedAt: string | null;
  isRoot: boolean;
  isLeaf: boolean;
  overrideLeaf: getTopicBuilder_customer_dialogue_questions_overrideLeaf | null;
  /**
   * Slidernode resolver
   */
  sliderNode: getTopicBuilder_customer_dialogue_questions_sliderNode | null;
  type: QuestionNodeTypeEnum;
  children: getTopicBuilder_customer_dialogue_questions_children[];
  options: getTopicBuilder_customer_dialogue_questions_options[];
}

export interface getTopicBuilder_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  title: string;
  publicTitle: string | null;
  creationDate: string | null;
  updatedAt: string | null;
  leafs: getTopicBuilder_customer_dialogue_leafs[];
  questions: getTopicBuilder_customer_dialogue_questions[];
}

export interface getTopicBuilder_customer {
  __typename: "Customer";
  id: string;
  dialogue: getTopicBuilder_customer_dialogue | null;
}

export interface getTopicBuilder {
  customer: getTopicBuilder_customer | null;
}

export interface getTopicBuilderVariables {
  customerSlug: string;
  dialogueSlug: string;
}
