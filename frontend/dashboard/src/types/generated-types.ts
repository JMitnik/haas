import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
  /**
   *
   *     A date-string follows format "dd-MM-yyyy HH:mm", "dd-MM-yyyy" or ISO format, and is resolved to a relevant Date object.
   *
   */
  DateString: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AwsImageType = {
  __typename?: 'AWSImageType';
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  encoding?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ActionRequest = {
  __typename?: 'ActionRequest';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  dialogueId?: Maybe<Scalars['String']>;
  assigneeId?: Maybe<Scalars['String']>;
  issueId?: Maybe<Scalars['String']>;
  requestEmail?: Maybe<Scalars['String']>;
  isVerified: Scalars['Boolean'];
  status: ActionRequestState;
  assignee?: Maybe<UserType>;
  dialogue?: Maybe<Dialogue>;
  issue?: Maybe<IssueModel>;
  session?: Maybe<Session>;
};

export type ActionRequestConnection = ConnectionInterface & {
  __typename?: 'ActionRequestConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  actionRequests?: Maybe<Array<Maybe<ActionRequest>>>;
};

export type ActionRequestConnectionFilterInput = {
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateString']>;
  endDate?: Maybe<Scalars['DateString']>;
  assigneeId?: Maybe<Scalars['String']>;
  requestEmail?: Maybe<Scalars['String']>;
  isVerified?: Maybe<Scalars['Boolean']>;
  topic?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
  status?: Maybe<ActionRequestState>;
  orderBy?: Maybe<ActionRequestConnectionOrderByInput>;
  offset: Scalars['Int'];
  perPage?: Scalars['Int'];
};

/** Sorting of ActionableConnection */
export type ActionRequestConnectionOrderByInput = {
  by: ActionRequestConnectionOrderType;
  desc?: Maybe<Scalars['Boolean']>;
};

/** Fields to order ActionableConnection by. */
export enum ActionRequestConnectionOrderType {
  CreatedAt = 'createdAt'
}

export type ActionRequestFilterInput = {
  startDate?: Maybe<Scalars['DateString']>;
  endDate?: Maybe<Scalars['DateString']>;
  assigneeId?: Maybe<Scalars['String']>;
  withFollowUpAction?: Maybe<Scalars['Boolean']>;
  status?: Maybe<ActionRequestState>;
};

export enum ActionRequestState {
  Pending = 'PENDING',
  Stale = 'STALE',
  Completed = 'COMPLETED',
  Dropped = 'DROPPED'
}

/** Basic statistics for action requests of an issue */
export type ActionRequestStatistics = {
  __typename?: 'ActionRequestStatistics';
  /** Number of responses */
  responseCount: Scalars['Int'];
  /** Average value of summarizable statistic */
  average: Scalars['Float'];
  /** Number of urgent actionRequests  */
  urgentCount: Scalars['Int'];
};

export type AdjustedImageInput = {
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  bucket?: Maybe<Scalars['String']>;
  reset?: Maybe<Scalars['Boolean']>;
};

/** Append new data to an uploaded session */
export type AppendToInteractionInput = {
  sessionId?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['String']>;
  edgeId?: Maybe<Scalars['String']>;
  data?: Maybe<NodeEntryDataInput>;
};

export type AssignUserToActionRequestInput = {
  workspaceId: Scalars['String'];
  assigneeId?: Maybe<Scalars['String']>;
  actionRequestId: Scalars['String'];
};

export type AssignUserToDialogueInput = {
  userId: Scalars['String'];
  workspaceId: Scalars['String'];
  dialogueId: Scalars['String'];
  state: Scalars['Boolean'];
};

export type AssignUserToDialoguesInput = {
  userId: Scalars['String'];
  workspaceId: Scalars['String'];
  assignedDialogueIds?: Maybe<Array<Scalars['String']>>;
};

export type AssignedDialogues = {
  __typename?: 'AssignedDialogues';
  privateWorkspaceDialogues?: Maybe<Array<Dialogue>>;
  assignedDialogues?: Maybe<Array<Dialogue>>;
};

export type AuthenticateLambdaInput = {
  authenticateEmail?: Maybe<Scalars['String']>;
  workspaceEmail?: Maybe<Scalars['String']>;
};

export type AutodeckConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'AutodeckConnectionType';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<DeprecatedPaginationPageInfo>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  jobs?: Maybe<Array<Maybe<CreateWorkspaceJobType>>>;
};

/** AutomationActionChannel */
export type AutomationActionChannel = {
  __typename?: 'AutomationActionChannel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  type?: Maybe<AutomationActionChannelType>;
  payload?: Maybe<Scalars['JSONObject']>;
};

export type AutomationActionChannelInput = {
  id?: Maybe<Scalars['ID']>;
};

export enum AutomationActionChannelType {
  Sms = 'SMS',
  Email = 'EMAIL',
  Slack = 'SLACK'
}

export type AutomationActionInput = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<AutomationActionType>;
  apiKey?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  payload?: Maybe<Scalars['JSONObject']>;
  channels?: Maybe<Array<Maybe<AutomationActionChannelInput>>>;
};

/** AutomationAction */
export type AutomationActionModel = {
  __typename?: 'AutomationActionModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  type?: Maybe<AutomationActionType>;
  channels?: Maybe<Array<Maybe<AutomationActionChannel>>>;
  payload?: Maybe<Scalars['JSONObject']>;
};

export enum AutomationActionType {
  SendSms = 'SEND_SMS',
  SendEmail = 'SEND_EMAIL',
  ApiCall = 'API_CALL',
  SendDialogueLink = 'SEND_DIALOGUE_LINK',
  WeekReport = 'WEEK_REPORT',
  MonthReport = 'MONTH_REPORT',
  YearReport = 'YEAR_REPORT',
  CustomReport = 'CUSTOM_REPORT',
  Webhook = 'WEBHOOK'
}

export type AutomationConditionBuilderInput = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<AutomationConditionBuilderType>;
  conditions?: Maybe<Array<Maybe<CreateAutomationCondition>>>;
  childConditionBuilder?: Maybe<AutomationConditionBuilderInput>;
};

/** AutomationConditionBuilder */
export type AutomationConditionBuilderModel = {
  __typename?: 'AutomationConditionBuilderModel';
  id?: Maybe<Scalars['ID']>;
  childConditionBuilderId?: Maybe<Scalars['String']>;
  type?: Maybe<AutomationConditionBuilderType>;
  conditions?: Maybe<Array<Maybe<AutomationConditionModel>>>;
};

export enum AutomationConditionBuilderType {
  And = 'AND',
  Or = 'OR'
}

/** AutomationCondition */
export type AutomationConditionModel = {
  __typename?: 'AutomationConditionModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  scope?: Maybe<AutomationConditionScopeType>;
  operator?: Maybe<AutomationConditionOperatorType>;
  operands?: Maybe<Array<Maybe<AutomationConditionOperandModel>>>;
  questionScope?: Maybe<QuestionConditionScopeModel>;
  dialogueScope?: Maybe<DialogueConditionScopeModel>;
  workspaceScope?: Maybe<WorkspaceConditionScopeModel>;
  question?: Maybe<QuestionNode>;
  dialogue?: Maybe<Dialogue>;
};

/** AutomationConditionOperand */
export type AutomationConditionOperandModel = {
  __typename?: 'AutomationConditionOperandModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  type?: Maybe<OperandType>;
  numberValue?: Maybe<Scalars['Int']>;
  textValue?: Maybe<Scalars['String']>;
  dateTimeValue?: Maybe<Scalars['String']>;
};

export enum AutomationConditionOperatorType {
  SmallerThan = 'SMALLER_THAN',
  SmallerOrEqualThan = 'SMALLER_OR_EQUAL_THAN',
  GreaterThan = 'GREATER_THAN',
  GreaterOrEqualThan = 'GREATER_OR_EQUAL_THAN',
  InnerRange = 'INNER_RANGE',
  OuterRange = 'OUTER_RANGE',
  IsEqual = 'IS_EQUAL',
  IsNotEqual = 'IS_NOT_EQUAL',
  IsTrue = 'IS_TRUE',
  IsFalse = 'IS_FALSE',
  EveryNThTime = 'EVERY_N_TH_TIME'
}

export enum AutomationConditionScopeType {
  Question = 'QUESTION',
  Dialogue = 'DIALOGUE',
  Workspace = 'WORKSPACE'
}

export type AutomationConnection = ConnectionInterface & {
  __typename?: 'AutomationConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  automations?: Maybe<Array<Maybe<AutomationModel>>>;
};

export type AutomationConnectionFilterInput = {
  label?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  type?: Maybe<AutomationType>;
  orderBy?: Maybe<AutomationConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

/** Sorting of UserConnection */
export type AutomationConnectionOrderByInput = {
  by: AutomationConnectionOrderType;
  desc?: Maybe<Scalars['Boolean']>;
};

/** Fields to order UserConnection by. */
export enum AutomationConnectionOrderType {
  UpdatedAt = 'updatedAt',
  Type = 'type',
  CreatedAt = 'createdAt'
}

export type AutomationEventInput = {
  id?: Maybe<Scalars['ID']>;
  eventType?: Maybe<AutomationEventType>;
  questionId?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
};

/** AutomationEvent */
export type AutomationEventModel = {
  __typename?: 'AutomationEventModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  type?: Maybe<AutomationEventType>;
  question?: Maybe<QuestionNode>;
  dialogue?: Maybe<Dialogue>;
  periodType?: Maybe<RecurringPeriodType>;
};

export enum AutomationEventType {
  Recurring = 'RECURRING',
  NewInteractionQuestion = 'NEW_INTERACTION_QUESTION',
  NewInteractionDialogue = 'NEW_INTERACTION_DIALOGUE',
  ApiCall = 'API_CALL'
}

/** Automation */
export type AutomationModel = {
  __typename?: 'AutomationModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  isActive?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<AutomationType>;
  automationTrigger?: Maybe<AutomationTriggerModel>;
  automationScheduled?: Maybe<AutomationScheduledModel>;
  workspace?: Maybe<Customer>;
};

export type AutomationScheduleInput = {
  id?: Maybe<Scalars['ID']>;
  type: RecurringPeriodType;
  minutes: Scalars['String'];
  hours: Scalars['String'];
  dayOfMonth: Scalars['String'];
  month: Scalars['String'];
  dayOfWeek: Scalars['String'];
  dialogueId?: Maybe<Scalars['String']>;
};

/** AutomationScheduled */
export type AutomationScheduledModel = {
  __typename?: 'AutomationScheduledModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  type?: Maybe<RecurringPeriodType>;
  minutes?: Maybe<Scalars['String']>;
  hours?: Maybe<Scalars['String']>;
  dayOfMonth?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['String']>;
  dayOfWeek?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
  frequency?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
  dayRange?: Maybe<Array<Maybe<DayRange>>>;
  actions?: Maybe<Array<Maybe<AutomationActionModel>>>;
  activeDialogue?: Maybe<Dialogue>;
};

/** AutomationTrigger */
export type AutomationTriggerModel = {
  __typename?: 'AutomationTriggerModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  activeDialogue?: Maybe<Dialogue>;
  event?: Maybe<AutomationEventModel>;
  conditionBuilder?: Maybe<AutomationConditionBuilderModel>;
  actions?: Maybe<Array<Maybe<AutomationActionModel>>>;
};

export enum AutomationType {
  Trigger = 'TRIGGER',
  Campaign = 'CAMPAIGN',
  Scheduled = 'SCHEDULED'
}

/** Basic statistics for a general statistics */
export type BasicStatistics = {
  __typename?: 'BasicStatistics';
  /** Number of responses */
  responseCount: Scalars['Int'];
  /** Average value of summarizable statistic */
  average: Scalars['Float'];
};

export type CtaLinkInputObjectType = {
  url?: Maybe<Scalars['String']>;
  type?: Maybe<LinkTypeEnumType>;
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  backgroundColor?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
  subHeader?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
};

export type CtaLinksInputType = {
  linkTypes?: Maybe<Array<Maybe<CtaLinkInputObjectType>>>;
};

export type CtaShareInputObjectType = {
  url?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

/** Campaign */
export type CampaignType = {
  __typename?: 'CampaignType';
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<CampaignVariantType>>>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
};


/** Campaign */
export type CampaignTypeDeliveryConnectionArgs = {
  filter?: Maybe<DeliveryConnectionFilterInput>;
};

export type CampaignVariantCustomVariableType = {
  __typename?: 'CampaignVariantCustomVariableType';
  id?: Maybe<Scalars['ID']>;
  key?: Maybe<Scalars['String']>;
};

export enum CampaignVariantEnum {
  Sms = 'SMS',
  Email = 'EMAIL',
  Queue = 'QUEUE'
}

/** Variant of campaign */
export type CampaignVariantType = {
  __typename?: 'CampaignVariantType';
  id: Scalars['ID'];
  label: Scalars['String'];
  weight?: Maybe<Scalars['Int']>;
  body?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  type?: Maybe<CampaignVariantEnum>;
  workspace?: Maybe<Customer>;
  dialogue?: Maybe<Dialogue>;
  campaign?: Maybe<CampaignType>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
  customVariables?: Maybe<Array<Maybe<CampaignVariantCustomVariableType>>>;
};

/** Input type for a choice node */
export type ChoiceNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export enum CloudReferenceType {
  Aws = 'AWS',
  Gcp = 'GCP',
  Azure = 'Azure',
  Ibm = 'IBM'
}

export type ColourSettings = {
  __typename?: 'ColourSettings';
  id?: Maybe<Scalars['Int']>;
  primary?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
};

export type ConditionDialogueScopeInput = {
  id?: Maybe<Scalars['ID']>;
  aspect?: Maybe<DialogueAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregateInput>;
};

export type ConditionPropertyAggregate = {
  __typename?: 'ConditionPropertyAggregate';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  latest?: Maybe<Scalars['Int']>;
  type?: Maybe<ConditionPropertyAggregateType>;
};

export type ConditionPropertyAggregateInput = {
  id?: Maybe<Scalars['ID']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  latest?: Maybe<Scalars['Int']>;
  type?: Maybe<ConditionPropertyAggregateType>;
};

export enum ConditionPropertyAggregateType {
  Count = 'COUNT',
  Min = 'MIN',
  Max = 'MAX',
  Avg = 'AVG'
}

export type ConditionQuestionScopeInput = {
  id?: Maybe<Scalars['ID']>;
  aspect?: Maybe<QuestionAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregateInput>;
};

export type ConditionScopeInput = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<AutomationConditionScopeType>;
  questionScope?: Maybe<ConditionQuestionScopeInput>;
  dialogueScope?: Maybe<ConditionDialogueScopeInput>;
  workspaceScope?: Maybe<ConditionWorkspaceScopeInput>;
};

export type ConditionWorkspaceScopeInput = {
  id?: Maybe<Scalars['ID']>;
  aspect?: Maybe<WorkspaceAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregateInput>;
};

/** Interface all pagination-based models should implement */
export type ConnectionInterface = {
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
};

export type CreateAutomationCondition = {
  id?: Maybe<Scalars['ID']>;
  scope?: Maybe<ConditionScopeInput>;
  operator?: Maybe<AutomationConditionOperatorType>;
  operands?: Maybe<Array<Maybe<CreateAutomationOperandInput>>>;
  questionId?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
};

export type CreateAutomationInput = {
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
  automationType?: Maybe<AutomationType>;
  event?: Maybe<AutomationEventInput>;
  schedule?: Maybe<AutomationScheduleInput>;
  actions?: Maybe<Array<Maybe<AutomationActionInput>>>;
};

export type CreateAutomationOperandInput = {
  id?: Maybe<Scalars['ID']>;
  operandType?: Maybe<OperandType>;
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  dateTimeValue?: Maybe<Scalars['String']>;
};

export type CreateBatchDeliveriesInputType = {
  campaignId?: Maybe<Scalars['ID']>;
  workspaceId?: Maybe<Scalars['String']>;
  uploadedCsv?: Maybe<Scalars['Upload']>;
  batchScheduledAt?: Maybe<Scalars['String']>;
};

export type CreateBatchDeliveriesOutputType = {
  __typename?: 'CreateBatchDeliveriesOutputType';
  failedDeliveries?: Maybe<Array<Maybe<FailedDeliveryModel>>>;
  nrDeliveries?: Maybe<Scalars['Int']>;
};

export type CreateCtaInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  /** Linked question-node id */
  questionId?: Maybe<Scalars['String']>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  form?: Maybe<FormNodeInputType>;
};

export type CreateCampaignCustomVariable = {
  key?: Maybe<Scalars['String']>;
};

export type CreateCampaignInputType = {
  label?: Maybe<Scalars['String']>;
  workspaceId: Scalars['ID'];
  variants?: Maybe<Array<Maybe<CreateCampaignVariantInputType>>>;
};

export type CreateCampaignVariantInputType = {
  workspaceId: Scalars['ID'];
  dialogueId: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  type: CampaignVariantEnum;
  customVariables?: Maybe<Array<Maybe<CreateCampaignCustomVariable>>>;
};

/** Input for creating a dialogue schedule. */
export type CreateDataPeriodInput = {
  startDateExpression: Scalars['String'];
  endInDeltaMinutes: Scalars['Int'];
};

export type CreateDialogueInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  isSeed?: Maybe<Scalars['Boolean']>;
  contentType?: Maybe<Scalars['String']>;
  templateDialogueId?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  tags?: Maybe<TagsInputObjectType>;
  language?: Maybe<LanguageEnumType>;
};

/** Input for creating a dialogue schedule. */
export type CreateDialogueScheduleInput = {
  workspaceId: Scalars['String'];
  dataPeriod: CreateDataPeriodInput;
  evaluationPeriod?: Maybe<CreateEvaluationPeriodInput>;
};

/** Result of creating dialogue schedule */
export type CreateDialogueScheduleOutput = {
  __typename?: 'CreateDialogueScheduleOutput';
  dialogueSchedule?: Maybe<DialogueSchedule>;
};

/** Input for creating a dialogue schedule. */
export type CreateEvaluationPeriodInput = {
  startDateExpression: Scalars['String'];
  endInDeltaMinutes?: Maybe<Scalars['Int']>;
};

export type CreateQuestionNodeInputType = {
  customerId?: Maybe<Scalars['ID']>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  parentQuestionId?: Maybe<Scalars['ID']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  extraContent?: Maybe<Scalars['String']>;
  unhappyText?: Maybe<Scalars['String']>;
  happyText?: Maybe<Scalars['String']>;
  optionEntries?: Maybe<OptionsInputType>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
};

/** Creates a topic (with subTopics) based on input */
export type CreateTopicInput = {
  name: Scalars['String'];
  type?: Maybe<TopicEnumType>;
  subTopics?: Maybe<Array<Maybe<CreateTopicInput>>>;
};

export type CreateTriggerInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
};

/** Creates a workspace */
export type CreateWorkspaceInput = {
  slug: Scalars['String'];
  name: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  primaryColour: Scalars['String'];
  isSeed?: Maybe<Scalars['Boolean']>;
  willGenerateFakeData?: Maybe<Scalars['Boolean']>;
  isDemo?: Maybe<Scalars['Boolean']>;
};

export type CreateWorkspaceJobType = {
  __typename?: 'CreateWorkspaceJobType';
  id?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<JobStatusType>;
  requiresColorExtraction?: Maybe<Scalars['Boolean']>;
  requiresRembg?: Maybe<Scalars['Boolean']>;
  requiresScreenshot?: Maybe<Scalars['Boolean']>;
  resourcesUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  referenceType?: Maybe<CloudReferenceType>;
  processLocation?: Maybe<JobProcessLocation>;
};

export type CustomFieldInputType = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CustomFieldType = {
  __typename?: 'CustomFieldType';
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  jobProcessLocationId?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  id?: Maybe<Scalars['ID']>;
  slug: Scalars['String'];
  name: Scalars['String'];
  isDemo?: Maybe<Scalars['Boolean']>;
  organization?: Maybe<Organization>;
  settings?: Maybe<CustomerSettings>;
  sessionConnection?: Maybe<SessionConnection>;
  /** Workspace statistics */
  statistics?: Maybe<WorkspaceStatistics>;
  actionRequestConnection?: Maybe<ActionRequestConnection>;
  dialogueSchedule?: Maybe<DialogueSchedule>;
  issueConnection?: Maybe<IssueConnection>;
  issueDialogues?: Maybe<Array<Maybe<Issue>>>;
  issueTopics?: Maybe<Array<Maybe<Issue>>>;
  dialogueConnection?: Maybe<DialogueConnection>;
  automationConnection?: Maybe<AutomationConnection>;
  usersConnection?: Maybe<UserConnection>;
  automations?: Maybe<Array<Maybe<AutomationModel>>>;
  /** @deprecated Deprectaed, see statistics */
  nestedHealthScore?: Maybe<HealthScore>;
  nestedMostPopular?: Maybe<MostPopularPath>;
  nestedMostChanged?: Maybe<MostChangedPath>;
  nestedMostTrendingTopic?: Maybe<MostTrendingTopic>;
  /** @deprecated Deprecated, see statistics */
  nestedDialogueStatisticsSummary?: Maybe<Array<Maybe<DialogueStatisticsSummaryModel>>>;
  dialogue?: Maybe<Dialogue>;
  dialogues?: Maybe<Array<Maybe<Dialogue>>>;
  users?: Maybe<Array<Maybe<UserType>>>;
  campaigns?: Maybe<Array<Maybe<CampaignType>>>;
  roles?: Maybe<Array<Maybe<RoleType>>>;
  campaign?: Maybe<CampaignType>;
  userCustomer?: Maybe<UserCustomer>;
};


export type CustomerSessionConnectionArgs = {
  filter?: Maybe<SessionConnectionFilterInput>;
};


export type CustomerActionRequestConnectionArgs = {
  input?: Maybe<ActionRequestConnectionFilterInput>;
};


export type CustomerIssueConnectionArgs = {
  filter?: Maybe<IssueConnectionFilterInput>;
};


export type CustomerIssueDialoguesArgs = {
  filter?: Maybe<IssueFilterInput>;
};


export type CustomerIssueTopicsArgs = {
  input?: Maybe<IssueFilterInput>;
};


export type CustomerDialogueConnectionArgs = {
  filter?: Maybe<DialogueConnectionFilterInput>;
};


export type CustomerAutomationConnectionArgs = {
  filter?: Maybe<AutomationConnectionFilterInput>;
};


export type CustomerUsersConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<UserConnectionFilterInput>;
};


export type CustomerNestedHealthScoreArgs = {
  input?: Maybe<HealthScoreInput>;
};


export type CustomerNestedMostPopularArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type CustomerNestedMostChangedArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type CustomerNestedMostTrendingTopicArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type CustomerNestedDialogueStatisticsSummaryArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type CustomerDialogueArgs = {
  where?: Maybe<DialogueWhereUniqueInput>;
};


export type CustomerDialoguesArgs = {
  filter?: Maybe<DialogueFilterInputType>;
};


export type CustomerCampaignArgs = {
  campaignId?: Maybe<Scalars['String']>;
};


export type CustomerUserCustomerArgs = {
  userId?: Maybe<Scalars['String']>;
};

export type CustomerSettings = {
  __typename?: 'CustomerSettings';
  id?: Maybe<Scalars['Int']>;
  logoUrl?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  colourSettingsId?: Maybe<Scalars['Int']>;
  colourSettings?: Maybe<ColourSettings>;
  fontSettingsId?: Maybe<Scalars['Int']>;
  fontSettings?: Maybe<FontSettings>;
};

export type CustomerWhereUniqueInput = {
  id: Scalars['ID'];
};

/** A data period schedule defines the general */
export type DataPeriodSchedule = {
  __typename?: 'DataPeriodSchedule';
  id?: Maybe<Scalars['ID']>;
  startDateExpression?: Maybe<Scalars['String']>;
  endInDeltaMinutes?: Maybe<Scalars['Int']>;
};


/** A histogram contains a list of entries sorted typically by date, along with their frequency. */
export type DateHistogram = {
  __typename?: 'DateHistogram';
  id?: Maybe<Scalars['ID']>;
  items: Array<DateHistogramItem>;
};

/** A histogram item contains a date */
export type DateHistogramItem = {
  __typename?: 'DateHistogramItem';
  id?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['Date']>;
  frequency: Scalars['Int'];
};


export type DayRange = {
  __typename?: 'DayRange';
  label?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
};

export type DeleteAutomationInput = {
  workspaceId: Scalars['String'];
  automationId: Scalars['String'];
};

export type DeleteDialogueInputType = {
  id?: Maybe<Scalars['ID']>;
  customerSlug?: Maybe<Scalars['String']>;
};

/** Delete Node Input type */
export type DeleteNodeInputType = {
  id?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['ID']>;
  dialogueSlug?: Maybe<Scalars['String']>;
};

export type DeleteUserInput = {
  userId?: Maybe<Scalars['ID']>;
  customerId?: Maybe<Scalars['ID']>;
};

export type DeleteUserOutput = {
  __typename?: 'DeleteUserOutput';
  deletedUser?: Maybe<Scalars['Boolean']>;
};

export type DeliveryConnectionFilterInput = {
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  campaignVariantId?: Maybe<Scalars['String']>;
  recipientFirstName?: Maybe<Scalars['String']>;
  recipientLastName?: Maybe<Scalars['String']>;
  recipientPhoneNumber?: Maybe<Scalars['String']>;
  recipientEmail?: Maybe<Scalars['String']>;
  status?: Maybe<DeliveryStatusEnum>;
  orderBy?: Maybe<DeliveryConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

/** Fields to order DeliveryConnection by. */
export enum DeliveryConnectionOrder {
  CreatedAt = 'createdAt'
}

/** Sorting of DeliveryConnection */
export type DeliveryConnectionOrderByInput = {
  by: DeliveryConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

export type DeliveryConnectionType = ConnectionInterface & {
  __typename?: 'DeliveryConnectionType';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  deliveries: Array<DeliveryType>;
};

export type DeliveryEventType = {
  __typename?: 'DeliveryEventType';
  id?: Maybe<Scalars['ID']>;
  status?: Maybe<DeliveryStatusEnum>;
  createdAt?: Maybe<Scalars['Date']>;
  failureMessage?: Maybe<Scalars['String']>;
};

export enum DeliveryStatusEnum {
  Scheduled = 'SCHEDULED',
  Deployed = 'DEPLOYED',
  Sent = 'SENT',
  Opened = 'OPENED',
  Finished = 'FINISHED',
  Failed = 'FAILED',
  Delivered = 'DELIVERED'
}

/** Delivery */
export type DeliveryType = {
  __typename?: 'DeliveryType';
  id: Scalars['ID'];
  deliveryRecipientFirstName?: Maybe<Scalars['String']>;
  deliveryRecipientLastName?: Maybe<Scalars['String']>;
  deliveryRecipientEmail?: Maybe<Scalars['String']>;
  deliveryRecipientPhone?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  scheduledAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  campaignVariant?: Maybe<CampaignVariantType>;
  currentStatus?: Maybe<DeliveryStatusEnum>;
  events?: Maybe<Array<Maybe<DeliveryEventType>>>;
};

/** Interface all pagination-based models should implement */
export type DeprecatedConnectionInterface = {
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<DeprecatedPaginationPageInfo>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
};

/** Information with regards to current page, and total number of pages */
export type DeprecatedPaginationPageInfo = {
  __typename?: 'DeprecatedPaginationPageInfo';
  cursor?: Maybe<Scalars['String']>;
  nrPages?: Maybe<Scalars['Int']>;
  pageIndex?: Maybe<Scalars['Int']>;
};

/** Deselects all question options as topic within workspace */
export type DeselectTopicInput = {
  workspaceId: Scalars['ID'];
  topic: Scalars['String'];
};

export type Dialogue = {
  __typename?: 'Dialogue';
  id: Scalars['String'];
  title: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  template?: Maybe<Scalars['String']>;
  isWithoutGenData?: Maybe<Scalars['Boolean']>;
  wasGeneratedWithGenData?: Maybe<Scalars['Boolean']>;
  language?: Maybe<LanguageEnumType>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  publicTitle?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  assignees?: Maybe<Array<Maybe<UserType>>>;
  postLeafNodeId?: Maybe<Scalars['String']>;
  postLeafNode?: Maybe<DialogueFinisherObjectType>;
  issues?: Maybe<Issue>;
  healthScore?: Maybe<HealthScore>;
  pathedSessionsConnection?: Maybe<PathedSessionsType>;
  topic?: Maybe<TopicType>;
  mostPopularPath?: Maybe<MostPopularPath>;
  mostChangedPath?: Maybe<MostChangedPath>;
  mostTrendingTopic?: Maybe<MostTrendingTopic>;
  dialogueStatisticsSummary?: Maybe<DialogueStatisticsSummaryModel>;
  averageScore?: Maybe<Scalars['Float']>;
  sessions?: Maybe<Array<Maybe<Session>>>;
  statistics?: Maybe<DialogueStatistics>;
  sessionConnection?: Maybe<SessionConnection>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** A dialogue can be online or offline, depending on the configurations (schedule) or manual work. */
  isOnline?: Maybe<Scalars['Boolean']>;
  customerId?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  rootQuestion?: Maybe<QuestionNode>;
  edges?: Maybe<Array<Maybe<Edge>>>;
  questions?: Maybe<Array<QuestionNode>>;
  leafs?: Maybe<Array<QuestionNode>>;
  campaignVariants?: Maybe<Array<CampaignVariantType>>;
};


export type DialogueIssuesArgs = {
  filter?: Maybe<IssueFilterInput>;
};


export type DialogueHealthScoreArgs = {
  input?: Maybe<HealthScoreInput>;
};


export type DialoguePathedSessionsConnectionArgs = {
  input?: Maybe<PathedSessionsInput>;
};


export type DialogueTopicArgs = {
  input?: Maybe<TopicInputType>;
};


export type DialogueMostPopularPathArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type DialogueMostChangedPathArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type DialogueMostTrendingTopicArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type DialogueDialogueStatisticsSummaryArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type DialogueAverageScoreArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueSessionsArgs = {
  take?: Maybe<Scalars['Int']>;
};


export type DialogueStatisticsArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type DialogueSessionConnectionArgs = {
  filter?: Maybe<SessionConnectionFilterInput>;
};


export type DialogueLeafsArgs = {
  searchTerm?: Maybe<Scalars['String']>;
};

export enum DialogueAspectType {
  NrInteractions = 'NR_INTERACTIONS',
  NrVisitors = 'NR_VISITORS',
  GeneralScore = 'GENERAL_SCORE',
  LatestScore = 'LATEST_SCORE'
}

/** DialogueConditionScope */
export type DialogueConditionScopeModel = {
  __typename?: 'DialogueConditionScopeModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  aspect?: Maybe<DialogueAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregate>;
};

export type DialogueConnection = ConnectionInterface & {
  __typename?: 'DialogueConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  dialogues?: Maybe<Array<Maybe<Dialogue>>>;
};

export type DialogueConnectionFilterInput = {
  searchTerm?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  orderBy?: Maybe<DialogueConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

/** Fields to order UserConnection by. */
export enum DialogueConnectionOrder {
  CreatedAt = 'createdAt'
}

/** Sorting of DialogueConnection */
export type DialogueConnectionOrderByInput = {
  by: DialogueConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

export type DialogueFilterInputType = {
  searchTerm?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
};

export type DialogueFinisherObjectType = {
  __typename?: 'DialogueFinisherObjectType';
  id?: Maybe<Scalars['ID']>;
  header?: Maybe<Scalars['String']>;
  subtext?: Maybe<Scalars['String']>;
};

export enum DialogueImpactScoreType {
  Average = 'AVERAGE'
}

/**
 * A dialogue schedule defines the data period (period of time whilst data is good),
 * and evaluation period (period of time when a dialogue may be enabled).
 */
export type DialogueSchedule = {
  __typename?: 'DialogueSchedule';
  id?: Maybe<Scalars['ID']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
  evaluationPeriodSchedule?: Maybe<EvaluationPeriodSchedule>;
  dataPeriodSchedule?: Maybe<DataPeriodSchedule>;
};

export type DialogueStatistics = {
  __typename?: 'DialogueStatistics';
  nrInteractions?: Maybe<Scalars['Int']>;
  topPositivePath?: Maybe<Array<Maybe<TopPathType>>>;
  topNegativePath?: Maybe<Array<Maybe<TopPathType>>>;
  mostPopularPath?: Maybe<TopPathType>;
  history?: Maybe<Array<Maybe<LineChartDataType>>>;
};

export type DialogueStatisticsSummaryFilterInput = {
  startDateTime: Scalars['String'];
  endDateTime?: Maybe<Scalars['String']>;
  refresh?: Maybe<Scalars['Boolean']>;
  impactType: DialogueImpactScoreType;
  topicsFilter?: Maybe<TopicFilterInput>;
  cutoff?: Maybe<Scalars['Int']>;
};

/** DialogueStatisticsSummary */
export type DialogueStatisticsSummaryModel = {
  __typename?: 'DialogueStatisticsSummaryModel';
  id?: Maybe<Scalars['ID']>;
  dialogueId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
  startDateTime?: Maybe<Scalars['Date']>;
  endDateTime?: Maybe<Scalars['Date']>;
  nrVotes?: Maybe<Scalars['Int']>;
  impactScore?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  dialogue?: Maybe<Dialogue>;
};

export enum DialogueTemplateType {
  TeacherNl = 'TEACHER_NL',
  StudentNl = 'STUDENT_NL',
  TeacherEng = 'TEACHER_ENG',
  StudentEng = 'STUDENT_ENG',
  SportEng = 'SPORT_ENG',
  SportNl = 'SPORT_NL',
  BusinessEng = 'BUSINESS_ENG',
  BusinessNl = 'BUSINESS_NL',
  Default = 'DEFAULT',
  MassSeed = 'MASS_SEED'
}

export type DialogueWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};

export type Edge = {
  __typename?: 'Edge';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  parentNodeId?: Maybe<Scalars['String']>;
  childNodeId?: Maybe<Scalars['String']>;
  parentNode?: Maybe<QuestionNode>;
  childNode?: Maybe<QuestionNode>;
  conditions?: Maybe<Array<EdgeCondition>>;
};

export type EdgeCondition = {
  __typename?: 'EdgeCondition';
  id?: Maybe<Scalars['Int']>;
  conditionType?: Maybe<Scalars['String']>;
  matchValue?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  edgeId?: Maybe<Scalars['String']>;
};

export type EdgeConditionInputType = {
  id?: Maybe<Scalars['Int']>;
  conditionType?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type EditUserInput = {
  email: Scalars['String'];
  roleId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

/** Edit a workspace */
export type EditWorkspaceInput = {
  id: Scalars['ID'];
  customerSlug: Scalars['String'];
  slug: Scalars['String'];
  name: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  primaryColour: Scalars['String'];
};

export type EnableAutomationInput = {
  workspaceId: Scalars['String'];
  automationId: Scalars['String'];
  state: Scalars['Boolean'];
};

/**
 * The Evaluation Period Schedule is used to define an opening and closing range for our dialogues.
 *
 * Currently workspace-wide.
 */
export type EvaluationPeriodSchedule = {
  __typename?: 'EvaluationPeriodSchedule';
  id?: Maybe<Scalars['ID']>;
  startDateExpression?: Maybe<Scalars['String']>;
  endInDeltaMinutes?: Maybe<Scalars['Int']>;
};

export type FailedDeliveryModel = {
  __typename?: 'FailedDeliveryModel';
  record?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
};

export type FindRoleInput = {
  roleId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type FontSettings = {
  __typename?: 'FontSettings';
  id?: Maybe<Scalars['Int']>;
};

/** FormNodeEntryInput */
export type FormNodeEntryFieldInput = {
  relatedFieldId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  shortText?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  contacts?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
};

/** FormNodeEntryInput */
export type FormNodeEntryInput = {
  values?: Maybe<Array<Maybe<FormNodeEntryFieldInput>>>;
};

export type FormNodeEntryType = {
  __typename?: 'FormNodeEntryType';
  id?: Maybe<Scalars['Int']>;
  values?: Maybe<Array<Maybe<FormNodeEntryValueType>>>;
};

export type FormNodeEntryValueType = {
  __typename?: 'FormNodeEntryValueType';
  relatedField?: Maybe<FormNodeField>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  shortText?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  contacts?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
};

export type FormNodeField = {
  __typename?: 'FormNodeField';
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  type: FormNodeFieldTypeEnum;
  isRequired?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['Int']>;
  placeholder?: Maybe<Scalars['String']>;
  /** List of possible contact points for a form-node. */
  contacts?: Maybe<Array<Maybe<UserType>>>;
};

export type FormNodeFieldInput = {
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  placeholder?: Maybe<Scalars['String']>;
  type?: Maybe<FormNodeFieldTypeEnum>;
  isRequired?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['Int']>;
  userIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** The types a field can assume */
export enum FormNodeFieldTypeEnum {
  Email = 'email',
  PhoneNumber = 'phoneNumber',
  Url = 'url',
  ShortText = 'shortText',
  LongText = 'longText',
  Number = 'number',
  Contacts = 'contacts'
}

export type FormNodeInputType = {
  id?: Maybe<Scalars['String']>;
  helperText?: Maybe<Scalars['String']>;
  preFormNode?: Maybe<PreFormNodeInput>;
  fields?: Maybe<Array<FormNodeFieldInput>>;
  steps?: Maybe<Array<FormNodeStepInput>>;
};

export type FormNodeStep = {
  __typename?: 'FormNodeStep';
  id: Scalars['String'];
  position: Scalars['Int'];
  header?: Maybe<Scalars['String']>;
  helper?: Maybe<Scalars['String']>;
  subHelper?: Maybe<Scalars['String']>;
  type: FormNodeStepType;
  fields?: Maybe<Array<FormNodeField>>;
};

export type FormNodeStepInput = {
  id?: Maybe<Scalars['ID']>;
  type: FormNodeStepType;
  header: Scalars['String'];
  helper: Scalars['String'];
  subHelper: Scalars['String'];
  position: Scalars['Int'];
  fields?: Maybe<Array<FormNodeFieldInput>>;
};

export enum FormNodeStepType {
  GenericFields = 'GENERIC_FIELDS'
}

export type FormNodeType = {
  __typename?: 'FormNodeType';
  id?: Maybe<Scalars['String']>;
  helperText?: Maybe<Scalars['String']>;
  preForm?: Maybe<PreFormNodeType>;
  fields?: Maybe<Array<FormNodeField>>;
  steps?: Maybe<Array<FormNodeStep>>;
};

/** Generate savales documents */
export type GenerateAutodeckInput = {
  id: Scalars['String'];
  requiresRembgLambda: Scalars['Boolean'];
  requiresWebsiteScreenshot: Scalars['Boolean'];
  requiresColorExtraction: Scalars['Boolean'];
  usesAdjustedLogo: Scalars['Boolean'];
  jobLocationId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  primaryColour?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  companyName?: Maybe<Scalars['String']>;
  answer1?: Maybe<Scalars['String']>;
  answer2?: Maybe<Scalars['String']>;
  answer3?: Maybe<Scalars['String']>;
  answer4?: Maybe<Scalars['String']>;
  sorryAboutX?: Maybe<Scalars['String']>;
  youLoveX?: Maybe<Scalars['String']>;
  reward?: Maybe<Scalars['String']>;
  emailContent?: Maybe<Scalars['String']>;
  textMessage?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  isGenerateWorkspace?: Maybe<Scalars['Boolean']>;
  standardFields?: Maybe<Array<Maybe<CustomFieldInputType>>>;
  customFields?: Maybe<Array<Maybe<CustomFieldInputType>>>;
  newCustomFields?: Maybe<Array<Maybe<CustomFieldInputType>>>;
};

export type GenerateWorkspaceCsvInputType = {
  workspaceSlug: Scalars['String'];
  workspaceTitle: Scalars['String'];
  uploadedCsv?: Maybe<Scalars['Upload']>;
  managerCsv?: Maybe<Scalars['Upload']>;
  type?: Scalars['String'];
  generateDemoData?: Maybe<Scalars['Boolean']>;
  isDemo?: Scalars['Boolean'];
  makeDialoguesPrivate?: Maybe<Scalars['Boolean']>;
};

export type GetAutomationInput = {
  id?: Maybe<Scalars['String']>;
};

export type GetAutomationsByWorkspaceInput = {
  workspaceId?: Maybe<Scalars['String']>;
};

export type GetCampaignsInput = {
  customerSlug?: Maybe<Scalars['String']>;
};

export type GetIssueResolverInput = {
  workspaceId?: Maybe<Scalars['String']>;
  issueId?: Maybe<Scalars['String']>;
  topicId?: Maybe<Scalars['String']>;
};

export type HandleUserStateInWorkspaceInput = {
  userId?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
};

export type HealthScore = {
  __typename?: 'HealthScore';
  score: Scalars['Float'];
  negativeResponseCount: Scalars['Int'];
  nrVotes: Scalars['Int'];
  average: Scalars['Float'];
};

export type HealthScoreInput = {
  threshold?: Maybe<Scalars['Float']>;
  startDateTime: Scalars['String'];
  endDateTime?: Maybe<Scalars['String']>;
  topicFilter?: Maybe<TopicFilterInput>;
};

export type ImageType = {
  __typename?: 'ImageType';
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  encoding?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type IndepthQuestionStatisticsSummary = {
  __typename?: 'IndepthQuestionStatisticsSummary';
  nrVotes?: Maybe<Scalars['Int']>;
  impactScore?: Maybe<Scalars['Float']>;
  option?: Maybe<Scalars['String']>;
};

export type InviteUserInput = {
  roleId: Scalars['String'];
  email: Scalars['String'];
  customerId: Scalars['String'];
};

export type InviteUserOutput = {
  __typename?: 'InviteUserOutput';
  didInvite?: Maybe<Scalars['Boolean']>;
  didAlreadyExist?: Maybe<Scalars['Boolean']>;
};

/**
 * An issue is a problem that has been identified.
 *
 * Typically, an issue is a combination of a particulat topic and a specific dialogue.
 */
export type Issue = {
  __typename?: 'Issue';
  id?: Maybe<Scalars['ID']>;
  rankScore?: Maybe<Scalars['Float']>;
  topic?: Maybe<Scalars['String']>;
  dialogueId: Scalars['String'];
  dialogue?: Maybe<Dialogue>;
  history: DateHistogram;
  basicStats: BasicStatistics;
  status: StatusType;
  followUpAction?: Maybe<SessionActionType>;
  /** Number of actions required */
  actionRequiredCount: Scalars['Int'];
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type IssueConnection = ConnectionInterface & {
  __typename?: 'IssueConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  issues?: Maybe<Array<Maybe<IssueModel>>>;
};

export type IssueConnectionFilterInput = {
  label?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateString']>;
  endDate?: Maybe<Scalars['DateString']>;
  topicStrings?: Maybe<Array<Scalars['String']>>;
  orderBy?: Maybe<IssueConnectionOrderByInput>;
  offset: Scalars['Int'];
  perPage?: Scalars['Int'];
};

/** Sorting of IssueConnection */
export type IssueConnectionOrderByInput = {
  by: IssueConnectionOrderType;
  desc?: Maybe<Scalars['Boolean']>;
};

/** Fields to order IssueConnection by. */
export enum IssueConnectionOrderType {
  Issue = 'issue'
}

/** Filter input for Issues */
export type IssueFilterInput = {
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  dialogueStrings?: Maybe<Array<Scalars['String']>>;
  topicStrings?: Maybe<Array<Scalars['String']>>;
};

export type IssueModel = {
  __typename?: 'IssueModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  topicId: Scalars['String'];
  workspaceId: Scalars['String'];
  topic: Topic;
  /** Number of different teams issue exists for */
  teamCount: Scalars['Int'];
  basicStats?: Maybe<ActionRequestStatistics>;
  actionRequestConnection?: Maybe<ActionRequestConnection>;
  actionRequests: Array<Maybe<ActionRequest>>;
};


export type IssueModelActionRequestConnectionArgs = {
  input?: Maybe<ActionRequestConnectionFilterInput>;
};


export type IssueModelActionRequestsArgs = {
  input?: Maybe<ActionRequestFilterInput>;
};


export type JobObjectType = {
  __typename?: 'JobObjectType';
  id?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  createWorkspaceJobId?: Maybe<Scalars['String']>;
  createWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
};

export type JobProcessLocation = {
  __typename?: 'JobProcessLocation';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  xMaterialDimension?: Maybe<Scalars['Int']>;
  yMaterialDimension?: Maybe<Scalars['Int']>;
  type?: Maybe<JobProcessLocationType>;
  customFields?: Maybe<Array<Maybe<CustomFieldType>>>;
};

export enum JobProcessLocationType {
  OnePager = 'ONE_PAGER',
  Pitchdeck = 'PITCHDECK',
  Brochure = 'BROCHURE'
}

export type JobProcessLocations = {
  __typename?: 'JobProcessLocations';
  jobProcessLocations?: Maybe<Array<Maybe<JobProcessLocation>>>;
};

export enum JobStatusType {
  Pending = 'PENDING',
  PreProcessing = 'PRE_PROCESSING',
  InPhotoshopQueue = 'IN_PHOTOSHOP_QUEUE',
  PreProcessingLogo = 'PRE_PROCESSING_LOGO',
  PreProcessingWebsiteScreenshot = 'PRE_PROCESSING_WEBSITE_SCREENSHOT',
  PhotoshopProcessing = 'PHOTOSHOP_PROCESSING',
  Processing = 'PROCESSING',
  WrappingUp = 'WRAPPING_UP',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  ReadyForProcessing = 'READY_FOR_PROCESSING',
  TransformingPsdsToPngs = 'TRANSFORMING_PSDS_TO_PNGS',
  StitchingSlides = 'STITCHING_SLIDES',
  CompressingSalesMaterial = 'COMPRESSING_SALES_MATERIAL'
}

export enum LanguageEnumType {
  English = 'ENGLISH',
  Dutch = 'DUTCH',
  German = 'GERMAN'
}

export type LinkType = {
  __typename?: 'LinkType';
  id: Scalars['String'];
  url: Scalars['String'];
  questionNodeId?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  backgroundColor?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
  subHeader?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  questionNode?: Maybe<QuestionNode>;
};

export enum LinkTypeEnumType {
  Single = 'SINGLE',
  Social = 'SOCIAL',
  Api = 'API',
  Facebook = 'FACEBOOK',
  Linkedin = 'LINKEDIN',
  Whatsapp = 'WHATSAPP',
  Instagram = 'INSTAGRAM',
  Twitter = 'TWITTER'
}

/** Login credential */
export type LoginInput = {
  email: Scalars['String'];
};

/** Information you get after you log out */
export type LoginOutput = {
  __typename?: 'LoginOutput';
  token?: Maybe<Scalars['String']>;
  expiryDate?: Maybe<Scalars['Int']>;
  user?: Maybe<UserType>;
};

export type MassSeedInput = {
  customerId: Scalars['String'];
  maxGroups: Scalars['Int'];
  maxTeams: Scalars['Int'];
  maxSessions: Scalars['Int'];
};

export type MostChangedPath = {
  __typename?: 'MostChangedPath';
  group?: Maybe<Scalars['String']>;
  topPositiveChanged?: Maybe<Array<Maybe<TopicDelta>>>;
  topNegativeChanged?: Maybe<Array<Maybe<TopicDelta>>>;
};

export type MostPopularPath = {
  __typename?: 'MostPopularPath';
  path?: Maybe<Array<Maybe<PathTopic>>>;
  group?: Maybe<Scalars['String']>;
};

export type MostTrendingTopic = {
  __typename?: 'MostTrendingTopic';
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
  nrVotes?: Maybe<Scalars['Int']>;
  group?: Maybe<Scalars['String']>;
  impactScore?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignUserToActionRequest?: Maybe<ActionRequest>;
  setActionRequestStatus?: Maybe<ActionRequest>;
  verifyActionRequest?: Maybe<ActionRequest>;
  /** Creates a dialogue schedule in the backend */
  createDialogueSchedule?: Maybe<CreateDialogueScheduleOutput>;
  /** Creates a dialogue schedule in the backend */
  toggleDialogueSchedule?: Maybe<DialogueSchedule>;
  sandbox?: Maybe<Scalars['String']>;
  generateWorkspaceFromCSV?: Maybe<Customer>;
  resetWorkspaceData?: Maybe<Scalars['Boolean']>;
  createJobProcessLocation?: Maybe<JobProcessLocation>;
  generateAutodeck?: Maybe<CreateWorkspaceJobType>;
  retryAutodeckJob?: Maybe<CreateWorkspaceJobType>;
  confirmCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  whitifyImage?: Maybe<AwsImageType>;
  removePixelRange?: Maybe<AwsImageType>;
  uploadJobImage?: Maybe<AwsImageType>;
  updateCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  assignTags?: Maybe<Dialogue>;
  createTag?: Maybe<Tag>;
  deleteTag?: Maybe<Tag>;
  /** Deselcting a topic implies that all question-options related to the topic string are disregarded as topic. */
  deselectTopic?: Maybe<Scalars['Boolean']>;
  /** Creates a list of topics and its subtopics. */
  createTopic?: Maybe<Scalars['Boolean']>;
  revokeTopic?: Maybe<Topic>;
  /** Creates a new automation. */
  createAutomation?: Maybe<AutomationModel>;
  updateAutomation?: Maybe<AutomationModel>;
  enableAutomation?: Maybe<AutomationModel>;
  deleteAutomation?: Maybe<AutomationModel>;
  sendAutomationDialogueLink?: Maybe<Scalars['Boolean']>;
  sendAutomationReport?: Maybe<Scalars['Boolean']>;
  createCampaign?: Maybe<CampaignType>;
  createBatchDeliveries?: Maybe<CreateBatchDeliveriesOutputType>;
  updateDeliveryStatus?: Maybe<Scalars['String']>;
  deleteTrigger?: Maybe<TriggerType>;
  editTrigger?: Maybe<TriggerType>;
  createTrigger?: Maybe<TriggerType>;
  createPermission?: Maybe<PermssionType>;
  updatePermissions?: Maybe<RoleType>;
  createRole?: Maybe<RoleType>;
  updateRoles?: Maybe<RoleType>;
  singleUpload?: Maybe<ImageType>;
  createWorkspace?: Maybe<Customer>;
  editWorkspace?: Maybe<Customer>;
  massSeed?: Maybe<Customer>;
  deleteCustomer?: Maybe<Customer>;
  handleUserStateInWorkspace?: Maybe<UserCustomer>;
  editUser?: Maybe<UserType>;
  deleteUser?: Maybe<DeleteUserOutput>;
  assignUserToDialogue?: Maybe<UserType>;
  assignUserToDialogues?: Maybe<UserType>;
  copyDialogue?: Maybe<Dialogue>;
  createDialogue?: Maybe<Dialogue>;
  editDialogue?: Maybe<Dialogue>;
  deleteDialogue?: Maybe<Dialogue>;
  setDialoguePrivacy?: Maybe<Dialogue>;
  uploadUpsellImage?: Maybe<ImageType>;
  authenticateLambda?: Maybe<Scalars['String']>;
  createAutomationToken?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  /** Given a token, checks in the database whether token has been set and has not expired yet */
  verifyUserToken?: Maybe<VerifyUserTokenOutput>;
  requestInvite?: Maybe<RequestInviteOutput>;
  /** Logs a user out by removing their refresh token */
  logout?: Maybe<Scalars['String']>;
  /** Invite a user to a particular customer domain, given an email and role */
  inviteUser?: Maybe<InviteUserOutput>;
  createSession?: Maybe<Session>;
  appendToInteraction?: Maybe<Session>;
  duplicateQuestion?: Maybe<QuestionNode>;
  deleteQuestion?: Maybe<QuestionNode>;
  createQuestion?: Maybe<QuestionNode>;
  deleteCTA?: Maybe<QuestionNode>;
  /** Create Call to Actions */
  createCTA?: Maybe<QuestionNode>;
  updateCTA?: Maybe<QuestionNode>;
  updateQuestion?: Maybe<QuestionNode>;
};


export type MutationAssignUserToActionRequestArgs = {
  input: AssignUserToActionRequestInput;
};


export type MutationSetActionRequestStatusArgs = {
  input: SetActionRequestStatusInput;
};


export type MutationVerifyActionRequestArgs = {
  input: VerifyActionRequestInput;
};


export type MutationCreateDialogueScheduleArgs = {
  input: CreateDialogueScheduleInput;
};


export type MutationToggleDialogueScheduleArgs = {
  input: ToggleDialogueScheduleInput;
};


export type MutationSandboxArgs = {
  input?: Maybe<SandboxInput>;
};


export type MutationGenerateWorkspaceFromCsvArgs = {
  input?: Maybe<GenerateWorkspaceCsvInputType>;
};


export type MutationResetWorkspaceDataArgs = {
  workspaceId?: Maybe<Scalars['String']>;
};


export type MutationCreateJobProcessLocationArgs = {
  input?: Maybe<CreateJobProcessLocationInput>;
};


export type MutationGenerateAutodeckArgs = {
  input?: Maybe<GenerateAutodeckInput>;
};


export type MutationRetryAutodeckJobArgs = {
  jobId?: Maybe<Scalars['String']>;
};


export type MutationConfirmCreateWorkspaceJobArgs = {
  input?: Maybe<GenerateAutodeckInput>;
};


export type MutationWhitifyImageArgs = {
  input?: Maybe<AdjustedImageInput>;
};


export type MutationRemovePixelRangeArgs = {
  input?: Maybe<RemovePixelRangeInput>;
};


export type MutationUploadJobImageArgs = {
  file?: Maybe<Scalars['Upload']>;
  jobId?: Maybe<Scalars['String']>;
  type?: Maybe<UploadImageEnumType>;
  disapproved?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateCreateWorkspaceJobArgs = {
  id?: Maybe<Scalars['String']>;
  status?: Maybe<JobStatusType>;
  resourceUrl?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
};


export type MutationAssignTagsArgs = {
  dialogueId?: Maybe<Scalars['String']>;
  tags?: Maybe<TagsInputObjectType>;
};


export type MutationCreateTagArgs = {
  name?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
  type?: Maybe<TagTypeEnum>;
};


export type MutationDeleteTagArgs = {
  tagId?: Maybe<Scalars['String']>;
};


export type MutationDeselectTopicArgs = {
  input?: Maybe<DeselectTopicInput>;
};


export type MutationCreateTopicArgs = {
  input?: Maybe<Array<CreateTopicInput>>;
};


export type MutationRevokeTopicArgs = {
  input?: Maybe<RevokeTopicInput>;
};


export type MutationCreateAutomationArgs = {
  input?: Maybe<CreateAutomationInput>;
};


export type MutationUpdateAutomationArgs = {
  input?: Maybe<CreateAutomationInput>;
};


export type MutationEnableAutomationArgs = {
  input?: Maybe<EnableAutomationInput>;
};


export type MutationDeleteAutomationArgs = {
  input?: Maybe<DeleteAutomationInput>;
};


export type MutationSendAutomationDialogueLinkArgs = {
  input: SendAutomationDialogueLinkInput;
};


export type MutationSendAutomationReportArgs = {
  input?: Maybe<SendAutomationReportInput>;
};


export type MutationCreateCampaignArgs = {
  input?: Maybe<CreateCampaignInputType>;
};


export type MutationCreateBatchDeliveriesArgs = {
  input?: Maybe<CreateBatchDeliveriesInputType>;
};


export type MutationUpdateDeliveryStatusArgs = {
  deliveryId?: Maybe<Scalars['String']>;
  status?: Maybe<DeliveryStatusEnum>;
};


export type MutationDeleteTriggerArgs = {
  id?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
};


export type MutationEditTriggerArgs = {
  triggerId?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
};


export type MutationCreateTriggerArgs = {
  input?: Maybe<CreateTriggerInputType>;
};


export type MutationCreatePermissionArgs = {
  data?: Maybe<PermissionInput>;
};


export type MutationUpdatePermissionsArgs = {
  input?: Maybe<UpdatePermissionsInput>;
};


export type MutationCreateRoleArgs = {
  data?: Maybe<RoleInput>;
};


export type MutationUpdateRolesArgs = {
  roleId?: Maybe<Scalars['String']>;
  permissions?: Maybe<PermissionIdsInput>;
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationCreateWorkspaceArgs = {
  input?: Maybe<CreateWorkspaceInput>;
};


export type MutationEditWorkspaceArgs = {
  input?: Maybe<EditWorkspaceInput>;
};


export type MutationMassSeedArgs = {
  input?: Maybe<MassSeedInput>;
};


export type MutationDeleteCustomerArgs = {
  where?: Maybe<CustomerWhereUniqueInput>;
};


export type MutationHandleUserStateInWorkspaceArgs = {
  input?: Maybe<HandleUserStateInWorkspaceInput>;
};


export type MutationEditUserArgs = {
  userId?: Maybe<Scalars['String']>;
  input?: Maybe<EditUserInput>;
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>;
};


export type MutationAssignUserToDialogueArgs = {
  input?: Maybe<AssignUserToDialogueInput>;
};


export type MutationAssignUserToDialoguesArgs = {
  input?: Maybe<AssignUserToDialoguesInput>;
};


export type MutationCopyDialogueArgs = {
  input?: Maybe<CreateDialogueInputType>;
};


export type MutationCreateDialogueArgs = {
  input?: Maybe<CreateDialogueInputType>;
};


export type MutationEditDialogueArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  isWithoutGenData?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<TagsInputObjectType>;
  language?: Maybe<LanguageEnumType>;
  dialogueFinisherHeading?: Maybe<Scalars['String']>;
  dialogueFinisherSubheading?: Maybe<Scalars['String']>;
};


export type MutationDeleteDialogueArgs = {
  input?: Maybe<DeleteDialogueInputType>;
};


export type MutationSetDialoguePrivacyArgs = {
  input?: Maybe<SetDialoguePrivacyInput>;
};


export type MutationUploadUpsellImageArgs = {
  input?: Maybe<UploadSellImageInputType>;
};


export type MutationAuthenticateLambdaArgs = {
  input?: Maybe<AuthenticateLambdaInput>;
};


export type MutationCreateAutomationTokenArgs = {
  email?: Maybe<Scalars['String']>;
};


export type MutationRegisterArgs = {
  input?: Maybe<RegisterInput>;
};


export type MutationVerifyUserTokenArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationRequestInviteArgs = {
  input?: Maybe<RequestInviteInput>;
};


export type MutationInviteUserArgs = {
  input?: Maybe<InviteUserInput>;
};


export type MutationCreateSessionArgs = {
  input?: Maybe<SessionInput>;
};


export type MutationAppendToInteractionArgs = {
  input?: Maybe<AppendToInteractionInput>;
};


export type MutationDuplicateQuestionArgs = {
  questionId?: Maybe<Scalars['String']>;
};


export type MutationDeleteQuestionArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationCreateQuestionArgs = {
  input?: Maybe<CreateQuestionNodeInputType>;
};


export type MutationDeleteCtaArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationCreateCtaArgs = {
  input?: Maybe<CreateCtaInputType>;
};


export type MutationUpdateCtaArgs = {
  input?: Maybe<UpdateCtaInputType>;
};


export type MutationUpdateQuestionArgs = {
  input?: Maybe<UpdateQuestionNodeInputType>;
};

export type NodeEntry = {
  __typename?: 'NodeEntry';
  creationDate?: Maybe<Scalars['Date']>;
  depth?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  relatedEdgeId?: Maybe<Scalars['String']>;
  relatedNodeId?: Maybe<Scalars['String']>;
  relatedNode?: Maybe<QuestionNode>;
  /** The core scoring value associated with the node entry. */
  value?: Maybe<NodeEntryValue>;
};

/** Data type for the actual node entry */
export type NodeEntryDataInput = {
  slider?: Maybe<SliderNodeEntryInput>;
  textbox?: Maybe<TextboxNodeEntryInput>;
  form?: Maybe<FormNodeEntryInput>;
  choice?: Maybe<ChoiceNodeEntryInput>;
  video?: Maybe<VideoNodeEntryInput>;
  register?: Maybe<RegisterNodeEntryInput>;
};

/** Input type for node-entry metadata */
export type NodeEntryInput = {
  nodeId?: Maybe<Scalars['String']>;
  edgeId?: Maybe<Scalars['String']>;
  depth?: Maybe<Scalars['Int']>;
  data?: Maybe<NodeEntryDataInput>;
};

export type NodeEntryValue = {
  __typename?: 'NodeEntryValue';
  sliderNodeEntry?: Maybe<Scalars['Int']>;
  textboxNodeEntry?: Maybe<Scalars['String']>;
  registrationNodeEntry?: Maybe<Scalars['String']>;
  choiceNodeEntry?: Maybe<Scalars['String']>;
  linkNodeEntry?: Maybe<Scalars['String']>;
  videoNodeEntry?: Maybe<Scalars['String']>;
  formNodeEntry?: Maybe<FormNodeEntryType>;
};

export enum OperandType {
  String = 'STRING',
  Int = 'INT',
  DateTime = 'DATE_TIME'
}

export type OptionInputType = {
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  overrideLeafId?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  isTopic?: Maybe<Scalars['Boolean']>;
};

export type OptionsInputType = {
  options?: Maybe<Array<Maybe<OptionInputType>>>;
};

/** An Organization defines the underlying members structure of a workspace, corresponding to an org-chart. */
export type Organization = {
  __typename?: 'Organization';
  id?: Maybe<Scalars['ID']>;
  layers?: Maybe<Array<Maybe<OrganizationLayer>>>;
};

/** A layer of an organization */
export type OrganizationLayer = {
  __typename?: 'OrganizationLayer';
  id?: Maybe<Scalars['ID']>;
  depth?: Maybe<Scalars['Int']>;
  type?: Maybe<OrganizationLayerType>;
};

/** Type of an organizational layer */
export enum OrganizationLayerType {
  Group = 'GROUP',
  Dialogue = 'DIALOGUE',
  Interaction = 'INTERACTION'
}

/** Information with regards to current page. */
export type PaginationPageInfo = {
  __typename?: 'PaginationPageInfo';
  hasPrevPage?: Maybe<Scalars['Boolean']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  prevPageOffset?: Maybe<Scalars['Int']>;
  nextPageOffset?: Maybe<Scalars['Int']>;
  pageIndex?: Maybe<Scalars['Int']>;
};

/** Fields that can be used for free text search on tables */
export enum PaginationSearchEnum {
  Name = 'name',
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  Title = 'title',
  PublicTitle = 'publicTitle'
}

/** Ways to sort a pagination object */
export enum PaginationSortByEnum {
  Score = 'score',
  Id = 'id',
  CreatedAt = 'createdAt',
  Email = 'email',
  Name = 'name',
  FirstName = 'firstName',
  LastName = 'lastName',
  Role = 'role',
  Medium = 'medium',
  Type = 'type',
  Paths = 'paths',
  User = 'user',
  When = 'when',
  ScheduledAt = 'scheduledAt',
  UpdatedAt = 'updatedAt'
}

/** Sorting of pagination (type and whether it ascends) */
export type PaginationSortInput = {
  by: PaginationSortByEnum;
  desc?: Maybe<Scalars['Boolean']>;
};

export type PaginationWhereInput = {
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  pageIndex?: Maybe<Scalars['Int']>;
  searchTerm?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  cursor?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<Maybe<PaginationSortInput>>>;
};

/** A path is the traversal of topics in a dialogue. */
export type Path = {
  __typename?: 'Path';
  id?: Maybe<Scalars['ID']>;
  topicStrings?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PathTopic = {
  __typename?: 'PathTopic';
  nrVotes?: Maybe<Scalars['Int']>;
  depth?: Maybe<Scalars['Int']>;
  topic?: Maybe<Scalars['String']>;
  impactScore?: Maybe<Scalars['Float']>;
};

export type PathedSessionsInput = {
  path?: Maybe<Array<Scalars['String']>>;
  startDateTime: Scalars['String'];
  endDateTime?: Maybe<Scalars['String']>;
  issueOnly?: Maybe<Scalars['Boolean']>;
  refresh?: Maybe<Scalars['Boolean']>;
};

export type PathedSessionsType = {
  __typename?: 'PathedSessionsType';
  startDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
  pathedSessions?: Maybe<Array<Session>>;
};

export type PermissionIdsInput = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PermissionInput = {
  customerId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type PermssionType = {
  __typename?: 'PermssionType';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
};

export type PreFormNodeInput = {
  header: Scalars['String'];
  helper: Scalars['String'];
  nextText: Scalars['String'];
  finishText: Scalars['String'];
};

export type PreFormNodeType = {
  __typename?: 'PreFormNodeType';
  id: Scalars['String'];
  header: Scalars['String'];
  helper: Scalars['String'];
  nextText: Scalars['String'];
  finishText: Scalars['String'];
};

export type PreviewDataType = {
  __typename?: 'PreviewDataType';
  colors?: Maybe<Array<Maybe<Scalars['String']>>>;
  rembgLogoUrl?: Maybe<Scalars['String']>;
  websiteScreenshotUrl?: Maybe<Scalars['String']>;
};

export type PublicDialogueConnection = ConnectionInterface & {
  __typename?: 'PublicDialogueConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  dialogues?: Maybe<Array<Maybe<PublicDialogueInfo>>>;
};

export type PublicDialogueInfo = {
  __typename?: 'PublicDialogueInfo';
  title?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getJobProcessLocations?: Maybe<JobProcessLocations>;
  getPreviewData?: Maybe<PreviewDataType>;
  getJob?: Maybe<CreateWorkspaceJobType>;
  getAutodeckJobs?: Maybe<AutodeckConnectionType>;
  getAdjustedLogo?: Maybe<AwsImageType>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  issue?: Maybe<IssueModel>;
  automation?: Maybe<AutomationModel>;
  automations?: Maybe<Array<Maybe<AutomationModel>>>;
  delivery?: Maybe<DeliveryType>;
  triggerConnection?: Maybe<TriggerConnectionType>;
  trigger?: Maybe<TriggerType>;
  triggers?: Maybe<Array<Maybe<TriggerType>>>;
  role?: Maybe<RoleType>;
  roleConnection?: Maybe<RoleConnection>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  customer?: Maybe<Customer>;
  UserOfCustomer?: Maybe<UserCustomer>;
  me?: Maybe<UserType>;
  users?: Maybe<Array<Maybe<UserType>>>;
  user?: Maybe<UserType>;
  dialogue?: Maybe<Dialogue>;
  dialogues?: Maybe<Array<Maybe<Dialogue>>>;
  dialogueLinks?: Maybe<PublicDialogueConnection>;
  refreshAccessToken?: Maybe<RefreshAccessTokenOutput>;
  sessions?: Maybe<Array<Maybe<Session>>>;
  /** A session is one entire user-interaction */
  session?: Maybe<Session>;
  question?: Maybe<QuestionNode>;
  edge?: Maybe<Edge>;
};


export type QueryGetPreviewDataArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetJobArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetAutodeckJobsArgs = {
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryGetAdjustedLogoArgs = {
  input?: Maybe<AdjustedImageInput>;
};


export type QueryTagsArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
};


export type QueryIssueArgs = {
  input: GetIssueResolverInput;
  actionableFilter?: Maybe<ActionRequestFilterInput>;
};


export type QueryAutomationArgs = {
  where?: Maybe<GetAutomationInput>;
};


export type QueryAutomationsArgs = {
  where?: Maybe<GetAutomationsByWorkspaceInput>;
};


export type QueryDeliveryArgs = {
  deliveryId?: Maybe<Scalars['String']>;
};


export type QueryTriggerConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryTriggerArgs = {
  triggerId?: Maybe<Scalars['String']>;
};


export type QueryTriggersArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryRoleArgs = {
  input?: Maybe<FindRoleInput>;
};


export type QueryRoleConnectionArgs = {
  customerId?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryCustomerArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryUserOfCustomerArgs = {
  input?: Maybe<UserOfCustomerInput>;
};


export type QueryUsersArgs = {
  customerSlug?: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  userId?: Maybe<Scalars['String']>;
};


export type QueryDialogueArgs = {
  where?: Maybe<DialogueWhereUniqueInput>;
};


export type QueryDialoguesArgs = {
  filter?: Maybe<DialogueFilterInputType>;
};


export type QueryDialogueLinksArgs = {
  workspaceId?: Maybe<Scalars['String']>;
  filter?: Maybe<DialogueConnectionFilterInput>;
};


export type QuerySessionsArgs = {
  where?: Maybe<SessionWhereUniqueInput>;
};


export type QuerySessionArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryQuestionArgs = {
  where?: Maybe<QuestionWhereUniqueInput>;
};


export type QueryEdgeArgs = {
  id?: Maybe<Scalars['String']>;
};

export enum QuestionAspectType {
  NodeValue = 'NODE_VALUE',
  AnswerSpeed = 'ANSWER_SPEED'
}

/** QuestionConditionScope */
export type QuestionConditionScopeModel = {
  __typename?: 'QuestionConditionScopeModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  aspect?: Maybe<QuestionAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregate>;
};

export enum QuestionImpactScoreType {
  Percentage = 'PERCENTAGE'
}

export type QuestionNode = {
  __typename?: 'QuestionNode';
  id: Scalars['ID'];
  isLeaf: Scalars['Boolean'];
  isRoot?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  videoEmbeddedNodeId?: Maybe<Scalars['String']>;
  extraContent?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['Date']>;
  type?: Maybe<QuestionNodeTypeEnum>;
  overrideLeafId?: Maybe<Scalars['String']>;
  indepthQuestionStatisticsSummary?: Maybe<Array<Maybe<IndepthQuestionStatisticsSummary>>>;
  questionStatisticsSummary?: Maybe<QuestionStatisticsSummary>;
  /** Slidernode resolver */
  sliderNode?: Maybe<SliderNodeType>;
  /** FormNode resolver */
  form?: Maybe<FormNodeType>;
  share?: Maybe<ShareNodeType>;
  questionDialogueId?: Maybe<Scalars['String']>;
  links: Array<LinkType>;
  questionDialogue?: Maybe<Dialogue>;
  overrideLeaf?: Maybe<QuestionNode>;
  options?: Maybe<Array<Maybe<QuestionOption>>>;
  children?: Maybe<Array<Edge>>;
};


export type QuestionNodeIndepthQuestionStatisticsSummaryArgs = {
  input?: Maybe<QuestionStatisticsSummaryFilterInput>;
};


export type QuestionNodeQuestionStatisticsSummaryArgs = {
  input?: Maybe<QuestionStatisticsSummaryFilterInput>;
};

/** The different types a node can assume */
export enum QuestionNodeTypeEnum {
  Generic = 'GENERIC',
  Slider = 'SLIDER',
  Choice = 'CHOICE',
  Registration = 'REGISTRATION',
  Form = 'FORM',
  Textbox = 'TEXTBOX',
  Link = 'LINK',
  Share = 'SHARE',
  VideoEmbedded = 'VIDEO_EMBEDDED'
}

export type QuestionNodeWhereInputType = {
  isRoot?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
};

export type QuestionNodeWhereUniqueInput = {
  id: Scalars['String'];
};

export type QuestionOption = {
  __typename?: 'QuestionOption';
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  isTopic?: Maybe<Scalars['Boolean']>;
  questionId?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  overrideLeafId?: Maybe<Scalars['String']>;
  overrideLeaf?: Maybe<QuestionNode>;
  position?: Maybe<Scalars['Int']>;
};

export type QuestionStatisticsSummary = {
  __typename?: 'QuestionStatisticsSummary';
  id?: Maybe<Scalars['ID']>;
  dialogueId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
  startDateTime?: Maybe<Scalars['Date']>;
  endDateTime?: Maybe<Scalars['Date']>;
};

export type QuestionStatisticsSummaryFilterInput = {
  startDateTime: Scalars['String'];
  impactType: QuestionImpactScoreType;
  endDateTime?: Maybe<Scalars['String']>;
  impactTreshold?: Maybe<Scalars['Int']>;
  refresh?: Maybe<Scalars['Boolean']>;
};

export type QuestionWhereUniqueInput = {
  id: Scalars['ID'];
};

export type RecipientsInputType = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum RecurringPeriodType {
  EveryYear = 'EVERY_YEAR',
  EveryMonth = 'EVERY_MONTH',
  EveryWeek = 'EVERY_WEEK',
  EveryDay = 'EVERY_DAY',
  StartOfDay = 'START_OF_DAY',
  EndOfDay = 'END_OF_DAY',
  StartOfWeek = 'START_OF_WEEK',
  EndOfWeek = 'END_OF_WEEK',
  Custom = 'CUSTOM'
}

export type RefreshAccessTokenOutput = {
  __typename?: 'RefreshAccessTokenOutput';
  accessToken?: Maybe<Scalars['String']>;
};

/** Registration credentials */
export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  customerId: Scalars['String'];
  roleId?: Maybe<Scalars['String']>;
};

/** Input type for a register node */
export type RegisterNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export type RemovePixelRangeInput = {
  key?: Maybe<Scalars['String']>;
  bucket?: Maybe<Scalars['String']>;
  red?: Maybe<Scalars['Int']>;
  green?: Maybe<Scalars['Int']>;
  blue?: Maybe<Scalars['Int']>;
  range?: Maybe<Scalars['Int']>;
};

export type RequestInviteInput = {
  email: Scalars['String'];
};

export type RequestInviteOutput = {
  __typename?: 'RequestInviteOutput';
  didInvite?: Maybe<Scalars['Boolean']>;
  userExists?: Maybe<Scalars['Boolean']>;
  loginToken?: Maybe<Scalars['String']>;
};

/** Revokes a sub topic from a topic based on input */
export type RevokeTopicInput = {
  topic: Scalars['String'];
  subTopic: Scalars['String'];
};

export type RoleConnection = DeprecatedConnectionInterface & {
  __typename?: 'RoleConnection';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<DeprecatedPaginationPageInfo>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<RoleType>>>;
};

export type RoleDataInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type RoleInput = {
  customerId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<SystemPermission>>>;
};

export type RoleType = {
  __typename?: 'RoleType';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  roleId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  nrPermissions?: Maybe<Scalars['Int']>;
  allPermissions?: Maybe<Array<Maybe<SystemPermission>>>;
  permissions?: Maybe<Array<Maybe<SystemPermission>>>;
};

export type SandboxInput = {
  name?: Maybe<Scalars['String']>;
  onlyGet?: Maybe<Scalars['Boolean']>;
  value?: Maybe<Scalars['Int']>;
};

export type SendAutomationDialogueLinkInput = {
  workspaceSlug: Scalars['String'];
  automationActionId: Scalars['String'];
};

export type SendAutomationReportInput = {
  workspaceSlug: Scalars['String'];
  automationActionId: Scalars['String'];
  reportUrl: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  createdAt?: Maybe<Scalars['Date']>;
  dialogueId?: Maybe<Scalars['String']>;
  mainScore?: Maybe<Scalars['Float']>;
  browser?: Maybe<Scalars['String']>;
  paths?: Maybe<Scalars['Int']>;
  score: Scalars['Float'];
  dialogue?: Maybe<Dialogue>;
  totalTimeInSec?: Maybe<Scalars['Int']>;
  originUrl?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  deliveryId?: Maybe<Scalars['String']>;
  delivery?: Maybe<DeliveryType>;
  nodeEntries?: Maybe<Array<NodeEntry>>;
  followUpAction?: Maybe<FormNodeEntryType>;
};

/** Actions expected after session */
export enum SessionActionType {
  Contact = 'CONTACT'
}

export type SessionConnection = ConnectionInterface & {
  __typename?: 'SessionConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  sessions: Array<Session>;
};

export type SessionConnectionFilterInput = {
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateString']>;
  endDate?: Maybe<Scalars['DateString']>;
  deliveryType?: Maybe<SessionDeliveryType>;
  scoreRange?: Maybe<SessionScoreRangeFilter>;
  campaignVariantId?: Maybe<Scalars['String']>;
  orderBy?: Maybe<SessionConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  dialogueIds?: Maybe<Array<Scalars['String']>>;
  withFollowUpAction?: Maybe<Scalars['Boolean']>;
};

/** Fields to order SessionConnection by. */
export enum SessionConnectionOrder {
  CreatedAt = 'createdAt',
  DialogueId = 'dialogueId'
}

/** Sorting of sessionConnection */
export type SessionConnectionOrderByInput = {
  by: SessionConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

/** Delivery type of session to filter by. */
export enum SessionDeliveryType {
  Campaigns = 'campaigns',
  NoCampaigns = 'noCampaigns'
}

/** Input for session */
export type SessionInput = {
  dialogueId: Scalars['String'];
  entries?: Maybe<Array<Maybe<NodeEntryInput>>>;
  deliveryId?: Maybe<Scalars['String']>;
  originUrl?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  totalTimeInSec?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
};

/** Scores to filter sessions by. */
export type SessionScoreRangeFilter = {
  min?: Maybe<Scalars['Int']>;
  max?: Maybe<Scalars['Int']>;
};

export type SessionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  dialogueId?: Maybe<Scalars['ID']>;
};

export type SetActionRequestStatusInput = {
  status: ActionRequestState;
  actionRequestId: Scalars['String'];
  workspaceId: Scalars['String'];
};

export type SetDialoguePrivacyInput = {
  customerId: Scalars['String'];
  dialogueSlug: Scalars['String'];
  state: Scalars['Boolean'];
};

export type ShareNodeInputType = {
  id?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ShareNodeType = {
  __typename?: 'ShareNodeType';
  id?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type SlideNodeMarkerInput = {
  id?: Maybe<Scalars['ID']>;
  label: Scalars['String'];
  subLabel: Scalars['String'];
  range?: Maybe<SliderNodeRangeInputType>;
};

/** Input type for a slider node */
export type SliderNodeEntryInput = {
  value?: Maybe<Scalars['Int']>;
};

export type SliderNodeInputType = {
  id?: Maybe<Scalars['ID']>;
  markers?: Maybe<Array<SlideNodeMarkerInput>>;
};

export type SliderNodeMarkerType = {
  __typename?: 'SliderNodeMarkerType';
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  subLabel?: Maybe<Scalars['String']>;
  range?: Maybe<SliderNodeRangeType>;
};

export type SliderNodeRangeInputType = {
  start?: Maybe<Scalars['Float']>;
  end?: Maybe<Scalars['Float']>;
};

export type SliderNodeRangeType = {
  __typename?: 'SliderNodeRangeType';
  id?: Maybe<Scalars['ID']>;
  start?: Maybe<Scalars['Float']>;
  end?: Maybe<Scalars['Float']>;
};

export type SliderNodeType = {
  __typename?: 'SliderNodeType';
  id?: Maybe<Scalars['ID']>;
  happyText?: Maybe<Scalars['String']>;
  unhappyText?: Maybe<Scalars['String']>;
  markers?: Maybe<Array<SliderNodeMarkerType>>;
};

/** Details regarding interaction with social node */
export type SocialNodeEntryInput = {
  visitedLink?: Maybe<Scalars['String']>;
};

/** A status is a label that indicates the current state of a process. */
export enum StatusType {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Closed = 'CLOSED'
}

export enum SystemPermission {
  CanAccessAllDialogues = 'CAN_ACCESS_ALL_DIALOGUES',
  CanViewActionRequests = 'CAN_VIEW_ACTION_REQUESTS',
  CanAccessAllActionRequests = 'CAN_ACCESS_ALL_ACTION_REQUESTS',
  CanResetWorkspaceData = 'CAN_RESET_WORKSPACE_DATA',
  CanAccessAdminPanel = 'CAN_ACCESS_ADMIN_PANEL',
  CanGenerateWorkspaceFromCsv = 'CAN_GENERATE_WORKSPACE_FROM_CSV',
  CanAssignUsersToDialogue = 'CAN_ASSIGN_USERS_TO_DIALOGUE',
  CanEditDialogue = 'CAN_EDIT_DIALOGUE',
  CanBuildDialogue = 'CAN_BUILD_DIALOGUE',
  CanViewDialogue = 'CAN_VIEW_DIALOGUE',
  CanDeleteDialogue = 'CAN_DELETE_DIALOGUE',
  CanViewDialogueAnalytics = 'CAN_VIEW_DIALOGUE_ANALYTICS',
  CanViewUsers = 'CAN_VIEW_USERS',
  CanAddUsers = 'CAN_ADD_USERS',
  CanDeleteUsers = 'CAN_DELETE_USERS',
  CanEditUsers = 'CAN_EDIT_USERS',
  CanCreateTriggers = 'CAN_CREATE_TRIGGERS',
  CanDeleteTriggers = 'CAN_DELETE_TRIGGERS',
  CanDeleteWorkspace = 'CAN_DELETE_WORKSPACE',
  CanEditWorkspace = 'CAN_EDIT_WORKSPACE',
  CanViewCampaigns = 'CAN_VIEW_CAMPAIGNS',
  CanCreateCampaigns = 'CAN_CREATE_CAMPAIGNS',
  CanCreateDeliveries = 'CAN_CREATE_DELIVERIES',
  CanCreateAutomations = 'CAN_CREATE_AUTOMATIONS',
  CanUpdateAutomations = 'CAN_UPDATE_AUTOMATIONS',
  CanViewAutomations = 'CAN_VIEW_AUTOMATIONS',
  CanAccessReportPage = 'CAN_ACCESS_REPORT_PAGE',
  CanDownloadReports = 'CAN_DOWNLOAD_REPORTS'
}

export type Tag = {
  __typename?: 'Tag';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  type?: Maybe<TagTypeEnum>;
};

export enum TagTypeEnum {
  Default = 'DEFAULT',
  Location = 'LOCATION',
  Agent = 'AGENT'
}

export type TagsInputObjectType = {
  entries?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Input type for a textbox node */
export type TextboxNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

/** Toggle status of dialogue schedule */
export type ToggleDialogueScheduleInput = {
  dialogueScheduleId: Scalars['ID'];
  status: Scalars['Boolean'];
};

/** Model for topic */
export type Topic = {
  __typename?: 'Topic';
  id: Scalars['ID'];
  name: Scalars['String'];
  type: Scalars['String'];
  subTopics?: Maybe<Array<Maybe<Topic>>>;
  parentTopics?: Maybe<Array<Maybe<Topic>>>;
  workspace?: Maybe<Customer>;
  /** A list of question options to which this topic is assigned to. */
  usedByOptions?: Maybe<Array<Maybe<QuestionOption>>>;
};

export type TopicDelta = {
  __typename?: 'TopicDelta';
  topic?: Maybe<Scalars['String']>;
  nrVotes?: Maybe<Scalars['Int']>;
  averageCurrent?: Maybe<Scalars['Float']>;
  averagePrevious?: Maybe<Scalars['Float']>;
  delta?: Maybe<Scalars['Float']>;
  percentageChanged?: Maybe<Scalars['Float']>;
  group?: Maybe<Scalars['String']>;
};

/** All the different types a topic can be. */
export enum TopicEnumType {
  System = 'SYSTEM',
  Workspace = 'WORKSPACE'
}

/** Generic filter object for filtering topics */
export type TopicFilterInput = {
  topicStrings?: Maybe<Array<Scalars['String']>>;
  relatedSessionScoreLowerThreshold?: Maybe<Scalars['Float']>;
  dialogueStrings?: Maybe<Array<Scalars['String']>>;
};

export type TopicInputType = {
  isRoot?: Maybe<Scalars['Boolean']>;
  value: Scalars['String'];
  impactScoreType: DialogueImpactScoreType;
  startDateTime: Scalars['String'];
  endDateTime?: Maybe<Scalars['String']>;
  refresh?: Maybe<Scalars['Boolean']>;
};

export type TopicNodeEntryValue = {
  __typename?: 'TopicNodeEntryValue';
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  nodeEntryId?: Maybe<Scalars['String']>;
  mainScore?: Maybe<Scalars['Int']>;
};

export type TopicType = {
  __typename?: 'TopicType';
  name: Scalars['String'];
  impactScore?: Maybe<Scalars['Float']>;
  nrVotes?: Maybe<Scalars['Int']>;
  subTopics?: Maybe<Array<Maybe<TopicType>>>;
  basicStats?: Maybe<BasicStatistics>;
};

export enum TriggerConditionEnum {
  LowThreshold = 'LOW_THRESHOLD',
  HighThreshold = 'HIGH_THRESHOLD',
  InnerRange = 'INNER_RANGE',
  OuterRange = 'OUTER_RANGE',
  TextMatch = 'TEXT_MATCH'
}

export type TriggerConditionInputType = {
  id?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerConditionEnum>;
  minValue?: Maybe<Scalars['Int']>;
  maxValue?: Maybe<Scalars['Int']>;
  textValue?: Maybe<Scalars['String']>;
};

export type TriggerConditionType = {
  __typename?: 'TriggerConditionType';
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<TriggerConditionEnum>;
  minValue?: Maybe<Scalars['Int']>;
  maxValue?: Maybe<Scalars['Int']>;
  textValue?: Maybe<Scalars['String']>;
  triggerId?: Maybe<Scalars['String']>;
  question?: Maybe<QuestionNode>;
};

export type TriggerConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'TriggerConnectionType';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<DeprecatedPaginationPageInfo>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  triggers?: Maybe<Array<Maybe<TriggerType>>>;
};

export type TriggerInputType = {
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerTypeEnum>;
  medium?: Maybe<TriggerMediumEnum>;
  conditions?: Maybe<Array<Maybe<TriggerConditionInputType>>>;
};

export enum TriggerMediumEnum {
  Email = 'EMAIL',
  Phone = 'PHONE',
  Both = 'BOTH'
}

export type TriggerType = {
  __typename?: 'TriggerType';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerTypeEnum>;
  medium?: Maybe<TriggerMediumEnum>;
  relatedNodeId?: Maybe<Scalars['String']>;
  relatedDialogue?: Maybe<Dialogue>;
  conditions?: Maybe<Array<Maybe<TriggerConditionType>>>;
  recipients?: Maybe<Array<Maybe<UserType>>>;
};

export enum TriggerTypeEnum {
  Question = 'QUESTION',
  Scheduled = 'SCHEDULED'
}

export type UpdateCtaInputType = {
  id?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['ID']>;
  customerSlug: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  type?: Maybe<QuestionNodeTypeEnum>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  form?: Maybe<FormNodeInputType>;
};

export type UpdatePermissionsInput = {
  roleId?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<SystemPermission>>>;
};

export type UpdateQuestionNodeInputType = {
  id: Scalars['ID'];
  customerId?: Maybe<Scalars['ID']>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  edgeId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  extraContent?: Maybe<Scalars['String']>;
  unhappyText?: Maybe<Scalars['String']>;
  happyText?: Maybe<Scalars['String']>;
  updateSameTemplate?: Maybe<Scalars['Boolean']>;
  sliderNode?: Maybe<SliderNodeInputType>;
  optionEntries?: Maybe<OptionsInputType>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
};


export enum UploadImageEnumType {
  Logo = 'LOGO',
  WebsiteScreenshot = 'WEBSITE_SCREENSHOT'
}

export type UploadSellImageInputType = {
  file?: Maybe<Scalars['Upload']>;
  workspaceId?: Maybe<Scalars['String']>;
};

/**
 * An urgent path is a path which was considered urgent. It currently follows a simple heuristic:
 * 1. Get all sessions of the workspace.
 * 2. Find sessions with a score below 4. If there is no such session, then no urgency is reported.
 * 3. Find the topic that has the most negative responses.
 */
export type UrgentPath = {
  __typename?: 'UrgentPath';
  id?: Maybe<Scalars['ID']>;
  path?: Maybe<Path>;
  dialogueId: Scalars['String'];
  dialogue?: Maybe<Dialogue>;
  basicStats?: Maybe<BasicStatistics>;
};

export type UserConnection = ConnectionInterface & {
  __typename?: 'UserConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo?: Maybe<PaginationPageInfo>;
  userCustomers?: Maybe<Array<Maybe<UserCustomer>>>;
};

export type UserConnectionFilterInput = {
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  orderBy?: Maybe<UserConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

/** Fields to order UserConnection by. */
export enum UserConnectionOrder {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  CreatedAt = 'createdAt',
  LastActivity = 'lastActivity',
  Role = 'role',
  IsActive = 'isActive'
}

/** Sorting of UserConnection */
export type UserConnectionOrderByInput = {
  by: UserConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

export type UserCustomer = {
  __typename?: 'UserCustomer';
  createdAt: Scalars['Date'];
  isActive?: Maybe<Scalars['Boolean']>;
  user?: Maybe<UserType>;
  customer?: Maybe<Customer>;
  role?: Maybe<RoleType>;
};

export type UserInput = {
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  roleId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type UserOfCustomerInput = {
  userId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  lastLoggedIn?: Maybe<Scalars['Date']>;
  lastActivity?: Maybe<Scalars['Date']>;
  assignedDialogues?: Maybe<AssignedDialogues>;
  globalPermissions?: Maybe<Array<Maybe<SystemPermission>>>;
  userCustomers?: Maybe<Array<Maybe<UserCustomer>>>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  roleId?: Maybe<Scalars['String']>;
  role?: Maybe<RoleType>;
};


export type UserTypeAssignedDialoguesArgs = {
  input?: Maybe<UserOfCustomerInput>;
};

export type VerifyActionRequestInput = {
  workspaceId: Scalars['String'];
  actionRequestId: Scalars['String'];
};

export type VerifyUserTokenOutput = {
  __typename?: 'VerifyUserTokenOutput';
  accessToken?: Maybe<Scalars['String']>;
  accessTokenExpiry?: Maybe<Scalars['Int']>;
  userData?: Maybe<UserType>;
};

/** Input type for a video node */
export type VideoNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export enum WorkspaceAspectType {
  NrInteractions = 'NR_INTERACTIONS',
  NrVisitors = 'NR_VISITORS',
  GeneralScore = 'GENERAL_SCORE'
}

/** WorkspaceConditionScope */
export type WorkspaceConditionScopeModel = {
  __typename?: 'WorkspaceConditionScopeModel';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
  aspect?: Maybe<WorkspaceAspectType>;
  aggregate?: Maybe<ConditionPropertyAggregate>;
};

export type WorkspaceStatistics = {
  __typename?: 'WorkspaceStatistics';
  id?: Maybe<Scalars['ID']>;
  workspaceStatisticsSummary: Array<DialogueStatisticsSummaryModel>;
  /** Basic statistics of a workspace (e.g. number of responses, average general score, etc) */
  basicStats?: Maybe<BasicStatistics>;
  /** Histogram of responses over time. */
  responseHistogram?: Maybe<DateHistogram>;
  /** Histogram of issues over time. */
  issueHistogram?: Maybe<DateHistogram>;
  /** Topics of a workspace ranked by either impact score or number of responses */
  rankedTopics?: Maybe<Array<Maybe<TopicType>>>;
  /** Gets the health score of the workspace */
  health?: Maybe<HealthScore>;
  /** Get the path (sequence of topics) with the most changed impact score. */
  mostChangedPath?: Maybe<MostChangedPath>;
  mostTrendingTopic?: Maybe<MostTrendingTopic>;
  mostPopularPath?: Maybe<MostPopularPath>;
};


export type WorkspaceStatisticsWorkspaceStatisticsSummaryArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsBasicStatsArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsResponseHistogramArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsIssueHistogramArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsRankedTopicsArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsHealthArgs = {
  input?: Maybe<HealthScoreInput>;
};


export type WorkspaceStatisticsMostChangedPathArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsMostTrendingTopicArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};


export type WorkspaceStatisticsMostPopularPathArgs = {
  input?: Maybe<DialogueStatisticsSummaryFilterInput>;
};

export type CreateJobProcessLocationInput = {
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<JobProcessLocationType>;
};

export type LineChartDataType = {
  __typename?: 'lineChartDataType';
  x?: Maybe<Scalars['String']>;
  y?: Maybe<Scalars['Int']>;
  entryId?: Maybe<Scalars['String']>;
};

export type TopPathType = {
  __typename?: 'topPathType';
  answer?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  basicSentiment?: Maybe<Scalars['String']>;
};

export type DeselectTopicMutationVariables = Exact<{
  input?: Maybe<DeselectTopicInput>;
}>;


export type DeselectTopicMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deselectTopic'>
);

export type GetDialogueTopicsQueryVariables = Exact<{
  dialogueId: Scalars['ID'];
  input: TopicInputType;
}>;


export type GetDialogueTopicsQuery = (
  { __typename?: 'Query' }
  & { dialogue?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id'>
    & { topic?: Maybe<(
      { __typename?: 'TopicType' }
      & Pick<TopicType, 'name' | 'impactScore' | 'nrVotes'>
      & { subTopics?: Maybe<Array<Maybe<(
        { __typename?: 'TopicType' }
        & Pick<TopicType, 'name' | 'impactScore' | 'nrVotes'>
      )>>> }
    )> }
  )> }
);

export type GetProblemsPerDialogueQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  filter?: Maybe<IssueFilterInput>;
}>;


export type GetProblemsPerDialogueQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { issueDialogues?: Maybe<Array<Maybe<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id' | 'topic' | 'rankScore' | 'followUpAction' | 'actionRequiredCount'>
      & { dialogue?: Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'id' | 'title'>
      )>, basicStats: (
        { __typename?: 'BasicStatistics' }
        & Pick<BasicStatistics, 'responseCount' | 'average'>
      ), history: (
        { __typename?: 'DateHistogram' }
        & Pick<DateHistogram, 'id'>
        & { items: Array<(
          { __typename?: 'DateHistogramItem' }
          & Pick<DateHistogramItem, 'id' | 'date' | 'frequency'>
        )> }
      ) }
    )>>> }
  )> }
);

export type GetSessionPathsQueryVariables = Exact<{
  dialogueId: Scalars['ID'];
  input: PathedSessionsInput;
}>;


export type GetSessionPathsQuery = (
  { __typename?: 'Query' }
  & { dialogue?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id'>
    & { pathedSessionsConnection?: Maybe<(
      { __typename?: 'PathedSessionsType' }
      & Pick<PathedSessionsType, 'startDateTime' | 'endDateTime' | 'path'>
      & { pathedSessions?: Maybe<Array<(
        { __typename?: 'Session' }
        & Pick<Session, 'id' | 'mainScore' | 'createdAt' | 'score' | 'totalTimeInSec'>
      )>> }
    )> }
  )> }
);

export type GetWorkspaceDialogueStatisticsQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  startDateTime: Scalars['String'];
  endDateTime: Scalars['String'];
}>;


export type GetWorkspaceDialogueStatisticsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & { dialogueSchedule?: Maybe<(
      { __typename?: 'DialogueSchedule' }
      & Pick<DialogueSchedule, 'id' | 'isEnabled'>
      & { dataPeriodSchedule?: Maybe<(
        { __typename?: 'DataPeriodSchedule' }
        & Pick<DataPeriodSchedule, 'id' | 'startDateExpression' | 'endInDeltaMinutes'>
      )> }
    )>, organization?: Maybe<(
      { __typename?: 'Organization' }
      & Pick<Organization, 'id'>
      & { layers?: Maybe<Array<Maybe<(
        { __typename?: 'OrganizationLayer' }
        & Pick<OrganizationLayer, 'id' | 'depth' | 'type'>
      )>>> }
    )>, statistics?: Maybe<(
      { __typename?: 'WorkspaceStatistics' }
      & { workspaceStatisticsSummary: Array<(
        { __typename?: 'DialogueStatisticsSummaryModel' }
        & Pick<DialogueStatisticsSummaryModel, 'id' | 'nrVotes' | 'impactScore' | 'updatedAt' | 'title'>
        & { dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'title' | 'id'>
        )> }
      )> }
    )> }
  )> }
);

export type ResetWorkspaceDataMutationVariables = Exact<{
  workspaceId?: Maybe<Scalars['String']>;
}>;


export type ResetWorkspaceDataMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetWorkspaceData'>
);

export type GetWorkspaceSummaryDetailsQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  summaryInput: DialogueStatisticsSummaryFilterInput;
  healthInput: HealthScoreInput;
}>;


export type GetWorkspaceSummaryDetailsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'isDemo'>
    & { statistics?: Maybe<(
      { __typename?: 'WorkspaceStatistics' }
      & Pick<WorkspaceStatistics, 'id'>
      & { health?: Maybe<(
        { __typename?: 'HealthScore' }
        & Pick<HealthScore, 'nrVotes' | 'negativeResponseCount' | 'score'>
      )>, rankedTopics?: Maybe<Array<Maybe<(
        { __typename?: 'TopicType' }
        & Pick<TopicType, 'name'>
        & { basicStats?: Maybe<(
          { __typename?: 'BasicStatistics' }
          & Pick<BasicStatistics, 'average' | 'responseCount'>
        )> }
      )>>> }
    )> }
  )> }
);

export type ActionRequestFragmentFragment = (
  { __typename?: 'ActionRequest' }
  & Pick<ActionRequest, 'id' | 'createdAt' | 'isVerified' | 'requestEmail' | 'dialogueId' | 'status'>
  & { issue?: Maybe<(
    { __typename?: 'IssueModel' }
    & { topic: (
      { __typename?: 'Topic' }
      & Pick<Topic, 'name'>
    ) }
  )>, session?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id' | 'mainScore'>
  )>, dialogue?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id' | 'title' | 'slug'>
  )>, assignee?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'email'>
  )> }
);

export type DeliveryEventFragmentFragment = (
  { __typename?: 'DeliveryEventType' }
  & Pick<DeliveryEventType, 'id' | 'status' | 'createdAt' | 'failureMessage'>
);

export type DeliveryFragmentFragment = (
  { __typename?: 'DeliveryType' }
  & Pick<DeliveryType, 'id' | 'deliveryRecipientFirstName' | 'deliveryRecipientLastName' | 'deliveryRecipientEmail' | 'deliveryRecipientPhone' | 'scheduledAt' | 'updatedAt' | 'createdAt' | 'currentStatus'>
  & { campaignVariant?: Maybe<(
    { __typename?: 'CampaignVariantType' }
    & Pick<CampaignVariantType, 'id' | 'label' | 'type'>
    & { campaign?: Maybe<(
      { __typename?: 'CampaignType' }
      & Pick<CampaignType, 'id' | 'label'>
    )> }
  )> }
);

export type IssueFragmentFragment = (
  { __typename?: 'IssueModel' }
  & Pick<IssueModel, 'id' | 'createdAt' | 'teamCount'>
  & { topic: (
    { __typename?: 'Topic' }
    & Pick<Topic, 'id' | 'name'>
  ), basicStats?: Maybe<(
    { __typename?: 'ActionRequestStatistics' }
    & Pick<ActionRequestStatistics, 'average' | 'responseCount' | 'urgentCount'>
  )>, actionRequests: Array<Maybe<(
    { __typename?: 'ActionRequest' }
    & Pick<ActionRequest, 'id' | 'createdAt' | 'status'>
    & { session?: Maybe<(
      { __typename?: 'Session' }
      & Pick<Session, 'id' | 'mainScore'>
    )>, dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title'>
    )>, assignee?: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'email'>
    )> }
  )>> }
);

export type NodeEntryFragmentFragment = (
  { __typename?: 'NodeEntry' }
  & Pick<NodeEntry, 'id' | 'depth'>
  & { relatedNode?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'title' | 'type'>
  )>, value?: Maybe<(
    { __typename?: 'NodeEntryValue' }
    & Pick<NodeEntryValue, 'sliderNodeEntry' | 'textboxNodeEntry' | 'registrationNodeEntry' | 'choiceNodeEntry' | 'videoNodeEntry' | 'linkNodeEntry'>
    & { formNodeEntry?: Maybe<(
      { __typename?: 'FormNodeEntryType' }
      & Pick<FormNodeEntryType, 'id'>
      & { values?: Maybe<Array<Maybe<(
        { __typename?: 'FormNodeEntryValueType' }
        & Pick<FormNodeEntryValueType, 'email' | 'phoneNumber' | 'url' | 'shortText' | 'longText' | 'number' | 'contacts'>
        & { relatedField?: Maybe<(
          { __typename?: 'FormNodeField' }
          & Pick<FormNodeField, 'id' | 'type'>
        )> }
      )>>> }
    )> }
  )> }
);

export type SessionFragmentFragment = (
  { __typename?: 'Session' }
  & Pick<Session, 'id' | 'createdAt' | 'score' | 'originUrl' | 'totalTimeInSec' | 'device' | 'dialogueId'>
  & { nodeEntries?: Maybe<Array<(
    { __typename?: 'NodeEntry' }
    & NodeEntryFragmentFragment
  )>>, delivery?: Maybe<(
    { __typename?: 'DeliveryType' }
    & DeliveryFragmentFragment
  )>, dialogue?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id' | 'title' | 'slug'>
  )>, followUpAction?: Maybe<(
    { __typename?: 'FormNodeEntryType' }
    & { values?: Maybe<Array<Maybe<(
      { __typename?: 'FormNodeEntryValueType' }
      & Pick<FormNodeEntryValueType, 'shortText' | 'email'>
    )>>> }
  )> }
);

export type GetDialogueLayoutDetailsQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  dialogueId: Scalars['ID'];
  healthInput: HealthScoreInput;
  filter?: Maybe<DialogueFilterInputType>;
}>;


export type GetDialogueLayoutDetailsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'averageScore'>
      & { healthScore?: Maybe<(
        { __typename?: 'HealthScore' }
        & Pick<HealthScore, 'nrVotes' | 'negativeResponseCount' | 'score' | 'average'>
      )> }
    )> }
  )> }
);

export type GetWorkspaceLayoutDetailsQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  healthInput: HealthScoreInput;
}>;


export type GetWorkspaceLayoutDetailsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { statistics?: Maybe<(
      { __typename?: 'WorkspaceStatistics' }
      & Pick<WorkspaceStatistics, 'id'>
      & { health?: Maybe<(
        { __typename?: 'HealthScore' }
        & Pick<HealthScore, 'nrVotes' | 'negativeResponseCount' | 'score' | 'average'>
      )> }
    )> }
  )> }
);

export type CreateCtaMutationVariables = Exact<{
  input?: Maybe<CreateCtaInputType>;
}>;


export type CreateCtaMutation = (
  { __typename?: 'Mutation' }
  & { createCTA?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id' | 'type' | 'title'>
  )> }
);

export type AutomationConnectionQueryVariables = Exact<{
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<AutomationConnectionFilterInput>;
}>;


export type AutomationConnectionQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'slug'>
    & { dialogueSchedule?: Maybe<(
      { __typename?: 'DialogueSchedule' }
      & Pick<DialogueSchedule, 'id' | 'isEnabled'>
      & { dataPeriodSchedule?: Maybe<(
        { __typename?: 'DataPeriodSchedule' }
        & Pick<DataPeriodSchedule, 'id' | 'startDateExpression' | 'endInDeltaMinutes'>
      )>, evaluationPeriodSchedule?: Maybe<(
        { __typename?: 'EvaluationPeriodSchedule' }
        & Pick<EvaluationPeriodSchedule, 'id' | 'startDateExpression' | 'endInDeltaMinutes'>
      )> }
    )>, automationConnection?: Maybe<(
      { __typename?: 'AutomationConnection' }
      & Pick<AutomationConnection, 'totalPages'>
      & { pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
      )>, automations?: Maybe<Array<Maybe<(
        { __typename?: 'AutomationModel' }
        & Pick<AutomationModel, 'id' | 'label' | 'description' | 'updatedAt' | 'isActive' | 'type'>
        & { automationScheduled?: Maybe<(
          { __typename?: 'AutomationScheduledModel' }
          & { activeDialogue?: Maybe<(
            { __typename?: 'Dialogue' }
            & Pick<Dialogue, 'slug'>
          )>, actions?: Maybe<Array<Maybe<(
            { __typename?: 'AutomationActionModel' }
            & Pick<AutomationActionModel, 'type'>
          )>>> }
        )>, automationTrigger?: Maybe<(
          { __typename?: 'AutomationTriggerModel' }
          & { activeDialogue?: Maybe<(
            { __typename?: 'Dialogue' }
            & Pick<Dialogue, 'slug'>
          )>, actions?: Maybe<Array<Maybe<(
            { __typename?: 'AutomationActionModel' }
            & Pick<AutomationActionModel, 'type'>
          )>>> }
        )> }
      )>>> }
    )> }
  )> }
);

export type GetCustomerOfUserQueryVariables = Exact<{
  input?: Maybe<UserOfCustomerInput>;
}>;


export type GetCustomerOfUserQuery = (
  { __typename?: 'Query' }
  & { UserOfCustomer?: Maybe<(
    { __typename?: 'UserCustomer' }
    & { customer?: Maybe<(
      { __typename?: 'Customer' }
      & Pick<Customer, 'id' | 'isDemo' | 'name' | 'slug'>
      & { settings?: Maybe<(
        { __typename?: 'CustomerSettings' }
        & Pick<CustomerSettings, 'id' | 'logoUrl'>
        & { colourSettings?: Maybe<(
          { __typename?: 'ColourSettings' }
          & Pick<ColourSettings, 'id' | 'primary'>
        )> }
      )>, campaigns?: Maybe<Array<Maybe<(
        { __typename?: 'CampaignType' }
        & Pick<CampaignType, 'id' | 'label'>
      )>>> }
    )>, role?: Maybe<(
      { __typename?: 'RoleType' }
      & Pick<RoleType, 'name' | 'permissions'>
    )>, user?: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id'>
      & { assignedDialogues?: Maybe<(
        { __typename?: 'AssignedDialogues' }
        & { privateWorkspaceDialogues?: Maybe<Array<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'title' | 'slug' | 'id'>
        )>>, assignedDialogues?: Maybe<Array<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'slug' | 'id'>
        )>> }
      )> }
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'globalPermissions'>
    & { userCustomers?: Maybe<Array<Maybe<(
      { __typename?: 'UserCustomer' }
      & Pick<UserCustomer, 'isActive'>
      & { customer?: Maybe<(
        { __typename?: 'Customer' }
        & Pick<Customer, 'id' | 'name' | 'slug'>
      )>, role?: Maybe<(
        { __typename?: 'RoleType' }
        & Pick<RoleType, 'name' | 'permissions'>
      )> }
    )>>> }
  )> }
);

export type AssignUserToActionRequestMutationVariables = Exact<{
  input: AssignUserToActionRequestInput;
}>;


export type AssignUserToActionRequestMutation = (
  { __typename?: 'Mutation' }
  & { assignUserToActionRequest?: Maybe<(
    { __typename?: 'ActionRequest' }
    & Pick<ActionRequest, 'createdAt' | 'status'>
    & { session?: Maybe<(
      { __typename?: 'Session' }
      & Pick<Session, 'id' | 'mainScore'>
    )>, dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'title'>
    )>, assignee?: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'email'>
    )> }
  )> }
);

export type GetIssueQueryVariables = Exact<{
  input: GetIssueResolverInput;
  actionableFilter?: Maybe<ActionRequestConnectionFilterInput>;
}>;


export type GetIssueQuery = (
  { __typename?: 'Query' }
  & { issue?: Maybe<(
    { __typename?: 'IssueModel' }
    & Pick<IssueModel, 'id' | 'topicId'>
    & { topic: (
      { __typename?: 'Topic' }
      & Pick<Topic, 'id' | 'name'>
    ), actionRequestConnection?: Maybe<(
      { __typename?: 'ActionRequestConnection' }
      & Pick<ActionRequestConnection, 'totalPages'>
      & { actionRequests?: Maybe<Array<Maybe<(
        { __typename?: 'ActionRequest' }
        & Pick<ActionRequest, 'id' | 'createdAt' | 'isVerified' | 'dialogueId' | 'status'>
        & { session?: Maybe<(
          { __typename?: 'Session' }
          & Pick<Session, 'id' | 'mainScore'>
        )>, dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'id' | 'title' | 'slug'>
        )>, assignee?: Maybe<(
          { __typename?: 'UserType' }
          & Pick<UserType, 'id' | 'email'>
        )> }
      )>>>, pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasNextPage' | 'hasPrevPage' | 'nextPageOffset' | 'pageIndex' | 'prevPageOffset'>
      )> }
    )> }
  )> }
);

export type GetWorkspaceActionRequestsQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  filter?: Maybe<ActionRequestConnectionFilterInput>;
}>;


export type GetWorkspaceActionRequestsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & { actionRequestConnection?: Maybe<(
      { __typename?: 'ActionRequestConnection' }
      & Pick<ActionRequestConnection, 'totalPages'>
      & { actionRequests?: Maybe<Array<Maybe<(
        { __typename?: 'ActionRequest' }
        & ActionRequestFragmentFragment
      )>>>, pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasNextPage' | 'hasPrevPage' | 'nextPageOffset' | 'pageIndex' | 'prevPageOffset'>
      )> }
    )> }
  )> }
);

export type GetWorkspaceIssuesQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  filter?: Maybe<IssueConnectionFilterInput>;
}>;


export type GetWorkspaceIssuesQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & { issueConnection?: Maybe<(
      { __typename?: 'IssueConnection' }
      & Pick<IssueConnection, 'totalPages'>
      & { issues?: Maybe<Array<Maybe<(
        { __typename?: 'IssueModel' }
        & IssueFragmentFragment
      )>>>, pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasNextPage' | 'hasPrevPage' | 'nextPageOffset' | 'pageIndex' | 'prevPageOffset'>
      )> }
    )> }
  )> }
);

export type SetActionRequestStatusMutationVariables = Exact<{
  input: SetActionRequestStatusInput;
}>;


export type SetActionRequestStatusMutation = (
  { __typename?: 'Mutation' }
  & { setActionRequestStatus?: Maybe<(
    { __typename?: 'ActionRequest' }
    & Pick<ActionRequest, 'id' | 'status'>
  )> }
);

export type UploadUpsellImageMutationVariables = Exact<{
  input?: Maybe<UploadSellImageInputType>;
}>;


export type UploadUpsellImageMutation = (
  { __typename?: 'Mutation' }
  & { uploadUpsellImage?: Maybe<(
    { __typename?: 'ImageType' }
    & Pick<ImageType, 'url'>
  )> }
);

export type CreateAutomationMutationVariables = Exact<{
  input?: Maybe<CreateAutomationInput>;
}>;


export type CreateAutomationMutation = (
  { __typename?: 'Mutation' }
  & { createAutomation?: Maybe<(
    { __typename?: 'AutomationModel' }
    & Pick<AutomationModel, 'id' | 'label'>
  )> }
);

export type GetUsersAndRolesQueryVariables = Exact<{
  customerSlug: Scalars['String'];
}>;


export type GetUsersAndRolesQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { users?: Maybe<Array<Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>
      & { role?: Maybe<(
        { __typename?: 'RoleType' }
        & Pick<RoleType, 'id' | 'name'>
      )> }
    )>>>, roles?: Maybe<Array<Maybe<(
      { __typename?: 'RoleType' }
      & Pick<RoleType, 'id' | 'name'>
    )>>> }
  )> }
);

export type ConfirmWorkspaceJobMutationVariables = Exact<{
  input?: Maybe<GenerateAutodeckInput>;
}>;


export type ConfirmWorkspaceJobMutation = (
  { __typename?: 'Mutation' }
  & { confirmCreateWorkspaceJob?: Maybe<(
    { __typename?: 'CreateWorkspaceJobType' }
    & Pick<CreateWorkspaceJobType, 'id' | 'name' | 'status'>
  )> }
);

export type CreateWorkspaceJobMutationVariables = Exact<{
  input?: Maybe<GenerateAutodeckInput>;
}>;


export type CreateWorkspaceJobMutation = (
  { __typename?: 'Mutation' }
  & { generateAutodeck?: Maybe<(
    { __typename?: 'CreateWorkspaceJobType' }
    & Pick<CreateWorkspaceJobType, 'id' | 'name' | 'status'>
  )> }
);

export type GetAutodeckJobsQueryVariables = Exact<{
  filter?: Maybe<PaginationWhereInput>;
}>;


export type GetAutodeckJobsQuery = (
  { __typename?: 'Query' }
  & { getAutodeckJobs?: Maybe<(
    { __typename?: 'AutodeckConnectionType' }
    & { jobs?: Maybe<Array<Maybe<(
      { __typename?: 'CreateWorkspaceJobType' }
      & Pick<CreateWorkspaceJobType, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'referenceId' | 'errorMessage' | 'message' | 'status' | 'resourcesUrl' | 'referenceType' | 'requiresColorExtraction' | 'requiresRembg' | 'requiresScreenshot'>
      & { processLocation?: Maybe<(
        { __typename?: 'JobProcessLocation' }
        & Pick<JobProcessLocation, 'id' | 'name' | 'path' | 'type'>
        & { customFields?: Maybe<Array<Maybe<(
          { __typename?: 'CustomFieldType' }
          & Pick<CustomFieldType, 'id' | 'key' | 'value'>
        )>>> }
      )> }
    )>>>, pageInfo?: Maybe<(
      { __typename?: 'DeprecatedPaginationPageInfo' }
      & Pick<DeprecatedPaginationPageInfo, 'nrPages' | 'pageIndex'>
    )> }
  )> }
);

export type UploadJobImageMutationVariables = Exact<{
  file: Scalars['Upload'];
  jobId?: Maybe<Scalars['String']>;
  type?: Maybe<UploadImageEnumType>;
  disapproved?: Maybe<Scalars['Boolean']>;
}>;


export type UploadJobImageMutation = (
  { __typename?: 'Mutation' }
  & { uploadJobImage?: Maybe<(
    { __typename?: 'AWSImageType' }
    & Pick<AwsImageType, 'url'>
  )> }
);

export type RetryAutodeckJobMutationVariables = Exact<{
  jobId?: Maybe<Scalars['String']>;
}>;


export type RetryAutodeckJobMutation = (
  { __typename?: 'Mutation' }
  & { retryAutodeckJob?: Maybe<(
    { __typename?: 'CreateWorkspaceJobType' }
    & Pick<CreateWorkspaceJobType, 'id' | 'name' | 'status'>
  )> }
);

export type GetAdjustedLogoQueryVariables = Exact<{
  input?: Maybe<AdjustedImageInput>;
}>;


export type GetAdjustedLogoQuery = (
  { __typename?: 'Query' }
  & { getAdjustedLogo?: Maybe<(
    { __typename?: 'AWSImageType' }
    & Pick<AwsImageType, 'url'>
  )> }
);

export type GetJobProcessLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobProcessLocationsQuery = (
  { __typename?: 'Query' }
  & { getJobProcessLocations?: Maybe<(
    { __typename?: 'JobProcessLocations' }
    & { jobProcessLocations?: Maybe<Array<Maybe<(
      { __typename?: 'JobProcessLocation' }
      & Pick<JobProcessLocation, 'id' | 'name' | 'path' | 'type'>
      & { customFields?: Maybe<Array<Maybe<(
        { __typename?: 'CustomFieldType' }
        & Pick<CustomFieldType, 'id' | 'key' | 'value'>
      )>>> }
    )>>> }
  )> }
);

export type GetPreviewDataQueryVariables = Exact<{
  id?: Maybe<Scalars['String']>;
}>;


export type GetPreviewDataQuery = (
  { __typename?: 'Query' }
  & { getPreviewData?: Maybe<(
    { __typename?: 'PreviewDataType' }
    & Pick<PreviewDataType, 'colors' | 'rembgLogoUrl' | 'websiteScreenshotUrl'>
  )> }
);

export type RemovePixelRangeMutationVariables = Exact<{
  input?: Maybe<RemovePixelRangeInput>;
}>;


export type RemovePixelRangeMutation = (
  { __typename?: 'Mutation' }
  & { removePixelRange?: Maybe<(
    { __typename?: 'AWSImageType' }
    & Pick<AwsImageType, 'url'>
  )> }
);

export type WhitifyImageMutationVariables = Exact<{
  input?: Maybe<AdjustedImageInput>;
}>;


export type WhitifyImageMutation = (
  { __typename?: 'Mutation' }
  & { whitifyImage?: Maybe<(
    { __typename?: 'AWSImageType' }
    & Pick<AwsImageType, 'url'>
  )> }
);

export type CreateDialogueScheduleMutationVariables = Exact<{
  input: CreateDialogueScheduleInput;
}>;


export type CreateDialogueScheduleMutation = (
  { __typename?: 'Mutation' }
  & { createDialogueSchedule?: Maybe<(
    { __typename?: 'CreateDialogueScheduleOutput' }
    & { dialogueSchedule?: Maybe<(
      { __typename?: 'DialogueSchedule' }
      & Pick<DialogueSchedule, 'id'>
    )> }
  )> }
);

export type ToggleDialogueScheduleMutationVariables = Exact<{
  input: ToggleDialogueScheduleInput;
}>;


export type ToggleDialogueScheduleMutation = (
  { __typename?: 'Mutation' }
  & { toggleDialogueSchedule?: Maybe<(
    { __typename?: 'DialogueSchedule' }
    & Pick<DialogueSchedule, 'id'>
  )> }
);

export type DeleteAutomationMutationVariables = Exact<{
  input?: Maybe<DeleteAutomationInput>;
}>;


export type DeleteAutomationMutation = (
  { __typename?: 'Mutation' }
  & { deleteAutomation?: Maybe<(
    { __typename?: 'AutomationModel' }
    & Pick<AutomationModel, 'id' | 'label'>
  )> }
);

export type EnableAutomationMutationVariables = Exact<{
  input?: Maybe<EnableAutomationInput>;
}>;


export type EnableAutomationMutation = (
  { __typename?: 'Mutation' }
  & { enableAutomation?: Maybe<(
    { __typename?: 'AutomationModel' }
    & Pick<AutomationModel, 'id' | 'label' | 'isActive'>
  )> }
);

export type CreateBatchDeliveriesMutationVariables = Exact<{
  input?: Maybe<CreateBatchDeliveriesInputType>;
}>;


export type CreateBatchDeliveriesMutation = (
  { __typename?: 'Mutation' }
  & { createBatchDeliveries?: Maybe<(
    { __typename?: 'CreateBatchDeliveriesOutputType' }
    & Pick<CreateBatchDeliveriesOutputType, 'nrDeliveries'>
    & { failedDeliveries?: Maybe<Array<Maybe<(
      { __typename?: 'FailedDeliveryModel' }
      & Pick<FailedDeliveryModel, 'record' | 'error'>
    )>>> }
  )> }
);

export type GetDeliveryQueryVariables = Exact<{
  deliveryId?: Maybe<Scalars['String']>;
}>;


export type GetDeliveryQuery = (
  { __typename?: 'Query' }
  & { delivery?: Maybe<(
    { __typename?: 'DeliveryType' }
    & { events?: Maybe<Array<Maybe<(
      { __typename?: 'DeliveryEventType' }
      & DeliveryEventFragmentFragment
    )>>> }
    & DeliveryFragmentFragment
  )> }
);

export type GetWorkspaceCampaignQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  campaignId: Scalars['String'];
  deliveryConnectionFilter?: Maybe<DeliveryConnectionFilterInput>;
}>;


export type GetWorkspaceCampaignQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { campaign?: Maybe<(
      { __typename?: 'CampaignType' }
      & Pick<CampaignType, 'id' | 'label'>
      & { deliveryConnection?: Maybe<(
        { __typename?: 'DeliveryConnectionType' }
        & Pick<DeliveryConnectionType, 'totalPages'>
        & { deliveries: Array<(
          { __typename?: 'DeliveryType' }
          & Pick<DeliveryType, 'id' | 'deliveryRecipientFirstName' | 'deliveryRecipientLastName' | 'deliveryRecipientEmail' | 'deliveryRecipientPhone' | 'scheduledAt' | 'updatedAt' | 'currentStatus'>
          & { campaignVariant?: Maybe<(
            { __typename?: 'CampaignVariantType' }
            & Pick<CampaignVariantType, 'id' | 'label' | 'type'>
          )>, events?: Maybe<Array<Maybe<(
            { __typename?: 'DeliveryEventType' }
            & Pick<DeliveryEventType, 'id' | 'createdAt' | 'status' | 'failureMessage'>
          )>>> }
        )>, pageInfo?: Maybe<(
          { __typename?: 'PaginationPageInfo' }
          & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
        )> }
      )>, variants?: Maybe<Array<Maybe<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label' | 'from' | 'type' | 'weight' | 'body'>
        & { customVariables?: Maybe<Array<Maybe<(
          { __typename?: 'CampaignVariantCustomVariableType' }
          & Pick<CampaignVariantCustomVariableType, 'id' | 'key'>
        )>>>, dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'id' | 'title'>
        )>, workspace?: Maybe<(
          { __typename?: 'Customer' }
          & Pick<Customer, 'id'>
        )> }
      )>>> }
    )> }
  )> }
);

export type CreateCampaignMutationVariables = Exact<{
  input?: Maybe<CreateCampaignInputType>;
}>;


export type CreateCampaignMutation = (
  { __typename?: 'Mutation' }
  & { createCampaign?: Maybe<(
    { __typename?: 'CampaignType' }
    & Pick<CampaignType, 'id'>
  )> }
);

export type GetWorkspaceCampaignsQueryVariables = Exact<{
  customerSlug: Scalars['String'];
}>;


export type GetWorkspaceCampaignsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { campaigns?: Maybe<Array<Maybe<(
      { __typename?: 'CampaignType' }
      & Pick<CampaignType, 'id' | 'label'>
      & { variants?: Maybe<Array<Maybe<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label'>
      )>>> }
    )>>> }
  )> }
);

export type GetWorkspaceDialoguesQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  filter?: Maybe<DialogueFilterInputType>;
}>;


export type GetWorkspaceDialoguesQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogues?: Maybe<Array<Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title' | 'slug' | 'publicTitle' | 'creationDate' | 'updatedAt' | 'customerId' | 'averageScore'>
      & { customer?: Maybe<(
        { __typename?: 'Customer' }
        & Pick<Customer, 'slug'>
      )>, tags?: Maybe<Array<Maybe<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'type' | 'name'>
      )>>> }
    )>>> }
  )> }
);

export type DuplicateQuestionMutationVariables = Exact<{
  questionId?: Maybe<Scalars['String']>;
}>;


export type DuplicateQuestionMutation = (
  { __typename?: 'Mutation' }
  & { duplicateQuestion?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id'>
  )> }
);

export type GetDialogueLinksQueryVariables = Exact<{
  workspaceId?: Maybe<Scalars['String']>;
  filter?: Maybe<DialogueConnectionFilterInput>;
}>;


export type GetDialogueLinksQuery = (
  { __typename?: 'Query' }
  & { dialogueLinks?: Maybe<(
    { __typename?: 'PublicDialogueConnection' }
    & Pick<PublicDialogueConnection, 'totalPages'>
    & { dialogues?: Maybe<Array<Maybe<(
      { __typename?: 'PublicDialogueInfo' }
      & Pick<PublicDialogueInfo, 'title' | 'slug' | 'description' | 'url'>
    )>>>, pageInfo?: Maybe<(
      { __typename?: 'PaginationPageInfo' }
      & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
    )> }
  )> }
);

export type AssignUserToDialogueMutationVariables = Exact<{
  input?: Maybe<AssignUserToDialogueInput>;
}>;


export type AssignUserToDialogueMutation = (
  { __typename?: 'Mutation' }
  & { assignUserToDialogue?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'email'>
  )> }
);

export type DeleteDialogueMutationVariables = Exact<{
  input?: Maybe<DeleteDialogueInputType>;
}>;


export type DeleteDialogueMutation = (
  { __typename?: 'Mutation' }
  & { deleteDialogue?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id' | 'slug'>
  )> }
);

export type DialogueConnectionQueryVariables = Exact<{
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<DialogueConnectionFilterInput>;
}>;


export type DialogueConnectionQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'slug'>
    & { dialogueConnection?: Maybe<(
      { __typename?: 'DialogueConnection' }
      & Pick<DialogueConnection, 'totalPages'>
      & { pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
      )>, dialogues?: Maybe<Array<Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'id' | 'title' | 'isPrivate' | 'template' | 'language' | 'slug' | 'publicTitle' | 'creationDate' | 'updatedAt' | 'customerId' | 'averageScore'>
        & { assignees?: Maybe<Array<Maybe<(
          { __typename?: 'UserType' }
          & Pick<UserType, 'id' | 'firstName' | 'lastName'>
        )>>>, customer?: Maybe<(
          { __typename?: 'Customer' }
          & Pick<Customer, 'slug'>
        )>, tags?: Maybe<Array<Maybe<(
          { __typename?: 'Tag' }
          & Pick<Tag, 'id' | 'type' | 'name'>
        )>>> }
      )>>> }
    )> }
  )> }
);

export type GetUsersQueryVariables = Exact<{
  customerSlug: Scalars['String'];
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { users?: Maybe<Array<Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'id' | 'firstName' | 'lastName'>
      & { role?: Maybe<(
        { __typename?: 'RoleType' }
        & Pick<RoleType, 'id' | 'name'>
      )> }
    )>>> }
  )> }
);

export type SetDialoguePrivacyMutationVariables = Exact<{
  input?: Maybe<SetDialoguePrivacyInput>;
}>;


export type SetDialoguePrivacyMutation = (
  { __typename?: 'Mutation' }
  & { setDialoguePrivacy?: Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'slug' | 'title' | 'isPrivate'>
  )> }
);

export type GetDialogueStatisticsQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  dialogueSlug: Scalars['String'];
  startDateTime: Scalars['String'];
  endDateTime?: Maybe<Scalars['String']>;
  issueFilter?: Maybe<IssueFilterInput>;
  healthInput?: Maybe<HealthScoreInput>;
}>;


export type GetDialogueStatisticsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title'>
      & { healthScore?: Maybe<(
        { __typename?: 'HealthScore' }
        & Pick<HealthScore, 'nrVotes' | 'negativeResponseCount' | 'score' | 'average'>
      )>, statistics?: Maybe<(
        { __typename?: 'DialogueStatistics' }
        & Pick<DialogueStatistics, 'nrInteractions'>
        & { topPositivePath?: Maybe<Array<Maybe<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'answer' | 'quantity' | 'basicSentiment'>
        )>>>, mostPopularPath?: Maybe<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'answer' | 'quantity' | 'basicSentiment'>
        )>, topNegativePath?: Maybe<Array<Maybe<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'quantity' | 'answer' | 'basicSentiment'>
        )>>>, history?: Maybe<Array<Maybe<(
          { __typename?: 'lineChartDataType' }
          & Pick<LineChartDataType, 'x' | 'y'>
        )>>> }
      )>, sessions?: Maybe<Array<Maybe<(
        { __typename?: 'Session' }
        & Pick<Session, 'id' | 'createdAt' | 'mainScore'>
        & { nodeEntries?: Maybe<Array<(
          { __typename?: 'NodeEntry' }
          & { relatedNode?: Maybe<(
            { __typename?: 'QuestionNode' }
            & Pick<QuestionNode, 'title' | 'type'>
          )>, value?: Maybe<(
            { __typename?: 'NodeEntryValue' }
            & Pick<NodeEntryValue, 'sliderNodeEntry' | 'textboxNodeEntry' | 'registrationNodeEntry' | 'choiceNodeEntry' | 'linkNodeEntry'>
          )> }
        )>> }
      )>>>, issues?: Maybe<(
        { __typename?: 'Issue' }
        & Pick<Issue, 'id' | 'topic' | 'rankScore' | 'followUpAction' | 'actionRequiredCount'>
        & { dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'id' | 'title'>
        )>, basicStats: (
          { __typename?: 'BasicStatistics' }
          & Pick<BasicStatistics, 'responseCount' | 'average'>
        ), history: (
          { __typename?: 'DateHistogram' }
          & Pick<DateHistogram, 'id'>
          & { items: Array<(
            { __typename?: 'DateHistogramItem' }
            & Pick<DateHistogramItem, 'id' | 'date' | 'frequency'>
          )> }
        ) }
      )>, dialogueStatisticsSummary?: Maybe<(
        { __typename?: 'DialogueStatisticsSummaryModel' }
        & Pick<DialogueStatisticsSummaryModel, 'id' | 'nrVotes' | 'impactScore' | 'updatedAt' | 'title'>
        & { dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'title' | 'id'>
        )> }
      )> }
    )> }
  )> }
);

export type GetAutomationQueryVariables = Exact<{
  input?: Maybe<GetAutomationInput>;
}>;


export type GetAutomationQuery = (
  { __typename?: 'Query' }
  & { automation?: Maybe<(
    { __typename?: 'AutomationModel' }
    & Pick<AutomationModel, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'label' | 'description' | 'type'>
    & { workspace?: Maybe<(
      { __typename?: 'Customer' }
      & Pick<Customer, 'slug' | 'id'>
    )>, automationScheduled?: Maybe<(
      { __typename?: 'AutomationScheduledModel' }
      & Pick<AutomationScheduledModel, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'minutes' | 'hours' | 'dayOfMonth' | 'dayOfWeek' | 'month' | 'frequency' | 'time'>
      & { dayRange?: Maybe<Array<Maybe<(
        { __typename?: 'DayRange' }
        & Pick<DayRange, 'label' | 'index'>
      )>>>, activeDialogue?: Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'id' | 'slug' | 'title'>
      )>, actions?: Maybe<Array<Maybe<(
        { __typename?: 'AutomationActionModel' }
        & Pick<AutomationActionModel, 'id' | 'type'>
        & { channels?: Maybe<Array<Maybe<(
          { __typename?: 'AutomationActionChannel' }
          & Pick<AutomationActionChannel, 'id' | 'type' | 'payload'>
        )>>> }
      )>>> }
    )>, automationTrigger?: Maybe<(
      { __typename?: 'AutomationTriggerModel' }
      & Pick<AutomationTriggerModel, 'id'>
      & { activeDialogue?: Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'title' | 'slug' | 'id'>
      )>, actions?: Maybe<Array<Maybe<(
        { __typename?: 'AutomationActionModel' }
        & Pick<AutomationActionModel, 'id' | 'type' | 'payload'>
      )>>>, event?: Maybe<(
        { __typename?: 'AutomationEventModel' }
        & Pick<AutomationEventModel, 'id' | 'type'>
        & { dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'title' | 'slug' | 'id'>
        )>, question?: Maybe<(
          { __typename?: 'QuestionNode' }
          & Pick<QuestionNode, 'id' | 'title' | 'type'>
        )> }
      )> }
    )> }
  )> }
);

export type UpdateAutomationMutationVariables = Exact<{
  input?: Maybe<CreateAutomationInput>;
}>;


export type UpdateAutomationMutation = (
  { __typename?: 'Mutation' }
  & { updateAutomation?: Maybe<(
    { __typename?: 'AutomationModel' }
    & Pick<AutomationModel, 'id' | 'label'>
  )> }
);

export type GetInteractionQueryVariables = Exact<{
  sessionId: Scalars['String'];
}>;


export type GetInteractionQuery = (
  { __typename?: 'Query' }
  & { session?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
    & { delivery?: Maybe<(
      { __typename?: 'DeliveryType' }
      & { campaignVariant?: Maybe<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id'>
        & { campaign?: Maybe<(
          { __typename?: 'CampaignType' }
          & Pick<CampaignType, 'id'>
        )> }
      )>, events?: Maybe<Array<Maybe<(
        { __typename?: 'DeliveryEventType' }
        & DeliveryEventFragmentFragment
      )>>> }
      & DeliveryFragmentFragment
    )> }
    & SessionFragmentFragment
  )> }
);

export type GetWorkspaceSessionsQueryVariables = Exact<{
  workspaceId?: Maybe<Scalars['ID']>;
  filter?: Maybe<SessionConnectionFilterInput>;
}>;


export type GetWorkspaceSessionsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { sessionConnection?: Maybe<(
      { __typename?: 'SessionConnection' }
      & Pick<SessionConnection, 'totalPages'>
      & { sessions: Array<(
        { __typename?: 'Session' }
        & SessionFragmentFragment
      )>, pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'nextPageOffset' | 'prevPageOffset' | 'pageIndex'>
      )> }
    )> }
  )> }
);

export type GenerateWorkspaceFromCsvMutationVariables = Exact<{
  input?: Maybe<GenerateWorkspaceCsvInputType>;
}>;


export type GenerateWorkspaceFromCsvMutation = (
  { __typename?: 'Mutation' }
  & { generateWorkspaceFromCSV?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'slug'>
  )> }
);

export type RequestInviteMutationVariables = Exact<{
  input?: Maybe<RequestInviteInput>;
}>;


export type RequestInviteMutation = (
  { __typename?: 'Mutation' }
  & { requestInvite?: Maybe<(
    { __typename?: 'RequestInviteOutput' }
    & Pick<RequestInviteOutput, 'didInvite' | 'userExists'>
  )> }
);

export type AssignUserToDialoguesMutationVariables = Exact<{
  input?: Maybe<AssignUserToDialoguesInput>;
}>;


export type AssignUserToDialoguesMutation = (
  { __typename?: 'Mutation' }
  & { assignUserToDialogues?: Maybe<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'email'>
    & { assignedDialogues?: Maybe<(
      { __typename?: 'AssignedDialogues' }
      & { privateWorkspaceDialogues?: Maybe<Array<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'title' | 'slug' | 'id'>
      )>>, assignedDialogues?: Maybe<Array<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'slug' | 'id'>
      )>> }
    )> }
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  input: DeleteUserInput;
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser?: Maybe<(
    { __typename?: 'DeleteUserOutput' }
    & Pick<DeleteUserOutput, 'deletedUser'>
  )> }
);

export type GetPaginatedUsersQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  filter?: Maybe<UserConnectionFilterInput>;
}>;


export type GetPaginatedUsersQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { usersConnection?: Maybe<(
      { __typename?: 'UserConnection' }
      & Pick<UserConnection, 'totalPages'>
      & { userCustomers?: Maybe<Array<Maybe<(
        { __typename?: 'UserCustomer' }
        & Pick<UserCustomer, 'createdAt' | 'isActive'>
        & { user?: Maybe<(
          { __typename?: 'UserType' }
          & Pick<UserType, 'lastLoggedIn' | 'lastActivity' | 'id' | 'email' | 'firstName' | 'lastName'>
        )>, role?: Maybe<(
          { __typename?: 'RoleType' }
          & Pick<RoleType, 'id' | 'name'>
        )> }
      )>>>, pageInfo?: Maybe<(
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
      )> }
    )> }
  )> }
);

export type FindRoleByIdQueryVariables = Exact<{
  input?: Maybe<FindRoleInput>;
}>;


export type FindRoleByIdQuery = (
  { __typename?: 'Query' }
  & { role?: Maybe<(
    { __typename?: 'RoleType' }
    & Pick<RoleType, 'id' | 'name' | 'nrPermissions' | 'permissions' | 'allPermissions'>
  )> }
);

export type GetRolesQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type GetRolesQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { roles?: Maybe<Array<Maybe<(
      { __typename?: 'RoleType' }
      & Pick<RoleType, 'id' | 'name'>
    )>>> }
  )> }
);

export type GetUserCustomerFromCustomerQueryVariables = Exact<{
  id: Scalars['ID'];
  userId: Scalars['String'];
  input?: Maybe<UserOfCustomerInput>;
}>;


export type GetUserCustomerFromCustomerQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { userCustomer?: Maybe<(
      { __typename?: 'UserCustomer' }
      & { user?: Maybe<(
        { __typename?: 'UserType' }
        & Pick<UserType, 'id' | 'email' | 'phone' | 'firstName' | 'lastName'>
        & { assignedDialogues?: Maybe<(
          { __typename?: 'AssignedDialogues' }
          & { privateWorkspaceDialogues?: Maybe<Array<(
            { __typename?: 'Dialogue' }
            & Pick<Dialogue, 'title' | 'slug' | 'id' | 'description'>
          )>>, assignedDialogues?: Maybe<Array<(
            { __typename?: 'Dialogue' }
            & Pick<Dialogue, 'slug' | 'id'>
          )>> }
        )> }
      )>, role?: Maybe<(
        { __typename?: 'RoleType' }
        & Pick<RoleType, 'name' | 'id'>
      )> }
    )> }
  )> }
);

export type HandleUserStateInWorkspaceMutationVariables = Exact<{
  input: HandleUserStateInWorkspaceInput;
}>;


export type HandleUserStateInWorkspaceMutation = (
  { __typename?: 'Mutation' }
  & { handleUserStateInWorkspace?: Maybe<(
    { __typename?: 'UserCustomer' }
    & Pick<UserCustomer, 'isActive'>
    & { user?: Maybe<(
      { __typename?: 'UserType' }
      & Pick<UserType, 'email'>
    )> }
  )> }
);

export type UpdatePermissionsMutationVariables = Exact<{
  input: UpdatePermissionsInput;
}>;


export type UpdatePermissionsMutation = (
  { __typename?: 'Mutation' }
  & { updatePermissions?: Maybe<(
    { __typename?: 'RoleType' }
    & Pick<RoleType, 'permissions'>
  )> }
);

export type GetWorkspaceReportQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  filter?: Maybe<DialogueStatisticsSummaryFilterInput>;
  issueFilter?: Maybe<IssueFilterInput>;
}>;


export type GetWorkspaceReportQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { issueTopics?: Maybe<Array<Maybe<(
      { __typename?: 'Issue' }
      & Pick<Issue, 'id' | 'rankScore' | 'topic'>
      & { dialogue?: Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'id' | 'title'>
      )>, basicStats: (
        { __typename?: 'BasicStatistics' }
        & Pick<BasicStatistics, 'responseCount' | 'average'>
      ) }
    )>>>, statistics?: Maybe<(
      { __typename?: 'WorkspaceStatistics' }
      & { basicStats?: Maybe<(
        { __typename?: 'BasicStatistics' }
        & Pick<BasicStatistics, 'responseCount' | 'average'>
      )>, responseHistogram?: Maybe<(
        { __typename?: 'DateHistogram' }
        & Pick<DateHistogram, 'id'>
        & { items: Array<(
          { __typename?: 'DateHistogramItem' }
          & Pick<DateHistogramItem, 'id' | 'frequency' | 'date'>
        )> }
      )>, issueHistogram?: Maybe<(
        { __typename?: 'DateHistogram' }
        & Pick<DateHistogram, 'id'>
        & { items: Array<(
          { __typename?: 'DateHistogramItem' }
          & Pick<DateHistogramItem, 'id' | 'frequency' | 'date'>
        )> }
      )> }
    )> }
  )> }
);

export const ActionRequestFragmentFragmentDoc = gql`
    fragment ActionRequestFragment on ActionRequest {
  id
  createdAt
  isVerified
  requestEmail
  dialogueId
  issue {
    topic {
      name
    }
  }
  session {
    id
    mainScore
  }
  dialogue {
    id
    title
    slug
  }
  status
  assignee {
    id
    email
  }
}
    `;
export const DeliveryEventFragmentFragmentDoc = gql`
    fragment DeliveryEventFragment on DeliveryEventType {
  id
  status
  createdAt
  failureMessage
}
    `;
export const IssueFragmentFragmentDoc = gql`
    fragment IssueFragment on IssueModel {
  id
  createdAt
  topic {
    id
    name
  }
  teamCount
  basicStats {
    average
    responseCount
    urgentCount
  }
  actionRequests {
    id
    createdAt
    session {
      id
      mainScore
    }
    dialogue {
      id
      title
    }
    status
    assignee {
      id
      email
    }
  }
}
    `;
export const NodeEntryFragmentFragmentDoc = gql`
    fragment NodeEntryFragment on NodeEntry {
  id
  depth
  relatedNode {
    title
    type
  }
  value {
    sliderNodeEntry
    textboxNodeEntry
    registrationNodeEntry
    choiceNodeEntry
    videoNodeEntry
    linkNodeEntry
    formNodeEntry {
      id
      values {
        relatedField {
          id
          type
        }
        email
        phoneNumber
        url
        shortText
        longText
        number
        contacts
      }
    }
  }
}
    `;
export const DeliveryFragmentFragmentDoc = gql`
    fragment DeliveryFragment on DeliveryType {
  id
  deliveryRecipientFirstName
  deliveryRecipientLastName
  deliveryRecipientEmail
  deliveryRecipientPhone
  scheduledAt
  updatedAt
  createdAt
  currentStatus
  campaignVariant {
    id
    label
    type
    campaign {
      id
      label
    }
  }
}
    `;
export const SessionFragmentFragmentDoc = gql`
    fragment SessionFragment on Session {
  id
  createdAt
  score
  originUrl
  totalTimeInSec
  device
  dialogueId
  nodeEntries {
    ...NodeEntryFragment
  }
  delivery {
    ...DeliveryFragment
  }
  dialogue {
    id
    title
    slug
  }
  followUpAction {
    values {
      shortText
      email
    }
  }
}
    ${NodeEntryFragmentFragmentDoc}
${DeliveryFragmentFragmentDoc}`;
export const DeselectTopicDocument = gql`
    mutation deselectTopic($input: DeselectTopicInput) {
  deselectTopic(input: $input)
}
    `;
export type DeselectTopicMutationFn = Apollo.MutationFunction<DeselectTopicMutation, DeselectTopicMutationVariables>;

/**
 * __useDeselectTopicMutation__
 *
 * To run a mutation, you first call `useDeselectTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeselectTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deselectTopicMutation, { data, loading, error }] = useDeselectTopicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeselectTopicMutation(baseOptions?: Apollo.MutationHookOptions<DeselectTopicMutation, DeselectTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeselectTopicMutation, DeselectTopicMutationVariables>(DeselectTopicDocument, options);
      }
export type DeselectTopicMutationHookResult = ReturnType<typeof useDeselectTopicMutation>;
export type DeselectTopicMutationResult = Apollo.MutationResult<DeselectTopicMutation>;
export type DeselectTopicMutationOptions = Apollo.BaseMutationOptions<DeselectTopicMutation, DeselectTopicMutationVariables>;
export const GetDialogueTopicsDocument = gql`
    query GetDialogueTopics($dialogueId: ID!, $input: TopicInputType!) {
  dialogue(where: {id: $dialogueId}) {
    id
    topic(input: $input) {
      name
      impactScore
      nrVotes
      subTopics {
        name
        impactScore
        nrVotes
      }
    }
  }
}
    `;

/**
 * __useGetDialogueTopicsQuery__
 *
 * To run a query within a React component, call `useGetDialogueTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDialogueTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDialogueTopicsQuery({
 *   variables: {
 *      dialogueId: // value for 'dialogueId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetDialogueTopicsQuery(baseOptions: Apollo.QueryHookOptions<GetDialogueTopicsQuery, GetDialogueTopicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDialogueTopicsQuery, GetDialogueTopicsQueryVariables>(GetDialogueTopicsDocument, options);
      }
export function useGetDialogueTopicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDialogueTopicsQuery, GetDialogueTopicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDialogueTopicsQuery, GetDialogueTopicsQueryVariables>(GetDialogueTopicsDocument, options);
        }
export type GetDialogueTopicsQueryHookResult = ReturnType<typeof useGetDialogueTopicsQuery>;
export type GetDialogueTopicsLazyQueryHookResult = ReturnType<typeof useGetDialogueTopicsLazyQuery>;
export type GetDialogueTopicsQueryResult = Apollo.QueryResult<GetDialogueTopicsQuery, GetDialogueTopicsQueryVariables>;
export function refetchGetDialogueTopicsQuery(variables?: GetDialogueTopicsQueryVariables) {
      return { query: GetDialogueTopicsDocument, variables: variables }
    }
export const GetProblemsPerDialogueDocument = gql`
    query GetProblemsPerDialogue($workspaceId: ID!, $filter: IssueFilterInput) {
  customer(id: $workspaceId) {
    id
    issueDialogues(filter: $filter) {
      id
      topic
      rankScore
      followUpAction
      actionRequiredCount
      dialogue {
        id
        title
      }
      basicStats {
        responseCount
        average
      }
      history {
        id
        items {
          id
          date
          frequency
        }
      }
    }
  }
}
    `;

/**
 * __useGetProblemsPerDialogueQuery__
 *
 * To run a query within a React component, call `useGetProblemsPerDialogueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProblemsPerDialogueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProblemsPerDialogueQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetProblemsPerDialogueQuery(baseOptions: Apollo.QueryHookOptions<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>(GetProblemsPerDialogueDocument, options);
      }
export function useGetProblemsPerDialogueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>(GetProblemsPerDialogueDocument, options);
        }
export type GetProblemsPerDialogueQueryHookResult = ReturnType<typeof useGetProblemsPerDialogueQuery>;
export type GetProblemsPerDialogueLazyQueryHookResult = ReturnType<typeof useGetProblemsPerDialogueLazyQuery>;
export type GetProblemsPerDialogueQueryResult = Apollo.QueryResult<GetProblemsPerDialogueQuery, GetProblemsPerDialogueQueryVariables>;
export function refetchGetProblemsPerDialogueQuery(variables?: GetProblemsPerDialogueQueryVariables) {
      return { query: GetProblemsPerDialogueDocument, variables: variables }
    }
export const GetSessionPathsDocument = gql`
    query GetSessionPaths($dialogueId: ID!, $input: PathedSessionsInput!) {
  dialogue(where: {id: $dialogueId}) {
    id
    pathedSessionsConnection(input: $input) {
      startDateTime
      endDateTime
      path
      pathedSessions {
        id
        mainScore
        createdAt
        score
        totalTimeInSec
      }
    }
  }
}
    `;

/**
 * __useGetSessionPathsQuery__
 *
 * To run a query within a React component, call `useGetSessionPathsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionPathsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionPathsQuery({
 *   variables: {
 *      dialogueId: // value for 'dialogueId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSessionPathsQuery(baseOptions: Apollo.QueryHookOptions<GetSessionPathsQuery, GetSessionPathsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSessionPathsQuery, GetSessionPathsQueryVariables>(GetSessionPathsDocument, options);
      }
export function useGetSessionPathsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionPathsQuery, GetSessionPathsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSessionPathsQuery, GetSessionPathsQueryVariables>(GetSessionPathsDocument, options);
        }
export type GetSessionPathsQueryHookResult = ReturnType<typeof useGetSessionPathsQuery>;
export type GetSessionPathsLazyQueryHookResult = ReturnType<typeof useGetSessionPathsLazyQuery>;
export type GetSessionPathsQueryResult = Apollo.QueryResult<GetSessionPathsQuery, GetSessionPathsQueryVariables>;
export function refetchGetSessionPathsQuery(variables?: GetSessionPathsQueryVariables) {
      return { query: GetSessionPathsDocument, variables: variables }
    }
export const GetWorkspaceDialogueStatisticsDocument = gql`
    query GetWorkspaceDialogueStatistics($workspaceId: ID!, $startDateTime: String!, $endDateTime: String!) {
  customer(id: $workspaceId) {
    dialogueSchedule {
      id
      isEnabled
      dataPeriodSchedule {
        id
        startDateExpression
        endInDeltaMinutes
      }
    }
    organization {
      id
      layers {
        id
        depth
        type
      }
    }
    statistics {
      workspaceStatisticsSummary(
        input: {startDateTime: $startDateTime, endDateTime: $endDateTime, impactType: AVERAGE, refresh: true}
      ) {
        id
        nrVotes
        impactScore
        updatedAt
        title
        dialogue {
          title
          id
        }
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceDialogueStatisticsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceDialogueStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceDialogueStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceDialogueStatisticsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      startDateTime: // value for 'startDateTime'
 *      endDateTime: // value for 'endDateTime'
 *   },
 * });
 */
export function useGetWorkspaceDialogueStatisticsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>(GetWorkspaceDialogueStatisticsDocument, options);
      }
export function useGetWorkspaceDialogueStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>(GetWorkspaceDialogueStatisticsDocument, options);
        }
export type GetWorkspaceDialogueStatisticsQueryHookResult = ReturnType<typeof useGetWorkspaceDialogueStatisticsQuery>;
export type GetWorkspaceDialogueStatisticsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceDialogueStatisticsLazyQuery>;
export type GetWorkspaceDialogueStatisticsQueryResult = Apollo.QueryResult<GetWorkspaceDialogueStatisticsQuery, GetWorkspaceDialogueStatisticsQueryVariables>;
export function refetchGetWorkspaceDialogueStatisticsQuery(variables?: GetWorkspaceDialogueStatisticsQueryVariables) {
      return { query: GetWorkspaceDialogueStatisticsDocument, variables: variables }
    }
export const ResetWorkspaceDataDocument = gql`
    mutation resetWorkspaceData($workspaceId: String) {
  resetWorkspaceData(workspaceId: $workspaceId)
}
    `;
export type ResetWorkspaceDataMutationFn = Apollo.MutationFunction<ResetWorkspaceDataMutation, ResetWorkspaceDataMutationVariables>;

/**
 * __useResetWorkspaceDataMutation__
 *
 * To run a mutation, you first call `useResetWorkspaceDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetWorkspaceDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetWorkspaceDataMutation, { data, loading, error }] = useResetWorkspaceDataMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useResetWorkspaceDataMutation(baseOptions?: Apollo.MutationHookOptions<ResetWorkspaceDataMutation, ResetWorkspaceDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetWorkspaceDataMutation, ResetWorkspaceDataMutationVariables>(ResetWorkspaceDataDocument, options);
      }
export type ResetWorkspaceDataMutationHookResult = ReturnType<typeof useResetWorkspaceDataMutation>;
export type ResetWorkspaceDataMutationResult = Apollo.MutationResult<ResetWorkspaceDataMutation>;
export type ResetWorkspaceDataMutationOptions = Apollo.BaseMutationOptions<ResetWorkspaceDataMutation, ResetWorkspaceDataMutationVariables>;
export const GetWorkspaceSummaryDetailsDocument = gql`
    query GetWorkspaceSummaryDetails($id: ID, $summaryInput: DialogueStatisticsSummaryFilterInput!, $healthInput: HealthScoreInput!) {
  customer(id: $id) {
    id
    isDemo
    statistics {
      id
      health(input: $healthInput) {
        nrVotes
        negativeResponseCount
        score
      }
      rankedTopics(input: $summaryInput) {
        name
        basicStats {
          average
          responseCount
        }
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceSummaryDetailsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceSummaryDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceSummaryDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceSummaryDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      summaryInput: // value for 'summaryInput'
 *      healthInput: // value for 'healthInput'
 *   },
 * });
 */
export function useGetWorkspaceSummaryDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceSummaryDetailsQuery, GetWorkspaceSummaryDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceSummaryDetailsQuery, GetWorkspaceSummaryDetailsQueryVariables>(GetWorkspaceSummaryDetailsDocument, options);
      }
export function useGetWorkspaceSummaryDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceSummaryDetailsQuery, GetWorkspaceSummaryDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceSummaryDetailsQuery, GetWorkspaceSummaryDetailsQueryVariables>(GetWorkspaceSummaryDetailsDocument, options);
        }
export type GetWorkspaceSummaryDetailsQueryHookResult = ReturnType<typeof useGetWorkspaceSummaryDetailsQuery>;
export type GetWorkspaceSummaryDetailsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceSummaryDetailsLazyQuery>;
export type GetWorkspaceSummaryDetailsQueryResult = Apollo.QueryResult<GetWorkspaceSummaryDetailsQuery, GetWorkspaceSummaryDetailsQueryVariables>;
export function refetchGetWorkspaceSummaryDetailsQuery(variables?: GetWorkspaceSummaryDetailsQueryVariables) {
      return { query: GetWorkspaceSummaryDetailsDocument, variables: variables }
    }
export const GetDialogueLayoutDetailsDocument = gql`
    query GetDialogueLayoutDetails($workspaceId: ID!, $dialogueId: ID!, $healthInput: HealthScoreInput!, $filter: DialogueFilterInputType) {
  customer(id: $workspaceId) {
    id
    dialogue(where: {id: $dialogueId}) {
      id
      averageScore(input: $filter)
      healthScore(input: $healthInput) {
        nrVotes
        negativeResponseCount
        score
        average
      }
    }
  }
}
    `;

/**
 * __useGetDialogueLayoutDetailsQuery__
 *
 * To run a query within a React component, call `useGetDialogueLayoutDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDialogueLayoutDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDialogueLayoutDetailsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      dialogueId: // value for 'dialogueId'
 *      healthInput: // value for 'healthInput'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetDialogueLayoutDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetDialogueLayoutDetailsQuery, GetDialogueLayoutDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDialogueLayoutDetailsQuery, GetDialogueLayoutDetailsQueryVariables>(GetDialogueLayoutDetailsDocument, options);
      }
export function useGetDialogueLayoutDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDialogueLayoutDetailsQuery, GetDialogueLayoutDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDialogueLayoutDetailsQuery, GetDialogueLayoutDetailsQueryVariables>(GetDialogueLayoutDetailsDocument, options);
        }
export type GetDialogueLayoutDetailsQueryHookResult = ReturnType<typeof useGetDialogueLayoutDetailsQuery>;
export type GetDialogueLayoutDetailsLazyQueryHookResult = ReturnType<typeof useGetDialogueLayoutDetailsLazyQuery>;
export type GetDialogueLayoutDetailsQueryResult = Apollo.QueryResult<GetDialogueLayoutDetailsQuery, GetDialogueLayoutDetailsQueryVariables>;
export function refetchGetDialogueLayoutDetailsQuery(variables?: GetDialogueLayoutDetailsQueryVariables) {
      return { query: GetDialogueLayoutDetailsDocument, variables: variables }
    }
export const GetWorkspaceLayoutDetailsDocument = gql`
    query GetWorkspaceLayoutDetails($workspaceId: ID!, $healthInput: HealthScoreInput!) {
  customer(id: $workspaceId) {
    id
    statistics {
      id
      health(input: $healthInput) {
        nrVotes
        negativeResponseCount
        score
        average
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceLayoutDetailsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceLayoutDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceLayoutDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceLayoutDetailsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      healthInput: // value for 'healthInput'
 *   },
 * });
 */
export function useGetWorkspaceLayoutDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>(GetWorkspaceLayoutDetailsDocument, options);
      }
export function useGetWorkspaceLayoutDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>(GetWorkspaceLayoutDetailsDocument, options);
        }
export type GetWorkspaceLayoutDetailsQueryHookResult = ReturnType<typeof useGetWorkspaceLayoutDetailsQuery>;
export type GetWorkspaceLayoutDetailsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceLayoutDetailsLazyQuery>;
export type GetWorkspaceLayoutDetailsQueryResult = Apollo.QueryResult<GetWorkspaceLayoutDetailsQuery, GetWorkspaceLayoutDetailsQueryVariables>;
export function refetchGetWorkspaceLayoutDetailsQuery(variables?: GetWorkspaceLayoutDetailsQueryVariables) {
      return { query: GetWorkspaceLayoutDetailsDocument, variables: variables }
    }
export const CreateCtaDocument = gql`
    mutation createCTA($input: CreateCTAInputType) {
  createCTA(input: $input) {
    id
    type
    title
  }
}
    `;
export type CreateCtaMutationFn = Apollo.MutationFunction<CreateCtaMutation, CreateCtaMutationVariables>;

/**
 * __useCreateCtaMutation__
 *
 * To run a mutation, you first call `useCreateCtaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCtaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCtaMutation, { data, loading, error }] = useCreateCtaMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCtaMutation(baseOptions?: Apollo.MutationHookOptions<CreateCtaMutation, CreateCtaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCtaMutation, CreateCtaMutationVariables>(CreateCtaDocument, options);
      }
export type CreateCtaMutationHookResult = ReturnType<typeof useCreateCtaMutation>;
export type CreateCtaMutationResult = Apollo.MutationResult<CreateCtaMutation>;
export type CreateCtaMutationOptions = Apollo.BaseMutationOptions<CreateCtaMutation, CreateCtaMutationVariables>;
export const AutomationConnectionDocument = gql`
    query automationConnection($customerSlug: String, $filter: AutomationConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    slug
    dialogueSchedule {
      id
      isEnabled
      dataPeriodSchedule {
        id
        startDateExpression
        endInDeltaMinutes
      }
      evaluationPeriodSchedule {
        id
        startDateExpression
        endInDeltaMinutes
      }
    }
    automationConnection(filter: $filter) {
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        prevPageOffset
        nextPageOffset
        pageIndex
      }
      automations {
        id
        label
        description
        updatedAt
        isActive
        type
        automationScheduled {
          activeDialogue {
            slug
          }
          actions {
            type
          }
        }
        automationTrigger {
          activeDialogue {
            slug
          }
          actions {
            type
          }
        }
      }
    }
  }
}
    `;

/**
 * __useAutomationConnectionQuery__
 *
 * To run a query within a React component, call `useAutomationConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutomationConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutomationConnectionQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useAutomationConnectionQuery(baseOptions?: Apollo.QueryHookOptions<AutomationConnectionQuery, AutomationConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AutomationConnectionQuery, AutomationConnectionQueryVariables>(AutomationConnectionDocument, options);
      }
export function useAutomationConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutomationConnectionQuery, AutomationConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AutomationConnectionQuery, AutomationConnectionQueryVariables>(AutomationConnectionDocument, options);
        }
export type AutomationConnectionQueryHookResult = ReturnType<typeof useAutomationConnectionQuery>;
export type AutomationConnectionLazyQueryHookResult = ReturnType<typeof useAutomationConnectionLazyQuery>;
export type AutomationConnectionQueryResult = Apollo.QueryResult<AutomationConnectionQuery, AutomationConnectionQueryVariables>;
export function refetchAutomationConnectionQuery(variables?: AutomationConnectionQueryVariables) {
      return { query: AutomationConnectionDocument, variables: variables }
    }
export const GetCustomerOfUserDocument = gql`
    query getCustomerOfUser($input: UserOfCustomerInput) {
  UserOfCustomer(input: $input) {
    customer {
      id
      isDemo
      name
      slug
      settings {
        id
        logoUrl
        colourSettings {
          id
          primary
        }
      }
      campaigns {
        id
        label
      }
    }
    role {
      name
      permissions
    }
    user {
      id
      assignedDialogues(input: $input) {
        privateWorkspaceDialogues {
          title
          slug
          id
        }
        assignedDialogues {
          slug
          id
        }
      }
    }
  }
}
    `;

/**
 * __useGetCustomerOfUserQuery__
 *
 * To run a query within a React component, call `useGetCustomerOfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerOfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerOfUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetCustomerOfUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(GetCustomerOfUserDocument, options);
      }
export function useGetCustomerOfUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>(GetCustomerOfUserDocument, options);
        }
export type GetCustomerOfUserQueryHookResult = ReturnType<typeof useGetCustomerOfUserQuery>;
export type GetCustomerOfUserLazyQueryHookResult = ReturnType<typeof useGetCustomerOfUserLazyQuery>;
export type GetCustomerOfUserQueryResult = Apollo.QueryResult<GetCustomerOfUserQuery, GetCustomerOfUserQueryVariables>;
export function refetchGetCustomerOfUserQuery(variables?: GetCustomerOfUserQueryVariables) {
      return { query: GetCustomerOfUserDocument, variables: variables }
    }
export const MeDocument = gql`
    query me {
  me {
    id
    email
    firstName
    lastName
    phone
    globalPermissions
    userCustomers {
      isActive
      customer {
        id
        name
        slug
      }
      role {
        name
        permissions
      }
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export function refetchMeQuery(variables?: MeQueryVariables) {
      return { query: MeDocument, variables: variables }
    }
export const AssignUserToActionRequestDocument = gql`
    mutation AssignUserToActionRequest($input: AssignUserToActionRequestInput!) {
  assignUserToActionRequest(input: $input) {
    createdAt
    session {
      id
      mainScore
    }
    dialogue {
      title
    }
    status
    assignee {
      email
    }
  }
}
    `;
export type AssignUserToActionRequestMutationFn = Apollo.MutationFunction<AssignUserToActionRequestMutation, AssignUserToActionRequestMutationVariables>;

/**
 * __useAssignUserToActionRequestMutation__
 *
 * To run a mutation, you first call `useAssignUserToActionRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignUserToActionRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignUserToActionRequestMutation, { data, loading, error }] = useAssignUserToActionRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAssignUserToActionRequestMutation(baseOptions?: Apollo.MutationHookOptions<AssignUserToActionRequestMutation, AssignUserToActionRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignUserToActionRequestMutation, AssignUserToActionRequestMutationVariables>(AssignUserToActionRequestDocument, options);
      }
export type AssignUserToActionRequestMutationHookResult = ReturnType<typeof useAssignUserToActionRequestMutation>;
export type AssignUserToActionRequestMutationResult = Apollo.MutationResult<AssignUserToActionRequestMutation>;
export type AssignUserToActionRequestMutationOptions = Apollo.BaseMutationOptions<AssignUserToActionRequestMutation, AssignUserToActionRequestMutationVariables>;
export const GetIssueDocument = gql`
    query GetIssue($input: GetIssueResolverInput!, $actionableFilter: ActionRequestConnectionFilterInput) {
  issue(input: $input) {
    id
    topicId
    topic {
      id
      name
    }
    actionRequestConnection(input: $actionableFilter) {
      actionRequests {
        id
        createdAt
        isVerified
        dialogueId
        session {
          id
          mainScore
        }
        dialogue {
          id
          title
          slug
        }
        status
        assignee {
          id
          email
        }
      }
      totalPages
      pageInfo {
        hasNextPage
        hasPrevPage
        nextPageOffset
        pageIndex
        prevPageOffset
      }
    }
  }
}
    `;

/**
 * __useGetIssueQuery__
 *
 * To run a query within a React component, call `useGetIssueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIssueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIssueQuery({
 *   variables: {
 *      input: // value for 'input'
 *      actionableFilter: // value for 'actionableFilter'
 *   },
 * });
 */
export function useGetIssueQuery(baseOptions: Apollo.QueryHookOptions<GetIssueQuery, GetIssueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIssueQuery, GetIssueQueryVariables>(GetIssueDocument, options);
      }
export function useGetIssueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIssueQuery, GetIssueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIssueQuery, GetIssueQueryVariables>(GetIssueDocument, options);
        }
export type GetIssueQueryHookResult = ReturnType<typeof useGetIssueQuery>;
export type GetIssueLazyQueryHookResult = ReturnType<typeof useGetIssueLazyQuery>;
export type GetIssueQueryResult = Apollo.QueryResult<GetIssueQuery, GetIssueQueryVariables>;
export function refetchGetIssueQuery(variables?: GetIssueQueryVariables) {
      return { query: GetIssueDocument, variables: variables }
    }
export const GetWorkspaceActionRequestsDocument = gql`
    query GetWorkspaceActionRequests($workspaceId: ID!, $filter: ActionRequestConnectionFilterInput) {
  customer(id: $workspaceId) {
    actionRequestConnection(input: $filter) {
      actionRequests {
        ...ActionRequestFragment
      }
      totalPages
      pageInfo {
        hasNextPage
        hasPrevPage
        nextPageOffset
        pageIndex
        prevPageOffset
      }
    }
  }
}
    ${ActionRequestFragmentFragmentDoc}`;

/**
 * __useGetWorkspaceActionRequestsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceActionRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceActionRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceActionRequestsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetWorkspaceActionRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceActionRequestsQuery, GetWorkspaceActionRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceActionRequestsQuery, GetWorkspaceActionRequestsQueryVariables>(GetWorkspaceActionRequestsDocument, options);
      }
export function useGetWorkspaceActionRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceActionRequestsQuery, GetWorkspaceActionRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceActionRequestsQuery, GetWorkspaceActionRequestsQueryVariables>(GetWorkspaceActionRequestsDocument, options);
        }
export type GetWorkspaceActionRequestsQueryHookResult = ReturnType<typeof useGetWorkspaceActionRequestsQuery>;
export type GetWorkspaceActionRequestsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceActionRequestsLazyQuery>;
export type GetWorkspaceActionRequestsQueryResult = Apollo.QueryResult<GetWorkspaceActionRequestsQuery, GetWorkspaceActionRequestsQueryVariables>;
export function refetchGetWorkspaceActionRequestsQuery(variables?: GetWorkspaceActionRequestsQueryVariables) {
      return { query: GetWorkspaceActionRequestsDocument, variables: variables }
    }
export const GetWorkspaceIssuesDocument = gql`
    query GetWorkspaceIssues($workspaceId: ID!, $filter: IssueConnectionFilterInput) {
  customer(id: $workspaceId) {
    issueConnection(filter: $filter) {
      issues {
        ...IssueFragment
      }
      totalPages
      pageInfo {
        hasNextPage
        hasPrevPage
        nextPageOffset
        pageIndex
        prevPageOffset
      }
    }
  }
}
    ${IssueFragmentFragmentDoc}`;

/**
 * __useGetWorkspaceIssuesQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceIssuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceIssuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceIssuesQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetWorkspaceIssuesQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceIssuesQuery, GetWorkspaceIssuesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceIssuesQuery, GetWorkspaceIssuesQueryVariables>(GetWorkspaceIssuesDocument, options);
      }
export function useGetWorkspaceIssuesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceIssuesQuery, GetWorkspaceIssuesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceIssuesQuery, GetWorkspaceIssuesQueryVariables>(GetWorkspaceIssuesDocument, options);
        }
export type GetWorkspaceIssuesQueryHookResult = ReturnType<typeof useGetWorkspaceIssuesQuery>;
export type GetWorkspaceIssuesLazyQueryHookResult = ReturnType<typeof useGetWorkspaceIssuesLazyQuery>;
export type GetWorkspaceIssuesQueryResult = Apollo.QueryResult<GetWorkspaceIssuesQuery, GetWorkspaceIssuesQueryVariables>;
export function refetchGetWorkspaceIssuesQuery(variables?: GetWorkspaceIssuesQueryVariables) {
      return { query: GetWorkspaceIssuesDocument, variables: variables }
    }
export const SetActionRequestStatusDocument = gql`
    mutation SetActionRequestStatus($input: SetActionRequestStatusInput!) {
  setActionRequestStatus(input: $input) {
    id
    status
  }
}
    `;
export type SetActionRequestStatusMutationFn = Apollo.MutationFunction<SetActionRequestStatusMutation, SetActionRequestStatusMutationVariables>;

/**
 * __useSetActionRequestStatusMutation__
 *
 * To run a mutation, you first call `useSetActionRequestStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetActionRequestStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setActionRequestStatusMutation, { data, loading, error }] = useSetActionRequestStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetActionRequestStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetActionRequestStatusMutation, SetActionRequestStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetActionRequestStatusMutation, SetActionRequestStatusMutationVariables>(SetActionRequestStatusDocument, options);
      }
export type SetActionRequestStatusMutationHookResult = ReturnType<typeof useSetActionRequestStatusMutation>;
export type SetActionRequestStatusMutationResult = Apollo.MutationResult<SetActionRequestStatusMutation>;
export type SetActionRequestStatusMutationOptions = Apollo.BaseMutationOptions<SetActionRequestStatusMutation, SetActionRequestStatusMutationVariables>;
export const UploadUpsellImageDocument = gql`
    mutation uploadUpsellImage($input: UploadSellImageInputType) {
  uploadUpsellImage(input: $input) {
    url
  }
}
    `;
export type UploadUpsellImageMutationFn = Apollo.MutationFunction<UploadUpsellImageMutation, UploadUpsellImageMutationVariables>;

/**
 * __useUploadUpsellImageMutation__
 *
 * To run a mutation, you first call `useUploadUpsellImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadUpsellImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadUpsellImageMutation, { data, loading, error }] = useUploadUpsellImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadUpsellImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadUpsellImageMutation, UploadUpsellImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadUpsellImageMutation, UploadUpsellImageMutationVariables>(UploadUpsellImageDocument, options);
      }
export type UploadUpsellImageMutationHookResult = ReturnType<typeof useUploadUpsellImageMutation>;
export type UploadUpsellImageMutationResult = Apollo.MutationResult<UploadUpsellImageMutation>;
export type UploadUpsellImageMutationOptions = Apollo.BaseMutationOptions<UploadUpsellImageMutation, UploadUpsellImageMutationVariables>;
export const CreateAutomationDocument = gql`
    mutation createAutomation($input: CreateAutomationInput) {
  createAutomation(input: $input) {
    id
    label
  }
}
    `;
export type CreateAutomationMutationFn = Apollo.MutationFunction<CreateAutomationMutation, CreateAutomationMutationVariables>;

/**
 * __useCreateAutomationMutation__
 *
 * To run a mutation, you first call `useCreateAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAutomationMutation, { data, loading, error }] = useCreateAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAutomationMutation(baseOptions?: Apollo.MutationHookOptions<CreateAutomationMutation, CreateAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAutomationMutation, CreateAutomationMutationVariables>(CreateAutomationDocument, options);
      }
export type CreateAutomationMutationHookResult = ReturnType<typeof useCreateAutomationMutation>;
export type CreateAutomationMutationResult = Apollo.MutationResult<CreateAutomationMutation>;
export type CreateAutomationMutationOptions = Apollo.BaseMutationOptions<CreateAutomationMutation, CreateAutomationMutationVariables>;
export const GetUsersAndRolesDocument = gql`
    query getUsersAndRoles($customerSlug: String!) {
  customer(slug: $customerSlug) {
    id
    users {
      id
      firstName
      lastName
      email
      phone
      role {
        id
        name
      }
    }
    roles {
      id
      name
    }
  }
}
    `;

/**
 * __useGetUsersAndRolesQuery__
 *
 * To run a query within a React component, call `useGetUsersAndRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersAndRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersAndRolesQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *   },
 * });
 */
export function useGetUsersAndRolesQuery(baseOptions: Apollo.QueryHookOptions<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>(GetUsersAndRolesDocument, options);
      }
export function useGetUsersAndRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>(GetUsersAndRolesDocument, options);
        }
export type GetUsersAndRolesQueryHookResult = ReturnType<typeof useGetUsersAndRolesQuery>;
export type GetUsersAndRolesLazyQueryHookResult = ReturnType<typeof useGetUsersAndRolesLazyQuery>;
export type GetUsersAndRolesQueryResult = Apollo.QueryResult<GetUsersAndRolesQuery, GetUsersAndRolesQueryVariables>;
export function refetchGetUsersAndRolesQuery(variables?: GetUsersAndRolesQueryVariables) {
      return { query: GetUsersAndRolesDocument, variables: variables }
    }
export const ConfirmWorkspaceJobDocument = gql`
    mutation confirmWorkspaceJob($input: GenerateAutodeckInput) {
  confirmCreateWorkspaceJob(input: $input) {
    id
    name
    status
  }
}
    `;
export type ConfirmWorkspaceJobMutationFn = Apollo.MutationFunction<ConfirmWorkspaceJobMutation, ConfirmWorkspaceJobMutationVariables>;

/**
 * __useConfirmWorkspaceJobMutation__
 *
 * To run a mutation, you first call `useConfirmWorkspaceJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmWorkspaceJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmWorkspaceJobMutation, { data, loading, error }] = useConfirmWorkspaceJobMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmWorkspaceJobMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmWorkspaceJobMutation, ConfirmWorkspaceJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmWorkspaceJobMutation, ConfirmWorkspaceJobMutationVariables>(ConfirmWorkspaceJobDocument, options);
      }
export type ConfirmWorkspaceJobMutationHookResult = ReturnType<typeof useConfirmWorkspaceJobMutation>;
export type ConfirmWorkspaceJobMutationResult = Apollo.MutationResult<ConfirmWorkspaceJobMutation>;
export type ConfirmWorkspaceJobMutationOptions = Apollo.BaseMutationOptions<ConfirmWorkspaceJobMutation, ConfirmWorkspaceJobMutationVariables>;
export const CreateWorkspaceJobDocument = gql`
    mutation createWorkspaceJob($input: GenerateAutodeckInput) {
  generateAutodeck(input: $input) {
    id
    name
    status
  }
}
    `;
export type CreateWorkspaceJobMutationFn = Apollo.MutationFunction<CreateWorkspaceJobMutation, CreateWorkspaceJobMutationVariables>;

/**
 * __useCreateWorkspaceJobMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceJobMutation, { data, loading, error }] = useCreateWorkspaceJobMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkspaceJobMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkspaceJobMutation, CreateWorkspaceJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkspaceJobMutation, CreateWorkspaceJobMutationVariables>(CreateWorkspaceJobDocument, options);
      }
export type CreateWorkspaceJobMutationHookResult = ReturnType<typeof useCreateWorkspaceJobMutation>;
export type CreateWorkspaceJobMutationResult = Apollo.MutationResult<CreateWorkspaceJobMutation>;
export type CreateWorkspaceJobMutationOptions = Apollo.BaseMutationOptions<CreateWorkspaceJobMutation, CreateWorkspaceJobMutationVariables>;
export const GetAutodeckJobsDocument = gql`
    query getAutodeckJobs($filter: PaginationWhereInput) {
  getAutodeckJobs(filter: $filter) {
    jobs {
      id
      name
      createdAt
      updatedAt
      referenceId
      errorMessage
      message
      status
      resourcesUrl
      referenceType
      requiresColorExtraction
      requiresRembg
      requiresScreenshot
      processLocation {
        id
        name
        path
        type
        customFields {
          id
          key
          value
        }
      }
    }
    pageInfo {
      nrPages
      pageIndex
    }
  }
}
    `;

/**
 * __useGetAutodeckJobsQuery__
 *
 * To run a query within a React component, call `useGetAutodeckJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutodeckJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutodeckJobsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAutodeckJobsQuery(baseOptions?: Apollo.QueryHookOptions<GetAutodeckJobsQuery, GetAutodeckJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAutodeckJobsQuery, GetAutodeckJobsQueryVariables>(GetAutodeckJobsDocument, options);
      }
export function useGetAutodeckJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAutodeckJobsQuery, GetAutodeckJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAutodeckJobsQuery, GetAutodeckJobsQueryVariables>(GetAutodeckJobsDocument, options);
        }
export type GetAutodeckJobsQueryHookResult = ReturnType<typeof useGetAutodeckJobsQuery>;
export type GetAutodeckJobsLazyQueryHookResult = ReturnType<typeof useGetAutodeckJobsLazyQuery>;
export type GetAutodeckJobsQueryResult = Apollo.QueryResult<GetAutodeckJobsQuery, GetAutodeckJobsQueryVariables>;
export function refetchGetAutodeckJobsQuery(variables?: GetAutodeckJobsQueryVariables) {
      return { query: GetAutodeckJobsDocument, variables: variables }
    }
export const UploadJobImageDocument = gql`
    mutation uploadJobImage($file: Upload!, $jobId: String, $type: UploadImageEnumType, $disapproved: Boolean) {
  uploadJobImage(
    file: $file
    jobId: $jobId
    type: $type
    disapproved: $disapproved
  ) {
    url
  }
}
    `;
export type UploadJobImageMutationFn = Apollo.MutationFunction<UploadJobImageMutation, UploadJobImageMutationVariables>;

/**
 * __useUploadJobImageMutation__
 *
 * To run a mutation, you first call `useUploadJobImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadJobImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadJobImageMutation, { data, loading, error }] = useUploadJobImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *      jobId: // value for 'jobId'
 *      type: // value for 'type'
 *      disapproved: // value for 'disapproved'
 *   },
 * });
 */
export function useUploadJobImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadJobImageMutation, UploadJobImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadJobImageMutation, UploadJobImageMutationVariables>(UploadJobImageDocument, options);
      }
export type UploadJobImageMutationHookResult = ReturnType<typeof useUploadJobImageMutation>;
export type UploadJobImageMutationResult = Apollo.MutationResult<UploadJobImageMutation>;
export type UploadJobImageMutationOptions = Apollo.BaseMutationOptions<UploadJobImageMutation, UploadJobImageMutationVariables>;
export const RetryAutodeckJobDocument = gql`
    mutation retryAutodeckJob($jobId: String) {
  retryAutodeckJob(jobId: $jobId) {
    id
    name
    status
  }
}
    `;
export type RetryAutodeckJobMutationFn = Apollo.MutationFunction<RetryAutodeckJobMutation, RetryAutodeckJobMutationVariables>;

/**
 * __useRetryAutodeckJobMutation__
 *
 * To run a mutation, you first call `useRetryAutodeckJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRetryAutodeckJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [retryAutodeckJobMutation, { data, loading, error }] = useRetryAutodeckJobMutation({
 *   variables: {
 *      jobId: // value for 'jobId'
 *   },
 * });
 */
export function useRetryAutodeckJobMutation(baseOptions?: Apollo.MutationHookOptions<RetryAutodeckJobMutation, RetryAutodeckJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RetryAutodeckJobMutation, RetryAutodeckJobMutationVariables>(RetryAutodeckJobDocument, options);
      }
export type RetryAutodeckJobMutationHookResult = ReturnType<typeof useRetryAutodeckJobMutation>;
export type RetryAutodeckJobMutationResult = Apollo.MutationResult<RetryAutodeckJobMutation>;
export type RetryAutodeckJobMutationOptions = Apollo.BaseMutationOptions<RetryAutodeckJobMutation, RetryAutodeckJobMutationVariables>;
export const GetAdjustedLogoDocument = gql`
    query getAdjustedLogo($input: AdjustedImageInput) {
  getAdjustedLogo(input: $input) {
    url
  }
}
    `;

/**
 * __useGetAdjustedLogoQuery__
 *
 * To run a query within a React component, call `useGetAdjustedLogoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdjustedLogoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdjustedLogoQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAdjustedLogoQuery(baseOptions?: Apollo.QueryHookOptions<GetAdjustedLogoQuery, GetAdjustedLogoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdjustedLogoQuery, GetAdjustedLogoQueryVariables>(GetAdjustedLogoDocument, options);
      }
export function useGetAdjustedLogoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdjustedLogoQuery, GetAdjustedLogoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdjustedLogoQuery, GetAdjustedLogoQueryVariables>(GetAdjustedLogoDocument, options);
        }
export type GetAdjustedLogoQueryHookResult = ReturnType<typeof useGetAdjustedLogoQuery>;
export type GetAdjustedLogoLazyQueryHookResult = ReturnType<typeof useGetAdjustedLogoLazyQuery>;
export type GetAdjustedLogoQueryResult = Apollo.QueryResult<GetAdjustedLogoQuery, GetAdjustedLogoQueryVariables>;
export function refetchGetAdjustedLogoQuery(variables?: GetAdjustedLogoQueryVariables) {
      return { query: GetAdjustedLogoDocument, variables: variables }
    }
export const GetJobProcessLocationsDocument = gql`
    query getJobProcessLocations {
  getJobProcessLocations {
    jobProcessLocations {
      id
      name
      path
      type
      customFields {
        id
        key
        value
      }
    }
  }
}
    `;

/**
 * __useGetJobProcessLocationsQuery__
 *
 * To run a query within a React component, call `useGetJobProcessLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJobProcessLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJobProcessLocationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetJobProcessLocationsQuery(baseOptions?: Apollo.QueryHookOptions<GetJobProcessLocationsQuery, GetJobProcessLocationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJobProcessLocationsQuery, GetJobProcessLocationsQueryVariables>(GetJobProcessLocationsDocument, options);
      }
export function useGetJobProcessLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJobProcessLocationsQuery, GetJobProcessLocationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJobProcessLocationsQuery, GetJobProcessLocationsQueryVariables>(GetJobProcessLocationsDocument, options);
        }
export type GetJobProcessLocationsQueryHookResult = ReturnType<typeof useGetJobProcessLocationsQuery>;
export type GetJobProcessLocationsLazyQueryHookResult = ReturnType<typeof useGetJobProcessLocationsLazyQuery>;
export type GetJobProcessLocationsQueryResult = Apollo.QueryResult<GetJobProcessLocationsQuery, GetJobProcessLocationsQueryVariables>;
export function refetchGetJobProcessLocationsQuery(variables?: GetJobProcessLocationsQueryVariables) {
      return { query: GetJobProcessLocationsDocument, variables: variables }
    }
export const GetPreviewDataDocument = gql`
    query getPreviewData($id: String) {
  getPreviewData(id: $id) {
    colors
    rembgLogoUrl
    websiteScreenshotUrl
  }
}
    `;

/**
 * __useGetPreviewDataQuery__
 *
 * To run a query within a React component, call `useGetPreviewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPreviewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPreviewDataQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPreviewDataQuery(baseOptions?: Apollo.QueryHookOptions<GetPreviewDataQuery, GetPreviewDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPreviewDataQuery, GetPreviewDataQueryVariables>(GetPreviewDataDocument, options);
      }
export function useGetPreviewDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPreviewDataQuery, GetPreviewDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPreviewDataQuery, GetPreviewDataQueryVariables>(GetPreviewDataDocument, options);
        }
export type GetPreviewDataQueryHookResult = ReturnType<typeof useGetPreviewDataQuery>;
export type GetPreviewDataLazyQueryHookResult = ReturnType<typeof useGetPreviewDataLazyQuery>;
export type GetPreviewDataQueryResult = Apollo.QueryResult<GetPreviewDataQuery, GetPreviewDataQueryVariables>;
export function refetchGetPreviewDataQuery(variables?: GetPreviewDataQueryVariables) {
      return { query: GetPreviewDataDocument, variables: variables }
    }
export const RemovePixelRangeDocument = gql`
    mutation removePixelRange($input: RemovePixelRangeInput) {
  removePixelRange(input: $input) {
    url
  }
}
    `;
export type RemovePixelRangeMutationFn = Apollo.MutationFunction<RemovePixelRangeMutation, RemovePixelRangeMutationVariables>;

/**
 * __useRemovePixelRangeMutation__
 *
 * To run a mutation, you first call `useRemovePixelRangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePixelRangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePixelRangeMutation, { data, loading, error }] = useRemovePixelRangeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemovePixelRangeMutation(baseOptions?: Apollo.MutationHookOptions<RemovePixelRangeMutation, RemovePixelRangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePixelRangeMutation, RemovePixelRangeMutationVariables>(RemovePixelRangeDocument, options);
      }
export type RemovePixelRangeMutationHookResult = ReturnType<typeof useRemovePixelRangeMutation>;
export type RemovePixelRangeMutationResult = Apollo.MutationResult<RemovePixelRangeMutation>;
export type RemovePixelRangeMutationOptions = Apollo.BaseMutationOptions<RemovePixelRangeMutation, RemovePixelRangeMutationVariables>;
export const WhitifyImageDocument = gql`
    mutation whitifyImage($input: AdjustedImageInput) {
  whitifyImage(input: $input) {
    url
  }
}
    `;
export type WhitifyImageMutationFn = Apollo.MutationFunction<WhitifyImageMutation, WhitifyImageMutationVariables>;

/**
 * __useWhitifyImageMutation__
 *
 * To run a mutation, you first call `useWhitifyImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWhitifyImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [whitifyImageMutation, { data, loading, error }] = useWhitifyImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useWhitifyImageMutation(baseOptions?: Apollo.MutationHookOptions<WhitifyImageMutation, WhitifyImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WhitifyImageMutation, WhitifyImageMutationVariables>(WhitifyImageDocument, options);
      }
export type WhitifyImageMutationHookResult = ReturnType<typeof useWhitifyImageMutation>;
export type WhitifyImageMutationResult = Apollo.MutationResult<WhitifyImageMutation>;
export type WhitifyImageMutationOptions = Apollo.BaseMutationOptions<WhitifyImageMutation, WhitifyImageMutationVariables>;
export const CreateDialogueScheduleDocument = gql`
    mutation CreateDialogueSchedule($input: CreateDialogueScheduleInput!) {
  createDialogueSchedule(input: $input) {
    dialogueSchedule {
      id
    }
  }
}
    `;
export type CreateDialogueScheduleMutationFn = Apollo.MutationFunction<CreateDialogueScheduleMutation, CreateDialogueScheduleMutationVariables>;

/**
 * __useCreateDialogueScheduleMutation__
 *
 * To run a mutation, you first call `useCreateDialogueScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDialogueScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDialogueScheduleMutation, { data, loading, error }] = useCreateDialogueScheduleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDialogueScheduleMutation(baseOptions?: Apollo.MutationHookOptions<CreateDialogueScheduleMutation, CreateDialogueScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDialogueScheduleMutation, CreateDialogueScheduleMutationVariables>(CreateDialogueScheduleDocument, options);
      }
export type CreateDialogueScheduleMutationHookResult = ReturnType<typeof useCreateDialogueScheduleMutation>;
export type CreateDialogueScheduleMutationResult = Apollo.MutationResult<CreateDialogueScheduleMutation>;
export type CreateDialogueScheduleMutationOptions = Apollo.BaseMutationOptions<CreateDialogueScheduleMutation, CreateDialogueScheduleMutationVariables>;
export const ToggleDialogueScheduleDocument = gql`
    mutation ToggleDialogueSchedule($input: ToggleDialogueScheduleInput!) {
  toggleDialogueSchedule(input: $input) {
    id
  }
}
    `;
export type ToggleDialogueScheduleMutationFn = Apollo.MutationFunction<ToggleDialogueScheduleMutation, ToggleDialogueScheduleMutationVariables>;

/**
 * __useToggleDialogueScheduleMutation__
 *
 * To run a mutation, you first call `useToggleDialogueScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleDialogueScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleDialogueScheduleMutation, { data, loading, error }] = useToggleDialogueScheduleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useToggleDialogueScheduleMutation(baseOptions?: Apollo.MutationHookOptions<ToggleDialogueScheduleMutation, ToggleDialogueScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleDialogueScheduleMutation, ToggleDialogueScheduleMutationVariables>(ToggleDialogueScheduleDocument, options);
      }
export type ToggleDialogueScheduleMutationHookResult = ReturnType<typeof useToggleDialogueScheduleMutation>;
export type ToggleDialogueScheduleMutationResult = Apollo.MutationResult<ToggleDialogueScheduleMutation>;
export type ToggleDialogueScheduleMutationOptions = Apollo.BaseMutationOptions<ToggleDialogueScheduleMutation, ToggleDialogueScheduleMutationVariables>;
export const DeleteAutomationDocument = gql`
    mutation deleteAutomation($input: DeleteAutomationInput) {
  deleteAutomation(input: $input) {
    id
    label
  }
}
    `;
export type DeleteAutomationMutationFn = Apollo.MutationFunction<DeleteAutomationMutation, DeleteAutomationMutationVariables>;

/**
 * __useDeleteAutomationMutation__
 *
 * To run a mutation, you first call `useDeleteAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAutomationMutation, { data, loading, error }] = useDeleteAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteAutomationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAutomationMutation, DeleteAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAutomationMutation, DeleteAutomationMutationVariables>(DeleteAutomationDocument, options);
      }
export type DeleteAutomationMutationHookResult = ReturnType<typeof useDeleteAutomationMutation>;
export type DeleteAutomationMutationResult = Apollo.MutationResult<DeleteAutomationMutation>;
export type DeleteAutomationMutationOptions = Apollo.BaseMutationOptions<DeleteAutomationMutation, DeleteAutomationMutationVariables>;
export const EnableAutomationDocument = gql`
    mutation enableAutomation($input: EnableAutomationInput) {
  enableAutomation(input: $input) {
    id
    label
    isActive
  }
}
    `;
export type EnableAutomationMutationFn = Apollo.MutationFunction<EnableAutomationMutation, EnableAutomationMutationVariables>;

/**
 * __useEnableAutomationMutation__
 *
 * To run a mutation, you first call `useEnableAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableAutomationMutation, { data, loading, error }] = useEnableAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnableAutomationMutation(baseOptions?: Apollo.MutationHookOptions<EnableAutomationMutation, EnableAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnableAutomationMutation, EnableAutomationMutationVariables>(EnableAutomationDocument, options);
      }
export type EnableAutomationMutationHookResult = ReturnType<typeof useEnableAutomationMutation>;
export type EnableAutomationMutationResult = Apollo.MutationResult<EnableAutomationMutation>;
export type EnableAutomationMutationOptions = Apollo.BaseMutationOptions<EnableAutomationMutation, EnableAutomationMutationVariables>;
export const CreateBatchDeliveriesDocument = gql`
    mutation CreateBatchDeliveries($input: CreateBatchDeliveriesInputType) {
  createBatchDeliveries(input: $input) {
    nrDeliveries
    failedDeliveries {
      record
      error
    }
  }
}
    `;
export type CreateBatchDeliveriesMutationFn = Apollo.MutationFunction<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>;

/**
 * __useCreateBatchDeliveriesMutation__
 *
 * To run a mutation, you first call `useCreateBatchDeliveriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBatchDeliveriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBatchDeliveriesMutation, { data, loading, error }] = useCreateBatchDeliveriesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBatchDeliveriesMutation(baseOptions?: Apollo.MutationHookOptions<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>(CreateBatchDeliveriesDocument, options);
      }
export type CreateBatchDeliveriesMutationHookResult = ReturnType<typeof useCreateBatchDeliveriesMutation>;
export type CreateBatchDeliveriesMutationResult = Apollo.MutationResult<CreateBatchDeliveriesMutation>;
export type CreateBatchDeliveriesMutationOptions = Apollo.BaseMutationOptions<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>;
export const GetDeliveryDocument = gql`
    query GetDelivery($deliveryId: String) {
  delivery(deliveryId: $deliveryId) {
    ...DeliveryFragment
    events {
      ...DeliveryEventFragment
    }
  }
}
    ${DeliveryFragmentFragmentDoc}
${DeliveryEventFragmentFragmentDoc}`;

/**
 * __useGetDeliveryQuery__
 *
 * To run a query within a React component, call `useGetDeliveryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeliveryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeliveryQuery({
 *   variables: {
 *      deliveryId: // value for 'deliveryId'
 *   },
 * });
 */
export function useGetDeliveryQuery(baseOptions?: Apollo.QueryHookOptions<GetDeliveryQuery, GetDeliveryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeliveryQuery, GetDeliveryQueryVariables>(GetDeliveryDocument, options);
      }
export function useGetDeliveryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeliveryQuery, GetDeliveryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeliveryQuery, GetDeliveryQueryVariables>(GetDeliveryDocument, options);
        }
export type GetDeliveryQueryHookResult = ReturnType<typeof useGetDeliveryQuery>;
export type GetDeliveryLazyQueryHookResult = ReturnType<typeof useGetDeliveryLazyQuery>;
export type GetDeliveryQueryResult = Apollo.QueryResult<GetDeliveryQuery, GetDeliveryQueryVariables>;
export function refetchGetDeliveryQuery(variables?: GetDeliveryQueryVariables) {
      return { query: GetDeliveryDocument, variables: variables }
    }
export const GetWorkspaceCampaignDocument = gql`
    query GetWorkspaceCampaign($customerSlug: String!, $campaignId: String!, $deliveryConnectionFilter: DeliveryConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    campaign(campaignId: $campaignId) {
      id
      label
      deliveryConnection(filter: $deliveryConnectionFilter) {
        deliveries {
          id
          deliveryRecipientFirstName
          deliveryRecipientLastName
          deliveryRecipientEmail
          deliveryRecipientPhone
          scheduledAt
          updatedAt
          currentStatus
          campaignVariant {
            id
            label
            type
          }
          events {
            id
            createdAt
            status
            failureMessage
          }
        }
        totalPages
        pageInfo {
          hasPrevPage
          hasNextPage
          prevPageOffset
          nextPageOffset
          pageIndex
        }
      }
      variants {
        id
        label
        from
        type
        weight
        body
        customVariables {
          id
          key
        }
        dialogue {
          id
          title
        }
        workspace {
          id
        }
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceCampaignQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceCampaignQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceCampaignQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceCampaignQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      campaignId: // value for 'campaignId'
 *      deliveryConnectionFilter: // value for 'deliveryConnectionFilter'
 *   },
 * });
 */
export function useGetWorkspaceCampaignQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>(GetWorkspaceCampaignDocument, options);
      }
export function useGetWorkspaceCampaignLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>(GetWorkspaceCampaignDocument, options);
        }
export type GetWorkspaceCampaignQueryHookResult = ReturnType<typeof useGetWorkspaceCampaignQuery>;
export type GetWorkspaceCampaignLazyQueryHookResult = ReturnType<typeof useGetWorkspaceCampaignLazyQuery>;
export type GetWorkspaceCampaignQueryResult = Apollo.QueryResult<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>;
export function refetchGetWorkspaceCampaignQuery(variables?: GetWorkspaceCampaignQueryVariables) {
      return { query: GetWorkspaceCampaignDocument, variables: variables }
    }
export const CreateCampaignDocument = gql`
    mutation CreateCampaign($input: CreateCampaignInputType) {
  createCampaign(input: $input) {
    id
  }
}
    `;
export type CreateCampaignMutationFn = Apollo.MutationFunction<CreateCampaignMutation, CreateCampaignMutationVariables>;

/**
 * __useCreateCampaignMutation__
 *
 * To run a mutation, you first call `useCreateCampaignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCampaignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCampaignMutation, { data, loading, error }] = useCreateCampaignMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCampaignMutation(baseOptions?: Apollo.MutationHookOptions<CreateCampaignMutation, CreateCampaignMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCampaignMutation, CreateCampaignMutationVariables>(CreateCampaignDocument, options);
      }
export type CreateCampaignMutationHookResult = ReturnType<typeof useCreateCampaignMutation>;
export type CreateCampaignMutationResult = Apollo.MutationResult<CreateCampaignMutation>;
export type CreateCampaignMutationOptions = Apollo.BaseMutationOptions<CreateCampaignMutation, CreateCampaignMutationVariables>;
export const GetWorkspaceCampaignsDocument = gql`
    query GetWorkspaceCampaigns($customerSlug: String!) {
  customer(slug: $customerSlug) {
    id
    campaigns {
      id
      label
      variants {
        id
        label
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceCampaignsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceCampaignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceCampaignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceCampaignsQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *   },
 * });
 */
export function useGetWorkspaceCampaignsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>(GetWorkspaceCampaignsDocument, options);
      }
export function useGetWorkspaceCampaignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>(GetWorkspaceCampaignsDocument, options);
        }
export type GetWorkspaceCampaignsQueryHookResult = ReturnType<typeof useGetWorkspaceCampaignsQuery>;
export type GetWorkspaceCampaignsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceCampaignsLazyQuery>;
export type GetWorkspaceCampaignsQueryResult = Apollo.QueryResult<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>;
export function refetchGetWorkspaceCampaignsQuery(variables?: GetWorkspaceCampaignsQueryVariables) {
      return { query: GetWorkspaceCampaignsDocument, variables: variables }
    }
export const GetWorkspaceDialoguesDocument = gql`
    query GetWorkspaceDialogues($customerSlug: String!, $filter: DialogueFilterInputType) {
  customer(slug: $customerSlug) {
    id
    dialogues(filter: $filter) {
      id
      title
      slug
      publicTitle
      creationDate
      updatedAt
      customerId
      averageScore
      customer {
        slug
      }
      tags {
        id
        type
        name
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceDialoguesQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceDialoguesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceDialoguesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceDialoguesQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetWorkspaceDialoguesQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>(GetWorkspaceDialoguesDocument, options);
      }
export function useGetWorkspaceDialoguesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>(GetWorkspaceDialoguesDocument, options);
        }
export type GetWorkspaceDialoguesQueryHookResult = ReturnType<typeof useGetWorkspaceDialoguesQuery>;
export type GetWorkspaceDialoguesLazyQueryHookResult = ReturnType<typeof useGetWorkspaceDialoguesLazyQuery>;
export type GetWorkspaceDialoguesQueryResult = Apollo.QueryResult<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>;
export function refetchGetWorkspaceDialoguesQuery(variables?: GetWorkspaceDialoguesQueryVariables) {
      return { query: GetWorkspaceDialoguesDocument, variables: variables }
    }
export const DuplicateQuestionDocument = gql`
    mutation duplicateQuestion($questionId: String) {
  duplicateQuestion(questionId: $questionId) {
    id
  }
}
    `;
export type DuplicateQuestionMutationFn = Apollo.MutationFunction<DuplicateQuestionMutation, DuplicateQuestionMutationVariables>;

/**
 * __useDuplicateQuestionMutation__
 *
 * To run a mutation, you first call `useDuplicateQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicateQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicateQuestionMutation, { data, loading, error }] = useDuplicateQuestionMutation({
 *   variables: {
 *      questionId: // value for 'questionId'
 *   },
 * });
 */
export function useDuplicateQuestionMutation(baseOptions?: Apollo.MutationHookOptions<DuplicateQuestionMutation, DuplicateQuestionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DuplicateQuestionMutation, DuplicateQuestionMutationVariables>(DuplicateQuestionDocument, options);
      }
export type DuplicateQuestionMutationHookResult = ReturnType<typeof useDuplicateQuestionMutation>;
export type DuplicateQuestionMutationResult = Apollo.MutationResult<DuplicateQuestionMutation>;
export type DuplicateQuestionMutationOptions = Apollo.BaseMutationOptions<DuplicateQuestionMutation, DuplicateQuestionMutationVariables>;
export const GetDialogueLinksDocument = gql`
    query GetDialogueLinks($workspaceId: String, $filter: DialogueConnectionFilterInput) {
  dialogueLinks(workspaceId: $workspaceId, filter: $filter) {
    dialogues {
      title
      slug
      description
      url
    }
    totalPages
    pageInfo {
      hasPrevPage
      hasNextPage
      prevPageOffset
      nextPageOffset
      pageIndex
    }
  }
}
    `;

/**
 * __useGetDialogueLinksQuery__
 *
 * To run a query within a React component, call `useGetDialogueLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDialogueLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDialogueLinksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetDialogueLinksQuery(baseOptions?: Apollo.QueryHookOptions<GetDialogueLinksQuery, GetDialogueLinksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDialogueLinksQuery, GetDialogueLinksQueryVariables>(GetDialogueLinksDocument, options);
      }
export function useGetDialogueLinksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDialogueLinksQuery, GetDialogueLinksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDialogueLinksQuery, GetDialogueLinksQueryVariables>(GetDialogueLinksDocument, options);
        }
export type GetDialogueLinksQueryHookResult = ReturnType<typeof useGetDialogueLinksQuery>;
export type GetDialogueLinksLazyQueryHookResult = ReturnType<typeof useGetDialogueLinksLazyQuery>;
export type GetDialogueLinksQueryResult = Apollo.QueryResult<GetDialogueLinksQuery, GetDialogueLinksQueryVariables>;
export function refetchGetDialogueLinksQuery(variables?: GetDialogueLinksQueryVariables) {
      return { query: GetDialogueLinksDocument, variables: variables }
    }
export const AssignUserToDialogueDocument = gql`
    mutation assignUserToDialogue($input: AssignUserToDialogueInput) {
  assignUserToDialogue(input: $input) {
    email
  }
}
    `;
export type AssignUserToDialogueMutationFn = Apollo.MutationFunction<AssignUserToDialogueMutation, AssignUserToDialogueMutationVariables>;

/**
 * __useAssignUserToDialogueMutation__
 *
 * To run a mutation, you first call `useAssignUserToDialogueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignUserToDialogueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignUserToDialogueMutation, { data, loading, error }] = useAssignUserToDialogueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAssignUserToDialogueMutation(baseOptions?: Apollo.MutationHookOptions<AssignUserToDialogueMutation, AssignUserToDialogueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignUserToDialogueMutation, AssignUserToDialogueMutationVariables>(AssignUserToDialogueDocument, options);
      }
export type AssignUserToDialogueMutationHookResult = ReturnType<typeof useAssignUserToDialogueMutation>;
export type AssignUserToDialogueMutationResult = Apollo.MutationResult<AssignUserToDialogueMutation>;
export type AssignUserToDialogueMutationOptions = Apollo.BaseMutationOptions<AssignUserToDialogueMutation, AssignUserToDialogueMutationVariables>;
export const DeleteDialogueDocument = gql`
    mutation deleteDialogue($input: DeleteDialogueInputType) {
  deleteDialogue(input: $input) {
    id
    slug
  }
}
    `;
export type DeleteDialogueMutationFn = Apollo.MutationFunction<DeleteDialogueMutation, DeleteDialogueMutationVariables>;

/**
 * __useDeleteDialogueMutation__
 *
 * To run a mutation, you first call `useDeleteDialogueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDialogueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDialogueMutation, { data, loading, error }] = useDeleteDialogueMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteDialogueMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDialogueMutation, DeleteDialogueMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDialogueMutation, DeleteDialogueMutationVariables>(DeleteDialogueDocument, options);
      }
export type DeleteDialogueMutationHookResult = ReturnType<typeof useDeleteDialogueMutation>;
export type DeleteDialogueMutationResult = Apollo.MutationResult<DeleteDialogueMutation>;
export type DeleteDialogueMutationOptions = Apollo.BaseMutationOptions<DeleteDialogueMutation, DeleteDialogueMutationVariables>;
export const DialogueConnectionDocument = gql`
    query dialogueConnection($customerSlug: String, $filter: DialogueConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    slug
    dialogueConnection(filter: $filter) {
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        prevPageOffset
        nextPageOffset
        pageIndex
      }
      dialogues {
        id
        title
        isPrivate
        template
        language
        slug
        publicTitle
        creationDate
        updatedAt
        customerId
        averageScore
        assignees {
          id
          firstName
          lastName
        }
        customer {
          slug
        }
        tags {
          id
          type
          name
        }
      }
    }
  }
}
    `;

/**
 * __useDialogueConnectionQuery__
 *
 * To run a query within a React component, call `useDialogueConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useDialogueConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDialogueConnectionQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useDialogueConnectionQuery(baseOptions?: Apollo.QueryHookOptions<DialogueConnectionQuery, DialogueConnectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DialogueConnectionQuery, DialogueConnectionQueryVariables>(DialogueConnectionDocument, options);
      }
export function useDialogueConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DialogueConnectionQuery, DialogueConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DialogueConnectionQuery, DialogueConnectionQueryVariables>(DialogueConnectionDocument, options);
        }
export type DialogueConnectionQueryHookResult = ReturnType<typeof useDialogueConnectionQuery>;
export type DialogueConnectionLazyQueryHookResult = ReturnType<typeof useDialogueConnectionLazyQuery>;
export type DialogueConnectionQueryResult = Apollo.QueryResult<DialogueConnectionQuery, DialogueConnectionQueryVariables>;
export function refetchDialogueConnectionQuery(variables?: DialogueConnectionQueryVariables) {
      return { query: DialogueConnectionDocument, variables: variables }
    }
export const GetUsersDocument = gql`
    query getUsers($customerSlug: String!) {
  customer(slug: $customerSlug) {
    id
    users {
      id
      firstName
      lastName
      role {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export function refetchGetUsersQuery(variables?: GetUsersQueryVariables) {
      return { query: GetUsersDocument, variables: variables }
    }
export const SetDialoguePrivacyDocument = gql`
    mutation setDialoguePrivacy($input: SetDialoguePrivacyInput) {
  setDialoguePrivacy(input: $input) {
    slug
    title
    isPrivate
  }
}
    `;
export type SetDialoguePrivacyMutationFn = Apollo.MutationFunction<SetDialoguePrivacyMutation, SetDialoguePrivacyMutationVariables>;

/**
 * __useSetDialoguePrivacyMutation__
 *
 * To run a mutation, you first call `useSetDialoguePrivacyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDialoguePrivacyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDialoguePrivacyMutation, { data, loading, error }] = useSetDialoguePrivacyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetDialoguePrivacyMutation(baseOptions?: Apollo.MutationHookOptions<SetDialoguePrivacyMutation, SetDialoguePrivacyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDialoguePrivacyMutation, SetDialoguePrivacyMutationVariables>(SetDialoguePrivacyDocument, options);
      }
export type SetDialoguePrivacyMutationHookResult = ReturnType<typeof useSetDialoguePrivacyMutation>;
export type SetDialoguePrivacyMutationResult = Apollo.MutationResult<SetDialoguePrivacyMutation>;
export type SetDialoguePrivacyMutationOptions = Apollo.BaseMutationOptions<SetDialoguePrivacyMutation, SetDialoguePrivacyMutationVariables>;
export const GetDialogueStatisticsDocument = gql`
    query GetDialogueStatistics($customerSlug: String!, $dialogueSlug: String!, $startDateTime: String!, $endDateTime: String, $issueFilter: IssueFilterInput, $healthInput: HealthScoreInput) {
  customer(slug: $customerSlug) {
    id
    dialogue(where: {slug: $dialogueSlug}) {
      id
      title
      healthScore(input: $healthInput) {
        nrVotes
        negativeResponseCount
        score
        average
      }
      statistics(
        input: {startDateTime: $startDateTime, endDateTime: $endDateTime, impactType: AVERAGE, refresh: true}
      ) {
        nrInteractions
        topPositivePath {
          answer
          quantity
          basicSentiment
        }
        mostPopularPath {
          answer
          quantity
          basicSentiment
        }
        topNegativePath {
          quantity
          answer
          basicSentiment
        }
        history {
          x
          y
        }
      }
      sessions(take: 3) {
        id
        createdAt
        mainScore
        nodeEntries {
          relatedNode {
            title
            type
          }
          value {
            sliderNodeEntry
            textboxNodeEntry
            registrationNodeEntry
            choiceNodeEntry
            linkNodeEntry
          }
        }
      }
      issues(filter: $issueFilter) {
        id
        topic
        rankScore
        followUpAction
        actionRequiredCount
        dialogue {
          id
          title
        }
        basicStats {
          responseCount
          average
        }
        history {
          id
          items {
            id
            date
            frequency
          }
        }
      }
      dialogueStatisticsSummary(
        input: {startDateTime: $startDateTime, endDateTime: $endDateTime, impactType: AVERAGE, refresh: true}
      ) {
        id
        nrVotes
        impactScore
        updatedAt
        title
        dialogue {
          title
          id
        }
      }
    }
  }
}
    `;

/**
 * __useGetDialogueStatisticsQuery__
 *
 * To run a query within a React component, call `useGetDialogueStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDialogueStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDialogueStatisticsQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      dialogueSlug: // value for 'dialogueSlug'
 *      startDateTime: // value for 'startDateTime'
 *      endDateTime: // value for 'endDateTime'
 *      issueFilter: // value for 'issueFilter'
 *      healthInput: // value for 'healthInput'
 *   },
 * });
 */
export function useGetDialogueStatisticsQuery(baseOptions: Apollo.QueryHookOptions<GetDialogueStatisticsQuery, GetDialogueStatisticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDialogueStatisticsQuery, GetDialogueStatisticsQueryVariables>(GetDialogueStatisticsDocument, options);
      }
export function useGetDialogueStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDialogueStatisticsQuery, GetDialogueStatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDialogueStatisticsQuery, GetDialogueStatisticsQueryVariables>(GetDialogueStatisticsDocument, options);
        }
export type GetDialogueStatisticsQueryHookResult = ReturnType<typeof useGetDialogueStatisticsQuery>;
export type GetDialogueStatisticsLazyQueryHookResult = ReturnType<typeof useGetDialogueStatisticsLazyQuery>;
export type GetDialogueStatisticsQueryResult = Apollo.QueryResult<GetDialogueStatisticsQuery, GetDialogueStatisticsQueryVariables>;
export function refetchGetDialogueStatisticsQuery(variables?: GetDialogueStatisticsQueryVariables) {
      return { query: GetDialogueStatisticsDocument, variables: variables }
    }
export const GetAutomationDocument = gql`
    query getAutomation($input: GetAutomationInput) {
  automation(where: $input) {
    id
    createdAt
    updatedAt
    isActive
    label
    description
    type
    workspace {
      slug
      id
    }
    automationScheduled {
      id
      createdAt
      updatedAt
      type
      minutes
      hours
      dayOfMonth
      dayOfWeek
      month
      frequency
      time
      dayRange {
        label
        index
      }
      activeDialogue {
        id
        slug
        title
      }
      actions {
        id
        type
        channels {
          id
          type
          payload
        }
      }
    }
    automationTrigger {
      id
      activeDialogue {
        title
        slug
        id
      }
      actions {
        id
        type
        payload
      }
      event {
        id
        type
        dialogue {
          title
          slug
          id
        }
        question {
          id
          title
          type
        }
      }
    }
  }
}
    `;

/**
 * __useGetAutomationQuery__
 *
 * To run a query within a React component, call `useGetAutomationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetAutomationQuery(baseOptions?: Apollo.QueryHookOptions<GetAutomationQuery, GetAutomationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAutomationQuery, GetAutomationQueryVariables>(GetAutomationDocument, options);
      }
export function useGetAutomationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAutomationQuery, GetAutomationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAutomationQuery, GetAutomationQueryVariables>(GetAutomationDocument, options);
        }
export type GetAutomationQueryHookResult = ReturnType<typeof useGetAutomationQuery>;
export type GetAutomationLazyQueryHookResult = ReturnType<typeof useGetAutomationLazyQuery>;
export type GetAutomationQueryResult = Apollo.QueryResult<GetAutomationQuery, GetAutomationQueryVariables>;
export function refetchGetAutomationQuery(variables?: GetAutomationQueryVariables) {
      return { query: GetAutomationDocument, variables: variables }
    }
export const UpdateAutomationDocument = gql`
    mutation updateAutomation($input: CreateAutomationInput) {
  updateAutomation(input: $input) {
    id
    label
  }
}
    `;
export type UpdateAutomationMutationFn = Apollo.MutationFunction<UpdateAutomationMutation, UpdateAutomationMutationVariables>;

/**
 * __useUpdateAutomationMutation__
 *
 * To run a mutation, you first call `useUpdateAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAutomationMutation, { data, loading, error }] = useUpdateAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAutomationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAutomationMutation, UpdateAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAutomationMutation, UpdateAutomationMutationVariables>(UpdateAutomationDocument, options);
      }
export type UpdateAutomationMutationHookResult = ReturnType<typeof useUpdateAutomationMutation>;
export type UpdateAutomationMutationResult = Apollo.MutationResult<UpdateAutomationMutation>;
export type UpdateAutomationMutationOptions = Apollo.BaseMutationOptions<UpdateAutomationMutation, UpdateAutomationMutationVariables>;
export const GetInteractionDocument = gql`
    query GetInteraction($sessionId: String!) {
  session(id: $sessionId) {
    id
    ...SessionFragment
    delivery {
      ...DeliveryFragment
      campaignVariant {
        id
        campaign {
          id
        }
      }
      events {
        ...DeliveryEventFragment
      }
    }
  }
}
    ${SessionFragmentFragmentDoc}
${DeliveryFragmentFragmentDoc}
${DeliveryEventFragmentFragmentDoc}`;

/**
 * __useGetInteractionQuery__
 *
 * To run a query within a React component, call `useGetInteractionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInteractionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInteractionQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetInteractionQuery(baseOptions: Apollo.QueryHookOptions<GetInteractionQuery, GetInteractionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInteractionQuery, GetInteractionQueryVariables>(GetInteractionDocument, options);
      }
export function useGetInteractionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInteractionQuery, GetInteractionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInteractionQuery, GetInteractionQueryVariables>(GetInteractionDocument, options);
        }
export type GetInteractionQueryHookResult = ReturnType<typeof useGetInteractionQuery>;
export type GetInteractionLazyQueryHookResult = ReturnType<typeof useGetInteractionLazyQuery>;
export type GetInteractionQueryResult = Apollo.QueryResult<GetInteractionQuery, GetInteractionQueryVariables>;
export function refetchGetInteractionQuery(variables?: GetInteractionQueryVariables) {
      return { query: GetInteractionDocument, variables: variables }
    }
export const GetWorkspaceSessionsDocument = gql`
    query GetWorkspaceSessions($workspaceId: ID, $filter: SessionConnectionFilterInput) {
  customer(id: $workspaceId) {
    id
    sessionConnection(filter: $filter) {
      sessions {
        ...SessionFragment
      }
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        nextPageOffset
        prevPageOffset
        pageIndex
      }
    }
  }
}
    ${SessionFragmentFragmentDoc}`;

/**
 * __useGetWorkspaceSessionsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceSessionsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetWorkspaceSessionsQuery(baseOptions?: Apollo.QueryHookOptions<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>(GetWorkspaceSessionsDocument, options);
      }
export function useGetWorkspaceSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>(GetWorkspaceSessionsDocument, options);
        }
export type GetWorkspaceSessionsQueryHookResult = ReturnType<typeof useGetWorkspaceSessionsQuery>;
export type GetWorkspaceSessionsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceSessionsLazyQuery>;
export type GetWorkspaceSessionsQueryResult = Apollo.QueryResult<GetWorkspaceSessionsQuery, GetWorkspaceSessionsQueryVariables>;
export function refetchGetWorkspaceSessionsQuery(variables?: GetWorkspaceSessionsQueryVariables) {
      return { query: GetWorkspaceSessionsDocument, variables: variables }
    }
export const GenerateWorkspaceFromCsvDocument = gql`
    mutation GenerateWorkspaceFromCSV($input: GenerateWorkspaceCSVInputType) {
  generateWorkspaceFromCSV(input: $input) {
    id
    slug
  }
}
    `;
export type GenerateWorkspaceFromCsvMutationFn = Apollo.MutationFunction<GenerateWorkspaceFromCsvMutation, GenerateWorkspaceFromCsvMutationVariables>;

/**
 * __useGenerateWorkspaceFromCsvMutation__
 *
 * To run a mutation, you first call `useGenerateWorkspaceFromCsvMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateWorkspaceFromCsvMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateWorkspaceFromCsvMutation, { data, loading, error }] = useGenerateWorkspaceFromCsvMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateWorkspaceFromCsvMutation(baseOptions?: Apollo.MutationHookOptions<GenerateWorkspaceFromCsvMutation, GenerateWorkspaceFromCsvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateWorkspaceFromCsvMutation, GenerateWorkspaceFromCsvMutationVariables>(GenerateWorkspaceFromCsvDocument, options);
      }
export type GenerateWorkspaceFromCsvMutationHookResult = ReturnType<typeof useGenerateWorkspaceFromCsvMutation>;
export type GenerateWorkspaceFromCsvMutationResult = Apollo.MutationResult<GenerateWorkspaceFromCsvMutation>;
export type GenerateWorkspaceFromCsvMutationOptions = Apollo.BaseMutationOptions<GenerateWorkspaceFromCsvMutation, GenerateWorkspaceFromCsvMutationVariables>;
export const RequestInviteDocument = gql`
    mutation RequestInvite($input: RequestInviteInput) {
  requestInvite(input: $input) {
    didInvite
    userExists
  }
}
    `;
export type RequestInviteMutationFn = Apollo.MutationFunction<RequestInviteMutation, RequestInviteMutationVariables>;

/**
 * __useRequestInviteMutation__
 *
 * To run a mutation, you first call `useRequestInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestInviteMutation, { data, loading, error }] = useRequestInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRequestInviteMutation(baseOptions?: Apollo.MutationHookOptions<RequestInviteMutation, RequestInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestInviteMutation, RequestInviteMutationVariables>(RequestInviteDocument, options);
      }
export type RequestInviteMutationHookResult = ReturnType<typeof useRequestInviteMutation>;
export type RequestInviteMutationResult = Apollo.MutationResult<RequestInviteMutation>;
export type RequestInviteMutationOptions = Apollo.BaseMutationOptions<RequestInviteMutation, RequestInviteMutationVariables>;
export const AssignUserToDialoguesDocument = gql`
    mutation assignUserToDialogues($input: AssignUserToDialoguesInput) {
  assignUserToDialogues(input: $input) {
    email
    assignedDialogues {
      privateWorkspaceDialogues {
        title
        slug
        id
      }
      assignedDialogues {
        slug
        id
      }
    }
  }
}
    `;
export type AssignUserToDialoguesMutationFn = Apollo.MutationFunction<AssignUserToDialoguesMutation, AssignUserToDialoguesMutationVariables>;

/**
 * __useAssignUserToDialoguesMutation__
 *
 * To run a mutation, you first call `useAssignUserToDialoguesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignUserToDialoguesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignUserToDialoguesMutation, { data, loading, error }] = useAssignUserToDialoguesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAssignUserToDialoguesMutation(baseOptions?: Apollo.MutationHookOptions<AssignUserToDialoguesMutation, AssignUserToDialoguesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignUserToDialoguesMutation, AssignUserToDialoguesMutationVariables>(AssignUserToDialoguesDocument, options);
      }
export type AssignUserToDialoguesMutationHookResult = ReturnType<typeof useAssignUserToDialoguesMutation>;
export type AssignUserToDialoguesMutationResult = Apollo.MutationResult<AssignUserToDialoguesMutation>;
export type AssignUserToDialoguesMutationOptions = Apollo.BaseMutationOptions<AssignUserToDialoguesMutation, AssignUserToDialoguesMutationVariables>;
export const DeleteUserDocument = gql`
    mutation deleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    deletedUser
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const GetPaginatedUsersDocument = gql`
    query getPaginatedUsers($customerSlug: String!, $filter: UserConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    usersConnection(filter: $filter) {
      userCustomers {
        createdAt
        isActive
        user {
          lastLoggedIn
          lastActivity
          id
          email
          firstName
          lastName
        }
        role {
          id
          name
        }
      }
      totalPages
      pageInfo {
        hasPrevPage
        hasNextPage
        prevPageOffset
        nextPageOffset
        pageIndex
      }
    }
  }
}
    `;

/**
 * __useGetPaginatedUsersQuery__
 *
 * To run a query within a React component, call `useGetPaginatedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaginatedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaginatedUsersQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetPaginatedUsersQuery(baseOptions: Apollo.QueryHookOptions<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(GetPaginatedUsersDocument, options);
      }
export function useGetPaginatedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(GetPaginatedUsersDocument, options);
        }
export type GetPaginatedUsersQueryHookResult = ReturnType<typeof useGetPaginatedUsersQuery>;
export type GetPaginatedUsersLazyQueryHookResult = ReturnType<typeof useGetPaginatedUsersLazyQuery>;
export type GetPaginatedUsersQueryResult = Apollo.QueryResult<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>;
export function refetchGetPaginatedUsersQuery(variables?: GetPaginatedUsersQueryVariables) {
      return { query: GetPaginatedUsersDocument, variables: variables }
    }
export const FindRoleByIdDocument = gql`
    query findRoleById($input: FindRoleInput) {
  role(input: $input) {
    id
    name
    nrPermissions
    permissions
    allPermissions
  }
}
    `;

/**
 * __useFindRoleByIdQuery__
 *
 * To run a query within a React component, call `useFindRoleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindRoleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindRoleByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindRoleByIdQuery(baseOptions?: Apollo.QueryHookOptions<FindRoleByIdQuery, FindRoleByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindRoleByIdQuery, FindRoleByIdQueryVariables>(FindRoleByIdDocument, options);
      }
export function useFindRoleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindRoleByIdQuery, FindRoleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindRoleByIdQuery, FindRoleByIdQueryVariables>(FindRoleByIdDocument, options);
        }
export type FindRoleByIdQueryHookResult = ReturnType<typeof useFindRoleByIdQuery>;
export type FindRoleByIdLazyQueryHookResult = ReturnType<typeof useFindRoleByIdLazyQuery>;
export type FindRoleByIdQueryResult = Apollo.QueryResult<FindRoleByIdQuery, FindRoleByIdQueryVariables>;
export function refetchFindRoleByIdQuery(variables?: FindRoleByIdQueryVariables) {
      return { query: FindRoleByIdDocument, variables: variables }
    }
export const GetRolesDocument = gql`
    query GetRoles($id: ID) {
  customer(id: $id) {
    id
    roles {
      id
      name
    }
  }
}
    `;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
export function refetchGetRolesQuery(variables?: GetRolesQueryVariables) {
      return { query: GetRolesDocument, variables: variables }
    }
export const GetUserCustomerFromCustomerDocument = gql`
    query GetUserCustomerFromCustomer($id: ID!, $userId: String!, $input: UserOfCustomerInput) {
  customer(id: $id) {
    id
    userCustomer(userId: $userId) {
      user {
        id
        email
        phone
        firstName
        lastName
        assignedDialogues(input: $input) {
          privateWorkspaceDialogues {
            title
            slug
            id
            description
          }
          assignedDialogues {
            slug
            id
          }
        }
      }
      role {
        name
        id
      }
    }
  }
}
    `;

/**
 * __useGetUserCustomerFromCustomerQuery__
 *
 * To run a query within a React component, call `useGetUserCustomerFromCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserCustomerFromCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserCustomerFromCustomerQuery({
 *   variables: {
 *      id: // value for 'id'
 *      userId: // value for 'userId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUserCustomerFromCustomerQuery(baseOptions: Apollo.QueryHookOptions<GetUserCustomerFromCustomerQuery, GetUserCustomerFromCustomerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserCustomerFromCustomerQuery, GetUserCustomerFromCustomerQueryVariables>(GetUserCustomerFromCustomerDocument, options);
      }
export function useGetUserCustomerFromCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserCustomerFromCustomerQuery, GetUserCustomerFromCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserCustomerFromCustomerQuery, GetUserCustomerFromCustomerQueryVariables>(GetUserCustomerFromCustomerDocument, options);
        }
export type GetUserCustomerFromCustomerQueryHookResult = ReturnType<typeof useGetUserCustomerFromCustomerQuery>;
export type GetUserCustomerFromCustomerLazyQueryHookResult = ReturnType<typeof useGetUserCustomerFromCustomerLazyQuery>;
export type GetUserCustomerFromCustomerQueryResult = Apollo.QueryResult<GetUserCustomerFromCustomerQuery, GetUserCustomerFromCustomerQueryVariables>;
export function refetchGetUserCustomerFromCustomerQuery(variables?: GetUserCustomerFromCustomerQueryVariables) {
      return { query: GetUserCustomerFromCustomerDocument, variables: variables }
    }
export const HandleUserStateInWorkspaceDocument = gql`
    mutation handleUserStateInWorkspace($input: HandleUserStateInWorkspaceInput!) {
  handleUserStateInWorkspace(input: $input) {
    isActive
    user {
      email
    }
  }
}
    `;
export type HandleUserStateInWorkspaceMutationFn = Apollo.MutationFunction<HandleUserStateInWorkspaceMutation, HandleUserStateInWorkspaceMutationVariables>;

/**
 * __useHandleUserStateInWorkspaceMutation__
 *
 * To run a mutation, you first call `useHandleUserStateInWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHandleUserStateInWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [handleUserStateInWorkspaceMutation, { data, loading, error }] = useHandleUserStateInWorkspaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useHandleUserStateInWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<HandleUserStateInWorkspaceMutation, HandleUserStateInWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<HandleUserStateInWorkspaceMutation, HandleUserStateInWorkspaceMutationVariables>(HandleUserStateInWorkspaceDocument, options);
      }
export type HandleUserStateInWorkspaceMutationHookResult = ReturnType<typeof useHandleUserStateInWorkspaceMutation>;
export type HandleUserStateInWorkspaceMutationResult = Apollo.MutationResult<HandleUserStateInWorkspaceMutation>;
export type HandleUserStateInWorkspaceMutationOptions = Apollo.BaseMutationOptions<HandleUserStateInWorkspaceMutation, HandleUserStateInWorkspaceMutationVariables>;
export const UpdatePermissionsDocument = gql`
    mutation updatePermissions($input: UpdatePermissionsInput!) {
  updatePermissions(input: $input) {
    permissions
  }
}
    `;
export type UpdatePermissionsMutationFn = Apollo.MutationFunction<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;

/**
 * __useUpdatePermissionsMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePermissionsMutation, { data, loading, error }] = useUpdatePermissionsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePermissionsMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>(UpdatePermissionsDocument, options);
      }
export type UpdatePermissionsMutationHookResult = ReturnType<typeof useUpdatePermissionsMutation>;
export type UpdatePermissionsMutationResult = Apollo.MutationResult<UpdatePermissionsMutation>;
export type UpdatePermissionsMutationOptions = Apollo.BaseMutationOptions<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;
export const GetWorkspaceReportDocument = gql`
    query GetWorkspaceReport($workspaceId: ID!, $filter: DialogueStatisticsSummaryFilterInput, $issueFilter: IssueFilterInput) {
  customer(id: $workspaceId) {
    id
    issueTopics(input: $issueFilter) {
      id
      rankScore
      topic
      dialogue {
        id
        title
      }
      basicStats {
        responseCount
        average
      }
    }
    statistics {
      basicStats(input: $filter) {
        responseCount
        average
      }
      responseHistogram(input: $filter) {
        id
        items {
          id
          frequency
          date
        }
      }
      issueHistogram(input: $filter) {
        id
        items {
          id
          frequency
          date
        }
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceReportQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceReportQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      filter: // value for 'filter'
 *      issueFilter: // value for 'issueFilter'
 *   },
 * });
 */
export function useGetWorkspaceReportQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>(GetWorkspaceReportDocument, options);
      }
export function useGetWorkspaceReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>(GetWorkspaceReportDocument, options);
        }
export type GetWorkspaceReportQueryHookResult = ReturnType<typeof useGetWorkspaceReportQuery>;
export type GetWorkspaceReportLazyQueryHookResult = ReturnType<typeof useGetWorkspaceReportLazyQuery>;
export type GetWorkspaceReportQueryResult = Apollo.QueryResult<GetWorkspaceReportQuery, GetWorkspaceReportQueryVariables>;
export function refetchGetWorkspaceReportQuery(variables?: GetWorkspaceReportQueryVariables) {
      return { query: GetWorkspaceReportDocument, variables: variables }
    }
export namespace DeselectTopic {
  export type Variables = DeselectTopicMutationVariables;
  export type Mutation = DeselectTopicMutation;
  export const Document = DeselectTopicDocument;
}

export namespace GetDialogueTopics {
  export type Variables = GetDialogueTopicsQueryVariables;
  export type Query = GetDialogueTopicsQuery;
  export type Dialogue = (NonNullable<GetDialogueTopicsQuery['dialogue']>);
  export type Topic = (NonNullable<(NonNullable<GetDialogueTopicsQuery['dialogue']>)['topic']>);
  export type SubTopics = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueTopicsQuery['dialogue']>)['topic']>)['subTopics']>)[number]>;
  export const Document = GetDialogueTopicsDocument;
}

export namespace GetProblemsPerDialogue {
  export type Variables = GetProblemsPerDialogueQueryVariables;
  export type Query = GetProblemsPerDialogueQuery;
  export type Customer = (NonNullable<GetProblemsPerDialogueQuery['customer']>);
  export type IssueDialogues = NonNullable<(NonNullable<(NonNullable<GetProblemsPerDialogueQuery['customer']>)['issueDialogues']>)[number]>;
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProblemsPerDialogueQuery['customer']>)['issueDialogues']>)[number]>['dialogue']>);
  export type BasicStats = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProblemsPerDialogueQuery['customer']>)['issueDialogues']>)[number]>['basicStats']>);
  export type History = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetProblemsPerDialogueQuery['customer']>)['issueDialogues']>)[number]>['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetProblemsPerDialogueQuery['customer']>)['issueDialogues']>)[number]>['history']>)['items']>)[number]>;
  export const Document = GetProblemsPerDialogueDocument;
}

export namespace GetSessionPaths {
  export type Variables = GetSessionPathsQueryVariables;
  export type Query = GetSessionPathsQuery;
  export type Dialogue = (NonNullable<GetSessionPathsQuery['dialogue']>);
  export type PathedSessionsConnection = (NonNullable<(NonNullable<GetSessionPathsQuery['dialogue']>)['pathedSessionsConnection']>);
  export type PathedSessions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetSessionPathsQuery['dialogue']>)['pathedSessionsConnection']>)['pathedSessions']>)[number]>;
  export const Document = GetSessionPathsDocument;
}

export namespace GetWorkspaceDialogueStatistics {
  export type Variables = GetWorkspaceDialogueStatisticsQueryVariables;
  export type Query = GetWorkspaceDialogueStatisticsQuery;
  export type Customer = (NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>);
  export type DialogueSchedule = (NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['dialogueSchedule']>);
  export type DataPeriodSchedule = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['dialogueSchedule']>)['dataPeriodSchedule']>);
  export type Organization = (NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['organization']>);
  export type Layers = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['organization']>)['layers']>)[number]>;
  export type Statistics = (NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['statistics']>);
  export type WorkspaceStatisticsSummary = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['statistics']>)['workspaceStatisticsSummary']>)[number]>;
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialogueStatisticsQuery['customer']>)['statistics']>)['workspaceStatisticsSummary']>)[number]>['dialogue']>);
  export const Document = GetWorkspaceDialogueStatisticsDocument;
}

export namespace ResetWorkspaceData {
  export type Variables = ResetWorkspaceDataMutationVariables;
  export type Mutation = ResetWorkspaceDataMutation;
  export const Document = ResetWorkspaceDataDocument;
}

export namespace GetWorkspaceSummaryDetails {
  export type Variables = GetWorkspaceSummaryDetailsQueryVariables;
  export type Query = GetWorkspaceSummaryDetailsQuery;
  export type Customer = (NonNullable<GetWorkspaceSummaryDetailsQuery['customer']>);
  export type Statistics = (NonNullable<(NonNullable<GetWorkspaceSummaryDetailsQuery['customer']>)['statistics']>);
  export type Health = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceSummaryDetailsQuery['customer']>)['statistics']>)['health']>);
  export type RankedTopics = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceSummaryDetailsQuery['customer']>)['statistics']>)['rankedTopics']>)[number]>;
  export type BasicStats = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceSummaryDetailsQuery['customer']>)['statistics']>)['rankedTopics']>)[number]>['basicStats']>);
  export const Document = GetWorkspaceSummaryDetailsDocument;
}

export namespace ActionRequestFragment {
  export type Fragment = ActionRequestFragmentFragment;
  export type Issue = (NonNullable<ActionRequestFragmentFragment['issue']>);
  export type Topic = (NonNullable<(NonNullable<ActionRequestFragmentFragment['issue']>)['topic']>);
  export type Session = (NonNullable<ActionRequestFragmentFragment['session']>);
  export type Dialogue = (NonNullable<ActionRequestFragmentFragment['dialogue']>);
  export type Assignee = (NonNullable<ActionRequestFragmentFragment['assignee']>);
}

export namespace DeliveryEventFragment {
  export type Fragment = DeliveryEventFragmentFragment;
}

export namespace DeliveryFragment {
  export type Fragment = DeliveryFragmentFragment;
  export type CampaignVariant = (NonNullable<DeliveryFragmentFragment['campaignVariant']>);
  export type Campaign = (NonNullable<(NonNullable<DeliveryFragmentFragment['campaignVariant']>)['campaign']>);
}

export namespace IssueFragment {
  export type Fragment = IssueFragmentFragment;
  export type Topic = (NonNullable<IssueFragmentFragment['topic']>);
  export type BasicStats = (NonNullable<IssueFragmentFragment['basicStats']>);
  export type ActionRequests = NonNullable<(NonNullable<IssueFragmentFragment['actionRequests']>)[number]>;
  export type Session = (NonNullable<NonNullable<(NonNullable<IssueFragmentFragment['actionRequests']>)[number]>['session']>);
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<IssueFragmentFragment['actionRequests']>)[number]>['dialogue']>);
  export type Assignee = (NonNullable<NonNullable<(NonNullable<IssueFragmentFragment['actionRequests']>)[number]>['assignee']>);
}

export namespace NodeEntryFragment {
  export type Fragment = NodeEntryFragmentFragment;
  export type RelatedNode = (NonNullable<NodeEntryFragmentFragment['relatedNode']>);
  export type Value = (NonNullable<NodeEntryFragmentFragment['value']>);
  export type FormNodeEntry = (NonNullable<(NonNullable<NodeEntryFragmentFragment['value']>)['formNodeEntry']>);
  export type Values = NonNullable<(NonNullable<(NonNullable<(NonNullable<NodeEntryFragmentFragment['value']>)['formNodeEntry']>)['values']>)[number]>;
  export type RelatedField = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<NodeEntryFragmentFragment['value']>)['formNodeEntry']>)['values']>)[number]>['relatedField']>);
}

export namespace SessionFragment {
  export type Fragment = SessionFragmentFragment;
  export type NodeEntries = NonNullable<(NonNullable<SessionFragmentFragment['nodeEntries']>)[number]>;
  export type Delivery = (NonNullable<SessionFragmentFragment['delivery']>);
  export type Dialogue = (NonNullable<SessionFragmentFragment['dialogue']>);
  export type FollowUpAction = (NonNullable<SessionFragmentFragment['followUpAction']>);
  export type Values = NonNullable<(NonNullable<(NonNullable<SessionFragmentFragment['followUpAction']>)['values']>)[number]>;
}

export namespace GetDialogueLayoutDetails {
  export type Variables = GetDialogueLayoutDetailsQueryVariables;
  export type Query = GetDialogueLayoutDetailsQuery;
  export type Customer = (NonNullable<GetDialogueLayoutDetailsQuery['customer']>);
  export type Dialogue = (NonNullable<(NonNullable<GetDialogueLayoutDetailsQuery['customer']>)['dialogue']>);
  export type HealthScore = (NonNullable<(NonNullable<(NonNullable<GetDialogueLayoutDetailsQuery['customer']>)['dialogue']>)['healthScore']>);
  export const Document = GetDialogueLayoutDetailsDocument;
}

export namespace GetWorkspaceLayoutDetails {
  export type Variables = GetWorkspaceLayoutDetailsQueryVariables;
  export type Query = GetWorkspaceLayoutDetailsQuery;
  export type Customer = (NonNullable<GetWorkspaceLayoutDetailsQuery['customer']>);
  export type Statistics = (NonNullable<(NonNullable<GetWorkspaceLayoutDetailsQuery['customer']>)['statistics']>);
  export type Health = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceLayoutDetailsQuery['customer']>)['statistics']>)['health']>);
  export const Document = GetWorkspaceLayoutDetailsDocument;
}

export namespace CreateCta {
  export type Variables = CreateCtaMutationVariables;
  export type Mutation = CreateCtaMutation;
  export type CreateCta = (NonNullable<CreateCtaMutation['createCTA']>);
  export const Document = CreateCtaDocument;
}

export namespace AutomationConnection {
  export type Variables = AutomationConnectionQueryVariables;
  export type Query = AutomationConnectionQuery;
  export type Customer = (NonNullable<AutomationConnectionQuery['customer']>);
  export type DialogueSchedule = (NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['dialogueSchedule']>);
  export type DataPeriodSchedule = (NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['dialogueSchedule']>)['dataPeriodSchedule']>);
  export type EvaluationPeriodSchedule = (NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['dialogueSchedule']>)['evaluationPeriodSchedule']>);
  export type AutomationConnection = (NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>);
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['pageInfo']>);
  export type Automations = NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>;
  export type AutomationScheduled = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationScheduled']>);
  export type ActiveDialogue = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationScheduled']>)['activeDialogue']>);
  export type Actions = NonNullable<(NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationScheduled']>)['actions']>)[number]>;
  export type AutomationTrigger = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationTrigger']>);
  export type _ActiveDialogue = (NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationTrigger']>)['activeDialogue']>);
  export type _Actions = NonNullable<(NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<AutomationConnectionQuery['customer']>)['automationConnection']>)['automations']>)[number]>['automationTrigger']>)['actions']>)[number]>;
  export const Document = AutomationConnectionDocument;
}

export namespace GetCustomerOfUser {
  export type Variables = GetCustomerOfUserQueryVariables;
  export type Query = GetCustomerOfUserQuery;
  export type UserOfCustomer = (NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>);
  export type Customer = (NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['customer']>);
  export type Settings = (NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['customer']>)['settings']>);
  export type ColourSettings = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['customer']>)['settings']>)['colourSettings']>);
  export type Campaigns = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['customer']>)['campaigns']>)[number]>;
  export type Role = (NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['role']>);
  export type User = (NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['user']>);
  export type AssignedDialogues = (NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['user']>)['assignedDialogues']>);
  export type PrivateWorkspaceDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['user']>)['assignedDialogues']>)['privateWorkspaceDialogues']>)[number]>;
  export type _AssignedDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerOfUserQuery['UserOfCustomer']>)['user']>)['assignedDialogues']>)['assignedDialogues']>)[number]>;
  export const Document = GetCustomerOfUserDocument;
}

export namespace Me {
  export type Variables = MeQueryVariables;
  export type Query = MeQuery;
  export type Me = (NonNullable<MeQuery['me']>);
  export type UserCustomers = NonNullable<(NonNullable<(NonNullable<MeQuery['me']>)['userCustomers']>)[number]>;
  export type Customer = (NonNullable<NonNullable<(NonNullable<(NonNullable<MeQuery['me']>)['userCustomers']>)[number]>['customer']>);
  export type Role = (NonNullable<NonNullable<(NonNullable<(NonNullable<MeQuery['me']>)['userCustomers']>)[number]>['role']>);
  export const Document = MeDocument;
}

export namespace AssignUserToActionRequest {
  export type Variables = AssignUserToActionRequestMutationVariables;
  export type Mutation = AssignUserToActionRequestMutation;
  export type AssignUserToActionRequest = (NonNullable<AssignUserToActionRequestMutation['assignUserToActionRequest']>);
  export type Session = (NonNullable<(NonNullable<AssignUserToActionRequestMutation['assignUserToActionRequest']>)['session']>);
  export type Dialogue = (NonNullable<(NonNullable<AssignUserToActionRequestMutation['assignUserToActionRequest']>)['dialogue']>);
  export type Assignee = (NonNullable<(NonNullable<AssignUserToActionRequestMutation['assignUserToActionRequest']>)['assignee']>);
  export const Document = AssignUserToActionRequestDocument;
}

export namespace GetIssue {
  export type Variables = GetIssueQueryVariables;
  export type Query = GetIssueQuery;
  export type Issue = (NonNullable<GetIssueQuery['issue']>);
  export type Topic = (NonNullable<(NonNullable<GetIssueQuery['issue']>)['topic']>);
  export type ActionRequestConnection = (NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>);
  export type ActionRequests = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>)['actionRequests']>)[number]>;
  export type Session = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>)['actionRequests']>)[number]>['session']>);
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>)['actionRequests']>)[number]>['dialogue']>);
  export type Assignee = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>)['actionRequests']>)[number]>['assignee']>);
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<GetIssueQuery['issue']>)['actionRequestConnection']>)['pageInfo']>);
  export const Document = GetIssueDocument;
}

export namespace GetWorkspaceActionRequests {
  export type Variables = GetWorkspaceActionRequestsQueryVariables;
  export type Query = GetWorkspaceActionRequestsQuery;
  export type Customer = (NonNullable<GetWorkspaceActionRequestsQuery['customer']>);
  export type ActionRequestConnection = (NonNullable<(NonNullable<GetWorkspaceActionRequestsQuery['customer']>)['actionRequestConnection']>);
  export type ActionRequests = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceActionRequestsQuery['customer']>)['actionRequestConnection']>)['actionRequests']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceActionRequestsQuery['customer']>)['actionRequestConnection']>)['pageInfo']>);
  export const Document = GetWorkspaceActionRequestsDocument;
}

export namespace GetWorkspaceIssues {
  export type Variables = GetWorkspaceIssuesQueryVariables;
  export type Query = GetWorkspaceIssuesQuery;
  export type Customer = (NonNullable<GetWorkspaceIssuesQuery['customer']>);
  export type IssueConnection = (NonNullable<(NonNullable<GetWorkspaceIssuesQuery['customer']>)['issueConnection']>);
  export type Issues = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceIssuesQuery['customer']>)['issueConnection']>)['issues']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceIssuesQuery['customer']>)['issueConnection']>)['pageInfo']>);
  export const Document = GetWorkspaceIssuesDocument;
}

export namespace SetActionRequestStatus {
  export type Variables = SetActionRequestStatusMutationVariables;
  export type Mutation = SetActionRequestStatusMutation;
  export type SetActionRequestStatus = (NonNullable<SetActionRequestStatusMutation['setActionRequestStatus']>);
  export const Document = SetActionRequestStatusDocument;
}

export namespace UploadUpsellImage {
  export type Variables = UploadUpsellImageMutationVariables;
  export type Mutation = UploadUpsellImageMutation;
  export type UploadUpsellImage = (NonNullable<UploadUpsellImageMutation['uploadUpsellImage']>);
  export const Document = UploadUpsellImageDocument;
}

export namespace CreateAutomation {
  export type Variables = CreateAutomationMutationVariables;
  export type Mutation = CreateAutomationMutation;
  export type CreateAutomation = (NonNullable<CreateAutomationMutation['createAutomation']>);
  export const Document = CreateAutomationDocument;
}

export namespace GetUsersAndRoles {
  export type Variables = GetUsersAndRolesQueryVariables;
  export type Query = GetUsersAndRolesQuery;
  export type Customer = (NonNullable<GetUsersAndRolesQuery['customer']>);
  export type Users = NonNullable<(NonNullable<(NonNullable<GetUsersAndRolesQuery['customer']>)['users']>)[number]>;
  export type Role = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetUsersAndRolesQuery['customer']>)['users']>)[number]>['role']>);
  export type Roles = NonNullable<(NonNullable<(NonNullable<GetUsersAndRolesQuery['customer']>)['roles']>)[number]>;
  export const Document = GetUsersAndRolesDocument;
}

export namespace ConfirmWorkspaceJob {
  export type Variables = ConfirmWorkspaceJobMutationVariables;
  export type Mutation = ConfirmWorkspaceJobMutation;
  export type ConfirmCreateWorkspaceJob = (NonNullable<ConfirmWorkspaceJobMutation['confirmCreateWorkspaceJob']>);
  export const Document = ConfirmWorkspaceJobDocument;
}

export namespace CreateWorkspaceJob {
  export type Variables = CreateWorkspaceJobMutationVariables;
  export type Mutation = CreateWorkspaceJobMutation;
  export type GenerateAutodeck = (NonNullable<CreateWorkspaceJobMutation['generateAutodeck']>);
  export const Document = CreateWorkspaceJobDocument;
}

export namespace GetAutodeckJobs {
  export type Variables = GetAutodeckJobsQueryVariables;
  export type Query = GetAutodeckJobsQuery;
  export type GetAutodeckJobs = (NonNullable<GetAutodeckJobsQuery['getAutodeckJobs']>);
  export type Jobs = NonNullable<(NonNullable<(NonNullable<GetAutodeckJobsQuery['getAutodeckJobs']>)['jobs']>)[number]>;
  export type ProcessLocation = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetAutodeckJobsQuery['getAutodeckJobs']>)['jobs']>)[number]>['processLocation']>);
  export type CustomFields = NonNullable<(NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetAutodeckJobsQuery['getAutodeckJobs']>)['jobs']>)[number]>['processLocation']>)['customFields']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<GetAutodeckJobsQuery['getAutodeckJobs']>)['pageInfo']>);
  export const Document = GetAutodeckJobsDocument;
}

export namespace UploadJobImage {
  export type Variables = UploadJobImageMutationVariables;
  export type Mutation = UploadJobImageMutation;
  export type UploadJobImage = (NonNullable<UploadJobImageMutation['uploadJobImage']>);
  export const Document = UploadJobImageDocument;
}

export namespace RetryAutodeckJob {
  export type Variables = RetryAutodeckJobMutationVariables;
  export type Mutation = RetryAutodeckJobMutation;
  export type RetryAutodeckJob = (NonNullable<RetryAutodeckJobMutation['retryAutodeckJob']>);
  export const Document = RetryAutodeckJobDocument;
}

export namespace GetAdjustedLogo {
  export type Variables = GetAdjustedLogoQueryVariables;
  export type Query = GetAdjustedLogoQuery;
  export type GetAdjustedLogo = (NonNullable<GetAdjustedLogoQuery['getAdjustedLogo']>);
  export const Document = GetAdjustedLogoDocument;
}

export namespace GetJobProcessLocations {
  export type Variables = GetJobProcessLocationsQueryVariables;
  export type Query = GetJobProcessLocationsQuery;
  export type GetJobProcessLocations = (NonNullable<GetJobProcessLocationsQuery['getJobProcessLocations']>);
  export type JobProcessLocations = NonNullable<(NonNullable<(NonNullable<GetJobProcessLocationsQuery['getJobProcessLocations']>)['jobProcessLocations']>)[number]>;
  export type CustomFields = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetJobProcessLocationsQuery['getJobProcessLocations']>)['jobProcessLocations']>)[number]>['customFields']>)[number]>;
  export const Document = GetJobProcessLocationsDocument;
}

export namespace GetPreviewData {
  export type Variables = GetPreviewDataQueryVariables;
  export type Query = GetPreviewDataQuery;
  export type GetPreviewData = (NonNullable<GetPreviewDataQuery['getPreviewData']>);
  export const Document = GetPreviewDataDocument;
}

export namespace RemovePixelRange {
  export type Variables = RemovePixelRangeMutationVariables;
  export type Mutation = RemovePixelRangeMutation;
  export type RemovePixelRange = (NonNullable<RemovePixelRangeMutation['removePixelRange']>);
  export const Document = RemovePixelRangeDocument;
}

export namespace WhitifyImage {
  export type Variables = WhitifyImageMutationVariables;
  export type Mutation = WhitifyImageMutation;
  export type WhitifyImage = (NonNullable<WhitifyImageMutation['whitifyImage']>);
  export const Document = WhitifyImageDocument;
}

export namespace CreateDialogueSchedule {
  export type Variables = CreateDialogueScheduleMutationVariables;
  export type Mutation = CreateDialogueScheduleMutation;
  export type CreateDialogueSchedule = (NonNullable<CreateDialogueScheduleMutation['createDialogueSchedule']>);
  export type DialogueSchedule = (NonNullable<(NonNullable<CreateDialogueScheduleMutation['createDialogueSchedule']>)['dialogueSchedule']>);
  export const Document = CreateDialogueScheduleDocument;
}

export namespace ToggleDialogueSchedule {
  export type Variables = ToggleDialogueScheduleMutationVariables;
  export type Mutation = ToggleDialogueScheduleMutation;
  export type ToggleDialogueSchedule = (NonNullable<ToggleDialogueScheduleMutation['toggleDialogueSchedule']>);
  export const Document = ToggleDialogueScheduleDocument;
}

export namespace DeleteAutomation {
  export type Variables = DeleteAutomationMutationVariables;
  export type Mutation = DeleteAutomationMutation;
  export type DeleteAutomation = (NonNullable<DeleteAutomationMutation['deleteAutomation']>);
  export const Document = DeleteAutomationDocument;
}

export namespace EnableAutomation {
  export type Variables = EnableAutomationMutationVariables;
  export type Mutation = EnableAutomationMutation;
  export type EnableAutomation = (NonNullable<EnableAutomationMutation['enableAutomation']>);
  export const Document = EnableAutomationDocument;
}

export namespace CreateBatchDeliveries {
  export type Variables = CreateBatchDeliveriesMutationVariables;
  export type Mutation = CreateBatchDeliveriesMutation;
  export type CreateBatchDeliveries = (NonNullable<CreateBatchDeliveriesMutation['createBatchDeliveries']>);
  export type FailedDeliveries = NonNullable<(NonNullable<(NonNullable<CreateBatchDeliveriesMutation['createBatchDeliveries']>)['failedDeliveries']>)[number]>;
  export const Document = CreateBatchDeliveriesDocument;
}

export namespace GetDelivery {
  export type Variables = GetDeliveryQueryVariables;
  export type Query = GetDeliveryQuery;
  export type Delivery = (NonNullable<GetDeliveryQuery['delivery']>);
  export type Events = NonNullable<(NonNullable<(NonNullable<GetDeliveryQuery['delivery']>)['events']>)[number]>;
  export const Document = GetDeliveryDocument;
}

export namespace GetWorkspaceCampaign {
  export type Variables = GetWorkspaceCampaignQueryVariables;
  export type Query = GetWorkspaceCampaignQuery;
  export type Customer = (NonNullable<GetWorkspaceCampaignQuery['customer']>);
  export type Campaign = (NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>);
  export type DeliveryConnection = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['deliveryConnection']>);
  export type Deliveries = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['deliveryConnection']>)['deliveries']>)[number]>;
  export type CampaignVariant = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['deliveryConnection']>)['deliveries']>)[number]>['campaignVariant']>);
  export type Events = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['deliveryConnection']>)['deliveries']>)[number]>['events']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['deliveryConnection']>)['pageInfo']>);
  export type Variants = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['variants']>)[number]>;
  export type CustomVariables = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['variants']>)[number]>['customVariables']>)[number]>;
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['variants']>)[number]>['dialogue']>);
  export type Workspace = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignQuery['customer']>)['campaign']>)['variants']>)[number]>['workspace']>);
  export const Document = GetWorkspaceCampaignDocument;
}

export namespace CreateCampaign {
  export type Variables = CreateCampaignMutationVariables;
  export type Mutation = CreateCampaignMutation;
  export type CreateCampaign = (NonNullable<CreateCampaignMutation['createCampaign']>);
  export const Document = CreateCampaignDocument;
}

export namespace GetWorkspaceCampaigns {
  export type Variables = GetWorkspaceCampaignsQueryVariables;
  export type Query = GetWorkspaceCampaignsQuery;
  export type Customer = (NonNullable<GetWorkspaceCampaignsQuery['customer']>);
  export type Campaigns = NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignsQuery['customer']>)['campaigns']>)[number]>;
  export type Variants = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetWorkspaceCampaignsQuery['customer']>)['campaigns']>)[number]>['variants']>)[number]>;
  export const Document = GetWorkspaceCampaignsDocument;
}

export namespace GetWorkspaceDialogues {
  export type Variables = GetWorkspaceDialoguesQueryVariables;
  export type Query = GetWorkspaceDialoguesQuery;
  export type Customer = (NonNullable<GetWorkspaceDialoguesQuery['customer']>);
  export type Dialogues = NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialoguesQuery['customer']>)['dialogues']>)[number]>;
  export type _Customer = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialoguesQuery['customer']>)['dialogues']>)[number]>['customer']>);
  export type Tags = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<GetWorkspaceDialoguesQuery['customer']>)['dialogues']>)[number]>['tags']>)[number]>;
  export const Document = GetWorkspaceDialoguesDocument;
}

export namespace DuplicateQuestion {
  export type Variables = DuplicateQuestionMutationVariables;
  export type Mutation = DuplicateQuestionMutation;
  export type DuplicateQuestion = (NonNullable<DuplicateQuestionMutation['duplicateQuestion']>);
  export const Document = DuplicateQuestionDocument;
}

export namespace GetDialogueLinks {
  export type Variables = GetDialogueLinksQueryVariables;
  export type Query = GetDialogueLinksQuery;
  export type DialogueLinks = (NonNullable<GetDialogueLinksQuery['dialogueLinks']>);
  export type Dialogues = NonNullable<(NonNullable<(NonNullable<GetDialogueLinksQuery['dialogueLinks']>)['dialogues']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<GetDialogueLinksQuery['dialogueLinks']>)['pageInfo']>);
  export const Document = GetDialogueLinksDocument;
}

export namespace AssignUserToDialogue {
  export type Variables = AssignUserToDialogueMutationVariables;
  export type Mutation = AssignUserToDialogueMutation;
  export type AssignUserToDialogue = (NonNullable<AssignUserToDialogueMutation['assignUserToDialogue']>);
  export const Document = AssignUserToDialogueDocument;
}

export namespace DeleteDialogue {
  export type Variables = DeleteDialogueMutationVariables;
  export type Mutation = DeleteDialogueMutation;
  export type DeleteDialogue = (NonNullable<DeleteDialogueMutation['deleteDialogue']>);
  export const Document = DeleteDialogueDocument;
}

export namespace DialogueConnection {
  export type Variables = DialogueConnectionQueryVariables;
  export type Query = DialogueConnectionQuery;
  export type Customer = (NonNullable<DialogueConnectionQuery['customer']>);
  export type DialogueConnection = (NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>);
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>)['pageInfo']>);
  export type Dialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>)['dialogues']>)[number]>;
  export type Assignees = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>)['dialogues']>)[number]>['assignees']>)[number]>;
  export type _Customer = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>)['dialogues']>)[number]>['customer']>);
  export type Tags = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<DialogueConnectionQuery['customer']>)['dialogueConnection']>)['dialogues']>)[number]>['tags']>)[number]>;
  export const Document = DialogueConnectionDocument;
}

export namespace GetUsers {
  export type Variables = GetUsersQueryVariables;
  export type Query = GetUsersQuery;
  export type Customer = (NonNullable<GetUsersQuery['customer']>);
  export type Users = NonNullable<(NonNullable<(NonNullable<GetUsersQuery['customer']>)['users']>)[number]>;
  export type Role = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetUsersQuery['customer']>)['users']>)[number]>['role']>);
  export const Document = GetUsersDocument;
}

export namespace SetDialoguePrivacy {
  export type Variables = SetDialoguePrivacyMutationVariables;
  export type Mutation = SetDialoguePrivacyMutation;
  export type SetDialoguePrivacy = (NonNullable<SetDialoguePrivacyMutation['setDialoguePrivacy']>);
  export const Document = SetDialoguePrivacyDocument;
}

export namespace GetDialogueStatistics {
  export type Variables = GetDialogueStatisticsQueryVariables;
  export type Query = GetDialogueStatisticsQuery;
  export type Customer = (NonNullable<GetDialogueStatisticsQuery['customer']>);
  export type Dialogue = (NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>);
  export type HealthScore = (NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['healthScore']>);
  export type Statistics = (NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['statistics']>);
  export type TopPositivePath = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['statistics']>)['topPositivePath']>)[number]>;
  export type MostPopularPath = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['statistics']>)['mostPopularPath']>);
  export type TopNegativePath = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['statistics']>)['topNegativePath']>)[number]>;
  export type History = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['statistics']>)['history']>)[number]>;
  export type Sessions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['sessions']>)[number]>;
  export type NodeEntries = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['sessions']>)[number]>['nodeEntries']>)[number]>;
  export type RelatedNode = (NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['sessions']>)[number]>['nodeEntries']>)[number]>['relatedNode']>);
  export type Value = (NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['sessions']>)[number]>['nodeEntries']>)[number]>['value']>);
  export type Issues = (NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['issues']>);
  export type _Dialogue = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['issues']>)['dialogue']>);
  export type BasicStats = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['issues']>)['basicStats']>);
  export type _History = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['issues']>)['history']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['issues']>)['history']>)['items']>)[number]>;
  export type DialogueStatisticsSummary = (NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['dialogueStatisticsSummary']>);
  export type __Dialogue = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetDialogueStatisticsQuery['customer']>)['dialogue']>)['dialogueStatisticsSummary']>)['dialogue']>);
  export const Document = GetDialogueStatisticsDocument;
}

export namespace GetAutomation {
  export type Variables = GetAutomationQueryVariables;
  export type Query = GetAutomationQuery;
  export type Automation = (NonNullable<GetAutomationQuery['automation']>);
  export type Workspace = (NonNullable<(NonNullable<GetAutomationQuery['automation']>)['workspace']>);
  export type AutomationScheduled = (NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationScheduled']>);
  export type DayRange = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationScheduled']>)['dayRange']>)[number]>;
  export type ActiveDialogue = (NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationScheduled']>)['activeDialogue']>);
  export type Actions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationScheduled']>)['actions']>)[number]>;
  export type Channels = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationScheduled']>)['actions']>)[number]>['channels']>)[number]>;
  export type AutomationTrigger = (NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>);
  export type _ActiveDialogue = (NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>)['activeDialogue']>);
  export type _Actions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>)['actions']>)[number]>;
  export type Event = (NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>)['event']>);
  export type Dialogue = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>)['event']>)['dialogue']>);
  export type Question = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetAutomationQuery['automation']>)['automationTrigger']>)['event']>)['question']>);
  export const Document = GetAutomationDocument;
}

export namespace UpdateAutomation {
  export type Variables = UpdateAutomationMutationVariables;
  export type Mutation = UpdateAutomationMutation;
  export type UpdateAutomation = (NonNullable<UpdateAutomationMutation['updateAutomation']>);
  export const Document = UpdateAutomationDocument;
}

export namespace GetInteraction {
  export type Variables = GetInteractionQueryVariables;
  export type Query = GetInteractionQuery;
  export type Session = (NonNullable<GetInteractionQuery['session']>);
  export type Delivery = (NonNullable<(NonNullable<GetInteractionQuery['session']>)['delivery']>);
  export type CampaignVariant = (NonNullable<(NonNullable<(NonNullable<GetInteractionQuery['session']>)['delivery']>)['campaignVariant']>);
  export type Campaign = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetInteractionQuery['session']>)['delivery']>)['campaignVariant']>)['campaign']>);
  export type Events = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetInteractionQuery['session']>)['delivery']>)['events']>)[number]>;
  export const Document = GetInteractionDocument;
}

export namespace GetWorkspaceSessions {
  export type Variables = GetWorkspaceSessionsQueryVariables;
  export type Query = GetWorkspaceSessionsQuery;
  export type Customer = (NonNullable<GetWorkspaceSessionsQuery['customer']>);
  export type SessionConnection = (NonNullable<(NonNullable<GetWorkspaceSessionsQuery['customer']>)['sessionConnection']>);
  export type Sessions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceSessionsQuery['customer']>)['sessionConnection']>)['sessions']>)[number]>;
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceSessionsQuery['customer']>)['sessionConnection']>)['pageInfo']>);
  export const Document = GetWorkspaceSessionsDocument;
}

export namespace GenerateWorkspaceFromCsv {
  export type Variables = GenerateWorkspaceFromCsvMutationVariables;
  export type Mutation = GenerateWorkspaceFromCsvMutation;
  export type GenerateWorkspaceFromCsv = (NonNullable<GenerateWorkspaceFromCsvMutation['generateWorkspaceFromCSV']>);
  export const Document = GenerateWorkspaceFromCsvDocument;
}

export namespace RequestInvite {
  export type Variables = RequestInviteMutationVariables;
  export type Mutation = RequestInviteMutation;
  export type RequestInvite = (NonNullable<RequestInviteMutation['requestInvite']>);
  export const Document = RequestInviteDocument;
}

export namespace AssignUserToDialogues {
  export type Variables = AssignUserToDialoguesMutationVariables;
  export type Mutation = AssignUserToDialoguesMutation;
  export type AssignUserToDialogues = (NonNullable<AssignUserToDialoguesMutation['assignUserToDialogues']>);
  export type AssignedDialogues = (NonNullable<(NonNullable<AssignUserToDialoguesMutation['assignUserToDialogues']>)['assignedDialogues']>);
  export type PrivateWorkspaceDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<AssignUserToDialoguesMutation['assignUserToDialogues']>)['assignedDialogues']>)['privateWorkspaceDialogues']>)[number]>;
  export type _AssignedDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<AssignUserToDialoguesMutation['assignUserToDialogues']>)['assignedDialogues']>)['assignedDialogues']>)[number]>;
  export const Document = AssignUserToDialoguesDocument;
}

export namespace DeleteUser {
  export type Variables = DeleteUserMutationVariables;
  export type Mutation = DeleteUserMutation;
  export type DeleteUser = (NonNullable<DeleteUserMutation['deleteUser']>);
  export const Document = DeleteUserDocument;
}

export namespace GetPaginatedUsers {
  export type Variables = GetPaginatedUsersQueryVariables;
  export type Query = GetPaginatedUsersQuery;
  export type Customer = (NonNullable<GetPaginatedUsersQuery['customer']>);
  export type UsersConnection = (NonNullable<(NonNullable<GetPaginatedUsersQuery['customer']>)['usersConnection']>);
  export type UserCustomers = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetPaginatedUsersQuery['customer']>)['usersConnection']>)['userCustomers']>)[number]>;
  export type User = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetPaginatedUsersQuery['customer']>)['usersConnection']>)['userCustomers']>)[number]>['user']>);
  export type Role = (NonNullable<NonNullable<(NonNullable<(NonNullable<(NonNullable<GetPaginatedUsersQuery['customer']>)['usersConnection']>)['userCustomers']>)[number]>['role']>);
  export type PageInfo = (NonNullable<(NonNullable<(NonNullable<GetPaginatedUsersQuery['customer']>)['usersConnection']>)['pageInfo']>);
  export const Document = GetPaginatedUsersDocument;
}

export namespace FindRoleById {
  export type Variables = FindRoleByIdQueryVariables;
  export type Query = FindRoleByIdQuery;
  export type Role = (NonNullable<FindRoleByIdQuery['role']>);
  export const Document = FindRoleByIdDocument;
}

export namespace GetRoles {
  export type Variables = GetRolesQueryVariables;
  export type Query = GetRolesQuery;
  export type Customer = (NonNullable<GetRolesQuery['customer']>);
  export type Roles = NonNullable<(NonNullable<(NonNullable<GetRolesQuery['customer']>)['roles']>)[number]>;
  export const Document = GetRolesDocument;
}

export namespace GetUserCustomerFromCustomer {
  export type Variables = GetUserCustomerFromCustomerQueryVariables;
  export type Query = GetUserCustomerFromCustomerQuery;
  export type Customer = (NonNullable<GetUserCustomerFromCustomerQuery['customer']>);
  export type UserCustomer = (NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>);
  export type User = (NonNullable<(NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>)['user']>);
  export type AssignedDialogues = (NonNullable<(NonNullable<(NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>)['user']>)['assignedDialogues']>);
  export type PrivateWorkspaceDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>)['user']>)['assignedDialogues']>)['privateWorkspaceDialogues']>)[number]>;
  export type _AssignedDialogues = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>)['user']>)['assignedDialogues']>)['assignedDialogues']>)[number]>;
  export type Role = (NonNullable<(NonNullable<(NonNullable<GetUserCustomerFromCustomerQuery['customer']>)['userCustomer']>)['role']>);
  export const Document = GetUserCustomerFromCustomerDocument;
}

export namespace HandleUserStateInWorkspace {
  export type Variables = HandleUserStateInWorkspaceMutationVariables;
  export type Mutation = HandleUserStateInWorkspaceMutation;
  export type HandleUserStateInWorkspace = (NonNullable<HandleUserStateInWorkspaceMutation['handleUserStateInWorkspace']>);
  export type User = (NonNullable<(NonNullable<HandleUserStateInWorkspaceMutation['handleUserStateInWorkspace']>)['user']>);
  export const Document = HandleUserStateInWorkspaceDocument;
}

export namespace UpdatePermissions {
  export type Variables = UpdatePermissionsMutationVariables;
  export type Mutation = UpdatePermissionsMutation;
  export type UpdatePermissions = (NonNullable<UpdatePermissionsMutation['updatePermissions']>);
  export const Document = UpdatePermissionsDocument;
}

export namespace GetWorkspaceReport {
  export type Variables = GetWorkspaceReportQueryVariables;
  export type Query = GetWorkspaceReportQuery;
  export type Customer = (NonNullable<GetWorkspaceReportQuery['customer']>);
  export type IssueTopics = NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['issueTopics']>)[number]>;
  export type Dialogue = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['issueTopics']>)[number]>['dialogue']>);
  export type BasicStats = (NonNullable<NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['issueTopics']>)[number]>['basicStats']>);
  export type Statistics = (NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>);
  export type _BasicStats = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>)['basicStats']>);
  export type ResponseHistogram = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>)['responseHistogram']>);
  export type Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>)['responseHistogram']>)['items']>)[number]>;
  export type IssueHistogram = (NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>)['issueHistogram']>);
  export type _Items = NonNullable<(NonNullable<(NonNullable<(NonNullable<(NonNullable<GetWorkspaceReportQuery['customer']>)['statistics']>)['issueHistogram']>)['items']>)[number]>;
  export const Document = GetWorkspaceReportDocument;
}
