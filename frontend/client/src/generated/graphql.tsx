import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-hooks';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** Date custom scalar type */
  Date: any;
};

/** Append new data to an uploaded session */
export type AppendToInteractionInput = {
  sessionId?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['String']>;
  edgeId?: Maybe<Scalars['String']>;
  data?: Maybe<NodeEntryDataInput>;
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

export type CreateCtaInputType = {
  customerSlug?: Maybe<Scalars['String']>;
  dialogueSlug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
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

export type CustomerCreateOptions = {
  slug: Scalars['String'];
  primaryColour: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  isSeed?: Maybe<Scalars['Boolean']>;
};

export type CustomerEditOptions = {
  slug: Scalars['String'];
  name: Scalars['String'];
  logo?: Maybe<Scalars['String']>;
  primaryColour: Scalars['String'];
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

export type Dialogue = {
   __typename?: 'Dialogue';
  id: Scalars['ID'];
  title: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  averageScore: Scalars['Float'];
  /** Count number of interactions between start-date and end-date */
  countInteractions: Scalars['Int'];
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


export type DialogueCountInteractionsArgs = {
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

export type FontSettings = {
   __typename?: 'FontSettings';
  id: Scalars['ID'];
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
  deleteTrigger?: Maybe<TriggerType>;
  editTrigger: TriggerType;
  createTrigger: TriggerType;
  createPermission?: Maybe<PermssionType>;
  createRole: RoleType;
  updateRoles: RoleType;
  deleteCustomer?: Maybe<Customer>;
  singleUpload: ImageType;
  createCustomer: Customer;
  editCustomer: Customer;
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
  updateCTA: QuestionNode;
  deleteCTA: QuestionNode;
  /** Create Call to Actions */
  createCTA: QuestionNode;
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


export type MutationDeleteTriggerArgs = {
  id?: Maybe<Scalars['String']>;
};


export type MutationEditTriggerArgs = {
  triggerId?: Maybe<Scalars['String']>;
  questionId?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
};


export type MutationCreateTriggerArgs = {
  customerSlug?: Maybe<Scalars['String']>;
  questionId?: Maybe<Scalars['String']>;
  recipients?: Maybe<RecipientsInputType>;
  trigger?: Maybe<TriggerInputType>;
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


export type MutationDeleteCustomerArgs = {
  where?: Maybe<CustomerWhereUniqueInput>;
};


export type MutationSingleUploadArgs = {
  file?: Maybe<Scalars['Upload']>;
};


export type MutationCreateCustomerArgs = {
  name?: Maybe<Scalars['String']>;
  options?: Maybe<CustomerCreateOptions>;
};


export type MutationEditCustomerArgs = {
  id?: Maybe<Scalars['String']>;
  options?: Maybe<CustomerEditOptions>;
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


export type MutationUpdateCtaArgs = {
  input?: Maybe<UpdateCtaInputType>;
};


export type MutationDeleteCtaArgs = {
  input?: Maybe<DeleteNodeInputType>;
};


export type MutationCreateCtaArgs = {
  input?: Maybe<CreateCtaInputType>;
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
  register?: Maybe<RegisterNodeEntryInput>;
  choice?: Maybe<ChoiceNodeEntryInput>;
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
  When = 'when'
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
  createdAt: Scalars['String'];
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

/** Input type for a slider node */
export type SliderNodeEntryInput = {
  value?: Maybe<Scalars['Int']>;
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
  CanEditWorkspace = 'CAN_EDIT_WORKSPACE'
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
  relatedNode?: Maybe<QuestionNode>;
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
  type?: Maybe<Scalars['String']>;
  links?: Maybe<CtaLinksInputType>;
  share?: Maybe<ShareNodeInputType>;
};

export type UpdateQuestionNodeInputType = {
  id?: Maybe<Scalars['ID']>;
  customerId?: Maybe<Scalars['ID']>;
  overrideLeafId?: Maybe<Scalars['ID']>;
  edgeId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  optionEntries?: Maybe<OptionsInputType>;
  edgeCondition?: Maybe<EdgeConditionInputType>;
};


export type UserConnection = {
   __typename?: 'UserConnection';
  pageIndex?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
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

export type CustomerFragmentFragment = (
  { __typename?: 'Customer' }
  & Pick<Customer, 'id' | 'name' | 'slug'>
  & { settings?: Maybe<(
    { __typename?: 'CustomerSettings' }
    & Pick<CustomerSettings, 'id' | 'logoUrl'>
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
    & Pick<QuestionNode, 'id'>
  )>, childNode?: Maybe<(
    { __typename?: 'QuestionNode' }
    & Pick<QuestionNode, 'id'>
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
          & Pick<LinkType, 'url' | 'type' | 'title' | 'iconUrl' | 'backgroundColor'>
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
  }
  childNode {
    id
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
  }
}
    ${EdgeFragmentFragmentDoc}`;
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
export function useCustomerQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
        return ApolloReactHooks.useQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, baseOptions);
      }
export function useCustomerLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CustomerQuery, CustomerQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CustomerQuery, CustomerQueryVariables>(CustomerDocument, baseOptions);
        }
export type CustomerQueryHookResult = ReturnType<typeof useCustomerQuery>;
export type CustomerLazyQueryHookResult = ReturnType<typeof useCustomerLazyQuery>;
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
export function useGetDialogueQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDialogueQuery, GetDialogueQueryVariables>) {
        return ApolloReactHooks.useQuery<GetDialogueQuery, GetDialogueQueryVariables>(GetDialogueDocument, baseOptions);
      }
export function useGetDialogueLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDialogueQuery, GetDialogueQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetDialogueQuery, GetDialogueQueryVariables>(GetDialogueDocument, baseOptions);
        }
export type GetDialogueQueryHookResult = ReturnType<typeof useGetDialogueQuery>;
export type GetDialogueLazyQueryHookResult = ReturnType<typeof useGetDialogueLazyQuery>;