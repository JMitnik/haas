/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: dialogueStatistics
// ====================================================

export interface dialogueStatistics_customer_dialogue_sessions {
  __typename: "Session";
  id: string;
  createdAt: string;
  score: number;
}

export interface dialogueStatistics_customer_dialogue_statistics_topPositivePath {
  __typename: "topPathType";
  answer: string | null;
  basicSentiment: string | null;
  quantity: number | null;
}

export interface dialogueStatistics_customer_dialogue_statistics_topNegativePath {
  __typename: "topPathType";
  quantity: number | null;
  answer: string | null;
  basicSentiment: string | null;
}

export interface dialogueStatistics_customer_dialogue_statistics_mostPopularPath {
  __typename: "topPathType";
  quantity: number | null;
  answer: string | null;
  basicSentiment: string | null;
}

export interface dialogueStatistics_customer_dialogue_statistics_history {
  __typename: "lineChartDataType";
  x: string | null;
  y: number | null;
}

export interface dialogueStatistics_customer_dialogue_statistics {
  __typename: "DialogueStatistics";
  topPositivePath: dialogueStatistics_customer_dialogue_statistics_topPositivePath[] | null;
  topNegativePath: dialogueStatistics_customer_dialogue_statistics_topNegativePath[] | null;
  mostPopularPath: dialogueStatistics_customer_dialogue_statistics_mostPopularPath | null;
  history: dialogueStatistics_customer_dialogue_statistics_history[] | null;
}

export interface dialogueStatistics_customer_dialogue {
  __typename: "Dialogue";
  id: string;
  countInteractions: number;
  averageScore: number;
  sessions: dialogueStatistics_customer_dialogue_sessions[];
  statistics: dialogueStatistics_customer_dialogue_statistics | null;
}

export interface dialogueStatistics_customer {
  __typename: "Customer";
  id: string;
  dialogue: dialogueStatistics_customer_dialogue | null;
}

export interface dialogueStatistics {
  customer: dialogueStatistics_customer | null;
}

export interface dialogueStatisticsVariables {
  customerSlug: string;
  dialogueSlug: string;
}
