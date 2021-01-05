import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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

/** Append new data to an uploaded session */
export type AppendToInteractionInput = {
  sessionId?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['String']>;
  edgeId?: Maybe<Scalars['String']>;
  data?: Maybe<NodeEntryDataInput>;
};

/** Campaign */
export type CampaignType = {
  __typename?: 'CampaignType';
  id: Scalars['ID'];
  label: Scalars['String'];
  variants: Array<CampaignVariantType>;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
};


/** Campaign */
export type CampaignTypeDeliveryConnectionArgs = {
  filter?: Maybe<DeliveryConnectionFilter>;
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
  workspace: Customer;
  dialogue: Dialogue;
  deliveryConnection?: Maybe<DeliveryConnectionType>;
};

/** Input type for a choice node */
export type ChoiceNodeEntryInput = {
  value?: Maybe<Scalars['String']>;
};

export type ColourSettings = {
  __typename?: 'ColourSettings';
  id: Scalars['ID'];
  primary: Scalars['String'];
  secondary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
};

/** Interface all pagination-based models should implement */
export type ConnectionInterface = {
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
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

export type CreateCampaignInputType = {
  label?: Maybe<Scalars['String']>;
  workspaceId: Scalars['ID'];
  variants?: Maybe<Array<CreateCampaignVariantInputType>>;
};

export type CreateCampaignVariantInputType = {
  label?: Maybe<Scalars['String']>;
  workspaceId: Scalars['ID'];
  dialogueId: Scalars['ID'];
  type: CampaignVariantEnum;
  body?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  subject?: Maybe<Scalars['String']>;
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
};

export type CreateQuestionNodeInputType = {
  customerId?: Maybe<Scalars['ID']>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  parentQuestionId?: Maybe<Scalars['ID']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  primaryColour: Scalars['String'];
  isSeed?: Maybe<Scalars['Boolean']>;
  willGenerateFakeData?: Maybe<Scalars['Boolean']>;
};

export type CtaLinkInputObjectType = {
  url?: Maybe<Scalars['String']>;
  type?: Maybe<LinkTypeEnumType>;
  id?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  backgroundColor?: Maybe<Scalars['String']>;
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
  userCustomer?: Maybe<UserCustomer>;
  dialogues?: Maybe<Array<Dialogue>>;
  users?: Maybe<Array<UserType>>;
  campaign: CampaignType;
  campaigns: Array<CampaignType>;
};


export type CustomerUsersConnectionArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  filter?: Maybe<PaginationWhereInput>;
};


export type CustomerDialogueArgs = {
  where?: Maybe<DialogueWhereUniqueInput>;
};


export type CustomerUserCustomerArgs = {
  userId?: Maybe<Scalars['String']>;
};


export type CustomerDialoguesArgs = {
  filter?: Maybe<DialogueFilterInputType>;
};


export type CustomerCampaignArgs = {
  campaignId?: Maybe<Scalars['String']>;
};

export type CustomerSettings = {
  __typename?: 'CustomerSettings';
  id: Scalars['ID'];
  logoUrl?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettings>;
  fontSettings?: Maybe<FontSettings>;
};

export type CustomerWhereUniqueInput = {
  id: Scalars['ID'];
};


export type Debug = {
  __typename?: 'Debug';
  debugResolver?: Maybe<Scalars['String']>;
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

export type DeliveryConnectionFilter = {
  campaignId?: Maybe<Scalars['String']>;
  paginationFilter?: Maybe<PaginationWhereInput>;
  status?: Maybe<DeliveryStatusEnum>;
  campaignVariantId?: Maybe<Scalars['ID']>;
};

export type DeliveryConnectionType = ConnectionInterface & {
  __typename?: 'DeliveryConnectionType';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  deliveries: Array<DeliveryType>;
  nrTotal: Scalars['Int'];
  nrSent: Scalars['Int'];
  nrOpened: Scalars['Int'];
  nrFinished: Scalars['Int'];
};

export enum DeliveryStatusEnum {
  Scheduled = 'SCHEDULED',
  Deployed = 'DEPLOYED',
  Sent = 'SENT',
  Opened = 'OPENED',
  Finished = 'FINISHED'
}

/** Delivery */
export type DeliveryType = {
  __typename?: 'DeliveryType';
  id: Scalars['ID'];
  deliveryRecipientFirstName: Scalars['String'];
  deliveryRecipientLastName: Scalars['String'];
  deliveryRecipientEmail: Scalars['String'];
  deliveryRecipientPhone: Scalars['String'];
  scheduledAt: Scalars['String'];
  updatedAt: Scalars['String'];
  campaignVariant: CampaignVariantType;
  currentStatus: DeliveryStatusEnum;
};

export type Dialogue = {
  __typename?: 'Dialogue';
  id: Scalars['ID'];
  title: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  isWithoutGenData: Scalars['Boolean'];
  wasGeneratedWithGenData: Scalars['Boolean'];
  publicTitle?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
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
};


export type DialogueAverageScoreArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueStatisticsArgs = {
  input?: Maybe<DialogueFilterInputType>;
};


export type DialogueSessionConnectionArgs = {
  filter?: Maybe<PaginationWhereInput>;
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
};

export type FormNodeFieldInput = {
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<Scalars['String']>;
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
  fields?: Maybe<Array<FormNodeFieldInput>>;
};

export type FormNodeType = {
  __typename?: 'FormNodeType';
  id?: Maybe<Scalars['String']>;
  fields: Array<FormNodeField>;
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
  questionNode: QuestionNode;
};

export enum LinkTypeEnumType {
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
  createUser: UserType;
  editUser: UserType;
  deleteUser: DeleteUserOutput;
  copyDialogue: Dialogue;
  createDialogue: Dialogue;
  editDialogue: Dialogue;
  deleteDialogue: Dialogue;
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
  deleteQuestion: QuestionNode;
  updateQuestion: QuestionNode;
  createQuestion?: Maybe<QuestionNode>;
  deleteCTA: QuestionNode;
  /** Create Call to Actions */
  createCTA: QuestionNode;
  updateCTA: QuestionNode;
  debugMutation?: Maybe<Scalars['String']>;
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


export type MutationCreateUserArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  input?: Maybe<UserInput>;
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
};


export type MutationDeleteDialogueArgs = {
  input?: Maybe<DeleteDialogueInputType>;
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


export type MutationDeleteQuestionArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationUpdateQuestionArgs = {
  input?: Maybe<UpdateQuestionNodeInputType>;
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
  formNodeEntry?: Maybe<FormNodeEntryType>;
};

export type OptionInputType = {
  id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
};

export type OptionsInputType = {
  options?: Maybe<Array<OptionInputType>>;
};

/** Information with regards to current page, and total number of pages */
export type PaginationPageInfo = {
  __typename?: 'PaginationPageInfo';
  nrPages: Scalars['Int'];
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
  ScheduledAt = 'scheduledAt'
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

export type Query = {
  __typename?: 'Query';
  tags: Array<Tag>;
  delivery?: Maybe<DeliveryType>;
  triggerConnection?: Maybe<TriggerConnectionType>;
  trigger?: Maybe<TriggerType>;
  triggers: Array<TriggerType>;
  roleConnection: RoleConnection;
  roles?: Maybe<Array<RoleType>>;
  customers: Array<Customer>;
  customer?: Maybe<Customer>;
  UserOfCustomer?: Maybe<UserCustomer>;
  me: UserType;
  users: Array<UserType>;
  user?: Maybe<UserType>;
  lineChartData: Array<LineChartDataType>;
  dialogue?: Maybe<Dialogue>;
  dialogues: Array<Dialogue>;
  refreshAccessToken: RefreshAccessTokenOutput;
  sessions: Array<Session>;
  session?: Maybe<Session>;
  questionNode?: Maybe<QuestionNode>;
  questionNodes: Array<QuestionNode>;
  edge?: Maybe<Edge>;
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


export type QueryRolesArgs = {
  customerSlug?: Maybe<Scalars['String']>;
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


export type QueryLineChartDataArgs = {
  dialogueId?: Maybe<Scalars['String']>;
  numberOfDaysBack?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
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
  where?: Maybe<SessionWhereUniqueInput>;
};


export type QueryQuestionNodeArgs = {
  where?: Maybe<QuestionNodeWhereUniqueInput>;
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
  Share = 'SHARE'
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

export type RequestInviteInput = {
  email: Scalars['String'];
};

export type RequestInviteOutput = {
  __typename?: 'RequestInviteOutput';
  didInvite: Scalars['Boolean'];
};

export type RoleConnection = ConnectionInterface & {
  __typename?: 'RoleConnection';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
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
  paths: Scalars['Int'];
  score: Scalars['Float'];
  nodeEntries: Array<NodeEntry>;
};

export type SessionConnection = ConnectionInterface & {
  __typename?: 'SessionConnection';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  sessions: Array<Session>;
};

/** Input for session */
export type SessionInput = {
  dialogueId: Scalars['String'];
  entries?: Maybe<Array<NodeEntryInput>>;
  deliveryId?: Maybe<Scalars['String']>;
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

export type TriggerConnectionType = ConnectionInterface & {
  __typename?: 'TriggerConnectionType';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
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
  id?: Maybe<Scalars['ID']>;
  customerId?: Maybe<Scalars['ID']>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  edgeId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  sliderNode?: Maybe<SliderNodeInputType>;
  optionEntries?: Maybe<OptionsInputType>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
};


export type UserConnection = ConnectionInterface & {
  __typename?: 'UserConnection';
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  pageInfo: PaginationPageInfo;
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  userCustomers: Array<UserCustomer>;
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

export type GetWorkspaceCampaignQueryVariables = Exact<{
  customerSlug: Scalars['String'];
  campaignId: Scalars['String'];
  deliveryConnectionFilter?: Maybe<DeliveryConnectionFilter>;
}>;


export type GetWorkspaceCampaignQuery = (
  { __typename?: 'Query' }
  & { customer?: Maybe<(
    { __typename?: 'Customer' }
    & Pick<Customer, 'id'>
    & { campaign: (
      { __typename?: 'CampaignType' }
      & Pick<CampaignType, 'id' | 'label'>
      & { deliveryConnection?: Maybe<(
        { __typename?: 'DeliveryConnectionType' }
        & Pick<DeliveryConnectionType, 'nrTotal' | 'nrSent' | 'nrOpened' | 'nrFinished'>
        & { deliveries: Array<(
          { __typename?: 'DeliveryType' }
          & Pick<DeliveryType, 'id' | 'deliveryRecipientFirstName' | 'deliveryRecipientLastName' | 'deliveryRecipientEmail' | 'deliveryRecipientPhone' | 'scheduledAt' | 'updatedAt' | 'currentStatus'>
        )> }
      )>, variants: Array<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label'>
      )> }
    ) }
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
      & { variants: Array<(
        { __typename?: 'CampaignVariantType' }
        & Pick<CampaignVariantType, 'id' | 'label'>
      )> }
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
        return Apollo.useMutation<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>(CreateBatchDeliveriesDocument, baseOptions);
      }
export type CreateBatchDeliveriesMutationHookResult = ReturnType<typeof useCreateBatchDeliveriesMutation>;
export type CreateBatchDeliveriesMutationResult = Apollo.MutationResult<CreateBatchDeliveriesMutation>;
export type CreateBatchDeliveriesMutationOptions = Apollo.BaseMutationOptions<CreateBatchDeliveriesMutation, CreateBatchDeliveriesMutationVariables>;
export const GetWorkspaceCampaignDocument = gql`
    query GetWorkspaceCampaign($customerSlug: String!, $campaignId: String!, $deliveryConnectionFilter: DeliveryConnectionFilter) {
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
        }
        nrTotal
        nrSent
        nrOpened
        nrFinished
      }
      variants {
        id
        label
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
        return Apollo.useQuery<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>(GetWorkspaceCampaignDocument, baseOptions);
      }
export function useGetWorkspaceCampaignLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>) {
          return Apollo.useLazyQuery<GetWorkspaceCampaignQuery, GetWorkspaceCampaignQueryVariables>(GetWorkspaceCampaignDocument, baseOptions);
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
        return Apollo.useMutation<CreateCampaignMutation, CreateCampaignMutationVariables>(CreateCampaignDocument, baseOptions);
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
        return Apollo.useQuery<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>(GetWorkspaceCampaignsDocument, baseOptions);
      }
export function useGetWorkspaceCampaignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>) {
          return Apollo.useLazyQuery<GetWorkspaceCampaignsQuery, GetWorkspaceCampaignsQueryVariables>(GetWorkspaceCampaignsDocument, baseOptions);
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
        return Apollo.useQuery<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>(GetWorkspaceDialoguesDocument, baseOptions);
      }
export function useGetWorkspaceDialoguesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>) {
          return Apollo.useLazyQuery<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>(GetWorkspaceDialoguesDocument, baseOptions);
        }
export type GetWorkspaceDialoguesQueryHookResult = ReturnType<typeof useGetWorkspaceDialoguesQuery>;
export type GetWorkspaceDialoguesLazyQueryHookResult = ReturnType<typeof useGetWorkspaceDialoguesLazyQuery>;
export type GetWorkspaceDialoguesQueryResult = Apollo.QueryResult<GetWorkspaceDialoguesQuery, GetWorkspaceDialoguesQueryVariables>;
export function refetchGetWorkspaceDialoguesQuery(variables?: GetWorkspaceDialoguesQueryVariables) {
      return { query: GetWorkspaceDialoguesDocument, variables: variables }
    }