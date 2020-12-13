/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuestionNodeTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getQuestionNode
// ====================================================

export interface getQuestionNode_questionNode_sliderNode_markers_range {
  __typename: "SliderNodeRangeType";
  id: string;
  start: number | null;
  end: number | null;
}

export interface getQuestionNode_questionNode_sliderNode_markers {
  __typename: "SliderNodeMarkerType";
  id: string;
  label: string;
  subLabel: string;
  range: getQuestionNode_questionNode_sliderNode_markers_range | null;
}

export interface getQuestionNode_questionNode_sliderNode {
  __typename: "SliderNodeType";
  id: string | null;
  markers: getQuestionNode_questionNode_sliderNode_markers[] | null;
}

export interface getQuestionNode_questionNode {
  __typename: "QuestionNode";
  id: string;
  title: string;
  type: QuestionNodeTypeEnum;
  /**
   * Slidernode resolver
   */
  sliderNode: getQuestionNode_questionNode_sliderNode | null;
}

export interface getQuestionNode {
  questionNode: getQuestionNode_questionNode | null;
}

export interface getQuestionNodeVariables {
  id: string;
}
