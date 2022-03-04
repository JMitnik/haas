import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type AdjustedImageInput = {
  bucket?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  reset?: Maybe<Scalars['Boolean']>;
};

/** Append new data to an uploaded session */
export type AppendToInteractionInput = {
  data?: Maybe<NodeEntryDataInput>;
  edgeId?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
  sessionId?: Maybe<Scalars['ID']>;
};

export type AutodeckConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'AutodeckConnectionType';
  cursor?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  jobs: Array<CreateWorkspaceJobType>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
};

export type AwsImageType = {
  __typename?: 'AWSImageType';
  encoding?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** Campaign */
export type CampaignType = {
  __typename?: 'CampaignType';
  deliveryConnection?: Maybe<DeliveryConnectionType>;
  id: Scalars['ID'];
  label: Scalars['String'];
  variants?: Maybe<Array<CampaignVariantType>>;
};


/** Campaign */
export type CampaignTypeDeliveryConnectionArgs = {
  filter?: Maybe<DeliveryConnectionFilterInput>;
};

export type CampaignVariantCustomVariableType = {
  __typename?: 'CampaignVariantCustomVariableType';
  id: Scalars['ID'];
  key: Scalars['String'];
};

export enum CampaignVariantEnum {
  Email = 'EMAIL',
  Queue = 'QUEUE',
  Sms = 'SMS'
}

/** Variant of campaign */
export type CampaignVariantType = {
  __typename?: 'CampaignVariantType';
  body: Scalars['String'];
  campaign?: Maybe<CampaignType>;
  customVariables?: Maybe<Array<CampaignVariantCustomVariableType>>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
  dialogue?: Maybe<Dialogue>;
  from?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  label: Scalars['String'];
  type: CampaignVariantEnum;
  weight: Scalars['Int'];
  workspace?: Maybe<Customer>;
};

/** Input type for a choice node */
export type ChoiceNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

/** Input type of a SessionEvent for Choices. */
export type ChoiceValueInput = {
  choiceId?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export enum CloudReferenceType {
  Aws = 'AWS',
  Azure = 'Azure',
  Gcp = 'GCP',
  Ibm = 'IBM'
}

export type ColourSettings = {
  __typename?: 'ColourSettings';
  id: Scalars['ID'];
  primary: Scalars['String'];
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
};

/** Interface all pagination-based models should implement */
export type ConnectionInterface = {
  pageInfo: PaginationPageInfo;
  totalPages?: Maybe<Scalars['Int']>;
};

export type CreateBatchDeliveriesInputType = {
  batchScheduledAt?: Maybe<Scalars['String']>;
  campaignId?: Maybe<Scalars['ID']>;
  uploadedCsv?: Maybe<Scalars['Upload']>;
  workspaceId?: Maybe<Scalars['String']>;
};

export type CreateBatchDeliveriesOutputType = {
  __typename?: 'CreateBatchDeliveriesOutputType';
  failedDeliveries: Array<FailedDeliveryModel>;
  nrDeliveries: Scalars['Int'];
};

export type CreateCampaignCustomVariable = {
  key?: Maybe<Scalars['String']>;
};

export type CreateCampaignInputType = {
  label?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<CreateCampaignVariantInputType>>;
  workspaceId: Scalars['ID'];
};

export type CreateCampaignVariantInputType = {
  body?: Maybe<Scalars['String']>;
  customVariables?: Maybe<Array<CreateCampaignCustomVariable>>;
  dialogueId: Scalars['ID'];
  from?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  type: CampaignVariantEnum;
  weight?: Maybe<Scalars['Float']>;
  workspaceId: Scalars['ID'];
};

export type CreateCtaInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  form?: Maybe<FormNodeInputType>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CreateDialogueInputType = {
  contentType?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  isSeed?: Maybe<Scalars['Boolean']>;
  language?: Maybe<LanguageEnumType>;
  publicTitle?: Maybe<Scalars['String']>;
  tags?: Maybe<TagsInputObjectType>;
  templateDialogueId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CreateJobProcessLocationInput = {
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<JobProcessLocationType>;
};

export type CreateQuestionNodeInputType = {
  customerId?: Maybe<Scalars['ID']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
  extraContent?: Maybe<Scalars['String']>;
  happyText?: Maybe<Scalars['String']>;
  optionEntries?: Maybe<OptionsInputType>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  parentQuestionId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  unhappyText?: Maybe<Scalars['String']>;
};

export type CreateTriggerInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
};

/** Creates a workspace */
export type CreateWorkspaceInput = {
  isSeed?: Maybe<Scalars['Boolean']>;
  logo?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  primaryColour: Scalars['String'];
  slug: Scalars['String'];
  willGenerateFakeData?: Maybe<Scalars['Boolean']>;
};

export type CreateWorkspaceJobType = {
  __typename?: 'CreateWorkspaceJobType';
  createdAt: Scalars['String'];
  errorMessage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  processLocation: JobProcessLocation;
  referenceId?: Maybe<Scalars['String']>;
  referenceType: CloudReferenceType;
  requiresColorExtraction: Scalars['Boolean'];
  requiresRembg: Scalars['Boolean'];
  requiresScreenshot: Scalars['Boolean'];
  resourcesUrl?: Maybe<Scalars['String']>;
  status: JobStatusType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type CtaLinkInputObjectType = {
  backgroundColor?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  subHeader?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<LinkTypeEnumType>;
  url?: Maybe<Scalars['String']>;
};

export type CtaLinksInputType = {
  linkTypes?: Maybe<Array<CtaLinkInputObjectType>>;
};

export type CtaShareInputObjectType = {
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  campaign?: Maybe<CampaignType>;
  campaigns: Array<CampaignType>;
  dialogue?: Maybe<Dialogue>;
  dialogues?: Maybe<Array<Dialogue>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  roles?: Maybe<Array<RoleType>>;
  settings?: Maybe<CustomerSettings>;
  slug: Scalars['String'];
  userCustomer?: Maybe<UserCustomer>;
  users?: Maybe<Array<UserType>>;
  usersConnection?: Maybe<UserConnection>;
};


export type CustomerCampaignArgs = {
  campaignId?: Maybe<Scalars['String']>;
};


export type CustomerDialogueArgs = {
  where?: Maybe<DialogueWhereUniqueInput>;
};


export type CustomerDialoguesArgs = {
  filter?: Maybe<DialogueFilterInputType>;
};


export type CustomerUserCustomerArgs = {
  userId?: Maybe<Scalars['String']>;
};


export type CustomerUsersConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<UserConnectionFilterInput>;
};

export type CustomerSettings = {
  __typename?: 'CustomerSettings';
  colourSettings?: Maybe<ColourSettings>;
  fontSettings?: Maybe<FontSettings>;
  id: Scalars['ID'];
  logoOpacity?: Maybe<Scalars['Int']>;
  logoUrl?: Maybe<Scalars['String']>;
};

export type CustomerWhereUniqueInput = {
  id: Scalars['ID'];
};

export type CustomFieldInputType = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CustomFieldType = {
  __typename?: 'CustomFieldType';
  id: Scalars['String'];
  jobProcessLocationId: Scalars['String'];
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};


export type DeleteDialogueInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};

/** Delete Node Input type */
export type DeleteNodeInputType = {
  customerId?: Maybe<Scalars['ID']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type DeleteUserInput = {
  customerId?: Maybe<Scalars['ID']>;
  userId?: Maybe<Scalars['ID']>;
};

export type DeleteUserOutput = {
  __typename?: 'DeleteUserOutput';
  deletedUser: Scalars['Boolean'];
};

export type DeliveryConnectionFilterInput = {
  campaignVariantId?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DeliveryConnectionOrderByInput>;
  perPage?: Maybe<Scalars['Int']>;
  recipientEmail?: Maybe<Scalars['String']>;
  recipientFirstName?: Maybe<Scalars['String']>;
  recipientLastName?: Maybe<Scalars['String']>;
  recipientPhoneNumber?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  status?: Maybe<DeliveryStatusEnum>;
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
  deliveries: Array<DeliveryType>;
  pageInfo: PaginationPageInfo;
  totalPages?: Maybe<Scalars['Int']>;
};

export type DeliveryEventType = {
  __typename?: 'DeliveryEventType';
  createdAt: Scalars['Date'];
  failureMessage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  status: DeliveryStatusEnum;
};

export enum DeliveryStatusEnum {
  Delivered = 'DELIVERED',
  Deployed = 'DEPLOYED',
  Failed = 'FAILED',
  Finished = 'FINISHED',
  Opened = 'OPENED',
  Scheduled = 'SCHEDULED',
  Sent = 'SENT'
}

/** Delivery */
export type DeliveryType = {
  __typename?: 'DeliveryType';
  campaignVariant?: Maybe<CampaignVariantType>;
  createdAt?: Maybe<Scalars['Date']>;
  currentStatus: DeliveryStatusEnum;
  deliveryRecipientEmail?: Maybe<Scalars['String']>;
  deliveryRecipientFirstName?: Maybe<Scalars['String']>;
  deliveryRecipientLastName?: Maybe<Scalars['String']>;
  deliveryRecipientPhone?: Maybe<Scalars['String']>;
  events?: Maybe<Array<DeliveryEventType>>;
  id: Scalars['ID'];
  scheduledAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

/** Interface all pagination-based models should implement */
export type DeprecatedConnectionInterface = {
  cursor?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
};

/** Information with regards to current page, and total number of pages */
export type DeprecatedPaginationPageInfo = {
  __typename?: 'DeprecatedPaginationPageInfo';
  cursor?: Maybe<Scalars['String']>;
  nrPages: Scalars['Int'];
  pageIndex: Scalars['Int'];
};

export type Dialogue = {
  __typename?: 'Dialogue';
  averageScore: Scalars['Float'];
  campaignVariants: Array<CampaignVariantType>;
  creationDate?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  customerId: Scalars['String'];
  description: Scalars['String'];
  edges: Array<Edge>;
  id: Scalars['ID'];
  isWithoutGenData: Scalars['Boolean'];
  language: LanguageEnumType;
  leafs: Array<QuestionNode>;
  postLeafNode?: Maybe<DialogueFinisherObjectType>;
  publicTitle?: Maybe<Scalars['String']>;
  questions: Array<QuestionNode>;
  rootQuestion: QuestionNode;
  sessionConnection?: Maybe<SessionConnection>;
  sessions: Array<Session>;
  slug: Scalars['String'];
  statistics?: Maybe<DialogueStatistics>;
  tags?: Maybe<Array<Tag>>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  wasGeneratedWithGenData: Scalars['Boolean'];
};


export type DialogueAverageScoreArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueLeafsArgs = {
  searchTerm?: Maybe<Scalars['String']>;
};


export type DialogueSessionConnectionArgs = {
  filter?: Maybe<SessionConnectionFilterInput>;
};


export type DialogueSessionsArgs = {
  take?: Maybe<Scalars['Int']>;
};


export type DialogueStatisticsArgs = {
  input?: Maybe<DialogueFilterInputType>;
};

export type DialogueFilterInputType = {
  endDate?: Maybe<Scalars['String']>;
  searchTerm?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

export type DialogueFinisherObjectType = {
  __typename?: 'DialogueFinisherObjectType';
  header: Scalars['String'];
  id: Scalars['ID'];
  subtext: Scalars['String'];
};

export type DialogueStatistics = {
  __typename?: 'DialogueStatistics';
  history?: Maybe<Array<LineChartDataType>>;
  mostPopularPath?: Maybe<TopPathType>;
  nrInteractions: Scalars['Int'];
  topNegativePath?: Maybe<Array<TopPathType>>;
  topPositivePath?: Maybe<Array<TopPathType>>;
};

export type DialogueWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};

export type Edge = {
  __typename?: 'Edge';
  childNode?: Maybe<QuestionNode>;
  childNodeId: Scalars['String'];
  conditions?: Maybe<Array<EdgeCondition>>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  parentNode?: Maybe<QuestionNode>;
  parentNodeId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type EdgeCondition = {
  __typename?: 'EdgeCondition';
  conditionType: Scalars['String'];
  edgeId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  matchValue?: Maybe<Scalars['String']>;
  renderMax?: Maybe<Scalars['Int']>;
  renderMin?: Maybe<Scalars['Int']>;
};

export type EdgeConditionInputType = {
  conditionType?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
  renderMax?: Maybe<Scalars['Int']>;
  renderMin?: Maybe<Scalars['Int']>;
};

export type EditUserInput = {
  customerId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  roleId?: Maybe<Scalars['String']>;
};

/** Edit a workspace */
export type EditWorkspaceInput = {
  customerSlug: Scalars['String'];
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  primaryColour: Scalars['String'];
  slug: Scalars['String'];
};

export type FailedDeliveryModel = {
  __typename?: 'FailedDeliveryModel';
  error: Scalars['String'];
  record: Scalars['String'];
};

export type FindRoleInput = {
  roleId?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type FontSettings = {
  __typename?: 'FontSettings';
  id: Scalars['ID'];
};

/** FormNodeEntryInput */
export type FormNodeEntryFieldInput = {
  email?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
  phoneNumber?: Maybe<Scalars['String']>;
  relatedFieldId?: Maybe<Scalars['ID']>;
  shortText?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** FormNodeEntryInput */
export type FormNodeEntryInput = {
  values?: Maybe<Array<FormNodeEntryFieldInput>>;
};

export type FormNodeEntryType = {
  __typename?: 'FormNodeEntryType';
  id: Scalars['Int'];
  values: Array<FormNodeEntryValueType>;
};

export type FormNodeEntryValueType = {
  __typename?: 'FormNodeEntryValueType';
  email?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
  phoneNumber?: Maybe<Scalars['String']>;
  relatedField: FormNodeField;
  shortText?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type FormNodeField = {
  __typename?: 'FormNodeField';
  id: Scalars['ID'];
  isRequired: Scalars['Boolean'];
  label: Scalars['String'];
  placeholder?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  type: FormNodeFieldTypeEnum;
};

export type FormNodeFieldInput = {
  id?: Maybe<Scalars['ID']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  label?: Maybe<Scalars['String']>;
  placeholder?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  type?: Maybe<FormNodeFieldTypeEnum>;
};

/** The types a field can assume */
export enum FormNodeFieldTypeEnum {
  Email = 'email',
  LongText = 'longText',
  Number = 'number',
  PhoneNumber = 'phoneNumber',
  ShortText = 'shortText',
  Url = 'url'
}

export type FormNodeInputType = {
  fields?: Maybe<Array<FormNodeFieldInput>>;
  helperText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type FormNodeType = {
  __typename?: 'FormNodeType';
  fields: Array<FormNodeField>;
  helperText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

/** Input of form values */
export type FormValueInput = {
  values?: Maybe<Array<FormNodeEntryFieldInput>>;
};

/** Generate savales documents */
export type GenerateAutodeckInput = {
  answer1?: Maybe<Scalars['String']>;
  answer2?: Maybe<Scalars['String']>;
  answer3?: Maybe<Scalars['String']>;
  answer4?: Maybe<Scalars['String']>;
  companyName?: Maybe<Scalars['String']>;
  customFields?: Maybe<Array<CustomFieldInputType>>;
  emailContent?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isGenerateWorkspace?: Maybe<Scalars['Boolean']>;
  jobLocationId?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  newCustomFields?: Maybe<Array<CustomFieldInputType>>;
  primaryColour?: Maybe<Scalars['String']>;
  requiresColorExtraction: Scalars['Boolean'];
  requiresRembgLambda: Scalars['Boolean'];
  requiresWebsiteScreenshot: Scalars['Boolean'];
  reward?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sorryAboutX?: Maybe<Scalars['String']>;
  standardFields?: Maybe<Array<CustomFieldInputType>>;
  textMessage?: Maybe<Scalars['String']>;
  usesAdjustedLogo: Scalars['Boolean'];
  website?: Maybe<Scalars['String']>;
  youLoveX?: Maybe<Scalars['String']>;
};

export type GetCampaignsInput = {
  customerSlug?: Maybe<Scalars['String']>;
};

export type HandleUserStateInWorkspaceInput = {
  isActive?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
};

export type ImageType = {
  __typename?: 'ImageType';
  encoding?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type InviteUserInput = {
  customerId: Scalars['String'];
  email: Scalars['String'];
  roleId: Scalars['String'];
};

export type InviteUserOutput = {
  __typename?: 'InviteUserOutput';
  didAlreadyExist: Scalars['Boolean'];
  didInvite: Scalars['Boolean'];
};

export type JobObjectType = {
  __typename?: 'JobObjectType';
  createdAt: Scalars['String'];
  createWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  createWorkspaceJobId: Scalars['String'];
  id: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type JobProcessLocation = {
  __typename?: 'JobProcessLocation';
  customFields?: Maybe<Array<CustomFieldType>>;
  id: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  type: JobProcessLocationType;
  xMaterialDimension: Scalars['Int'];
  yMaterialDimension: Scalars['Int'];
};

export type JobProcessLocations = {
  __typename?: 'JobProcessLocations';
  jobProcessLocations: Array<JobProcessLocation>;
};

export enum JobProcessLocationType {
  Brochure = 'BROCHURE',
  OnePager = 'ONE_PAGER',
  Pitchdeck = 'PITCHDECK'
}

export enum JobStatusType {
  Completed = 'COMPLETED',
  CompressingSalesMaterial = 'COMPRESSING_SALES_MATERIAL',
  Failed = 'FAILED',
  InPhotoshopQueue = 'IN_PHOTOSHOP_QUEUE',
  Pending = 'PENDING',
  PhotoshopProcessing = 'PHOTOSHOP_PROCESSING',
  PreProcessing = 'PRE_PROCESSING',
  PreProcessingLogo = 'PRE_PROCESSING_LOGO',
  PreProcessingWebsiteScreenshot = 'PRE_PROCESSING_WEBSITE_SCREENSHOT',
  Processing = 'PROCESSING',
  ReadyForProcessing = 'READY_FOR_PROCESSING',
  StitchingSlides = 'STITCHING_SLIDES',
  TransformingPsdsToPngs = 'TRANSFORMING_PSDS_TO_PNGS',
  WrappingUp = 'WRAPPING_UP'
}

export enum LanguageEnumType {
  Dutch = 'DUTCH',
  English = 'ENGLISH',
  German = 'GERMAN'
}

export type LineChartDataType = {
  __typename?: 'lineChartDataType';
  entryId?: Maybe<Scalars['String']>;
  x?: Maybe<Scalars['String']>;
  y?: Maybe<Scalars['Int']>;
};

export type LinkType = {
  __typename?: 'LinkType';
  backgroundColor?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  questionNode: QuestionNode;
  questionNodeId?: Maybe<Scalars['String']>;
  subHeader?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  url: Scalars['String'];
};

export enum LinkTypeEnumType {
  Api = 'API',
  Facebook = 'FACEBOOK',
  Instagram = 'INSTAGRAM',
  Linkedin = 'LINKEDIN',
  Single = 'SINGLE',
  Social = 'SOCIAL',
  Twitter = 'TWITTER',
  Whatsapp = 'WHATSAPP'
}

/** Login credential */
export type LoginInput = {
  email: Scalars['String'];
};

/** Information you get after you log out */
export type LoginOutput = {
  __typename?: 'LoginOutput';
  expiryDate: Scalars['Int'];
  token: Scalars['String'];
  user: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  appendToInteraction: Session;
  assignTags: Dialogue;
  confirmCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  copyDialogue: Dialogue;
  createBatchDeliveries: CreateBatchDeliveriesOutputType;
  createCampaign: CampaignType;
  /** Create Call to Actions */
  createCTA: QuestionNode;
  createDialogue: Dialogue;
  createJobProcessLocation: JobProcessLocation;
  createPermission?: Maybe<PermssionType>;
  createQuestion?: Maybe<QuestionNode>;
  createRole: RoleType;
  createSession: Session;
  createTag: Tag;
  createTrigger: TriggerType;
  createWorkspace: Customer;
  deleteCTA: QuestionNode;
  deleteCustomer?: Maybe<Customer>;
  deleteDialogue: Dialogue;
  deleteQuestion: QuestionNode;
  deleteTag: Tag;
  deleteTrigger?: Maybe<TriggerType>;
  deleteUser: DeleteUserOutput;
  duplicateQuestion?: Maybe<QuestionNode>;
  editDialogue: Dialogue;
  editTrigger: TriggerType;
  editUser: UserType;
  editWorkspace: Customer;
  generateAutodeck?: Maybe<CreateWorkspaceJobType>;
  handleUserStateInWorkspace: UserCustomer;
  /** Invite a user to a particular customer domain, given an email and role */
  inviteUser: InviteUserOutput;
  /** Logs a user out by removing their refresh token */
  logout: Scalars['String'];
  register?: Maybe<Scalars['String']>;
  removePixelRange?: Maybe<AwsImageType>;
  requestInvite: RequestInviteOutput;
  retryAutodeckJob?: Maybe<CreateWorkspaceJobType>;
  singleUpload: ImageType;
  updateCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  updateCTA: QuestionNode;
  updateDeliveryStatus: Scalars['String'];
  updatePermissions?: Maybe<RoleType>;
  updateQuestion: QuestionNode;
  updateRoles: RoleType;
  uploadJobImage?: Maybe<AwsImageType>;
  /** Upload a number of events of a session. */
  uploadSessionEvents: UploadSessionEventsOutput;
  uploadUpsellImage?: Maybe<ImageType>;
  /** Given a token, checks in the database whether token has been set and has not expired yet */
  verifyUserToken: VerifyUserTokenOutput;
  whitifyImage?: Maybe<AwsImageType>;
};


export type MutationAppendToInteractionArgs = {
  input?: Maybe<AppendToInteractionInput>;
};


export type MutationAssignTagsArgs = {
  dialogueId?: Maybe<Scalars['String']>;
  tags?: Maybe<TagsInputObjectType>;
};


export type MutationConfirmCreateWorkspaceJobArgs = {
  input?: Maybe<GenerateAutodeckInput>;
};


export type MutationCopyDialogueArgs = {
  input?: Maybe<CreateDialogueInputType>;
};


export type MutationCreateBatchDeliveriesArgs = {
  input?: Maybe<CreateBatchDeliveriesInputType>;
};


export type MutationCreateCampaignArgs = {
  input?: Maybe<CreateCampaignInputType>;
};


export type MutationCreateCtaArgs = {
  input?: Maybe<CreateCtaInputType>;
};


export type MutationCreateDialogueArgs = {
  input?: Maybe<CreateDialogueInputType>;
};


export type MutationCreateJobProcessLocationArgs = {
  input?: Maybe<CreateJobProcessLocationInput>;
};


export type MutationCreatePermissionArgs = {
  data?: Maybe<PermissionInput>;
};


export type MutationCreateQuestionArgs = {
  input?: Maybe<CreateQuestionNodeInputType>;
};


export type MutationCreateRoleArgs = {
  data?: Maybe<RoleInput>;
};


export type MutationCreateSessionArgs = {
  input?: Maybe<SessionInput>;
};


export type MutationCreateTagArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TagTypeEnum>;
};


export type MutationCreateTriggerArgs = {
  input?: Maybe<CreateTriggerInputType>;
};


export type MutationCreateWorkspaceArgs = {
  input?: Maybe<CreateWorkspaceInput>;
};


export type MutationDeleteCtaArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationDeleteCustomerArgs = {
  where?: Maybe<CustomerWhereUniqueInput>;
};


export type MutationDeleteDialogueArgs = {
  input?: Maybe<DeleteDialogueInputType>;
};


export type MutationDeleteQuestionArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationDeleteTagArgs = {
  tagId?: Maybe<Scalars['String']>;
};


export type MutationDeleteTriggerArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>;
};


export type MutationDuplicateQuestionArgs = {
  questionId?: Maybe<Scalars['String']>;
};


export type MutationEditDialogueArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dialogueFinisherHeading?: Maybe<Scalars['String']>;
  dialogueFinisherSubheading?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  isWithoutGenData?: Maybe<Scalars['Boolean']>;
  language?: Maybe<LanguageEnumType>;
  publicTitle?: Maybe<Scalars['String']>;
  tags?: Maybe<TagsInputObjectType>;
  title?: Maybe<Scalars['String']>;
};


export type MutationEditTriggerArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
  triggerId?: Maybe<Scalars['String']>;
};


export type MutationEditUserArgs = {
  input?: Maybe<EditUserInput>;
  userId?: Maybe<Scalars['String']>;
};


export type MutationEditWorkspaceArgs = {
  input?: Maybe<EditWorkspaceInput>;
};


export type MutationGenerateAutodeckArgs = {
  input?: Maybe<GenerateAutodeckInput>;
};


export type MutationHandleUserStateInWorkspaceArgs = {
  input?: Maybe<HandleUserStateInWorkspaceInput>;
};


export type MutationInviteUserArgs = {
  input?: Maybe<InviteUserInput>;
};


export type MutationRegisterArgs = {
  input?: Maybe<RegisterInput>;
};


export type MutationRemovePixelRangeArgs = {
  input?: Maybe<RemovePixelRangeInput>;
};


export type MutationRequestInviteArgs = {
  input?: Maybe<RequestInviteInput>;
};


export type MutationRetryAutodeckJobArgs = {
  jobId?: Maybe<Scalars['String']>;
};


export type MutationSingleUploadArgs = {
  file?: Maybe<Scalars['Upload']>;
};


export type MutationUpdateCreateWorkspaceJobArgs = {
  errorMessage?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  resourceUrl?: Maybe<Scalars['String']>;
  status?: Maybe<JobStatusType>;
};


export type MutationUpdateCtaArgs = {
  input?: Maybe<UpdateCtaInputType>;
};


export type MutationUpdateDeliveryStatusArgs = {
  deliveryId?: Maybe<Scalars['String']>;
  status?: Maybe<DeliveryStatusEnum>;
};


export type MutationUpdatePermissionsArgs = {
  input?: Maybe<UpdatePermissionsInput>;
};


export type MutationUpdateQuestionArgs = {
  input?: Maybe<UpdateQuestionNodeInputType>;
};


export type MutationUpdateRolesArgs = {
  permissions?: Maybe<PermissionIdsInput>;
  roleId?: Maybe<Scalars['String']>;
};


export type MutationUploadJobImageArgs = {
  disapproved?: Maybe<Scalars['Boolean']>;
  file?: Maybe<Scalars['Upload']>;
  jobId?: Maybe<Scalars['String']>;
  type?: Maybe<UploadImageEnumType>;
};


export type MutationUploadSessionEventsArgs = {
  input?: Maybe<UploadSessionEventsInput>;
};


export type MutationUploadUpsellImageArgs = {
  input?: Maybe<UploadSellImageInputType>;
};


export type MutationVerifyUserTokenArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationWhitifyImageArgs = {
  input?: Maybe<AdjustedImageInput>;
};

export type NodeEntry = {
  __typename?: 'NodeEntry';
  creationDate: Scalars['String'];
  depth?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  relatedEdgeId?: Maybe<Scalars['String']>;
  relatedNode?: Maybe<QuestionNode>;
  relatedNodeId?: Maybe<Scalars['String']>;
  /** The core scoring value associated with the node entry. */
  value?: Maybe<NodeEntryValue>;
};

/** Data type for the actual node entry */
export type NodeEntryDataInput = {
  choice?: Maybe<ChoiceNodeEntryInput>;
  form?: Maybe<FormNodeEntryInput>;
  register?: Maybe<RegisterNodeEntryInput>;
  slider?: Maybe<SliderNodeEntryInput>;
  textbox?: Maybe<TextboxNodeEntryInput>;
  video?: Maybe<VideoNodeEntryInput>;
};

/** Input type for node-entry metadata */
export type NodeEntryInput = {
  data?: Maybe<NodeEntryDataInput>;
  depth?: Maybe<Scalars['Int']>;
  edgeId?: Maybe<Scalars['String']>;
  nodeId?: Maybe<Scalars['String']>;
};

export type NodeEntryValue = {
  __typename?: 'NodeEntryValue';
  choiceNodeEntry?: Maybe<Scalars['String']>;
  formNodeEntry?: Maybe<FormNodeEntryType>;
  linkNodeEntry?: Maybe<Scalars['String']>;
  registrationNodeEntry?: Maybe<Scalars['String']>;
  sliderNodeEntry?: Maybe<Scalars['Int']>;
  textboxNodeEntry?: Maybe<Scalars['String']>;
  videoNodeEntry?: Maybe<Scalars['String']>;
};

export type OptionInputType = {
  id?: Maybe<Scalars['Int']>;
  overrideLeafId?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  publicValue?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type OptionsInputType = {
  options?: Maybe<Array<OptionInputType>>;
};

/** Information with regards to current page. */
export type PaginationPageInfo = {
  __typename?: 'PaginationPageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPrevPage: Scalars['Boolean'];
  nextPageOffset: Scalars['Int'];
  pageIndex: Scalars['Int'];
  prevPageOffset: Scalars['Int'];
};

/** Fields that can be used for free text search on tables */
export enum PaginationSearchEnum {
  Email = 'email',
  FirstName = 'firstName',
  LastName = 'lastName',
  Name = 'name',
  PublicTitle = 'publicTitle',
  Title = 'title'
}

/** Ways to sort a pagination object */
export enum PaginationSortByEnum {
  CreatedAt = 'createdAt',
  Email = 'email',
  FirstName = 'firstName',
  Id = 'id',
  LastName = 'lastName',
  Medium = 'medium',
  Name = 'name',
  Paths = 'paths',
  Role = 'role',
  ScheduledAt = 'scheduledAt',
  Score = 'score',
  Type = 'type',
  UpdatedAt = 'updatedAt',
  User = 'user',
  When = 'when'
}

/** Sorting of pagination (type and whether it ascends) */
export type PaginationSortInput = {
  by: PaginationSortByEnum;
  desc?: Maybe<Scalars['Boolean']>;
};

export type PaginationWhereInput = {
  cursor?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<PaginationSortInput>>;
  pageIndex?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
  searchTerm?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

export type PermissionIdsInput = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type PermissionInput = {
  customerId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PermssionType = {
  __typename?: 'PermssionType';
  customer?: Maybe<Customer>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type PreviewDataType = {
  __typename?: 'PreviewDataType';
  colors: Array<Scalars['String']>;
  rembgLogoUrl: Scalars['String'];
  websiteScreenshotUrl: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  customer?: Maybe<Customer>;
  customers: Array<Customer>;
  delivery?: Maybe<DeliveryType>;
  dialogue?: Maybe<Dialogue>;
  dialogues: Array<Dialogue>;
  edge?: Maybe<Edge>;
  getAdjustedLogo?: Maybe<AwsImageType>;
  getAutodeckJobs: AutodeckConnectionType;
  getJob?: Maybe<CreateWorkspaceJobType>;
  getJobProcessLocations: JobProcessLocations;
  getPreviewData?: Maybe<PreviewDataType>;
  me: UserType;
  refreshAccessToken: RefreshAccessTokenOutput;
  role?: Maybe<RoleType>;
  roleConnection: RoleConnection;
  /** A session is one entire user-interaction */
  session?: Maybe<Session>;
  sessions: Array<Session>;
  tags: Array<Tag>;
  trigger?: Maybe<TriggerType>;
  triggerConnection?: Maybe<TriggerConnectionType>;
  triggers: Array<TriggerType>;
  user?: Maybe<UserType>;
  UserOfCustomer?: Maybe<UserCustomer>;
  users: Array<UserType>;
};


export type QueryCustomerArgs = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryDeliveryArgs = {
  deliveryId?: Maybe<Scalars['String']>;
};


export type QueryDialogueArgs = {
  where?: Maybe<DialogueWhereUniqueInput>;
};


export type QueryDialoguesArgs = {
  filter?: Maybe<DialogueFilterInputType>;
};


export type QueryEdgeArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetAdjustedLogoArgs = {
  input?: Maybe<AdjustedImageInput>;
};


export type QueryGetAutodeckJobsArgs = {
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryGetJobArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryGetPreviewDataArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryRoleArgs = {
  input?: Maybe<FindRoleInput>;
};


export type QueryRoleConnectionArgs = {
  customerId?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type QuerySessionArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QuerySessionsArgs = {
  where?: Maybe<SessionWhereUniqueInput>;
};


export type QueryTagsArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
};


export type QueryTriggerArgs = {
  triggerId?: Maybe<Scalars['String']>;
};


export type QueryTriggerConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type QueryTriggersArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueId?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
  userId?: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  userId?: Maybe<Scalars['String']>;
};


export type QueryUserOfCustomerArgs = {
  input?: Maybe<UserOfCustomerInput>;
};


export type QueryUsersArgs = {
  customerSlug?: Maybe<Scalars['String']>;
};

export type QuestionNode = {
  __typename?: 'QuestionNode';
  children: Array<Edge>;
  creationDate?: Maybe<Scalars['String']>;
  extraContent?: Maybe<Scalars['String']>;
  /** FormNode resolver */
  form?: Maybe<FormNodeType>;
  id: Scalars['ID'];
  isLeaf: Scalars['Boolean'];
  isRoot: Scalars['Boolean'];
  links: Array<LinkType>;
  options: Array<QuestionOption>;
  overrideLeaf?: Maybe<QuestionNode>;
  overrideLeafId?: Maybe<Scalars['String']>;
  questionDialogue?: Maybe<Dialogue>;
  questionDialogueId?: Maybe<Scalars['String']>;
  share?: Maybe<ShareNodeType>;
  /** Slidernode resolver */
  sliderNode?: Maybe<SliderNodeType>;
  title: Scalars['String'];
  type: QuestionNodeTypeEnum;
  updatedAt?: Maybe<Scalars['String']>;
};

/** The different types a node can assume */
export enum QuestionNodeTypeEnum {
  Choice = 'CHOICE',
  Form = 'FORM',
  Generic = 'GENERIC',
  Link = 'LINK',
  Registration = 'REGISTRATION',
  Share = 'SHARE',
  Slider = 'SLIDER',
  Textbox = 'TEXTBOX',
  VideoEmbedded = 'VIDEO_EMBEDDED'
}

export type QuestionNodeWhereInputType = {
  id?: Maybe<Scalars['ID']>;
  isRoot?: Maybe<Scalars['Boolean']>;
};

export type QuestionNodeWhereUniqueInput = {
  id: Scalars['String'];
};

export type QuestionOption = {
  __typename?: 'QuestionOption';
  id: Scalars['Int'];
  overrideLeaf?: Maybe<QuestionNode>;
  position?: Maybe<Scalars['Int']>;
  publicValue?: Maybe<Scalars['String']>;
  questionId?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type RecipientsInputType = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type RefreshAccessTokenOutput = {
  __typename?: 'RefreshAccessTokenOutput';
  accessToken: Scalars['String'];
};

/** Registration credentials */
export type RegisterInput = {
  customerId: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  roleId?: Maybe<Scalars['String']>;
};

/** Input type for a register node */
export type RegisterNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export type RemovePixelRangeInput = {
  blue?: Maybe<Scalars['Int']>;
  bucket?: Maybe<Scalars['String']>;
  green?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  range?: Maybe<Scalars['Int']>;
  red?: Maybe<Scalars['Int']>;
};

export type RequestInviteInput = {
  email: Scalars['String'];
};

export type RequestInviteOutput = {
  __typename?: 'RequestInviteOutput';
  didInvite: Scalars['Boolean'];
  userExists: Scalars['Boolean'];
};

export type RoleConnection = DeprecatedConnectionInterface & {
  __typename?: 'RoleConnection';
  cursor?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  pageInfo: DeprecatedPaginationPageInfo;
  roles: Array<RoleType>;
  startDate?: Maybe<Scalars['String']>;
};

export type RoleDataInput = {
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type RoleInput = {
  customerId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<SystemPermission>>;
};

export type RoleType = {
  __typename?: 'RoleType';
  allPermissions: Array<SystemPermission>;
  customerId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  nrPermissions?: Maybe<Scalars['Int']>;
  permissions?: Maybe<Array<SystemPermission>>;
  roleId?: Maybe<Scalars['String']>;
};

export type Session = {
  __typename?: 'Session';
  browser: Scalars['String'];
  createdAt: Scalars['Date'];
  delivery?: Maybe<DeliveryType>;
  deliveryId?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  dialogueId: Scalars['String'];
  id: Scalars['ID'];
  nodeEntries: Array<NodeEntry>;
  originUrl?: Maybe<Scalars['String']>;
  paths: Scalars['Int'];
  score: Scalars['Float'];
  totalTimeInSec?: Maybe<Scalars['Int']>;
};

/** An action represents user input in response to a state */
export type SessionActionInput = {
  choice?: Maybe<ChoiceValueInput>;
  slider?: Maybe<SliderValueInput>;
  timeSpent?: Maybe<Scalars['Int']>;
  type: SessionActionType;
};

/** Types of actions that can be emitted in a user's session. */
export enum SessionActionType {
  ChoiceAction = 'CHOICE_ACTION',
  FormAction = 'FORM_ACTION',
  Navigation = 'NAVIGATION',
  SliderAction = 'SLIDER_ACTION'
}

export type SessionConnection = ConnectionInterface & {
  __typename?: 'SessionConnection';
  pageInfo: PaginationPageInfo;
  sessions: Array<Session>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type SessionConnectionFilterInput = {
  campaignVariantId?: Maybe<Scalars['String']>;
  deliveryType?: Maybe<SessionDeliveryType>;
  endDate?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SessionConnectionOrderByInput>;
  perPage?: Maybe<Scalars['Int']>;
  scoreRange?: Maybe<SessionScoreRangeFilter>;
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

/** Fields to order SessionConnection by. */
export enum SessionConnectionOrder {
  CreatedAt = 'createdAt'
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

/** A session event describes an action of a user during a session they had with the dialogue. */
export type SessionEvent = {
  __typename?: 'SessionEvent';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
};

/** Input type of a SessionEvent */
export type SessionEventInput = {
  action?: Maybe<SessionActionInput>;
  sessionId: Scalars['String'];
  state?: Maybe<SessionStateInput>;
  timestamp: Scalars['Date'];
};

/** Input for session */
export type SessionInput = {
  deliveryId?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  dialogueId: Scalars['String'];
  entries?: Maybe<Array<NodeEntryInput>>;
  originUrl?: Maybe<Scalars['String']>;
  totalTimeInSec?: Maybe<Scalars['Int']>;
};

/** Scores to filter sessions by. */
export type SessionScoreRangeFilter = {
  max?: Maybe<Scalars['Int']>;
  min?: Maybe<Scalars['Int']>;
};

/** Input of states */
export type SessionStateInput = {
  nodeId?: Maybe<Scalars['String']>;
};

export type SessionWhereUniqueInput = {
  dialogueId?: Maybe<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
};

export type ShareNodeInputType = {
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ShareNodeType = {
  __typename?: 'ShareNodeType';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title: Scalars['String'];
  tooltip?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type SlideNodeMarkerInput = {
  id?: Maybe<Scalars['ID']>;
  label: Scalars['String'];
  range?: Maybe<SliderNodeRangeInputType>;
  subLabel: Scalars['String'];
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
  id: Scalars['ID'];
  label: Scalars['String'];
  range?: Maybe<SliderNodeRangeType>;
  subLabel: Scalars['String'];
};

export type SliderNodeRangeInputType = {
  end?: Maybe<Scalars['Float']>;
  start?: Maybe<Scalars['Float']>;
};

export type SliderNodeRangeType = {
  __typename?: 'SliderNodeRangeType';
  end?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  start?: Maybe<Scalars['Float']>;
};

export type SliderNodeType = {
  __typename?: 'SliderNodeType';
  happyText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  markers?: Maybe<Array<SliderNodeMarkerType>>;
  unhappyText?: Maybe<Scalars['String']>;
};

/** Input type of a SessionEvent for Sliders. */
export type SliderValueInput = {
  value: Scalars['Int'];
};

/** Details regarding interaction with social node */
export type SocialNodeEntryInput = {
  visitedLink?: Maybe<Scalars['String']>;
};

export enum SystemPermission {
  CanAccessAdminPanel = 'CAN_ACCESS_ADMIN_PANEL',
  CanAddUsers = 'CAN_ADD_USERS',
  CanBuildDialogue = 'CAN_BUILD_DIALOGUE',
  CanCreateCampaigns = 'CAN_CREATE_CAMPAIGNS',
  CanCreateDeliveries = 'CAN_CREATE_DELIVERIES',
  CanCreateTriggers = 'CAN_CREATE_TRIGGERS',
  CanDeleteDialogue = 'CAN_DELETE_DIALOGUE',
  CanDeleteTriggers = 'CAN_DELETE_TRIGGERS',
  CanDeleteUsers = 'CAN_DELETE_USERS',
  CanDeleteWorkspace = 'CAN_DELETE_WORKSPACE',
  CanEditDialogue = 'CAN_EDIT_DIALOGUE',
  CanEditUsers = 'CAN_EDIT_USERS',
  CanEditWorkspace = 'CAN_EDIT_WORKSPACE',
  CanViewCampaigns = 'CAN_VIEW_CAMPAIGNS',
  CanViewDialogue = 'CAN_VIEW_DIALOGUE',
  CanViewDialogueAnalytics = 'CAN_VIEW_DIALOGUE_ANALYTICS',
  CanViewUsers = 'CAN_VIEW_USERS'
}

export type Tag = {
  __typename?: 'Tag';
  customerId: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  type: TagTypeEnum;
};

export type TagsInputObjectType = {
  entries?: Maybe<Array<Scalars['String']>>;
};

export enum TagTypeEnum {
  Agent = 'AGENT',
  Default = 'DEFAULT',
  Location = 'LOCATION'
}

/** Input type for a textbox node */
export type TextboxNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export type TopPathType = {
  __typename?: 'topPathType';
  answer?: Maybe<Scalars['String']>;
  basicSentiment?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
};

export enum TriggerConditionEnum {
  HighThreshold = 'HIGH_THRESHOLD',
  InnerRange = 'INNER_RANGE',
  LowThreshold = 'LOW_THRESHOLD',
  OuterRange = 'OUTER_RANGE',
  TextMatch = 'TEXT_MATCH'
}

export type TriggerConditionInputType = {
  id?: Maybe<Scalars['Int']>;
  maxValue?: Maybe<Scalars['Int']>;
  minValue?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['String']>;
  textValue?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerConditionEnum>;
};

export type TriggerConditionType = {
  __typename?: 'TriggerConditionType';
  id: Scalars['Int'];
  maxValue?: Maybe<Scalars['Int']>;
  minValue?: Maybe<Scalars['Int']>;
  question?: Maybe<QuestionNode>;
  textValue?: Maybe<Scalars['String']>;
  triggerId: Scalars['String'];
  type: TriggerConditionEnum;
};

export type TriggerConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'TriggerConnectionType';
  cursor?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  triggers: Array<TriggerType>;
};

export type TriggerInputType = {
  conditions?: Maybe<Array<TriggerConditionInputType>>;
  medium?: Maybe<TriggerMediumEnum>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerTypeEnum>;
};

export enum TriggerMediumEnum {
  Both = 'BOTH',
  Email = 'EMAIL',
  Phone = 'PHONE'
}

export type TriggerType = {
  __typename?: 'TriggerType';
  conditions: Array<TriggerConditionType>;
  id: Scalars['String'];
  medium: TriggerMediumEnum;
  name: Scalars['String'];
  recipients: Array<UserType>;
  relatedDialogue?: Maybe<Dialogue>;
  relatedNodeId?: Maybe<Scalars['String']>;
  type: TriggerTypeEnum;
};

export enum TriggerTypeEnum {
  Question = 'QUESTION',
  Scheduled = 'SCHEDULED'
}

export type UpdateCtaInputType = {
  customerId?: Maybe<Scalars['ID']>;
  form?: Maybe<FormNodeInputType>;
  id?: Maybe<Scalars['String']>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<QuestionNodeTypeEnum>;
};

export type UpdatePermissionsInput = {
  permissions?: Maybe<Array<SystemPermission>>;
  roleId?: Maybe<Scalars['String']>;
};

export type UpdateQuestionNodeInputType = {
  customerId?: Maybe<Scalars['ID']>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
  edgeId?: Maybe<Scalars['ID']>;
  extraContent?: Maybe<Scalars['String']>;
  happyText?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  optionEntries?: Maybe<OptionsInputType>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  sliderNode?: Maybe<SliderNodeInputType>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  unhappyText?: Maybe<Scalars['String']>;
};


export enum UploadImageEnumType {
  Logo = 'LOGO',
  WebsiteScreenshot = 'WEBSITE_SCREENSHOT'
}

export type UploadSellImageInputType = {
  file?: Maybe<Scalars['Upload']>;
  workspaceId?: Maybe<Scalars['String']>;
};

export type UploadSessionEventsInput = {
  events?: Maybe<Array<SessionEventInput>>;
  sessionId?: Maybe<Scalars['String']>;
};

export type UploadSessionEventsOutput = {
  __typename?: 'UploadSessionEventsOutput';
  status: Scalars['String'];
};

export type UserConnection = ConnectionInterface & {
  __typename?: 'UserConnection';
  pageInfo: PaginationPageInfo;
  totalPages?: Maybe<Scalars['Int']>;
  userCustomers: Array<UserCustomer>;
};

export type UserConnectionFilterInput = {
  email?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserConnectionOrderByInput>;
  perPage?: Maybe<Scalars['Int']>;
  role?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
};

/** Fields to order UserConnection by. */
export enum UserConnectionOrder {
  CreatedAt = 'createdAt',
  Email = 'email',
  FirstName = 'firstName',
  IsActive = 'isActive',
  LastActivity = 'lastActivity',
  LastName = 'lastName',
  Role = 'role'
}

/** Sorting of UserConnection */
export type UserConnectionOrderByInput = {
  by: UserConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

export type UserCustomer = {
  __typename?: 'UserCustomer';
  createdAt: Scalars['Date'];
  customer: Customer;
  isActive: Scalars['Boolean'];
  role: RoleType;
  user: UserType;
};

export type UserInput = {
  customerId?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  roleId?: Maybe<Scalars['String']>;
};

export type UserOfCustomerInput = {
  customerId?: Maybe<Scalars['String']>;
  customerSlug?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type UserType = {
  __typename?: 'UserType';
  customers: Array<Customer>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  globalPermissions?: Maybe<Array<SystemPermission>>;
  id: Scalars['ID'];
  lastActivity?: Maybe<Scalars['Date']>;
  lastLoggedIn?: Maybe<Scalars['Date']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  role?: Maybe<RoleType>;
  roleId?: Maybe<Scalars['String']>;
  userCustomers: Array<UserCustomer>;
};

export type VerifyUserTokenOutput = {
  __typename?: 'VerifyUserTokenOutput';
  accessToken: Scalars['String'];
  accessTokenExpiry: Scalars['Int'];
  userData: UserType;
};

/** Input type for a video node */
export type VideoNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

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
    & { children: Array<(
      { __typename?: 'Edge' }
      & Pick<Edge, 'id'>
    )> }
  )> }
);

export type QuestionNodeFragmentFragment = (
  { __typename?: 'QuestionNode' }
  & Pick<QuestionNode, 'id' | 'title' | 'isRoot' | 'isLeaf' | 'type'>
  & { children: Array<(
    { __typename?: 'Edge' }
    & { parentNode?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )>, childNode?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )> }
    & EdgeFragmentFragment
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
  )>, form?: Maybe<(
    { __typename?: 'FormNodeType' }
    & Pick<FormNodeType, 'id' | 'helperText'>
    & { fields: Array<(
      { __typename?: 'FormNodeField' }
      & Pick<FormNodeField, 'id' | 'label' | 'type' | 'placeholder' | 'isRequired' | 'position'>
    )> }
  )>, overrideLeaf?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id' | 'title' | 'type'>
  )>, options: Array<(
    { __typename?: 'QuestionOption' }
    & Pick<QuestionOption, 'id' | 'value' | 'publicValue'>
    & { overrideLeaf?: Maybe<(
      { __typename?: 'QuestionNode' }
      & Pick<QuestionNode, 'id'>
    )> }
  )> }
);

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
export const QuestionNodeFragmentFragmentDoc = gql`
    fragment QuestionNodeFragment on QuestionNode {
  id
  title
  isRoot
  isLeaf
  type
  children {
    ...EdgeFragment
    parentNode {
      id
    }
    childNode {
      id
    }
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
  form {
    id
    helperText
    fields {
      id
      label
      type
      placeholder
      isRequired
      position
    }
  }
  overrideLeaf {
    id
    title
    type
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