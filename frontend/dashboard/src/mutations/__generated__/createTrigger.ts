/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateTriggerInputType, TriggerMediumEnum, TriggerTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createTrigger
// ====================================================

export interface createTrigger_createTrigger_conditions {
  __typename: "TriggerConditionType";
  id: number;
  minValue: number | null;
  maxValue: number | null;
  textValue: string | null;
}

export interface createTrigger_createTrigger_recipients {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
}

export interface createTrigger_createTrigger {
  __typename: "TriggerType";
  id: string;
  name: string;
  medium: TriggerMediumEnum;
  type: TriggerTypeEnum;
  conditions: createTrigger_createTrigger_conditions[];
  recipients: createTrigger_createTrigger_recipients[];
}

export interface createTrigger {
  createTrigger: createTrigger_createTrigger;
}

export interface createTriggerVariables {
  input?: CreateTriggerInputType | null;
}
