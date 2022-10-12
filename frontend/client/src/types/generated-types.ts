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

export type GetDeliveryQueryVariables = Exact<{
  deliveryId?: Maybe<Scalars['String']>;
}>;


export type GetDeliveryQuery = (
  { __typename?: 'Query' }
  & { delivery?: Maybe<(
    { __typename?: 'DeliveryType' }
    & Pick<DeliveryType, 'id'>
    & { campaignVariant?: Maybe<(
      { __typename?: 'CampaignVariantType' }
      & Pick<CampaignVariantType, 'id'>
      & { dialogue?: Maybe<(
        { __typename?: 'Dialogue' }
        & Pick<Dialogue, 'slug'>
      )>, workspace?: Maybe<(
        { __typename?: 'Customer' }
        & Pick<Customer, 'slug'>
      )> }
    )> }
  )> }
);

export type UpdateDeliveryStatusMutationVariables = Exact<{
  deliveryId: Scalars['String'];
  status: DeliveryStatusEnum;
}>;


export type UpdateDeliveryStatusMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateDeliveryStatus'>
);

export type AppendToInteractionMutationVariables = Exact<{
  input?: Maybe<AppendToInteractionInput>;
}>;


export type AppendToInteractionMutation = (
  { __typename?: 'Mutation' }
  & { appendToInteraction?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  )> }
);

export type CreateSessionMutationVariables = Exact<{
  input?: Maybe<SessionInput>;
}>;


export type CreateSessionMutation = (
  { __typename?: 'Mutation' }
  & { createSession?: Maybe<(
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  )> }
);

export type VerifyActionRequestMutationVariables = Exact<{
  input: VerifyActionRequestInput;
}>;


export type VerifyActionRequestMutation = (
  { __typename?: 'Mutation' }
  & { verifyActionRequest?: Maybe<(
    { __typename?: 'ActionRequest' }
    & Pick<ActionRequest, 'id'>
  )> }
);

export type CustomerFragmentFragment = (
  { __typename?: 'Customer' }
  & Pick<Customer, 'id' | 'name' | 'slug'>
  & { settings?: Maybe<(
    { __typename?: 'CustomerSettings' }
    & Pick<CustomerSettings, 'id' | 'logoUrl' | 'logoOpacity'>
    & { colourSettings?: Maybe<(
      { __typename?: 'ColourSettings' }
      & Pick<ColourSettings, 'id' | 'primary' | 'primaryAlt' | 'secondary'>
    )> }
  )>, dialogues?: Maybe<Array<Maybe<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id' | 'slug' | 'description' | 'title' | 'publicTitle'>
  )>>> }
);

export type EdgeFragmentFragment = (
  { __typename?: 'Edge' }
  & Pick<Edge, 'id'>
  & { conditions?: Maybe<Array<(
    { __typename?: 'EdgeCondition' }
    & Pick<EdgeCondition, 'id' | 'conditionType' | 'matchValue' | 'renderMin' | 'renderMax'>
  )>>, parentNode?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id' | 'title'>
  )>, childNode?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id' | 'title' | 'isRoot' | 'type'>
    & { children?: Maybe<Array<(
      { __typename?: 'Edge' }
      & Pick<Edge, 'id'>
    )>> }
  )> }
);

export type GetCustomerQueryVariables = Exact<{
  slug: Scalars['String'];
  dialogueSlug: Scalars['String'];
}>;


export type GetCustomerQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id' | 'name' | 'slug'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title' | 'slug' | 'publicTitle' | 'language' | 'creationDate' | 'updatedAt' | 'customerId'>
      & { postLeafNode?: Maybe<(
        { __typename?: 'DialogueFinisherObjectType' }
        & Pick<DialogueFinisherObjectType, 'header' | 'subtext'>
      )>, leafs?: Maybe<Array<(
        { __typename?: 'QuestionNode' }
        & QuestionFragmentFragment
      )>>, rootQuestion?: Maybe<(
        { __typename?: 'QuestionNode' }
        & QuestionFragmentFragment
      )>, questions?: Maybe<Array<(
        { __typename?: 'QuestionNode' }
        & QuestionFragmentFragment
      )>>, edges?: Maybe<Array<Maybe<(
        { __typename?: 'Edge' }
        & EdgeFragmentFragment
      )>>> }
    )>, settings?: Maybe<(
      { __typename?: 'CustomerSettings' }
      & Pick<CustomerSettings, 'id' | 'logoUrl' | 'logoOpacity'>
      & { colourSettings?: Maybe<(
        { __typename?: 'ColourSettings' }
        & Pick<ColourSettings, 'id' | 'primary' | 'primaryAlt' | 'secondary'>
      )> }
    )> }
  )> }
);

export type QuestionFragmentFragment = (
  { __typename?: 'QuestionNode' }
  & Pick<QuestionNode, 'id' | 'title' | 'isRoot' | 'isLeaf' | 'type' | 'extraContent'>
  & { children?: Maybe<Array<(
    { __typename?: 'Edge' }
    & { parentNode?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )>, childNode?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )> }
    & EdgeFragmentFragment
  )>>, overrideLeaf?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id' | 'title' | 'type'>
  )>, share?: Maybe<(
    { __typename?: 'ShareNodeType' }
    & Pick<ShareNodeType, 'id' | 'title' | 'url' | 'tooltip'>
  )>, form?: Maybe<(
    { __typename?: 'FormNodeType' }
    & Pick<FormNodeType, 'id' | 'helperText'>
    & { preForm?: Maybe<(
      { __typename?: 'PreFormNodeType' }
      & Pick<PreFormNodeType, 'id' | 'header' | 'helper' | 'nextText' | 'finishText'>
    )>, steps?: Maybe<Array<(
      { __typename?: 'FormNodeStep' }
      & Pick<FormNodeStep, 'id' | 'header' | 'helper' | 'subHelper' | 'position' | 'type'>
      & { fields?: Maybe<Array<(
        { __typename?: 'FormNodeField' }
        & Pick<FormNodeField, 'id' | 'label' | 'type' | 'placeholder' | 'isRequired' | 'position'>
        & { contacts?: Maybe<Array<Maybe<(
          { __typename?: 'UserType' }
          & Pick<UserType, 'id' | 'email' | 'firstName' | 'lastName'>
        )>>> }
      )>> }
    )>>, fields?: Maybe<Array<(
      { __typename?: 'FormNodeField' }
      & Pick<FormNodeField, 'id' | 'label' | 'type' | 'placeholder' | 'isRequired' | 'position'>
      & { contacts?: Maybe<Array<Maybe<(
        { __typename?: 'UserType' }
        & Pick<UserType, 'id' | 'email' | 'firstName' | 'lastName'>
      )>>> }
    )>> }
  )>, links: Array<(
    { __typename?: 'LinkType' }
    & Pick<LinkType, 'url' | 'type' | 'title' | 'iconUrl' | 'backgroundColor' | 'buttonText' | 'header' | 'subHeader' | 'imageUrl'>
  )>, sliderNode?: Maybe<(
    { __typename?: 'SliderNodeType' }
    & Pick<SliderNodeType, 'id' | 'happyText' | 'unhappyText'>
    & { markers?: Maybe<Array<(
      { __typename?: 'SliderNodeMarkerType' }
      & Pick<SliderNodeMarkerType, 'id' | 'label' | 'subLabel'>
      & { range?: Maybe<(
        { __typename?: 'SliderNodeRangeType' }
        & Pick<SliderNodeRangeType, 'id' | 'start' | 'end'>
      )> }
    )>> }
  )>, options?: Maybe<Array<Maybe<(
    { __typename?: 'QuestionOption' }
    & Pick<QuestionOption, 'id' | 'value' | 'publicValue'>
    & { overrideLeaf?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )> }
  )>>> }
);

export const CustomerFragmentFragmentDoc = gql`
    fragment CustomerFragment on Customer {
  id
  name
  slug
  settings {
    id
    logoUrl
    logoOpacity
    colourSettings {
      id
      primary
      primaryAlt
      secondary
    }
  }
  dialogues {
    id
    slug
    description
    title
    publicTitle
  }
}
    `;
export const EdgeFragmentFragmentDoc = gql`
    fragment EdgeFragment on Edge {
  id
  conditions {
    id
    conditionType
    matchValue
    renderMin
    renderMax
  }
  parentNode {
    id
    title
  }
  childNode {
    id
    title
    isRoot
    children {
      id
    }
    type
  }
}
    `;
export const QuestionFragmentFragmentDoc = gql`
    fragment QuestionFragment on QuestionNode {
  id
  title
  isRoot
  isLeaf
  type
  extraContent
  children {
    ...EdgeFragment
    parentNode {
      id
    }
    childNode {
      id
    }
  }
  overrideLeaf {
    id
    title
    type
  }
  share {
    id
    title
    url
    tooltip
  }
  form {
    id
    helperText
    preForm {
      id
      header
      helper
      nextText
      finishText
    }
    steps {
      id
      header
      helper
      subHelper
      position
      type
      fields {
        id
        label
        type
        placeholder
        isRequired
        position
        contacts {
          id
          email
          firstName
          lastName
        }
      }
    }
    fields {
      id
      label
      type
      placeholder
      isRequired
      position
      contacts {
        id
        email
        firstName
        lastName
      }
    }
  }
  links {
    url
    type
    title
    iconUrl
    backgroundColor
    buttonText
    header
    subHeader
    imageUrl
  }
  sliderNode {
    id
    happyText
    unhappyText
    markers {
      id
      label
      subLabel
      range {
        id
        start
        end
      }
    }
  }
  options {
    id
    value
    publicValue
    overrideLeaf {
      id
    }
  }
}
    ${EdgeFragmentFragmentDoc}`;
export const GetDeliveryDocument = gql`
    query GetDelivery($deliveryId: String) {
  delivery(deliveryId: $deliveryId) {
    id
    campaignVariant {
      id
      dialogue {
        slug
      }
      workspace {
        slug
      }
    }
  }
}
    `;

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
export const UpdateDeliveryStatusDocument = gql`
    mutation UpdateDeliveryStatus($deliveryId: String!, $status: DeliveryStatusEnum!) {
  updateDeliveryStatus(deliveryId: $deliveryId, status: $status)
}
    `;
export type UpdateDeliveryStatusMutationFn = Apollo.MutationFunction<UpdateDeliveryStatusMutation, UpdateDeliveryStatusMutationVariables>;

/**
 * __useUpdateDeliveryStatusMutation__
 *
 * To run a mutation, you first call `useUpdateDeliveryStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDeliveryStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDeliveryStatusMutation, { data, loading, error }] = useUpdateDeliveryStatusMutation({
 *   variables: {
 *      deliveryId: // value for 'deliveryId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdateDeliveryStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDeliveryStatusMutation, UpdateDeliveryStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDeliveryStatusMutation, UpdateDeliveryStatusMutationVariables>(UpdateDeliveryStatusDocument, options);
      }
export type UpdateDeliveryStatusMutationHookResult = ReturnType<typeof useUpdateDeliveryStatusMutation>;
export type UpdateDeliveryStatusMutationResult = Apollo.MutationResult<UpdateDeliveryStatusMutation>;
export type UpdateDeliveryStatusMutationOptions = Apollo.BaseMutationOptions<UpdateDeliveryStatusMutation, UpdateDeliveryStatusMutationVariables>;
export const AppendToInteractionDocument = gql`
    mutation appendToInteraction($input: AppendToInteractionInput) {
  appendToInteraction(input: $input) {
    id
  }
}
    `;
export type AppendToInteractionMutationFn = Apollo.MutationFunction<AppendToInteractionMutation, AppendToInteractionMutationVariables>;

/**
 * __useAppendToInteractionMutation__
 *
 * To run a mutation, you first call `useAppendToInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppendToInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appendToInteractionMutation, { data, loading, error }] = useAppendToInteractionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAppendToInteractionMutation(baseOptions?: Apollo.MutationHookOptions<AppendToInteractionMutation, AppendToInteractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AppendToInteractionMutation, AppendToInteractionMutationVariables>(AppendToInteractionDocument, options);
      }
export type AppendToInteractionMutationHookResult = ReturnType<typeof useAppendToInteractionMutation>;
export type AppendToInteractionMutationResult = Apollo.MutationResult<AppendToInteractionMutation>;
export type AppendToInteractionMutationOptions = Apollo.BaseMutationOptions<AppendToInteractionMutation, AppendToInteractionMutationVariables>;
export const CreateSessionDocument = gql`
    mutation createSession($input: SessionInput) {
  createSession(input: $input) {
    id
  }
}
    `;
export type CreateSessionMutationFn = Apollo.MutationFunction<CreateSessionMutation, CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSessionMutation, CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSessionMutation, CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<CreateSessionMutation, CreateSessionMutationVariables>;
export const VerifyActionRequestDocument = gql`
    mutation VerifyActionRequest($input: VerifyActionRequestInput!) {
  verifyActionRequest(input: $input) {
    id
  }
}
    `;
export type VerifyActionRequestMutationFn = Apollo.MutationFunction<VerifyActionRequestMutation, VerifyActionRequestMutationVariables>;

/**
 * __useVerifyActionRequestMutation__
 *
 * To run a mutation, you first call `useVerifyActionRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyActionRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyActionRequestMutation, { data, loading, error }] = useVerifyActionRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyActionRequestMutation(baseOptions?: Apollo.MutationHookOptions<VerifyActionRequestMutation, VerifyActionRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyActionRequestMutation, VerifyActionRequestMutationVariables>(VerifyActionRequestDocument, options);
      }
export type VerifyActionRequestMutationHookResult = ReturnType<typeof useVerifyActionRequestMutation>;
export type VerifyActionRequestMutationResult = Apollo.MutationResult<VerifyActionRequestMutation>;
export type VerifyActionRequestMutationOptions = Apollo.BaseMutationOptions<VerifyActionRequestMutation, VerifyActionRequestMutationVariables>;
export const GetCustomerDocument = gql`
    query GetCustomer($slug: String!, $dialogueSlug: String!) {
  customer(slug: $slug) {
    id
    name
    slug
    dialogue(where: {slug: $dialogueSlug}) {
      id
      title
      slug
      publicTitle
      language
      creationDate
      updatedAt
      postLeafNode {
        header
        subtext
      }
      leafs {
        ...QuestionFragment
      }
      customerId
      rootQuestion {
        ...QuestionFragment
      }
      questions {
        ...QuestionFragment
      }
      edges {
        ...EdgeFragment
      }
    }
    settings {
      id
      logoUrl
      logoOpacity
      colourSettings {
        id
        primary
        primaryAlt
        secondary
      }
    }
  }
}
    ${QuestionFragmentFragmentDoc}
${EdgeFragmentFragmentDoc}`;

/**
 * __useGetCustomerQuery__
 *
 * To run a query within a React component, call `useGetCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *      dialogueSlug: // value for 'dialogueSlug'
 *   },
 * });
 */
export function useGetCustomerQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerQuery, GetCustomerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerQuery, GetCustomerQueryVariables>(GetCustomerDocument, options);
      }
export function useGetCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerQuery, GetCustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerQuery, GetCustomerQueryVariables>(GetCustomerDocument, options);
        }
export type GetCustomerQueryHookResult = ReturnType<typeof useGetCustomerQuery>;
export type GetCustomerLazyQueryHookResult = ReturnType<typeof useGetCustomerLazyQuery>;
export type GetCustomerQueryResult = Apollo.QueryResult<GetCustomerQuery, GetCustomerQueryVariables>;
export function refetchGetCustomerQuery(variables?: GetCustomerQueryVariables) {
      return { query: GetCustomerDocument, variables: variables }
    }
export namespace GetDelivery {
  export type Variables = GetDeliveryQueryVariables;
  export type Query = GetDeliveryQuery;
  export type Delivery = (NonNullable<GetDeliveryQuery['delivery']>);
  export type CampaignVariant = (NonNullable<(NonNullable<GetDeliveryQuery['delivery']>)['campaignVariant']>);
  export type Dialogue = (NonNullable<(NonNullable<(NonNullable<GetDeliveryQuery['delivery']>)['campaignVariant']>)['dialogue']>);
  export type Workspace = (NonNullable<(NonNullable<(NonNullable<GetDeliveryQuery['delivery']>)['campaignVariant']>)['workspace']>);
  export const Document = GetDeliveryDocument;
}

export namespace UpdateDeliveryStatus {
  export type Variables = UpdateDeliveryStatusMutationVariables;
  export type Mutation = UpdateDeliveryStatusMutation;
  export const Document = UpdateDeliveryStatusDocument;
}

export namespace AppendToInteraction {
  export type Variables = AppendToInteractionMutationVariables;
  export type Mutation = AppendToInteractionMutation;
  export type AppendToInteraction = (NonNullable<AppendToInteractionMutation['appendToInteraction']>);
  export const Document = AppendToInteractionDocument;
}

export namespace CreateSession {
  export type Variables = CreateSessionMutationVariables;
  export type Mutation = CreateSessionMutation;
  export type CreateSession = (NonNullable<CreateSessionMutation['createSession']>);
  export const Document = CreateSessionDocument;
}

export namespace VerifyActionRequest {
  export type Variables = VerifyActionRequestMutationVariables;
  export type Mutation = VerifyActionRequestMutation;
  export type VerifyActionRequest = (NonNullable<VerifyActionRequestMutation['verifyActionRequest']>);
  export const Document = VerifyActionRequestDocument;
}

export namespace CustomerFragment {
  export type Fragment = CustomerFragmentFragment;
  export type Settings = (NonNullable<CustomerFragmentFragment['settings']>);
  export type ColourSettings = (NonNullable<(NonNullable<CustomerFragmentFragment['settings']>)['colourSettings']>);
  export type Dialogues = NonNullable<(NonNullable<CustomerFragmentFragment['dialogues']>)[number]>;
}

export namespace EdgeFragment {
  export type Fragment = EdgeFragmentFragment;
  export type Conditions = NonNullable<(NonNullable<EdgeFragmentFragment['conditions']>)[number]>;
  export type ParentNode = (NonNullable<EdgeFragmentFragment['parentNode']>);
  export type ChildNode = (NonNullable<EdgeFragmentFragment['childNode']>);
  export type Children = NonNullable<(NonNullable<(NonNullable<EdgeFragmentFragment['childNode']>)['children']>)[number]>;
}

export namespace GetCustomer {
  export type Variables = GetCustomerQueryVariables;
  export type Query = GetCustomerQuery;
  export type Customer = (NonNullable<GetCustomerQuery['customer']>);
  export type Dialogue = (NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>);
  export type PostLeafNode = (NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>)['postLeafNode']>);
  export type Leafs = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>)['leafs']>)[number]>;
  export type RootQuestion = (NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>)['rootQuestion']>);
  export type Questions = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>)['questions']>)[number]>;
  export type Edges = NonNullable<(NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['dialogue']>)['edges']>)[number]>;
  export type Settings = (NonNullable<(NonNullable<GetCustomerQuery['customer']>)['settings']>);
  export type ColourSettings = (NonNullable<(NonNullable<(NonNullable<GetCustomerQuery['customer']>)['settings']>)['colourSettings']>);
  export const Document = GetCustomerDocument;
}

export namespace QuestionFragment {
  export type Fragment = QuestionFragmentFragment;
  export type Children = NonNullable<(NonNullable<QuestionFragmentFragment['children']>)[number]>;
  export type ParentNode = (NonNullable<NonNullable<(NonNullable<QuestionFragmentFragment['children']>)[number]>['parentNode']>);
  export type ChildNode = (NonNullable<NonNullable<(NonNullable<QuestionFragmentFragment['children']>)[number]>['childNode']>);
  export type OverrideLeaf = (NonNullable<QuestionFragmentFragment['overrideLeaf']>);
  export type Share = (NonNullable<QuestionFragmentFragment['share']>);
  export type Form = (NonNullable<QuestionFragmentFragment['form']>);
  export type PreForm = (NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['preForm']>);
  export type Steps = NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['steps']>)[number]>;
  export type Fields = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['steps']>)[number]>['fields']>)[number]>;
  export type Contacts = NonNullable<(NonNullable<NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['steps']>)[number]>['fields']>)[number]>['contacts']>)[number]>;
  export type _Fields = NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['fields']>)[number]>;
  export type _Contacts = NonNullable<(NonNullable<NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['form']>)['fields']>)[number]>['contacts']>)[number]>;
  export type Links = NonNullable<(NonNullable<QuestionFragmentFragment['links']>)[number]>;
  export type SliderNode = (NonNullable<QuestionFragmentFragment['sliderNode']>);
  export type Markers = NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['sliderNode']>)['markers']>)[number]>;
  export type Range = (NonNullable<NonNullable<(NonNullable<(NonNullable<QuestionFragmentFragment['sliderNode']>)['markers']>)[number]>['range']>);
  export type Options = NonNullable<(NonNullable<QuestionFragmentFragment['options']>)[number]>;
  export type _OverrideLeaf = (NonNullable<NonNullable<(NonNullable<QuestionFragmentFragment['options']>)[number]>['overrideLeaf']>);
}
