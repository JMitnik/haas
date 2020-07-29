/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput, TriggerMediumEnum, TriggerTypeEnum, TriggerConditionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getTriggers
// ====================================================

export interface getTriggers_triggers_conditions {
  __typename: "TriggerConditionType";
  id: number;
  type: TriggerConditionEnum;
  minValue: number | null;
  maxValue: number | null;
  textValue: string | null;
}

export interface getTriggers_triggers_recipients {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
}

export interface getTriggers_triggers {
  __typename: "TriggerType";
  id: string;
  name: string;
  medium: TriggerMediumEnum;
  type: TriggerTypeEnum;
  conditions: getTriggers_triggers_conditions[];
  recipients: getTriggers_triggers_recipients[];
}

export interface getTriggers {
  triggers: getTriggers_triggers[];
}

export interface getTriggersVariables {
  customerSlug?: string | null;
  userId?: string | null;
  filter?: PaginationWhereInput | null;
}
