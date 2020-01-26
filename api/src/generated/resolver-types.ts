import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Long: any,
};

export type AggregateQuestion = {
   __typename?: 'AggregateQuestion',
  count: Scalars['Int'],
};

export type AggregateTopic = {
   __typename?: 'AggregateTopic',
  count: Scalars['Int'],
};

export type BatchPayload = {
   __typename?: 'BatchPayload',
  count: Scalars['Long'],
};


export type Mutation = {
   __typename?: 'Mutation',
  createQuestion: Question,
  updateQuestion?: Maybe<Question>,
  upsertQuestion: Question,
  deleteQuestion?: Maybe<Question>,
  deleteManyQuestions: BatchPayload,
  createTopic: Topic,
  updateTopic?: Maybe<Topic>,
  updateManyTopics: BatchPayload,
  upsertTopic: Topic,
  deleteTopic?: Maybe<Topic>,
  deleteManyTopics: BatchPayload,
};


export type MutationCreateQuestionArgs = {
  data: QuestionCreateInput
};


export type MutationUpdateQuestionArgs = {
  data: QuestionUpdateInput,
  where: QuestionWhereUniqueInput
};


export type MutationUpsertQuestionArgs = {
  where: QuestionWhereUniqueInput,
  create: QuestionCreateInput,
  update: QuestionUpdateInput
};


export type MutationDeleteQuestionArgs = {
  where: QuestionWhereUniqueInput
};


export type MutationDeleteManyQuestionsArgs = {
  where?: Maybe<QuestionWhereInput>
};


export type MutationCreateTopicArgs = {
  data: TopicCreateInput
};


export type MutationUpdateTopicArgs = {
  data: TopicUpdateInput,
  where: TopicWhereUniqueInput
};


export type MutationUpdateManyTopicsArgs = {
  data: TopicUpdateManyMutationInput,
  where?: Maybe<TopicWhereInput>
};


export type MutationUpsertTopicArgs = {
  where: TopicWhereUniqueInput,
  create: TopicCreateInput,
  update: TopicUpdateInput
};


export type MutationDeleteTopicArgs = {
  where: TopicWhereUniqueInput
};


export type MutationDeleteManyTopicsArgs = {
  where?: Maybe<TopicWhereInput>
};

export enum MutationType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED'
}

export type Node = {
  id: Scalars['ID'],
};

export type PageInfo = {
   __typename?: 'PageInfo',
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
  startCursor?: Maybe<Scalars['String']>,
  endCursor?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  question?: Maybe<Question>,
  questions: Array<Maybe<Question>>,
  questionsConnection: QuestionConnection,
  topic?: Maybe<Topic>,
  topics: Array<Maybe<Topic>>,
  topicsConnection: TopicConnection,
  node?: Maybe<Node>,
};


export type QueryQuestionArgs = {
  where: QuestionWhereUniqueInput
};


export type QueryQuestionsArgs = {
  where?: Maybe<QuestionWhereInput>,
  orderBy?: Maybe<QuestionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionsConnectionArgs = {
  where?: Maybe<QuestionWhereInput>,
  orderBy?: Maybe<QuestionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryTopicArgs = {
  where: TopicWhereUniqueInput
};


export type QueryTopicsArgs = {
  where?: Maybe<TopicWhereInput>,
  orderBy?: Maybe<TopicOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryTopicsConnectionArgs = {
  where?: Maybe<TopicWhereInput>,
  orderBy?: Maybe<TopicOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryNodeArgs = {
  id: Scalars['ID']
};

export type Question = {
   __typename?: 'Question',
  id: Scalars['ID'],
  children?: Maybe<Array<Question>>,
};


export type QuestionChildrenArgs = {
  where?: Maybe<QuestionWhereInput>,
  orderBy?: Maybe<QuestionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type QuestionConnection = {
   __typename?: 'QuestionConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionEdge>>,
  aggregate: AggregateQuestion,
};

export type QuestionCreateInput = {
  id?: Maybe<Scalars['ID']>,
  children?: Maybe<QuestionCreateManyInput>,
};

export type QuestionCreateManyInput = {
  create?: Maybe<Array<QuestionCreateInput>>,
  connect?: Maybe<Array<QuestionWhereUniqueInput>>,
};

export type QuestionEdge = {
   __typename?: 'QuestionEdge',
  node: Question,
  cursor: Scalars['String'],
};

export enum QuestionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type QuestionPreviousValues = {
   __typename?: 'QuestionPreviousValues',
  id: Scalars['ID'],
};

export type QuestionScalarWhereInput = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  AND?: Maybe<Array<QuestionScalarWhereInput>>,
  OR?: Maybe<Array<QuestionScalarWhereInput>>,
  NOT?: Maybe<Array<QuestionScalarWhereInput>>,
};

export type QuestionSubscriptionPayload = {
   __typename?: 'QuestionSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Question>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionPreviousValues>,
};

export type QuestionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionWhereInput>,
  AND?: Maybe<Array<QuestionSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionSubscriptionWhereInput>>,
};

export type QuestionUpdateDataInput = {
  children?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionUpdateInput = {
  children?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionUpdateManyInput = {
  create?: Maybe<Array<QuestionCreateInput>>,
  update?: Maybe<Array<QuestionUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<QuestionUpsertWithWhereUniqueNestedInput>>,
  delete?: Maybe<Array<QuestionWhereUniqueInput>>,
  connect?: Maybe<Array<QuestionWhereUniqueInput>>,
  set?: Maybe<Array<QuestionWhereUniqueInput>>,
  disconnect?: Maybe<Array<QuestionWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionScalarWhereInput>>,
};

export type QuestionUpdateWithWhereUniqueNestedInput = {
  where: QuestionWhereUniqueInput,
  data: QuestionUpdateDataInput,
};

export type QuestionUpsertWithWhereUniqueNestedInput = {
  where: QuestionWhereUniqueInput,
  update: QuestionUpdateDataInput,
  create: QuestionCreateInput,
};

export type QuestionWhereInput = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  children_every?: Maybe<QuestionWhereInput>,
  children_some?: Maybe<QuestionWhereInput>,
  children_none?: Maybe<QuestionWhereInput>,
  AND?: Maybe<Array<QuestionWhereInput>>,
  OR?: Maybe<Array<QuestionWhereInput>>,
  NOT?: Maybe<Array<QuestionWhereInput>>,
};

export type QuestionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Subscription = {
   __typename?: 'Subscription',
  question?: Maybe<QuestionSubscriptionPayload>,
  topic?: Maybe<TopicSubscriptionPayload>,
};


export type SubscriptionQuestionArgs = {
  where?: Maybe<QuestionSubscriptionWhereInput>
};


export type SubscriptionTopicArgs = {
  where?: Maybe<TopicSubscriptionWhereInput>
};

export type Topic = {
   __typename?: 'Topic',
  id: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
  questions?: Maybe<Array<Question>>,
};


export type TopicQuestionsArgs = {
  where?: Maybe<QuestionWhereInput>,
  orderBy?: Maybe<QuestionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type TopicConnection = {
   __typename?: 'TopicConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<TopicEdge>>,
  aggregate: AggregateTopic,
};

export type TopicCreateInput = {
  id?: Maybe<Scalars['ID']>,
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionCreateManyInput>,
};

export type TopicEdge = {
   __typename?: 'TopicEdge',
  node: Topic,
  cursor: Scalars['String'],
};

export enum TopicOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  PublicTitleAsc = 'publicTitle_ASC',
  PublicTitleDesc = 'publicTitle_DESC',
  LogoUrlAsc = 'logoUrl_ASC',
  LogoUrlDesc = 'logoUrl_DESC',
  LanguageAsc = 'language_ASC',
  LanguageDesc = 'language_DESC',
  TopicUrlAsc = 'topicUrl_ASC',
  TopicUrlDesc = 'topicUrl_DESC'
}

export type TopicPreviousValues = {
   __typename?: 'TopicPreviousValues',
  id: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
};

export type TopicSubscriptionPayload = {
   __typename?: 'TopicSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Topic>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<TopicPreviousValues>,
};

export type TopicSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<TopicWhereInput>,
  AND?: Maybe<Array<TopicSubscriptionWhereInput>>,
  OR?: Maybe<Array<TopicSubscriptionWhereInput>>,
  NOT?: Maybe<Array<TopicSubscriptionWhereInput>>,
};

export type TopicUpdateInput = {
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionUpdateManyInput>,
};

export type TopicUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
};

export type TopicWhereInput = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  description_not?: Maybe<Scalars['String']>,
  description_in?: Maybe<Array<Scalars['String']>>,
  description_not_in?: Maybe<Array<Scalars['String']>>,
  description_lt?: Maybe<Scalars['String']>,
  description_lte?: Maybe<Scalars['String']>,
  description_gt?: Maybe<Scalars['String']>,
  description_gte?: Maybe<Scalars['String']>,
  description_contains?: Maybe<Scalars['String']>,
  description_not_contains?: Maybe<Scalars['String']>,
  description_starts_with?: Maybe<Scalars['String']>,
  description_not_starts_with?: Maybe<Scalars['String']>,
  description_ends_with?: Maybe<Scalars['String']>,
  description_not_ends_with?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  publicTitle_not?: Maybe<Scalars['String']>,
  publicTitle_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_not_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_lt?: Maybe<Scalars['String']>,
  publicTitle_lte?: Maybe<Scalars['String']>,
  publicTitle_gt?: Maybe<Scalars['String']>,
  publicTitle_gte?: Maybe<Scalars['String']>,
  publicTitle_contains?: Maybe<Scalars['String']>,
  publicTitle_not_contains?: Maybe<Scalars['String']>,
  publicTitle_starts_with?: Maybe<Scalars['String']>,
  publicTitle_not_starts_with?: Maybe<Scalars['String']>,
  publicTitle_ends_with?: Maybe<Scalars['String']>,
  publicTitle_not_ends_with?: Maybe<Scalars['String']>,
  logoUrl?: Maybe<Scalars['String']>,
  logoUrl_not?: Maybe<Scalars['String']>,
  logoUrl_in?: Maybe<Array<Scalars['String']>>,
  logoUrl_not_in?: Maybe<Array<Scalars['String']>>,
  logoUrl_lt?: Maybe<Scalars['String']>,
  logoUrl_lte?: Maybe<Scalars['String']>,
  logoUrl_gt?: Maybe<Scalars['String']>,
  logoUrl_gte?: Maybe<Scalars['String']>,
  logoUrl_contains?: Maybe<Scalars['String']>,
  logoUrl_not_contains?: Maybe<Scalars['String']>,
  logoUrl_starts_with?: Maybe<Scalars['String']>,
  logoUrl_not_starts_with?: Maybe<Scalars['String']>,
  logoUrl_ends_with?: Maybe<Scalars['String']>,
  logoUrl_not_ends_with?: Maybe<Scalars['String']>,
  language?: Maybe<Scalars['String']>,
  language_not?: Maybe<Scalars['String']>,
  language_in?: Maybe<Array<Scalars['String']>>,
  language_not_in?: Maybe<Array<Scalars['String']>>,
  language_lt?: Maybe<Scalars['String']>,
  language_lte?: Maybe<Scalars['String']>,
  language_gt?: Maybe<Scalars['String']>,
  language_gte?: Maybe<Scalars['String']>,
  language_contains?: Maybe<Scalars['String']>,
  language_not_contains?: Maybe<Scalars['String']>,
  language_starts_with?: Maybe<Scalars['String']>,
  language_not_starts_with?: Maybe<Scalars['String']>,
  language_ends_with?: Maybe<Scalars['String']>,
  language_not_ends_with?: Maybe<Scalars['String']>,
  topicUrl?: Maybe<Scalars['String']>,
  topicUrl_not?: Maybe<Scalars['String']>,
  topicUrl_in?: Maybe<Array<Scalars['String']>>,
  topicUrl_not_in?: Maybe<Array<Scalars['String']>>,
  topicUrl_lt?: Maybe<Scalars['String']>,
  topicUrl_lte?: Maybe<Scalars['String']>,
  topicUrl_gt?: Maybe<Scalars['String']>,
  topicUrl_gte?: Maybe<Scalars['String']>,
  topicUrl_contains?: Maybe<Scalars['String']>,
  topicUrl_not_contains?: Maybe<Scalars['String']>,
  topicUrl_starts_with?: Maybe<Scalars['String']>,
  topicUrl_not_starts_with?: Maybe<Scalars['String']>,
  topicUrl_ends_with?: Maybe<Scalars['String']>,
  topicUrl_not_ends_with?: Maybe<Scalars['String']>,
  questions_every?: Maybe<QuestionWhereInput>,
  questions_some?: Maybe<QuestionWhereInput>,
  questions_none?: Maybe<QuestionWhereInput>,
  AND?: Maybe<Array<TopicWhereInput>>,
  OR?: Maybe<Array<TopicWhereInput>>,
  NOT?: Maybe<Array<TopicWhereInput>>,
};

export type TopicWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>,
  QuestionWhereUniqueInput: QuestionWhereUniqueInput,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Question: ResolverTypeWrapper<Question>,
  QuestionWhereInput: QuestionWhereInput,
  QuestionOrderByInput: QuestionOrderByInput,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  QuestionConnection: ResolverTypeWrapper<QuestionConnection>,
  PageInfo: ResolverTypeWrapper<PageInfo>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  QuestionEdge: ResolverTypeWrapper<QuestionEdge>,
  AggregateQuestion: ResolverTypeWrapper<AggregateQuestion>,
  TopicWhereUniqueInput: TopicWhereUniqueInput,
  Topic: ResolverTypeWrapper<Topic>,
  TopicWhereInput: TopicWhereInput,
  TopicOrderByInput: TopicOrderByInput,
  TopicConnection: ResolverTypeWrapper<TopicConnection>,
  TopicEdge: ResolverTypeWrapper<TopicEdge>,
  AggregateTopic: ResolverTypeWrapper<AggregateTopic>,
  Node: ResolverTypeWrapper<Node>,
  Mutation: ResolverTypeWrapper<{}>,
  QuestionCreateInput: QuestionCreateInput,
  QuestionCreateManyInput: QuestionCreateManyInput,
  QuestionUpdateInput: QuestionUpdateInput,
  QuestionUpdateManyInput: QuestionUpdateManyInput,
  QuestionUpdateWithWhereUniqueNestedInput: QuestionUpdateWithWhereUniqueNestedInput,
  QuestionUpdateDataInput: QuestionUpdateDataInput,
  QuestionUpsertWithWhereUniqueNestedInput: QuestionUpsertWithWhereUniqueNestedInput,
  QuestionScalarWhereInput: QuestionScalarWhereInput,
  BatchPayload: ResolverTypeWrapper<BatchPayload>,
  Long: ResolverTypeWrapper<Scalars['Long']>,
  TopicCreateInput: TopicCreateInput,
  TopicUpdateInput: TopicUpdateInput,
  TopicUpdateManyMutationInput: TopicUpdateManyMutationInput,
  Subscription: ResolverTypeWrapper<{}>,
  QuestionSubscriptionWhereInput: QuestionSubscriptionWhereInput,
  MutationType: MutationType,
  QuestionSubscriptionPayload: ResolverTypeWrapper<QuestionSubscriptionPayload>,
  QuestionPreviousValues: ResolverTypeWrapper<QuestionPreviousValues>,
  TopicSubscriptionWhereInput: TopicSubscriptionWhereInput,
  TopicSubscriptionPayload: ResolverTypeWrapper<TopicSubscriptionPayload>,
  TopicPreviousValues: ResolverTypeWrapper<TopicPreviousValues>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  QuestionWhereUniqueInput: QuestionWhereUniqueInput,
  ID: Scalars['ID'],
  Question: Question,
  QuestionWhereInput: QuestionWhereInput,
  QuestionOrderByInput: QuestionOrderByInput,
  Int: Scalars['Int'],
  String: Scalars['String'],
  QuestionConnection: QuestionConnection,
  PageInfo: PageInfo,
  Boolean: Scalars['Boolean'],
  QuestionEdge: QuestionEdge,
  AggregateQuestion: AggregateQuestion,
  TopicWhereUniqueInput: TopicWhereUniqueInput,
  Topic: Topic,
  TopicWhereInput: TopicWhereInput,
  TopicOrderByInput: TopicOrderByInput,
  TopicConnection: TopicConnection,
  TopicEdge: TopicEdge,
  AggregateTopic: AggregateTopic,
  Node: Node,
  Mutation: {},
  QuestionCreateInput: QuestionCreateInput,
  QuestionCreateManyInput: QuestionCreateManyInput,
  QuestionUpdateInput: QuestionUpdateInput,
  QuestionUpdateManyInput: QuestionUpdateManyInput,
  QuestionUpdateWithWhereUniqueNestedInput: QuestionUpdateWithWhereUniqueNestedInput,
  QuestionUpdateDataInput: QuestionUpdateDataInput,
  QuestionUpsertWithWhereUniqueNestedInput: QuestionUpsertWithWhereUniqueNestedInput,
  QuestionScalarWhereInput: QuestionScalarWhereInput,
  BatchPayload: BatchPayload,
  Long: Scalars['Long'],
  TopicCreateInput: TopicCreateInput,
  TopicUpdateInput: TopicUpdateInput,
  TopicUpdateManyMutationInput: TopicUpdateManyMutationInput,
  Subscription: {},
  QuestionSubscriptionWhereInput: QuestionSubscriptionWhereInput,
  MutationType: MutationType,
  QuestionSubscriptionPayload: QuestionSubscriptionPayload,
  QuestionPreviousValues: QuestionPreviousValues,
  TopicSubscriptionWhereInput: TopicSubscriptionWhereInput,
  TopicSubscriptionPayload: TopicSubscriptionPayload,
  TopicPreviousValues: TopicPreviousValues,
}>;

export type AggregateQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestion'] = ResolversParentTypes['AggregateQuestion']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateTopicResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateTopic'] = ResolversParentTypes['AggregateTopic']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type BatchPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchPayload'] = ResolversParentTypes['BatchPayload']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Long'], ParentType, ContextType>,
}>;

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createQuestion?: Resolver<ResolversTypes['Question'], ParentType, ContextType, RequireFields<MutationCreateQuestionArgs, 'data'>>,
  updateQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionArgs, 'data' | 'where'>>,
  upsertQuestion?: Resolver<ResolversTypes['Question'], ParentType, ContextType, RequireFields<MutationUpsertQuestionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionArgs, 'where'>>,
  deleteManyQuestions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionsArgs>,
  createTopic?: Resolver<ResolversTypes['Topic'], ParentType, ContextType, RequireFields<MutationCreateTopicArgs, 'data'>>,
  updateTopic?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType, RequireFields<MutationUpdateTopicArgs, 'data' | 'where'>>,
  updateManyTopics?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyTopicsArgs, 'data'>>,
  upsertTopic?: Resolver<ResolversTypes['Topic'], ParentType, ContextType, RequireFields<MutationUpsertTopicArgs, 'where' | 'create' | 'update'>>,
  deleteTopic?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType, RequireFields<MutationDeleteTopicArgs, 'where'>>,
  deleteManyTopics?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyTopicsArgs>,
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<QueryQuestionArgs, 'where'>>,
  questions?: Resolver<Array<Maybe<ResolversTypes['Question']>>, ParentType, ContextType, QueryQuestionsArgs>,
  questionsConnection?: Resolver<ResolversTypes['QuestionConnection'], ParentType, ContextType, QueryQuestionsConnectionArgs>,
  topic?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType, RequireFields<QueryTopicArgs, 'where'>>,
  topics?: Resolver<Array<Maybe<ResolversTypes['Topic']>>, ParentType, ContextType, QueryTopicsArgs>,
  topicsConnection?: Resolver<ResolversTypes['TopicConnection'], ParentType, ContextType, QueryTopicsConnectionArgs>,
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
}>;

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  children?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType, QuestionChildrenArgs>,
}>;

export type QuestionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConnection'] = ResolversParentTypes['QuestionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestion'], ParentType, ContextType>,
}>;

export type QuestionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionEdge'] = ResolversParentTypes['QuestionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Question'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionPreviousValues'] = ResolversParentTypes['QuestionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type QuestionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionSubscriptionPayload'] = ResolversParentTypes['QuestionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionPreviousValues']>, ParentType, ContextType>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  question?: SubscriptionResolver<Maybe<ResolversTypes['QuestionSubscriptionPayload']>, "question", ParentType, ContextType, SubscriptionQuestionArgs>,
  topic?: SubscriptionResolver<Maybe<ResolversTypes['TopicSubscriptionPayload']>, "topic", ParentType, ContextType, SubscriptionTopicArgs>,
}>;

export type TopicResolvers<ContextType = any, ParentType extends ResolversParentTypes['Topic'] = ResolversParentTypes['Topic']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  topicUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  questions?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType, TopicQuestionsArgs>,
}>;

export type TopicConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicConnection'] = ResolversParentTypes['TopicConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['TopicEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateTopic'], ParentType, ContextType>,
}>;

export type TopicEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicEdge'] = ResolversParentTypes['TopicEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Topic'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type TopicPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicPreviousValues'] = ResolversParentTypes['TopicPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  topicUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type TopicSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicSubscriptionPayload'] = ResolversParentTypes['TopicSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['TopicPreviousValues']>, ParentType, ContextType>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AggregateQuestion?: AggregateQuestionResolvers<ContextType>,
  AggregateTopic?: AggregateTopicResolvers<ContextType>,
  BatchPayload?: BatchPayloadResolvers<ContextType>,
  Long?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Node?: NodeResolvers,
  PageInfo?: PageInfoResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Question?: QuestionResolvers<ContextType>,
  QuestionConnection?: QuestionConnectionResolvers<ContextType>,
  QuestionEdge?: QuestionEdgeResolvers<ContextType>,
  QuestionPreviousValues?: QuestionPreviousValuesResolvers<ContextType>,
  QuestionSubscriptionPayload?: QuestionSubscriptionPayloadResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Topic?: TopicResolvers<ContextType>,
  TopicConnection?: TopicConnectionResolvers<ContextType>,
  TopicEdge?: TopicEdgeResolvers<ContextType>,
  TopicPreviousValues?: TopicPreviousValuesResolvers<ContextType>,
  TopicSubscriptionPayload?: TopicSubscriptionPayloadResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
