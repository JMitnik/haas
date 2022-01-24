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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
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

export type AutodeckConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'AutodeckConnectionType';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  jobs: Array<CreateWorkspaceJobType>;
};

export type AwsImageType = {
  __typename?: 'AWSImageType';
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  encoding?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** Campaign */
export type CampaignType = {
  __typename?: 'CampaignType';
  id: Scalars['ID'];
  label: Scalars['String'];
  variants?: Maybe<Array<CampaignVariantType>>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
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
  Sms = 'SMS',
  Email = 'EMAIL',
  Queue = 'QUEUE'
}

/** Variant of campaign */
export type CampaignVariantType = {
  __typename?: 'CampaignVariantType';
  id: Scalars['ID'];
  label: Scalars['String'];
  weight: Scalars['Int'];
  body: Scalars['String'];
  from?: Maybe<Scalars['String']>;
  type: CampaignVariantEnum;
  workspace?: Maybe<Customer>;
  dialogue?: Maybe<Dialogue>;
  campaign?: Maybe<CampaignType>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
  customVariables?: Maybe<Array<CampaignVariantCustomVariableType>>;
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
  id: Scalars['ID'];
  primary: Scalars['String'];
  secondary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
};

/** Interface all pagination-based models should implement */
export type ConnectionInterface = {
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo: PaginationPageInfo;
};

export type CreateBatchDeliveriesInputType = {
  campaignId?: Maybe<Scalars['ID']>;
  workspaceId?: Maybe<Scalars['String']>;
  uploadedCsv?: Maybe<Scalars['Upload']>;
  batchScheduledAt?: Maybe<Scalars['String']>;
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
  workspaceId: Scalars['ID'];
  variants?: Maybe<Array<CreateCampaignVariantInputType>>;
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
  customVariables?: Maybe<Array<CreateCampaignCustomVariable>>;
};

export type CreateCtaInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  form?: Maybe<FormNodeInputType>;
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

export type CreateJobProcessLocationInput = {
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<JobProcessLocationType>;
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
};

export type CreateWorkspaceJobType = {
  __typename?: 'CreateWorkspaceJobType';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  name: Scalars['String'];
  status: JobStatusType;
  requiresColorExtraction: Scalars['Boolean'];
  requiresRembg: Scalars['Boolean'];
  requiresScreenshot: Scalars['Boolean'];
  resourcesUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  referenceType: CloudReferenceType;
  processLocation: JobProcessLocation;
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
  linkTypes?: Maybe<Array<CtaLinkInputObjectType>>;
};

export type CtaShareInputObjectType = {
  url?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['ID'];
  slug: Scalars['String'];
  name: Scalars['String'];
  settings?: Maybe<CustomerSettings>;
  usersConnection?: Maybe<UserConnection>;
  dialogue?: Maybe<Dialogue>;
  dialogues?: Maybe<Array<Dialogue>>;
  users?: Maybe<Array<UserType>>;
  campaigns: Array<CampaignType>;
  roles?: Maybe<Array<RoleType>>;
  campaign?: Maybe<CampaignType>;
  userCustomer?: Maybe<UserCustomer>;
};


export type CustomerUsersConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<UserConnectionFilterInput>;
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
  id: Scalars['ID'];
  logoUrl?: Maybe<Scalars['String']>;
  logoOpacity?: Maybe<Scalars['Int']>;
  colourSettings?: Maybe<ColourSettings>;
  fontSettings?: Maybe<FontSettings>;
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
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  jobProcessLocationId: Scalars['String'];
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
  deletedUser: Scalars['Boolean'];
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
  pageInfo: PaginationPageInfo;
  deliveries: Array<DeliveryType>;
};

export type DeliveryEventType = {
  __typename?: 'DeliveryEventType';
  id: Scalars['ID'];
  status: DeliveryStatusEnum;
  createdAt: Scalars['Date'];
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
  currentStatus: DeliveryStatusEnum;
  events?: Maybe<Array<DeliveryEventType>>;
};

/** Interface all pagination-based models should implement */
export type DeprecatedConnectionInterface = {
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
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
  id: Scalars['ID'];
  title: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  isWithoutGenData: Scalars['Boolean'];
  wasGeneratedWithGenData: Scalars['Boolean'];
  language: LanguageEnumType;
  publicTitle?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  postLeafNode?: Maybe<DialogueFinisherObjectType>;
  averageScore: Scalars['Float'];
  statistics?: Maybe<DialogueStatistics>;
  sessionConnection?: Maybe<SessionConnection>;
  tags?: Maybe<Array<Tag>>;
  customerId: Scalars['String'];
  customer?: Maybe<Customer>;
  rootQuestion: QuestionNode;
  edges: Array<Edge>;
  questions: Array<QuestionNode>;
  sessions: Array<Session>;
  leafs: Array<QuestionNode>;
  campaignVariants: Array<CampaignVariantType>;
};


export type DialogueAverageScoreArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueStatisticsArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueSessionConnectionArgs = {
  filter?: Maybe<SessionConnectionFilterInput>;
};


export type DialogueSessionsArgs = {
  take?: Maybe<Scalars['Int']>;
};


export type DialogueLeafsArgs = {
  searchTerm?: Maybe<Scalars['String']>;
};

export type DialogueFilterInputType = {
  searchTerm?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
};

export type DialogueFinisherObjectType = {
  __typename?: 'DialogueFinisherObjectType';
  id: Scalars['ID'];
  header: Scalars['String'];
  subtext: Scalars['String'];
};

export type DialogueStatistics = {
  __typename?: 'DialogueStatistics';
  nrInteractions: Scalars['Int'];
  topPositivePath?: Maybe<Array<TopPathType>>;
  topNegativePath?: Maybe<Array<TopPathType>>;
  mostPopularPath?: Maybe<TopPathType>;
  history?: Maybe<Array<LineChartDataType>>;
};

export type DialogueWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
};

export type Edge = {
  __typename?: 'Edge';
  id: Scalars['ID'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  parentNodeId: Scalars['String'];
  childNodeId: Scalars['String'];
  parentNode?: Maybe<QuestionNode>;
  childNode?: Maybe<QuestionNode>;
  conditions?: Maybe<Array<EdgeCondition>>;
};

export type EdgeCondition = {
  __typename?: 'EdgeCondition';
  id: Scalars['Int'];
  conditionType: Scalars['String'];
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

export type FailedDeliveryModel = {
  __typename?: 'FailedDeliveryModel';
  record: Scalars['String'];
  error: Scalars['String'];
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
  relatedFieldId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  shortText?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
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
  relatedField: FormNodeField;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  shortText?: Maybe<Scalars['String']>;
  longText?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
};

export type FormNodeField = {
  __typename?: 'FormNodeField';
  id: Scalars['ID'];
  label: Scalars['String'];
  type: FormNodeFieldTypeEnum;
  isRequired: Scalars['Boolean'];
  position: Scalars['Int'];
  placeholder?: Maybe<Scalars['String']>;
};

export type FormNodeFieldInput = {
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
  placeholder?: Maybe<Scalars['String']>;
  type?: Maybe<FormNodeFieldTypeEnum>;
  isRequired?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['Int']>;
};

/** The types a field can assume */
export enum FormNodeFieldTypeEnum {
  Email = 'email',
  PhoneNumber = 'phoneNumber',
  Url = 'url',
  ShortText = 'shortText',
  LongText = 'longText',
  Number = 'number'
}

export type FormNodeInputType = {
  id?: Maybe<Scalars['String']>;
  helperText?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<FormNodeFieldInput>>;
};

export type FormNodeType = {
  __typename?: 'FormNodeType';
  id?: Maybe<Scalars['String']>;
  helperText?: Maybe<Scalars['String']>;
  fields: Array<FormNodeField>;
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
  standardFields?: Maybe<Array<CustomFieldInputType>>;
  customFields?: Maybe<Array<CustomFieldInputType>>;
  newCustomFields?: Maybe<Array<CustomFieldInputType>>;
};

export type GetCampaignsInput = {
  customerSlug?: Maybe<Scalars['String']>;
};

export type HandleUserStateInWorkspaceInput = {
  userId?: Maybe<Scalars['String']>;
  workspaceId?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
};

export type ImageType = {
  __typename?: 'ImageType';
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  encoding?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type InviteUserInput = {
  roleId: Scalars['String'];
  email: Scalars['String'];
  customerId: Scalars['String'];
};

export type InviteUserOutput = {
  __typename?: 'InviteUserOutput';
  didInvite: Scalars['Boolean'];
  didAlreadyExist: Scalars['Boolean'];
};

export type JobObjectType = {
  __typename?: 'JobObjectType';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  createWorkspaceJobId: Scalars['String'];
  createWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
};

export type JobProcessLocation = {
  __typename?: 'JobProcessLocation';
  id: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  xMaterialDimension: Scalars['Int'];
  yMaterialDimension: Scalars['Int'];
  type: JobProcessLocationType;
  customFields?: Maybe<Array<CustomFieldType>>;
};

export type JobProcessLocations = {
  __typename?: 'JobProcessLocations';
  jobProcessLocations: Array<JobProcessLocation>;
};

export enum JobProcessLocationType {
  OnePager = 'ONE_PAGER',
  Pitchdeck = 'PITCHDECK',
  Brochure = 'BROCHURE'
}

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

export type LineChartDataType = {
  __typename?: 'lineChartDataType';
  x?: Maybe<Scalars['String']>;
  y?: Maybe<Scalars['Int']>;
  entryId?: Maybe<Scalars['String']>;
};

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
  questionNode: QuestionNode;
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
  token: Scalars['String'];
  expiryDate: Scalars['Int'];
  user: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createJobProcessLocation: JobProcessLocation;
  generateAutodeck?: Maybe<CreateWorkspaceJobType>;
  retryAutodeckJob?: Maybe<CreateWorkspaceJobType>;
  confirmCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  whitifyImage?: Maybe<AwsImageType>;
  removePixelRange?: Maybe<AwsImageType>;
  uploadJobImage?: Maybe<AwsImageType>;
  updateCreateWorkspaceJob?: Maybe<CreateWorkspaceJobType>;
  assignTags: Dialogue;
  createTag: Tag;
  deleteTag: Tag;
  createCampaign: CampaignType;
  createBatchDeliveries: CreateBatchDeliveriesOutputType;
  updateDeliveryStatus: Scalars['String'];
  deleteTrigger?: Maybe<TriggerType>;
  editTrigger: TriggerType;
  createTrigger: TriggerType;
  createPermission?: Maybe<PermssionType>;
  updatePermissions?: Maybe<RoleType>;
  createRole: RoleType;
  updateRoles: RoleType;
  singleUpload: ImageType;
  createWorkspace: Customer;
  editWorkspace: Customer;
  deleteCustomer?: Maybe<Customer>;
  handleUserStateInWorkspace: UserCustomer;
  editUser: UserType;
  deleteUser: DeleteUserOutput;
  copyDialogue: Dialogue;
  createDialogue: Dialogue;
  editDialogue: Dialogue;
  deleteDialogue: Dialogue;
  uploadUpsellImage?: Maybe<ImageType>;
  register?: Maybe<Scalars['String']>;
  /** Given a token, checks in the database whether token has been set and has not expired yet */
  verifyUserToken: VerifyUserTokenOutput;
  requestInvite: RequestInviteOutput;
  /** Logs a user out by removing their refresh token */
  logout: Scalars['String'];
  /** Invite a user to a particular customer domain, given an email and role */
  inviteUser: InviteUserOutput;
  createSession: Session;
  appendToInteraction: Session;
  /** Upload a number of events of a session. */
  uploadSessionEvents: UploadSessionEventsOutput;
  duplicateQuestion?: Maybe<QuestionNode>;
  deleteQuestion: QuestionNode;
  createQuestion?: Maybe<QuestionNode>;
  deleteCTA: QuestionNode;
  /** Create Call to Actions */
  createCTA: QuestionNode;
  updateCTA: QuestionNode;
  updateQuestion: QuestionNode;
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
  file?: Maybe<Scalars['Upload']>;
};


export type MutationCreateWorkspaceArgs = {
  input?: Maybe<CreateWorkspaceInput>;
};


export type MutationEditWorkspaceArgs = {
  input?: Maybe<EditWorkspaceInput>;
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


export type MutationUploadUpsellImageArgs = {
  input?: Maybe<UploadSellImageInputType>;
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


export type MutationUploadSessionEventsArgs = {
  input?: Maybe<UploadSessionEventsInput>;
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
  creationDate: Scalars['String'];
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

export type OptionInputType = {
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  overrideLeafId?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
};

export type OptionsInputType = {
  options?: Maybe<Array<OptionInputType>>;
};

/** Information with regards to current page. */
export type PaginationPageInfo = {
  __typename?: 'PaginationPageInfo';
  hasPrevPage: Scalars['Boolean'];
  hasNextPage: Scalars['Boolean'];
  prevPageOffset: Scalars['Int'];
  nextPageOffset: Scalars['Int'];
  pageIndex: Scalars['Int'];
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
  orderBy?: Maybe<Array<PaginationSortInput>>;
};

export type PermissionIdsInput = {
  ids?: Maybe<Array<Scalars['String']>>;
};

export type PermissionInput = {
  customerId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type PermssionType = {
  __typename?: 'PermssionType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
};

export type PreviewDataType = {
  __typename?: 'PreviewDataType';
  colors: Array<Scalars['String']>;
  rembgLogoUrl: Scalars['String'];
  websiteScreenshotUrl: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getJobProcessLocations: JobProcessLocations;
  getPreviewData?: Maybe<PreviewDataType>;
  getJob?: Maybe<CreateWorkspaceJobType>;
  getAutodeckJobs: AutodeckConnectionType;
  getAdjustedLogo?: Maybe<AwsImageType>;
  tags: Array<Tag>;
  delivery?: Maybe<DeliveryType>;
  triggerConnection?: Maybe<TriggerConnectionType>;
  trigger?: Maybe<TriggerType>;
  triggers: Array<TriggerType>;
  role?: Maybe<RoleType>;
  roleConnection: RoleConnection;
  customers: Array<Customer>;
  customer?: Maybe<Customer>;
  UserOfCustomer?: Maybe<UserCustomer>;
  me: UserType;
  users: Array<UserType>;
  user?: Maybe<UserType>;
  dialogue?: Maybe<Dialogue>;
  dialogues: Array<Dialogue>;
  refreshAccessToken: RefreshAccessTokenOutput;
  sessions: Array<Session>;
  /** A session is one entire user-interaction */
  session?: Maybe<Session>;
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


export type QuerySessionsArgs = {
  where?: Maybe<SessionWhereUniqueInput>;
};


export type QuerySessionArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryEdgeArgs = {
  id?: Maybe<Scalars['String']>;
};

export type QuestionNode = {
  __typename?: 'QuestionNode';
  id: Scalars['ID'];
  isLeaf: Scalars['Boolean'];
  isRoot: Scalars['Boolean'];
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  extraContent?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  type: QuestionNodeTypeEnum;
  overrideLeafId?: Maybe<Scalars['String']>;
  /** Slidernode resolver */
  sliderNode?: Maybe<SliderNodeType>;
  /** FormNode resolver */
  form?: Maybe<FormNodeType>;
  share?: Maybe<ShareNodeType>;
  questionDialogueId?: Maybe<Scalars['String']>;
  links: Array<LinkType>;
  questionDialogue?: Maybe<Dialogue>;
  overrideLeaf?: Maybe<QuestionNode>;
  options: Array<QuestionOption>;
  children: Array<Edge>;
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
  id: Scalars['Int'];
  value: Scalars['String'];
  questionId?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  overrideLeaf?: Maybe<QuestionNode>;
  position?: Maybe<Scalars['Int']>;
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
  didInvite: Scalars['Boolean'];
  userExists: Scalars['Boolean'];
};

export type RoleConnection = DeprecatedConnectionInterface & {
  __typename?: 'RoleConnection';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  roles: Array<RoleType>;
};

export type RoleDataInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type RoleInput = {
  customerId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<SystemPermission>>;
};

export type RoleType = {
  __typename?: 'RoleType';
  id: Scalars['ID'];
  name: Scalars['String'];
  roleId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  nrPermissions?: Maybe<Scalars['Int']>;
  allPermissions: Array<SystemPermission>;
  permissions?: Maybe<Array<SystemPermission>>;
};

export type Session = {
  __typename?: 'Session';
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  dialogueId: Scalars['String'];
  browser: Scalars['String'];
  paths: Scalars['Int'];
  score: Scalars['Float'];
  totalTimeInSec?: Maybe<Scalars['Int']>;
  originUrl?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  deliveryId?: Maybe<Scalars['String']>;
  delivery?: Maybe<DeliveryType>;
  nodeEntries: Array<NodeEntry>;
};

export type SessionConnection = ConnectionInterface & {
  __typename?: 'SessionConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo: PaginationPageInfo;
  sessions: Array<Session>;
};

export type SessionConnectionFilterInput = {
  search?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  deliveryType?: Maybe<SessionDeliveryType>;
  scoreRange?: Maybe<SessionScoreRangeFilter>;
  campaignVariantId?: Maybe<Scalars['String']>;
  orderBy?: Maybe<SessionConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
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

/** Input type of a SessionEvent for Choices. */
export type SessionEventChoiceValueInput = {
  value: Scalars['String'];
  relatedNodeId: Scalars['String'];
  optionId?: Maybe<Scalars['String']>;
  timeSpent?: Maybe<Scalars['Int']>;
};

/** Input type of a SessionEvent for a form. */
export type SessionEventFormValueInput = {
  values?: Maybe<Array<FormNodeEntryFieldInput>>;
  relatedNodeId: Scalars['String'];
  timeSpent?: Maybe<Scalars['Int']>;
};

/** Input type of a SessionEvent */
export type SessionEventInput = {
  sessionId: Scalars['String'];
  timestamp: Scalars['Date'];
  eventType: SessionEventType;
  toNodeId?: Maybe<Scalars['String']>;
  choiceValue?: Maybe<SessionEventChoiceValueInput>;
  sliderValue?: Maybe<SessionEventSliderValueInput>;
  formValue?: Maybe<SessionEventFormValueInput>;
};

/** Input type of a SessionEvent for Sliders. */
export type SessionEventSliderValueInput = {
  value: Scalars['Int'];
  relatedNodeId: Scalars['String'];
  timeSpent?: Maybe<Scalars['Int']>;
};

/** Types of events that can be emitted in a user's session. */
export enum SessionEventType {
  ChoiceAction = 'CHOICE_ACTION',
  SliderAction = 'SLIDER_ACTION',
  Navigation = 'NAVIGATION',
  FormAction = 'FORM_ACTION'
}

/** Input for session */
export type SessionInput = {
  dialogueId: Scalars['String'];
  entries?: Maybe<Array<NodeEntryInput>>;
  deliveryId?: Maybe<Scalars['String']>;
  originUrl?: Maybe<Scalars['String']>;
  device?: Maybe<Scalars['String']>;
  totalTimeInSec?: Maybe<Scalars['Int']>;
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

export type ShareNodeInputType = {
  id?: Maybe<Scalars['String']>;
  tooltip?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ShareNodeType = {
  __typename?: 'ShareNodeType';
  id: Scalars['String'];
  url: Scalars['String'];
  title: Scalars['String'];
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
  id: Scalars['ID'];
  label: Scalars['String'];
  subLabel: Scalars['String'];
  range?: Maybe<SliderNodeRangeType>;
};

export type SliderNodeRangeInputType = {
  start?: Maybe<Scalars['Float']>;
  end?: Maybe<Scalars['Float']>;
};

export type SliderNodeRangeType = {
  __typename?: 'SliderNodeRangeType';
  id: Scalars['ID'];
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

export enum SystemPermission {
  CanAccessAdminPanel = 'CAN_ACCESS_ADMIN_PANEL',
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
  CanCreateDeliveries = 'CAN_CREATE_DELIVERIES'
}

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name: Scalars['String'];
  customerId: Scalars['String'];
  type: TagTypeEnum;
};

export type TagsInputObjectType = {
  entries?: Maybe<Array<Scalars['String']>>;
};

export enum TagTypeEnum {
  Default = 'DEFAULT',
  Location = 'LOCATION',
  Agent = 'AGENT'
}

/** Input type for a textbox node */
export type TextboxNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export type TopPathType = {
  __typename?: 'topPathType';
  answer?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  basicSentiment?: Maybe<Scalars['String']>;
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
  id: Scalars['Int'];
  type: TriggerConditionEnum;
  minValue?: Maybe<Scalars['Int']>;
  maxValue?: Maybe<Scalars['Int']>;
  textValue?: Maybe<Scalars['String']>;
  triggerId: Scalars['String'];
  question?: Maybe<QuestionNode>;
};

export type TriggerConnectionType = DeprecatedConnectionInterface & {
  __typename?: 'TriggerConnectionType';
  cursor?: Maybe<Scalars['String']>;
  offset?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  pageInfo: DeprecatedPaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  triggers: Array<TriggerType>;
};

export type TriggerInputType = {
  name?: Maybe<Scalars['String']>;
  type?: Maybe<TriggerTypeEnum>;
  medium?: Maybe<TriggerMediumEnum>;
  conditions?: Maybe<Array<TriggerConditionInputType>>;
};

export enum TriggerMediumEnum {
  Email = 'EMAIL',
  Phone = 'PHONE',
  Both = 'BOTH'
}

export type TriggerType = {
  __typename?: 'TriggerType';
  id: Scalars['String'];
  name: Scalars['String'];
  type: TriggerTypeEnum;
  medium: TriggerMediumEnum;
  relatedNodeId?: Maybe<Scalars['String']>;
  relatedDialogue?: Maybe<Dialogue>;
  conditions: Array<TriggerConditionType>;
  recipients: Array<UserType>;
};

export enum TriggerTypeEnum {
  Question = 'QUESTION',
  Scheduled = 'SCHEDULED'
}

export type UpdateCtaInputType = {
  id?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<QuestionNodeTypeEnum>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
  form?: Maybe<FormNodeInputType>;
};

export type UpdatePermissionsInput = {
  roleId?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<SystemPermission>>;
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

export type UploadSessionEventsInput = {
  sessionId?: Maybe<Scalars['String']>;
  events?: Maybe<Array<SessionEventInput>>;
};

export type UploadSessionEventsOutput = {
  __typename?: 'UploadSessionEventsOutput';
  status: Scalars['String'];
};

export type UserConnection = ConnectionInterface & {
  __typename?: 'UserConnection';
  totalPages?: Maybe<Scalars['Int']>;
  pageInfo: PaginationPageInfo;
  userCustomers: Array<UserCustomer>;
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
  isActive: Scalars['Boolean'];
  user: UserType;
  customer: Customer;
  role: RoleType;
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
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['ID'];
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  lastLoggedIn?: Maybe<Scalars['Date']>;
  lastActivity?: Maybe<Scalars['Date']>;
  globalPermissions?: Maybe<Array<SystemPermission>>;
  userCustomers: Array<UserCustomer>;
  customers: Array<Customer>;
  roleId?: Maybe<Scalars['String']>;
  role?: Maybe<RoleType>;
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

export type CreateSessionMutationVariables = Exact<{
  input?: Maybe<SessionInput>;
}>;


export type CreateSessionMutation = (
  { __typename?: 'Mutation' }
  & { createSession: (
    { __typename?: 'Session' }
    & Pick<Session, 'id'>
  ) }
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
  )>, dialogues?: Maybe<Array<(
    { __typename?: 'Dialogue' }
    & Pick<Dialogue, 'id' | 'slug' | 'description' | 'title' | 'publicTitle'>
  )>> }
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
    & { children: Array<(
      { __typename?: 'Edge' }
      & Pick<Edge, 'id'>
    )> }
  )> }
);

export type CustomerQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type CustomerQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & CustomerFragmentFragment
  )> }
);

export type GetDialogueQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  dialogueSlug: Scalars['String'];
}>;


export type GetDialogueQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title' | 'slug' | 'publicTitle' | 'creationDate' | 'updatedAt' | 'customerId'>
      & { leafs: Array<(
        { __typename?: 'QuestionNode' }
        & Pick<QuestionNode, 'id' | 'title' | 'type'>
        & { links: Array<(
          { __typename?: 'LinkType' }
          & Pick<LinkType, 'url' | 'type' | 'title' | 'iconUrl' | 'backgroundColor' | 'buttonText' | 'header' | 'subHeader' | 'imageUrl'>
        )>, share?: Maybe<(
          { __typename?: 'ShareNodeType' }
          & Pick<ShareNodeType, 'id' | 'title' | 'url' | 'tooltip'>
        )> }
      )>, rootQuestion: (
        { __typename?: 'QuestionNode' }
        & QuestionFragmentFragment
      ), questions: Array<(
        { __typename?: 'QuestionNode' }
        & QuestionFragmentFragment
      )>, edges: Array<(
        { __typename?: 'Edge' }
        & EdgeFragmentFragment
      )>, customer?: Maybe<(
        { __typename?: 'Customer' }
        & CustomerFragmentFragment
      )> }
    )> }
  )> }
);

export type QuestionFragmentFragment = (
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
export const CustomerDocument = gql`
    query customer($slug: String!) {
  customer(slug: $slug) {
    ...CustomerFragment
  }
}
    ${CustomerFragmentFragmentDoc}`;

/**
 * __useCustomerQuery__
 *
 * To run a query within a React component, call `useCustomerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomerQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useCustomerQuery(baseOptions: Apollo.QueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
      }
export function useCustomerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, options);
        }
export type CustomerQueryHookResult = ReturnType<typeof useCustomerQuery>;
export type CustomerLazyQueryHookResult = ReturnType<typeof useCustomerLazyQuery>;
export type CustomerQueryResult = Apollo.QueryResult<CustomerQuery, CustomerQueryVariables>;
export function refetchCustomerQuery(variables?: CustomerQueryVariables) {
      return { query: CustomerDocument, variables: variables }
    }
export const GetDialogueDocument = gql`
    query getDialogue($customerSlug: String!, $dialogueSlug: String!) {
  customer(slug: $customerSlug) {
    id
    dialogue(where: {slug: $dialogueSlug}) {
      id
      title
      slug
      publicTitle
      creationDate
      updatedAt
      leafs {
        id
        title
        type
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
        share {
          id
          title
          url
          tooltip
        }
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
      customer {
        ...CustomerFragment
      }
    }
  }
}
    ${QuestionFragmentFragmentDoc}
${EdgeFragmentFragmentDoc}
${CustomerFragmentFragmentDoc}`;

/**
 * __useGetDialogueQuery__
 *
 * To run a query within a React component, call `useGetDialogueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDialogueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDialogueQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      dialogueSlug: // value for 'dialogueSlug'
 *   },
 * });
 */
export function useGetDialogueQuery(baseOptions: Apollo.QueryHookOptions<GetDialogueQuery, GetDialogueQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDialogueQuery, GetDialogueQueryVariables>(GetDialogueDocument, options);
      }
export function useGetDialogueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDialogueQuery, GetDialogueQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDialogueQuery, GetDialogueQueryVariables>(GetDialogueDocument, options);
        }
export type GetDialogueQueryHookResult = ReturnType<typeof useGetDialogueQuery>;
export type GetDialogueLazyQueryHookResult = ReturnType<typeof useGetDialogueLazyQuery>;
export type GetDialogueQueryResult = Apollo.QueryResult<GetDialogueQuery, GetDialogueQueryVariables>;
export function refetchGetDialogueQuery(variables?: GetDialogueQueryVariables) {
      return { query: GetDialogueDocument, variables: variables }
    }