/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum LinkTypeEnumType {
  API = "API",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
  SHARE = "SHARE",
  SOCIAL = "SOCIAL",
  TWITTER = "TWITTER",
  WHATSAPP = "WHATSAPP",
}

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
  paths = "paths",
  role = "role",
  score = "score",
  type = "type",
  user = "user",
  when = "when",
}

/**
 * The different types a node can assume
 */
export enum QuestionNodeTypeEnum {
  CHOICE = "CHOICE",
  GENERIC = "GENERIC",
  LINK = "LINK",
  REGISTRATION = "REGISTRATION",
  SHARE = "SHARE",
  SLIDER = "SLIDER",
  TEXTBOX = "TEXTBOX",
}

export enum SystemPermission {
  CAN_ACCESS_ADMIN_PANEL = "CAN_ACCESS_ADMIN_PANEL",
  CAN_ADD_USERS = "CAN_ADD_USERS",
  CAN_BUILD_DIALOGUE = "CAN_BUILD_DIALOGUE",
  CAN_CREATE_TRIGGERS = "CAN_CREATE_TRIGGERS",
  CAN_DELETE_DIALOGUE = "CAN_DELETE_DIALOGUE",
  CAN_DELETE_TRIGGERS = "CAN_DELETE_TRIGGERS",
  CAN_DELETE_USERS = "CAN_DELETE_USERS",
  CAN_DELETE_WORKSPACE = "CAN_DELETE_WORKSPACE",
  CAN_EDIT_DIALOGUE = "CAN_EDIT_DIALOGUE",
  CAN_EDIT_USERS = "CAN_EDIT_USERS",
  CAN_EDIT_WORKSPACE = "CAN_EDIT_WORKSPACE",
  CAN_VIEW_DIALOGUE = "CAN_VIEW_DIALOGUE",
  CAN_VIEW_DIALOGUE_ANALYTICS = "CAN_VIEW_DIALOGUE_ANALYTICS",
  CAN_VIEW_USERS = "CAN_VIEW_USERS",
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

export interface CTALinkInputObjectType {
  url?: string | null;
  type?: LinkTypeEnumType | null;
  id?: string | null;
  title?: string | null;
  iconUrl?: string | null;
  backgroundColor?: string | null;
}

export interface CTALinksInputType {
  linkTypes?: CTALinkInputObjectType[] | null;
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
  startDate?: string | null;
  endDate?: string | null;
}

export interface EdgeConditionInputType {
  id?: number | null;
  conditionType?: string | null;
  renderMin?: number | null;
  renderMax?: number | null;
  matchValue?: string | null;
}

export interface EditUserInput {
  email: string;
  firstName?: string | null;
  customerId?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

export interface InviteUserInput {
  roleId: string;
  email: string;
  customerId: string;
}

export interface OptionInputType {
  id?: number | null;
  value?: string | null;
  publicValue?: string | null;
}

export interface OptionsInputType {
  options?: OptionInputType[] | null;
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

export interface RecipientsInputType {
  ids?: string[] | null;
}

export interface RequestInviteInput {
  email: string;
}

export interface ShareNodeInputType {
  id?: string | null;
  tooltip?: string | null;
  url?: string | null;
  title?: string | null;
}

export interface TagsInputObjectType {
  entries?: string[] | null;
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
  email: string;
  firstName?: string | null;
  password?: string | null;
  roleId?: string | null;
  customerId?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

export interface UserOfCustomerInput {
  userId?: string | null;
  customerId?: string | null;
  customerSlug?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
