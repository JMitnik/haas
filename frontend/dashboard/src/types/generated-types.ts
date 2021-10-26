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
  createRole: RoleType;
  updateRoles: RoleType;
  singleUpload: ImageType;
  createWorkspace: Customer;
  editWorkspace: Customer;
  deleteCustomer?: Maybe<Customer>;
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
  orderBy?: Maybe<UserConnectionOrderByInput>;
  offset?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

/** Fields to order UserConnection by. */
export enum UserConnectionOrder {
  FirstName = 'firstName',
  LastName = 'lastName',
  Email = 'email',
  CreatedAt = 'createdAt'
}

/** Sorting of UserConnection */
export type UserConnectionOrderByInput = {
  by: UserConnectionOrder;
  desc?: Maybe<Scalars['Boolean']>;
};

export type UserCustomer = {
  __typename?: 'UserCustomer';
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
      & { values: Array<(
        { __typename?: 'FormNodeEntryValueType' }
        & Pick<FormNodeEntryValueType, 'email' | 'phoneNumber' | 'url' | 'shortText' | 'longText' | 'number'>
        & { relatedField: (
          { __typename?: 'FormNodeField' }
          & Pick<FormNodeField, 'id' | 'type'>
        ) }
      )> }
    )> }
  )> }
);

export type SessionFragmentFragment = (
  { __typename?: 'Session' }
  & Pick<Session, 'id' | 'createdAt' | 'score' | 'originUrl' | 'totalTimeInSec' | 'device'>
  & { nodeEntries: Array<(
    { __typename?: 'NodeEntry' }
    & NodeEntryFragmentFragment
  )>, delivery?: Maybe<(
    { __typename?: 'DeliveryType' }
    & DeliveryFragmentFragment
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

export type GetWorkspaceAdminsQueryVariables = Exact<{
  customerSlug: Scalars['String'];
}>;


export type GetWorkspaceAdminsQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserType' }
    & Pick<UserType, 'id' | 'firstName' | 'lastName' | 'globalPermissions'>
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
  & { getAutodeckJobs: (
    { __typename?: 'AutodeckConnectionType' }
    & { jobs: Array<(
      { __typename?: 'CreateWorkspaceJobType' }
      & Pick<CreateWorkspaceJobType, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'referenceId' | 'errorMessage' | 'message' | 'status' | 'resourcesUrl' | 'referenceType' | 'requiresColorExtraction' | 'requiresRembg' | 'requiresScreenshot'>
      & { processLocation: (
        { __typename?: 'JobProcessLocation' }
        & Pick<JobProcessLocation, 'id' | 'name' | 'path' | 'type'>
        & { customFields?: Maybe<Array<(
          { __typename?: 'CustomFieldType' }
          & Pick<CustomFieldType, 'id' | 'key' | 'value'>
        )>> }
      ) }
    )>, pageInfo: (
      { __typename?: 'DeprecatedPaginationPageInfo' }
      & Pick<DeprecatedPaginationPageInfo, 'nrPages' | 'pageIndex'>
    ) }
  ) }
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
  & { getJobProcessLocations: (
    { __typename?: 'JobProcessLocations' }
    & { jobProcessLocations: Array<(
      { __typename?: 'JobProcessLocation' }
      & Pick<JobProcessLocation, 'id' | 'name' | 'path' | 'type'>
      & { customFields?: Maybe<Array<(
        { __typename?: 'CustomFieldType' }
        & Pick<CustomFieldType, 'id' | 'key' | 'value'>
      )>> }
    )> }
  ) }
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

export type CreateBatchDeliveriesMutationVariables = Exact<{
  input?: Maybe<CreateBatchDeliveriesInputType>;
}>;


export type CreateBatchDeliveriesMutation = (
  { __typename?: 'Mutation' }
  & { createBatchDeliveries: (
    { __typename?: 'CreateBatchDeliveriesOutputType' }
    & Pick<CreateBatchDeliveriesOutputType, 'nrDeliveries'>
    & { failedDeliveries: Array<(
      { __typename?: 'FailedDeliveryModel' }
      & Pick<FailedDeliveryModel, 'record' | 'error'>
    )> }
  ) }
);

export type GetDeliveryQueryVariables = Exact<{
  deliveryId?: Maybe<Scalars['String']>;
}>;


export type GetDeliveryQuery = (
  { __typename?: 'Query' }
  & { delivery?: Maybe<(
    { __typename?: 'DeliveryType' }
    & { events?: Maybe<Array<(
      { __typename?: 'DeliveryEventType' }
      & DeliveryEventFragmentFragment
    )>> }
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
          )>, events?: Maybe<Array<(
            { __typename?: 'DeliveryEventType' }
            & Pick<DeliveryEventType, 'id' | 'createdAt' | 'status' | 'failureMessage'>
          )>> }
        )>, pageInfo: (
          { __typename?: 'PaginationPageInfo' }
          & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
        ) }
      )>, variants?: Maybe<Array<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label' | 'from' | 'type' | 'weight' | 'body'>
        & { customVariables?: Maybe<Array<(
          { __typename?: 'CampaignVariantCustomVariableType' }
          & Pick<CampaignVariantCustomVariableType, 'id' | 'key'>
        )>>, dialogue?: Maybe<(
          { __typename?: 'Dialogue' }
          & Pick<Dialogue, 'id' | 'title'>
        )>, workspace?: Maybe<(
          { __typename?: 'Customer' }
          & Pick<Customer, 'id'>
        )> }
      )>> }
    )> }
  )> }
);

export type CreateCampaignMutationVariables = Exact<{
  input?: Maybe<CreateCampaignInputType>;
}>;


export type CreateCampaignMutation = (
  { __typename?: 'Mutation' }
  & { createCampaign: (
    { __typename?: 'CampaignType' }
    & Pick<CampaignType, 'id'>
  ) }
);

export type GetWorkspaceCampaignsQueryVariables = Exact<{
  customerSlug: Scalars['String'];
}>;


export type GetWorkspaceCampaignsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { campaigns: Array<(
      { __typename?: 'CampaignType' }
      & Pick<CampaignType, 'id' | 'label'>
      & { variants?: Maybe<Array<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label'>
      )>> }
    )> }
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
    & { dialogues?: Maybe<Array<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title' | 'slug' | 'publicTitle' | 'creationDate' | 'updatedAt' | 'customerId' | 'averageScore'>
      & { customer?: Maybe<(
        { __typename?: 'Customer' }
        & Pick<Customer, 'slug'>
      )>, tags?: Maybe<Array<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'type' | 'name'>
      )>> }
    )>> }
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

export type GetDialogueStatisticsQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  dialogueSlug: Scalars['String'];
  prevDateFilter?: Maybe<DialogueFilterInputType>;
  statisticsDateFilter?: Maybe<DialogueFilterInputType>;
}>;


export type GetDialogueStatisticsQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id' | 'title'>
      & { thisWeekAverageScore: Dialogue['averageScore'], previousScore: Dialogue['averageScore'] }
      & { sessions: Array<(
        { __typename?: 'Session' }
        & Pick<Session, 'id' | 'createdAt' | 'score'>
        & { nodeEntries: Array<(
          { __typename?: 'NodeEntry' }
          & { relatedNode?: Maybe<(
            { __typename?: 'QuestionNode' }
            & Pick<QuestionNode, 'title' | 'type'>
          )>, value?: Maybe<(
            { __typename?: 'NodeEntryValue' }
            & Pick<NodeEntryValue, 'sliderNodeEntry' | 'textboxNodeEntry' | 'registrationNodeEntry' | 'choiceNodeEntry' | 'linkNodeEntry'>
          )> }
        )> }
      )>, statistics?: Maybe<(
        { __typename?: 'DialogueStatistics' }
        & Pick<DialogueStatistics, 'nrInteractions'>
        & { topPositivePath?: Maybe<Array<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'answer' | 'quantity' | 'basicSentiment'>
        )>>, mostPopularPath?: Maybe<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'answer' | 'quantity' | 'basicSentiment'>
        )>, topNegativePath?: Maybe<Array<(
          { __typename?: 'topPathType' }
          & Pick<TopPathType, 'quantity' | 'answer' | 'basicSentiment'>
        )>>, history?: Maybe<Array<(
          { __typename?: 'lineChartDataType' }
          & Pick<LineChartDataType, 'x' | 'y'>
        )>> }
      )> }
    )> }
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
      )>, events?: Maybe<Array<(
        { __typename?: 'DeliveryEventType' }
        & DeliveryEventFragmentFragment
      )>> }
      & DeliveryFragmentFragment
    )> }
    & SessionFragmentFragment
  )> }
);

export type GetInteractionsQueryQueryVariables = Exact<{
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  sessionsFilter?: Maybe<SessionConnectionFilterInput>;
}>;


export type GetInteractionsQueryQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { dialogue?: Maybe<(
      { __typename?: 'Dialogue' }
      & Pick<Dialogue, 'id'>
      & { campaignVariants: Array<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label'>
        & { campaign?: Maybe<(
          { __typename?: 'CampaignType' }
          & Pick<CampaignType, 'id' | 'label'>
        )> }
      )>, sessionConnection?: Maybe<(
        { __typename?: 'SessionConnection' }
        & Pick<SessionConnection, 'totalPages'>
        & { sessions: Array<(
          { __typename?: 'Session' }
          & SessionFragmentFragment
        )>, pageInfo: (
          { __typename?: 'PaginationPageInfo' }
          & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'pageIndex' | 'nextPageOffset' | 'prevPageOffset'>
        ) }
      )> }
    )> }
  )> }
);

export type RequestInviteMutationVariables = Exact<{
  input?: Maybe<RequestInviteInput>;
}>;


export type RequestInviteMutation = (
  { __typename?: 'Mutation' }
  & { requestInvite: (
    { __typename?: 'RequestInviteOutput' }
    & Pick<RequestInviteOutput, 'didInvite' | 'userExists'>
  ) }
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
      & { userCustomers: Array<(
        { __typename?: 'UserCustomer' }
        & { user: (
          { __typename?: 'UserType' }
          & Pick<UserType, 'id' | 'email' | 'firstName' | 'lastName'>
        ), role: (
          { __typename?: 'RoleType' }
          & Pick<RoleType, 'id' | 'name'>
        ) }
      )>, pageInfo: (
        { __typename?: 'PaginationPageInfo' }
        & Pick<PaginationPageInfo, 'hasPrevPage' | 'hasNextPage' | 'prevPageOffset' | 'nextPageOffset' | 'pageIndex'>
      ) }
    )> }
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
    & { roles?: Maybe<Array<(
      { __typename?: 'RoleType' }
      & Pick<RoleType, 'id' | 'name'>
    )>> }
  )> }
);

export type GetUserCustomerFromCustomerQueryVariables = Exact<{
  id: Scalars['ID'];
  userId: Scalars['String'];
}>;


export type GetUserCustomerFromCustomerQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { userCustomer?: Maybe<(
      { __typename?: 'UserCustomer' }
      & { user: (
        { __typename?: 'UserType' }
        & Pick<UserType, 'id' | 'email' | 'phone' | 'firstName' | 'lastName'>
      ), role: (
        { __typename?: 'RoleType' }
        & Pick<RoleType, 'name' | 'id'>
      ) }
    )> }
  )> }
);

export const DeliveryEventFragmentFragmentDoc = gql`
    fragment DeliveryEventFragment on DeliveryEventType {
  id
  status
  createdAt
  failureMessage
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
  nodeEntries {
    ...NodeEntryFragment
  }
  delivery {
    ...DeliveryFragment
  }
}
    ${NodeEntryFragmentFragmentDoc}
${DeliveryFragmentFragmentDoc}`;
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
export const GetWorkspaceAdminsDocument = gql`
    query GetWorkspaceAdmins($customerSlug: String!) {
  users(customerSlug: $customerSlug) {
    id
    firstName
    lastName
    globalPermissions
  }
}
    `;

/**
 * __useGetWorkspaceAdminsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceAdminsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceAdminsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceAdminsQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *   },
 * });
 */
export function useGetWorkspaceAdminsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceAdminsQuery, GetWorkspaceAdminsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceAdminsQuery, GetWorkspaceAdminsQueryVariables>(GetWorkspaceAdminsDocument, options);
      }
export function useGetWorkspaceAdminsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceAdminsQuery, GetWorkspaceAdminsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceAdminsQuery, GetWorkspaceAdminsQueryVariables>(GetWorkspaceAdminsDocument, options);
        }
export type GetWorkspaceAdminsQueryHookResult = ReturnType<typeof useGetWorkspaceAdminsQuery>;
export type GetWorkspaceAdminsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceAdminsLazyQuery>;
export type GetWorkspaceAdminsQueryResult = Apollo.QueryResult<GetWorkspaceAdminsQuery, GetWorkspaceAdminsQueryVariables>;
export function refetchGetWorkspaceAdminsQuery(variables?: GetWorkspaceAdminsQueryVariables) {
      return { query: GetWorkspaceAdminsDocument, variables: variables }
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
  uploadJobImage(file: $file, jobId: $jobId, type: $type, disapproved: $disapproved) {
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
export const GetDialogueStatisticsDocument = gql`
    query GetDialogueStatistics($customerSlug: String!, $dialogueSlug: String!, $prevDateFilter: DialogueFilterInputType, $statisticsDateFilter: DialogueFilterInputType) {
  customer(slug: $customerSlug) {
    id
    dialogue(where: {slug: $dialogueSlug}) {
      id
      title
      thisWeekAverageScore: averageScore(input: $statisticsDateFilter)
      previousScore: averageScore(input: $prevDateFilter)
      sessions(take: 3) {
        id
        createdAt
        score
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
      statistics(input: $statisticsDateFilter) {
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
 *      prevDateFilter: // value for 'prevDateFilter'
 *      statisticsDateFilter: // value for 'statisticsDateFilter'
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
export const GetInteractionsQueryDocument = gql`
    query GetInteractionsQuery($customerSlug: String, $dialogueSlug: String, $sessionsFilter: SessionConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    dialogue(where: {slug: $dialogueSlug}) {
      id
      campaignVariants {
        id
        label
        campaign {
          id
          label
        }
      }
      sessionConnection(filter: $sessionsFilter) {
        sessions {
          ...SessionFragment
        }
        totalPages
        pageInfo {
          hasPrevPage
          hasNextPage
          pageIndex
          nextPageOffset
          prevPageOffset
        }
      }
    }
  }
}
    ${SessionFragmentFragmentDoc}`;

/**
 * __useGetInteractionsQueryQuery__
 *
 * To run a query within a React component, call `useGetInteractionsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInteractionsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInteractionsQueryQuery({
 *   variables: {
 *      customerSlug: // value for 'customerSlug'
 *      dialogueSlug: // value for 'dialogueSlug'
 *      sessionsFilter: // value for 'sessionsFilter'
 *   },
 * });
 */
export function useGetInteractionsQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetInteractionsQueryQuery, GetInteractionsQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInteractionsQueryQuery, GetInteractionsQueryQueryVariables>(GetInteractionsQueryDocument, options);
      }
export function useGetInteractionsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInteractionsQueryQuery, GetInteractionsQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInteractionsQueryQuery, GetInteractionsQueryQueryVariables>(GetInteractionsQueryDocument, options);
        }
export type GetInteractionsQueryQueryHookResult = ReturnType<typeof useGetInteractionsQueryQuery>;
export type GetInteractionsQueryLazyQueryHookResult = ReturnType<typeof useGetInteractionsQueryLazyQuery>;
export type GetInteractionsQueryQueryResult = Apollo.QueryResult<GetInteractionsQueryQuery, GetInteractionsQueryQueryVariables>;
export function refetchGetInteractionsQueryQuery(variables?: GetInteractionsQueryQueryVariables) {
      return { query: GetInteractionsQueryDocument, variables: variables }
    }
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
export const GetPaginatedUsersDocument = gql`
    query getPaginatedUsers($customerSlug: String!, $filter: UserConnectionFilterInput) {
  customer(slug: $customerSlug) {
    id
    usersConnection(filter: $filter) {
      userCustomers {
        user {
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
    query GetUserCustomerFromCustomer($id: ID!, $userId: String!) {
  customer(id: $id) {
    id
    userCustomer(userId: $userId) {
      user {
        id
        email
        phone
        firstName
        lastName
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