/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput, TriggerMediumEnum, TriggerTypeEnum, TriggerConditionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getTriggerTable
// ====================================================

export interface getTriggerTable_triggerConnection_triggers_conditions {
  __typename: "TriggerConditionType";
  id: number;
  type: TriggerConditionEnum;
  minValue: number | null;
  maxValue: number | null;
  textValue: string | null;
}

export interface getTriggerTable_triggerConnection_triggers_recipients {
  __typename: "UserType";
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string;
}

export interface getTriggerTable_triggerConnection_triggers {
  __typename: "TriggerType";
  id: string;
  name: string;
  medium: TriggerMediumEnum;
  type: TriggerTypeEnum;
  conditions: getTriggerTable_triggerConnection_triggers_conditions[];
  recipients: getTriggerTable_triggerConnection_triggers_recipients[];
}

export interface getTriggerTable_triggerConnection_pageInfo {
  __typename: "PaginationPageInfo";
  pageIndex: number;
  nrPages: number;
}

export interface getTriggerTable_triggerConnection {
  __typename: "TriggerConnectionType";
  triggers: getTriggerTable_triggerConnection_triggers[];
  pageInfo: getTriggerTable_triggerConnection_pageInfo;
}

export interface getTriggerTable {
  triggerConnection: getTriggerTable_triggerConnection | null;
}

export interface getTriggerTableVariables {
  customerSlug: string;
  filter?: PaginationWhereInput | null;
}
