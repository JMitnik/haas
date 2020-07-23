/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTopicBuilder
// ====================================================

export interface getTopicBuilder_customer_dialogue_leafs {
  __typename: "QuestionNode";
  id: string;
  title: string;
  type: string;
}

export interface getTopicBuilder_customer_dialogue_questions_overrideLeaf {
  __typename: "QuestionNode";
  id: string;
  type: string;
  title: string;
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
  isRoot: boolean;
  isLeaf: boolean;
  overrideLeaf: getTopicBuilder_customer_dialogue_questions_overrideLeaf | null;
  type: string;
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
