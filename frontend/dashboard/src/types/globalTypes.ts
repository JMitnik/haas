/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * Ways to sort a pagination object
 */
export enum PaginationSortByEnum {
  createdAt = "createdAt",
  email = "email",
  firstName = "firstName",
  id = "id",
  lastName = "lastName",
  medium = "medium",
  name = "name",
  role = "role",
  score = "score",
  type = "type",
}

/**
 * The different types a node can assume
 */
export enum QuestionNodeTypeEnum {
  CHOICE = "CHOICE",
  GENERIC = "GENERIC",
  LINK = "LINK",
  REGISTRATION = "REGISTRATION",
  SLIDER = "SLIDER",
  TEXTBOX = "TEXTBOX",
}

export enum TagTypeEnum {
  AGENT = "AGENT",
  DEFAULT = "DEFAULT",
  LOCATION = "LOCATION",
}

export enum TriggerConditionEnum {
  HIGH_THRESHOLD = "HIGH_THRESHOLD",
  INNER_RANGE = "INNER_RANGE",
  LOW_THRESHOLD = "LOW_THRESHOLD",
  OUTER_RANGE = "OUTER_RANGE",
  TEXT_MATCH = "TEXT_MATCH",
}

export enum TriggerMediumEnum {
  BOTH = "BOTH",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
}

export enum TriggerTypeEnum {
  QUESTION = "QUESTION",
  SCHEDULED = "SCHEDULED",
}

export interface CustomerCreateOptions {
  slug: string;
  primaryColour: string;
  logo?: string | null;
  isSeed?: boolean | null;
}

export interface CustomerEditOptions {
  slug: string;
  name: string;
  logo?: string | null;
  primaryColour: string;
}

export interface DialogueFilterInputType {
  searchTerm?: string | null;
}

export interface EdgeChildInput {
  id?: string | null;
  conditions?: QuestionConditionInput[] | null;
  parentNode?: EdgeNodeInput | null;
  childNode?: EdgeNodeInput | null;
}

export interface EdgeNodeInput {
  id?: string | null;
  title?: string | null;
}

export interface LeafNodeInput {
  id?: string | null;
  type?: string | null;
  title?: string | null;
}

export interface OptionInput {
  id?: number | null;
  value?: string | null;
  publicValue?: string | null;
}

/**
 * Sorting of pagination (type and whether it ascends)
 */
export interface PaginationSortInput {
  by: PaginationSortByEnum;
  desc?: boolean | null;
}

export interface PaginationWhereInput {
  startDate?: string | null;
  endDate?: string | null;
  offset?: number | null;
  limit?: number | null;
  pageIndex?: number | null;
  searchTerm?: string | null;
  search?: string | null;
  orderBy?: PaginationSortInput[] | null;
}

export interface QuestionConditionInput {
  id?: number | null;
  conditionType?: string | null;
  renderMin?: number | null;
  renderMax?: number | null;
  matchValue?: string | null;
}

export interface QuestionInput {
  id?: string | null;
  title?: string | null;
  isRoot?: boolean | null;
  isLeaf?: boolean | null;
  type?: string | null;
  overrideLeaf?: LeafNodeInput | null;
  options?: OptionInput[] | null;
  children?: EdgeChildInput[] | null;
}

export interface RecipientsInputType {
  ids?: string[] | null;
}

export interface TagsInputObjectType {
  entries?: string[] | null;
}

export interface TopicDataEntry {
  id?: string | null;
  questions?: QuestionInput[] | null;
}

export interface TriggerConditionInputType {
  id?: number | null;
  type?: TriggerConditionEnum | null;
  minValue?: number | null;
  maxValue?: number | null;
  textValue?: string | null;
}

export interface TriggerInputType {
  name?: string | null;
  type?: TriggerTypeEnum | null;
  medium?: TriggerMediumEnum | null;
  conditions?: TriggerConditionInputType[] | null;
}

export interface UserInput {
  email?: string | null;
  roleId?: string | null;
  customerId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string | null;
  phone?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
