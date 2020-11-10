/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerMediumEnum, TriggerTypeEnum, TriggerConditionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getTrigger
// ====================================================

export interface getTrigger_trigger_relatedDialogue {
  __typename: "Dialogue";
  slug: string;
  title: string;
}

export interface getTrigger_trigger_conditions_question {
  __typename: "QuestionNode";
  title: string;
  id: string;
}

export interface getTrigger_trigger_conditions {
  __typename: "TriggerConditionType";
  id: number;
  type: TriggerConditionEnum;
  minValue: number | null;
  maxValue: number | null;
  textValue: string | null;
  question: getTrigger_trigger_conditions_question | null;
}

export interface getTrigger_trigger_recipients {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
}

export interface getTrigger_trigger {
  __typename: "TriggerType";
  id: string;
  name: string;
  medium: TriggerMediumEnum;
  type: TriggerTypeEnum;
  relatedDialogue: getTrigger_trigger_relatedDialogue | null;
  conditions: getTrigger_trigger_conditions[];
  recipients: getTrigger_trigger_recipients[];
}

export interface getTrigger {
  trigger: getTrigger_trigger | null;
}

export interface getTriggerVariables {
  id: string;
}
