/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CampaignVariantEnum {
  EMAIL = "EMAIL",
  QUEUE = "QUEUE",
  SMS = "SMS",
}

/**
 * The types a field can assume
 */
export enum FormNodeFieldTypeEnum {
  email = "email",
  longText = "longText",
  number = "number",
  phoneNumber = "phoneNumber",
  shortText = "shortText",
  url = "url",
}

export enum LinkTypeEnumType {
  API = "API",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  LINKEDIN = "LINKEDIN",
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
  FORM = "FORM",
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
  CAN_VIEW_CAMPAIGNS = "CAN_VIEW_CAMPAIGNS",
  CAN_CREATE_CAMPAIGNS = "CAN_CREATE_CAMPAIGNS",
  CAN_CREATE_DELIVERIES = "CAN_CREATE_DELIVERIES",
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

export interface CreateCTAInputType {
  customerSlug?: string | null;
  dialogueSlug?: string | null;
  title?: string | null;
  type?: string | null;
  links?: CTALinksInputType | null;
  share?: ShareNodeInputType | null;
  form?: FormNodeInputType | null;
}

export interface CreateCampaignInputType {
  label?: string | null;
  workspaceId: string;
  variants?: CreateCampaignVariantInputType[] | null;
}

export interface CreateCampaignVariantInputType {
  label?: string | null;
  workspaceId: string;
  dialogueId: string;
  type: CampaignVariantEnum;
  body?: string | null;
  weight?: number | null;
  subject?: string | null;
}

export interface CreateDialogueInputType {
  customerSlug?: string | null;
  title?: string | null;
  dialogueSlug?: string | null;
  description?: string | null;
  isSeed?: boolean | null;
  contentType?: string | null;
  templateDialogueId?: string | null;
  publicTitle?: string | null;
  tags?: TagsInputObjectType | null;
}

export interface CreateQuestionNodeInputType {
  customerId?: string | null;
  overrideLeafId?: string | null;
  parentQuestionId?: string | null;
  dialogueSlug?: string | null;
  title?: string | null;
  type?: string | null;
  optionEntries?: OptionsInputType | null;
  edgeCondition?: EdgeConditionInputType | null;
}

export interface CreateTriggerInputType {
  customerSlug?: string | null;
  recipients?: RecipientsInputType | null;
  trigger?: TriggerInputType | null;
}

/**
 * Creates a workspace
 */
export interface CreateWorkspaceInput {
  slug: string;
  name: string;
  logoOpacity: number;
  logo?: string | null;
  primaryColour: string;
  isSeed?: boolean | null;
  willGenerateFakeData?: boolean | null;
}

export interface DeleteDialogueInputType {
  id?: string | null;
  customerSlug?: string | null;
}

/**
 * Delete Node Input type
 */
export interface DeleteNodeInputType {
  id?: string | null;
  customerId?: string | null;
  dialogueSlug?: string | null;
}

export interface DeleteUserInput {
  userId?: string | null;
  customerId?: string | null;
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
  roleId?: string | null;
  firstName?: string | null;
  customerId?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

/**
 * Edit a workspace
 */
export interface EditWorkspaceInput {
  id: string;
  customerSlug: string;
  slug: string;
  name: string;
  logo?: string | null;
  primaryColour: string;
}

export interface FormNodeFieldInput {
  id?: string | null;
  label?: string | null;
  type?: FormNodeFieldTypeEnum | null;
  isRequired?: boolean | null;
  position?: number | null;
}

export interface FormNodeInputType {
  id?: string | null;
  fields?: FormNodeFieldInput[] | null;
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

export interface SlideNodeMarkerInput {
  id?: string | null;
  label: string;
  subLabel: string;
  range?: SliderNodeRangeInputType | null;
}

export interface SliderNodeInputType {
  id?: string | null;
  markers?: SlideNodeMarkerInput[] | null;
}

export interface SliderNodeRangeInputType {
  start?: number | null;
  end?: number | null;
}

export interface TagsInputObjectType {
  entries?: string[] | null;
}

export interface TriggerConditionInputType {
  id?: number | null;
  questionId?: string | null;
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

export interface UpdateCTAInputType {
  id?: string | null;
  customerId?: string | null;
  title?: string | null;
  type?: QuestionNodeTypeEnum | null;
  links?: CTALinksInputType | null;
  share?: ShareNodeInputType | null;
  form?: FormNodeInputType | null;
}

export interface UpdateQuestionNodeInputType {
  id?: string | null;
  customerId?: string | null;
  overrideLeafId?: string | null;
  edgeId?: string | null;
  title?: string | null;
  type?: string | null;
  sliderNode?: SliderNodeInputType | null;
  optionEntries?: OptionsInputType | null;
  edgeCondition?: EdgeConditionInputType | null;
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
