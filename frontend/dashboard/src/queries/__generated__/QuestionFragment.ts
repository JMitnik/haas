/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionNodeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: QuestionFragment
// ====================================================

export interface QuestionFragment_overrideLeaf {
  __typename: "QuestionNode";
  id: string;
  type: QuestionNodeTypeEnum;
  title: string;
}

export interface QuestionFragment_sliderNode_markers_range {
  __typename: "SliderNodeRangeType";
  start: number | null;
  end: number | null;
}

export interface QuestionFragment_sliderNode_markers {
  __typename: "SliderNodeMarkerType";
  id: string;
  label: string;
  subLabel: string;
  range: QuestionFragment_sliderNode_markers_range | null;
}

export interface QuestionFragment_sliderNode {
  __typename: "SliderNodeType";
  markers: QuestionFragment_sliderNode_markers[] | null;
}

export interface QuestionFragment_children_conditions {
  __typename: "EdgeCondition";
  id: number;
  conditionType: string;
  matchValue: string | null;
  renderMin: number | null;
  renderMax: number | null;
}

export interface QuestionFragment_children_parentNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
}

export interface QuestionFragment_children_childNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
}

export interface QuestionFragment_children {
  __typename: "Edge";
  id: string;
  conditions: QuestionFragment_children_conditions[] | null;
  parentNode: QuestionFragment_children_parentNode | null;
  childNode: QuestionFragment_children_childNode | null;
}

export interface QuestionFragment_options {
  __typename: "QuestionOption";
  id: number;
  value: string;
  publicValue: string | null;
}

export interface QuestionFragment {
  __typename: "QuestionNode";
  id: string;
  title: string;
  creationDate: string | null;
  updatedAt: string | null;
  isRoot: boolean;
  isLeaf: boolean;
  overrideLeaf: QuestionFragment_overrideLeaf | null;
  /**
   * Slidernode resolver
   */
  sliderNode: QuestionFragment_sliderNode | null;
  type: QuestionNodeTypeEnum;
  children: QuestionFragment_children[];
  options: QuestionFragment_options[];
}
