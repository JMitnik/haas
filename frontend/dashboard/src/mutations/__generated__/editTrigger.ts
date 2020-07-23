/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TriggerInputType, RecipientsInputType, TriggerMediumEnum, TriggerTypeEnum } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: editTrigger
// ====================================================

export interface editTrigger_editTrigger_conditions {
  __typename: "TriggerConditionType";
  id: number;
  minValue: number | null;
  maxValue: number | null;
  textValue: string | null;
}

export interface editTrigger_editTrigger_recipients {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
}

export interface editTrigger_editTrigger {
  __typename: "TriggerType";
  id: string;
  name: string;
  medium: TriggerMediumEnum;
  type: TriggerTypeEnum;
  conditions: editTrigger_editTrigger_conditions[];
  recipients: editTrigger_editTrigger_recipients[];
}

export interface editTrigger {
  editTrigger: editTrigger_editTrigger;
}

export interface editTriggerVariables {
  triggerId: string;
  questionId?: string | null;
  trigger?: TriggerInputType | null;
  recipients?: RecipientsInputType | null;
}
