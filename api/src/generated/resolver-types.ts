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
  DateTime: any,
  Long: any,
};

export type AggregateColourSettings = {
   __typename?: 'AggregateColourSettings',
  count: Scalars['Int'],
};

export type AggregateCustomer = {
   __typename?: 'AggregateCustomer',
  count: Scalars['Int'],
};

export type AggregateCustomerSettings = {
   __typename?: 'AggregateCustomerSettings',
  count: Scalars['Int'],
};

export type AggregateEdge = {
   __typename?: 'AggregateEdge',
  count: Scalars['Int'],
};

export type AggregateFontSettings = {
   __typename?: 'AggregateFontSettings',
  count: Scalars['Int'],
};

export type AggregateLeafNode = {
   __typename?: 'AggregateLeafNode',
  count: Scalars['Int'],
};

export type AggregateQuestionCondition = {
   __typename?: 'AggregateQuestionCondition',
  count: Scalars['Int'],
};

export type AggregateQuestionnaire = {
   __typename?: 'AggregateQuestionnaire',
  count: Scalars['Int'],
};

export type AggregateQuestionNode = {
   __typename?: 'AggregateQuestionNode',
  count: Scalars['Int'],
};

export type AggregateQuestionOption = {
   __typename?: 'AggregateQuestionOption',
  count: Scalars['Int'],
};

export type BatchPayload = {
   __typename?: 'BatchPayload',
  count: Scalars['Long'],
};

export type ColourSettings = {
   __typename?: 'ColourSettings',
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsConnection = {
   __typename?: 'ColourSettingsConnection',
  aggregate: AggregateColourSettings,
  edges: Array<Maybe<ColourSettingsEdge>>,
  pageInfo: PageInfo,
};

export type ColourSettingsCreateInput = {
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsCreateOneInput = {
  connect?: Maybe<ColourSettingsWhereUniqueInput>,
  create?: Maybe<ColourSettingsCreateInput>,
};

export type ColourSettingsEdge = {
   __typename?: 'ColourSettingsEdge',
  cursor: Scalars['String'],
  node: ColourSettings,
};

export enum ColourSettingsOrderByInput {
  DarkAsc = 'dark_ASC',
  DarkDesc = 'dark_DESC',
  DarkestAsc = 'darkest_ASC',
  DarkestDesc = 'darkest_DESC',
  ErrorAsc = 'error_ASC',
  ErrorDesc = 'error_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LightAsc = 'light_ASC',
  LightDesc = 'light_DESC',
  LightestAsc = 'lightest_ASC',
  LightestDesc = 'lightest_DESC',
  MutedAsc = 'muted_ASC',
  MutedDesc = 'muted_DESC',
  NormalAsc = 'normal_ASC',
  NormalDesc = 'normal_DESC',
  PrimaryAsc = 'primary_ASC',
  PrimaryDesc = 'primary_DESC',
  SecondaryAsc = 'secondary_ASC',
  SecondaryDesc = 'secondary_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC',
  TertiaryAsc = 'tertiary_ASC',
  TertiaryDesc = 'tertiary_DESC',
  TextAsc = 'text_ASC',
  TextDesc = 'text_DESC',
  WarningAsc = 'warning_ASC',
  WarningDesc = 'warning_DESC'
}

export type ColourSettingsPreviousValues = {
   __typename?: 'ColourSettingsPreviousValues',
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsSubscriptionPayload = {
   __typename?: 'ColourSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<ColourSettings>,
  previousValues?: Maybe<ColourSettingsPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type ColourSettingsSubscriptionWhereInput = {
  AND?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<ColourSettingsWhereInput>,
  NOT?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type ColourSettingsUpdateDataInput = {
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateInput = {
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateManyMutationInput = {
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateOneInput = {
  connect?: Maybe<ColourSettingsWhereUniqueInput>,
  create?: Maybe<ColourSettingsCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<ColourSettingsUpdateDataInput>,
  upsert?: Maybe<ColourSettingsUpsertNestedInput>,
};

export type ColourSettingsUpsertNestedInput = {
  create: ColourSettingsCreateInput,
  update: ColourSettingsUpdateDataInput,
};

export type ColourSettingsWhereInput = {
  AND?: Maybe<Array<ColourSettingsWhereInput>>,
  dark?: Maybe<Scalars['String']>,
  dark_contains?: Maybe<Scalars['String']>,
  dark_ends_with?: Maybe<Scalars['String']>,
  dark_gt?: Maybe<Scalars['String']>,
  dark_gte?: Maybe<Scalars['String']>,
  dark_in?: Maybe<Array<Scalars['String']>>,
  dark_lt?: Maybe<Scalars['String']>,
  dark_lte?: Maybe<Scalars['String']>,
  dark_not?: Maybe<Scalars['String']>,
  dark_not_contains?: Maybe<Scalars['String']>,
  dark_not_ends_with?: Maybe<Scalars['String']>,
  dark_not_in?: Maybe<Array<Scalars['String']>>,
  dark_not_starts_with?: Maybe<Scalars['String']>,
  dark_starts_with?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  darkest_contains?: Maybe<Scalars['String']>,
  darkest_ends_with?: Maybe<Scalars['String']>,
  darkest_gt?: Maybe<Scalars['String']>,
  darkest_gte?: Maybe<Scalars['String']>,
  darkest_in?: Maybe<Array<Scalars['String']>>,
  darkest_lt?: Maybe<Scalars['String']>,
  darkest_lte?: Maybe<Scalars['String']>,
  darkest_not?: Maybe<Scalars['String']>,
  darkest_not_contains?: Maybe<Scalars['String']>,
  darkest_not_ends_with?: Maybe<Scalars['String']>,
  darkest_not_in?: Maybe<Array<Scalars['String']>>,
  darkest_not_starts_with?: Maybe<Scalars['String']>,
  darkest_starts_with?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  error_contains?: Maybe<Scalars['String']>,
  error_ends_with?: Maybe<Scalars['String']>,
  error_gt?: Maybe<Scalars['String']>,
  error_gte?: Maybe<Scalars['String']>,
  error_in?: Maybe<Array<Scalars['String']>>,
  error_lt?: Maybe<Scalars['String']>,
  error_lte?: Maybe<Scalars['String']>,
  error_not?: Maybe<Scalars['String']>,
  error_not_contains?: Maybe<Scalars['String']>,
  error_not_ends_with?: Maybe<Scalars['String']>,
  error_not_in?: Maybe<Array<Scalars['String']>>,
  error_not_starts_with?: Maybe<Scalars['String']>,
  error_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  light?: Maybe<Scalars['String']>,
  light_contains?: Maybe<Scalars['String']>,
  light_ends_with?: Maybe<Scalars['String']>,
  light_gt?: Maybe<Scalars['String']>,
  light_gte?: Maybe<Scalars['String']>,
  light_in?: Maybe<Array<Scalars['String']>>,
  light_lt?: Maybe<Scalars['String']>,
  light_lte?: Maybe<Scalars['String']>,
  light_not?: Maybe<Scalars['String']>,
  light_not_contains?: Maybe<Scalars['String']>,
  light_not_ends_with?: Maybe<Scalars['String']>,
  light_not_in?: Maybe<Array<Scalars['String']>>,
  light_not_starts_with?: Maybe<Scalars['String']>,
  light_starts_with?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  lightest_contains?: Maybe<Scalars['String']>,
  lightest_ends_with?: Maybe<Scalars['String']>,
  lightest_gt?: Maybe<Scalars['String']>,
  lightest_gte?: Maybe<Scalars['String']>,
  lightest_in?: Maybe<Array<Scalars['String']>>,
  lightest_lt?: Maybe<Scalars['String']>,
  lightest_lte?: Maybe<Scalars['String']>,
  lightest_not?: Maybe<Scalars['String']>,
  lightest_not_contains?: Maybe<Scalars['String']>,
  lightest_not_ends_with?: Maybe<Scalars['String']>,
  lightest_not_in?: Maybe<Array<Scalars['String']>>,
  lightest_not_starts_with?: Maybe<Scalars['String']>,
  lightest_starts_with?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  muted_contains?: Maybe<Scalars['String']>,
  muted_ends_with?: Maybe<Scalars['String']>,
  muted_gt?: Maybe<Scalars['String']>,
  muted_gte?: Maybe<Scalars['String']>,
  muted_in?: Maybe<Array<Scalars['String']>>,
  muted_lt?: Maybe<Scalars['String']>,
  muted_lte?: Maybe<Scalars['String']>,
  muted_not?: Maybe<Scalars['String']>,
  muted_not_contains?: Maybe<Scalars['String']>,
  muted_not_ends_with?: Maybe<Scalars['String']>,
  muted_not_in?: Maybe<Array<Scalars['String']>>,
  muted_not_starts_with?: Maybe<Scalars['String']>,
  muted_starts_with?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  normal_contains?: Maybe<Scalars['String']>,
  normal_ends_with?: Maybe<Scalars['String']>,
  normal_gt?: Maybe<Scalars['String']>,
  normal_gte?: Maybe<Scalars['String']>,
  normal_in?: Maybe<Array<Scalars['String']>>,
  normal_lt?: Maybe<Scalars['String']>,
  normal_lte?: Maybe<Scalars['String']>,
  normal_not?: Maybe<Scalars['String']>,
  normal_not_contains?: Maybe<Scalars['String']>,
  normal_not_ends_with?: Maybe<Scalars['String']>,
  normal_not_in?: Maybe<Array<Scalars['String']>>,
  normal_not_starts_with?: Maybe<Scalars['String']>,
  normal_starts_with?: Maybe<Scalars['String']>,
  NOT?: Maybe<Array<ColourSettingsWhereInput>>,
  OR?: Maybe<Array<ColourSettingsWhereInput>>,
  primary?: Maybe<Scalars['String']>,
  primary_contains?: Maybe<Scalars['String']>,
  primary_ends_with?: Maybe<Scalars['String']>,
  primary_gt?: Maybe<Scalars['String']>,
  primary_gte?: Maybe<Scalars['String']>,
  primary_in?: Maybe<Array<Scalars['String']>>,
  primary_lt?: Maybe<Scalars['String']>,
  primary_lte?: Maybe<Scalars['String']>,
  primary_not?: Maybe<Scalars['String']>,
  primary_not_contains?: Maybe<Scalars['String']>,
  primary_not_ends_with?: Maybe<Scalars['String']>,
  primary_not_in?: Maybe<Array<Scalars['String']>>,
  primary_not_starts_with?: Maybe<Scalars['String']>,
  primary_starts_with?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  secondary_contains?: Maybe<Scalars['String']>,
  secondary_ends_with?: Maybe<Scalars['String']>,
  secondary_gt?: Maybe<Scalars['String']>,
  secondary_gte?: Maybe<Scalars['String']>,
  secondary_in?: Maybe<Array<Scalars['String']>>,
  secondary_lt?: Maybe<Scalars['String']>,
  secondary_lte?: Maybe<Scalars['String']>,
  secondary_not?: Maybe<Scalars['String']>,
  secondary_not_contains?: Maybe<Scalars['String']>,
  secondary_not_ends_with?: Maybe<Scalars['String']>,
  secondary_not_in?: Maybe<Array<Scalars['String']>>,
  secondary_not_starts_with?: Maybe<Scalars['String']>,
  secondary_starts_with?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  success_contains?: Maybe<Scalars['String']>,
  success_ends_with?: Maybe<Scalars['String']>,
  success_gt?: Maybe<Scalars['String']>,
  success_gte?: Maybe<Scalars['String']>,
  success_in?: Maybe<Array<Scalars['String']>>,
  success_lt?: Maybe<Scalars['String']>,
  success_lte?: Maybe<Scalars['String']>,
  success_not?: Maybe<Scalars['String']>,
  success_not_contains?: Maybe<Scalars['String']>,
  success_not_ends_with?: Maybe<Scalars['String']>,
  success_not_in?: Maybe<Array<Scalars['String']>>,
  success_not_starts_with?: Maybe<Scalars['String']>,
  success_starts_with?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  tertiary_contains?: Maybe<Scalars['String']>,
  tertiary_ends_with?: Maybe<Scalars['String']>,
  tertiary_gt?: Maybe<Scalars['String']>,
  tertiary_gte?: Maybe<Scalars['String']>,
  tertiary_in?: Maybe<Array<Scalars['String']>>,
  tertiary_lt?: Maybe<Scalars['String']>,
  tertiary_lte?: Maybe<Scalars['String']>,
  tertiary_not?: Maybe<Scalars['String']>,
  tertiary_not_contains?: Maybe<Scalars['String']>,
  tertiary_not_ends_with?: Maybe<Scalars['String']>,
  tertiary_not_in?: Maybe<Array<Scalars['String']>>,
  tertiary_not_starts_with?: Maybe<Scalars['String']>,
  tertiary_starts_with?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  text_contains?: Maybe<Scalars['String']>,
  text_ends_with?: Maybe<Scalars['String']>,
  text_gt?: Maybe<Scalars['String']>,
  text_gte?: Maybe<Scalars['String']>,
  text_in?: Maybe<Array<Scalars['String']>>,
  text_lt?: Maybe<Scalars['String']>,
  text_lte?: Maybe<Scalars['String']>,
  text_not?: Maybe<Scalars['String']>,
  text_not_contains?: Maybe<Scalars['String']>,
  text_not_ends_with?: Maybe<Scalars['String']>,
  text_not_in?: Maybe<Array<Scalars['String']>>,
  text_not_starts_with?: Maybe<Scalars['String']>,
  text_starts_with?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
  warning_contains?: Maybe<Scalars['String']>,
  warning_ends_with?: Maybe<Scalars['String']>,
  warning_gt?: Maybe<Scalars['String']>,
  warning_gte?: Maybe<Scalars['String']>,
  warning_in?: Maybe<Array<Scalars['String']>>,
  warning_lt?: Maybe<Scalars['String']>,
  warning_lte?: Maybe<Scalars['String']>,
  warning_not?: Maybe<Scalars['String']>,
  warning_not_contains?: Maybe<Scalars['String']>,
  warning_not_ends_with?: Maybe<Scalars['String']>,
  warning_not_in?: Maybe<Array<Scalars['String']>>,
  warning_not_starts_with?: Maybe<Scalars['String']>,
  warning_starts_with?: Maybe<Scalars['String']>,
};

export type ColourSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Customer = {
   __typename?: 'Customer',
  id: Scalars['ID'],
  name: Scalars['String'],
  questionnaires?: Maybe<Array<Questionnaire>>,
  settings?: Maybe<CustomerSettings>,
};


export type CustomerQuestionnairesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionnaireWhereInput>
};

export type CustomerConnection = {
   __typename?: 'CustomerConnection',
  aggregate: AggregateCustomer,
  edges: Array<Maybe<CustomerEdge>>,
  pageInfo: PageInfo,
};

export type CustomerCreateInput = {
  id?: Maybe<Scalars['ID']>,
  name: Scalars['String'],
  questionnaires?: Maybe<QuestionnaireCreateManyWithoutCustomerInput>,
  settings?: Maybe<CustomerSettingsCreateOneInput>,
};

export type CustomerCreateOneWithoutQuestionnairesInput = {
  connect?: Maybe<CustomerWhereUniqueInput>,
  create?: Maybe<CustomerCreateWithoutQuestionnairesInput>,
};

export type CustomerCreateOptions = {
  isSeed?: Maybe<Scalars['Boolean']>,
  logo?: Maybe<Scalars['String']>,
};

export type CustomerCreateWithoutQuestionnairesInput = {
  id?: Maybe<Scalars['ID']>,
  name: Scalars['String'],
  settings?: Maybe<CustomerSettingsCreateOneInput>,
};

export type CustomerEdge = {
   __typename?: 'CustomerEdge',
  cursor: Scalars['String'],
  node: Customer,
};

export enum CustomerOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type CustomerPreviousValues = {
   __typename?: 'CustomerPreviousValues',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type CustomerSettings = {
   __typename?: 'CustomerSettings',
  colourSettings?: Maybe<ColourSettings>,
  fontSettings?: Maybe<FontSettings>,
  id: Scalars['ID'],
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsConnection = {
   __typename?: 'CustomerSettingsConnection',
  aggregate: AggregateCustomerSettings,
  edges: Array<Maybe<CustomerSettingsEdge>>,
  pageInfo: PageInfo,
};

export type CustomerSettingsCreateInput = {
  colourSettings?: Maybe<ColourSettingsCreateOneInput>,
  fontSettings?: Maybe<FontSettingsCreateOneInput>,
  id?: Maybe<Scalars['ID']>,
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsCreateOneInput = {
  connect?: Maybe<CustomerSettingsWhereUniqueInput>,
  create?: Maybe<CustomerSettingsCreateInput>,
};

export type CustomerSettingsEdge = {
   __typename?: 'CustomerSettingsEdge',
  cursor: Scalars['String'],
  node: CustomerSettings,
};

export enum CustomerSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LogoUrlAsc = 'logoUrl_ASC',
  LogoUrlDesc = 'logoUrl_DESC'
}

export type CustomerSettingsPreviousValues = {
   __typename?: 'CustomerSettingsPreviousValues',
  id: Scalars['ID'],
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsSubscriptionPayload = {
   __typename?: 'CustomerSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<CustomerSettings>,
  previousValues?: Maybe<CustomerSettingsPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type CustomerSettingsSubscriptionWhereInput = {
  AND?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<CustomerSettingsWhereInput>,
  NOT?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type CustomerSettingsUpdateDataInput = {
  colourSettings?: Maybe<ColourSettingsUpdateOneInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneInput>,
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsUpdateInput = {
  colourSettings?: Maybe<ColourSettingsUpdateOneInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneInput>,
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsUpdateManyMutationInput = {
  logoUrl?: Maybe<Scalars['String']>,
};

export type CustomerSettingsUpdateOneInput = {
  connect?: Maybe<CustomerSettingsWhereUniqueInput>,
  create?: Maybe<CustomerSettingsCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<CustomerSettingsUpdateDataInput>,
  upsert?: Maybe<CustomerSettingsUpsertNestedInput>,
};

export type CustomerSettingsUpsertNestedInput = {
  create: CustomerSettingsCreateInput,
  update: CustomerSettingsUpdateDataInput,
};

export type CustomerSettingsWhereInput = {
  AND?: Maybe<Array<CustomerSettingsWhereInput>>,
  colourSettings?: Maybe<ColourSettingsWhereInput>,
  fontSettings?: Maybe<FontSettingsWhereInput>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  logoUrl?: Maybe<Scalars['String']>,
  logoUrl_contains?: Maybe<Scalars['String']>,
  logoUrl_ends_with?: Maybe<Scalars['String']>,
  logoUrl_gt?: Maybe<Scalars['String']>,
  logoUrl_gte?: Maybe<Scalars['String']>,
  logoUrl_in?: Maybe<Array<Scalars['String']>>,
  logoUrl_lt?: Maybe<Scalars['String']>,
  logoUrl_lte?: Maybe<Scalars['String']>,
  logoUrl_not?: Maybe<Scalars['String']>,
  logoUrl_not_contains?: Maybe<Scalars['String']>,
  logoUrl_not_ends_with?: Maybe<Scalars['String']>,
  logoUrl_not_in?: Maybe<Array<Scalars['String']>>,
  logoUrl_not_starts_with?: Maybe<Scalars['String']>,
  logoUrl_starts_with?: Maybe<Scalars['String']>,
  NOT?: Maybe<Array<CustomerSettingsWhereInput>>,
  OR?: Maybe<Array<CustomerSettingsWhereInput>>,
};

export type CustomerSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type CustomerSubscriptionPayload = {
   __typename?: 'CustomerSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Customer>,
  previousValues?: Maybe<CustomerPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type CustomerSubscriptionWhereInput = {
  AND?: Maybe<Array<CustomerSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<CustomerWhereInput>,
  NOT?: Maybe<Array<CustomerSubscriptionWhereInput>>,
  OR?: Maybe<Array<CustomerSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type CustomerUpdateInput = {
  name?: Maybe<Scalars['String']>,
  questionnaires?: Maybe<QuestionnaireUpdateManyWithoutCustomerInput>,
  settings?: Maybe<CustomerSettingsUpdateOneInput>,
};

export type CustomerUpdateManyMutationInput = {
  name?: Maybe<Scalars['String']>,
};

export type CustomerUpdateOneRequiredWithoutQuestionnairesInput = {
  connect?: Maybe<CustomerWhereUniqueInput>,
  create?: Maybe<CustomerCreateWithoutQuestionnairesInput>,
  update?: Maybe<CustomerUpdateWithoutQuestionnairesDataInput>,
  upsert?: Maybe<CustomerUpsertWithoutQuestionnairesInput>,
};

export type CustomerUpdateWithoutQuestionnairesDataInput = {
  name?: Maybe<Scalars['String']>,
  settings?: Maybe<CustomerSettingsUpdateOneInput>,
};

export type CustomerUpsertWithoutQuestionnairesInput = {
  create: CustomerCreateWithoutQuestionnairesInput,
  update: CustomerUpdateWithoutQuestionnairesDataInput,
};

export type CustomerWhereInput = {
  AND?: Maybe<Array<CustomerWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  name_contains?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_lt?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  NOT?: Maybe<Array<CustomerWhereInput>>,
  OR?: Maybe<Array<CustomerWhereInput>>,
  questionnaires_every?: Maybe<QuestionnaireWhereInput>,
  questionnaires_none?: Maybe<QuestionnaireWhereInput>,
  questionnaires_some?: Maybe<QuestionnaireWhereInput>,
  settings?: Maybe<CustomerSettingsWhereInput>,
};

export type CustomerWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};


export type Edge = {
   __typename?: 'Edge',
  childNode?: Maybe<QuestionNode>,
  conditions?: Maybe<Array<QuestionCondition>>,
  createdAt: Scalars['DateTime'],
  id: Scalars['ID'],
  parentNode?: Maybe<QuestionNode>,
  questionnaire?: Maybe<Questionnaire>,
  updatedAt: Scalars['DateTime'],
};


export type EdgeConditionsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionConditionWhereInput>
};

export type EdgeConnection = {
   __typename?: 'EdgeConnection',
  aggregate: AggregateEdge,
  edges: Array<Maybe<EdgeEdge>>,
  pageInfo: PageInfo,
};

export type EdgeCreateInput = {
  childNode?: Maybe<QuestionNodeCreateOneInput>,
  conditions?: Maybe<QuestionConditionCreateManyInput>,
  id?: Maybe<Scalars['ID']>,
  parentNode?: Maybe<QuestionNodeCreateOneInput>,
  questionnaire?: Maybe<QuestionnaireCreateOneInput>,
};

export type EdgeCreateManyInput = {
  connect?: Maybe<Array<EdgeWhereUniqueInput>>,
  create?: Maybe<Array<EdgeCreateInput>>,
};

export type EdgeEdge = {
   __typename?: 'EdgeEdge',
  cursor: Scalars['String'],
  node: Edge,
};

export enum EdgeOrderByInput {
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type EdgePreviousValues = {
   __typename?: 'EdgePreviousValues',
  createdAt: Scalars['DateTime'],
  id: Scalars['ID'],
  updatedAt: Scalars['DateTime'],
};

export type EdgeScalarWhereInput = {
  AND?: Maybe<Array<EdgeScalarWhereInput>>,
  createdAt?: Maybe<Scalars['DateTime']>,
  createdAt_gt?: Maybe<Scalars['DateTime']>,
  createdAt_gte?: Maybe<Scalars['DateTime']>,
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>,
  createdAt_lt?: Maybe<Scalars['DateTime']>,
  createdAt_lte?: Maybe<Scalars['DateTime']>,
  createdAt_not?: Maybe<Scalars['DateTime']>,
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<EdgeScalarWhereInput>>,
  OR?: Maybe<Array<EdgeScalarWhereInput>>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  updatedAt_gt?: Maybe<Scalars['DateTime']>,
  updatedAt_gte?: Maybe<Scalars['DateTime']>,
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_lt?: Maybe<Scalars['DateTime']>,
  updatedAt_lte?: Maybe<Scalars['DateTime']>,
  updatedAt_not?: Maybe<Scalars['DateTime']>,
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
};

export type EdgeSubscriptionPayload = {
   __typename?: 'EdgeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Edge>,
  previousValues?: Maybe<EdgePreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type EdgeSubscriptionWhereInput = {
  AND?: Maybe<Array<EdgeSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<EdgeWhereInput>,
  NOT?: Maybe<Array<EdgeSubscriptionWhereInput>>,
  OR?: Maybe<Array<EdgeSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type EdgeUpdateDataInput = {
  childNode?: Maybe<QuestionNodeUpdateOneInput>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  parentNode?: Maybe<QuestionNodeUpdateOneInput>,
  questionnaire?: Maybe<QuestionnaireUpdateOneInput>,
};

export type EdgeUpdateInput = {
  childNode?: Maybe<QuestionNodeUpdateOneInput>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  parentNode?: Maybe<QuestionNodeUpdateOneInput>,
  questionnaire?: Maybe<QuestionnaireUpdateOneInput>,
};

export type EdgeUpdateManyInput = {
  connect?: Maybe<Array<EdgeWhereUniqueInput>>,
  create?: Maybe<Array<EdgeCreateInput>>,
  delete?: Maybe<Array<EdgeWhereUniqueInput>>,
  deleteMany?: Maybe<Array<EdgeScalarWhereInput>>,
  disconnect?: Maybe<Array<EdgeWhereUniqueInput>>,
  set?: Maybe<Array<EdgeWhereUniqueInput>>,
  update?: Maybe<Array<EdgeUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<EdgeUpsertWithWhereUniqueNestedInput>>,
};

export type EdgeUpdateWithWhereUniqueNestedInput = {
  data: EdgeUpdateDataInput,
  where: EdgeWhereUniqueInput,
};

export type EdgeUpsertWithWhereUniqueNestedInput = {
  create: EdgeCreateInput,
  update: EdgeUpdateDataInput,
  where: EdgeWhereUniqueInput,
};

export type EdgeWhereInput = {
  AND?: Maybe<Array<EdgeWhereInput>>,
  childNode?: Maybe<QuestionNodeWhereInput>,
  conditions_every?: Maybe<QuestionConditionWhereInput>,
  conditions_none?: Maybe<QuestionConditionWhereInput>,
  conditions_some?: Maybe<QuestionConditionWhereInput>,
  createdAt?: Maybe<Scalars['DateTime']>,
  createdAt_gt?: Maybe<Scalars['DateTime']>,
  createdAt_gte?: Maybe<Scalars['DateTime']>,
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>,
  createdAt_lt?: Maybe<Scalars['DateTime']>,
  createdAt_lte?: Maybe<Scalars['DateTime']>,
  createdAt_not?: Maybe<Scalars['DateTime']>,
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<EdgeWhereInput>>,
  OR?: Maybe<Array<EdgeWhereInput>>,
  parentNode?: Maybe<QuestionNodeWhereInput>,
  questionnaire?: Maybe<QuestionnaireWhereInput>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  updatedAt_gt?: Maybe<Scalars['DateTime']>,
  updatedAt_gte?: Maybe<Scalars['DateTime']>,
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_lt?: Maybe<Scalars['DateTime']>,
  updatedAt_lte?: Maybe<Scalars['DateTime']>,
  updatedAt_not?: Maybe<Scalars['DateTime']>,
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
};

export type EdgeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type FontSettings = {
   __typename?: 'FontSettings',
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsConnection = {
   __typename?: 'FontSettingsConnection',
  aggregate: AggregateFontSettings,
  edges: Array<Maybe<FontSettingsEdge>>,
  pageInfo: PageInfo,
};

export type FontSettingsCreateInput = {
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsCreateOneInput = {
  connect?: Maybe<FontSettingsWhereUniqueInput>,
  create?: Maybe<FontSettingsCreateInput>,
};

export type FontSettingsEdge = {
   __typename?: 'FontSettingsEdge',
  cursor: Scalars['String'],
  node: FontSettings,
};

export enum FontSettingsOrderByInput {
  BodyAsc = 'body_ASC',
  BodyDesc = 'body_DESC',
  FontTitleAsc = 'fontTitle_ASC',
  FontTitleDesc = 'fontTitle_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SettingTitleAsc = 'settingTitle_ASC',
  SettingTitleDesc = 'settingTitle_DESC',
  SpecialAsc = 'special_ASC',
  SpecialDesc = 'special_DESC'
}

export type FontSettingsPreviousValues = {
   __typename?: 'FontSettingsPreviousValues',
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsSubscriptionPayload = {
   __typename?: 'FontSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<FontSettings>,
  previousValues?: Maybe<FontSettingsPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type FontSettingsSubscriptionWhereInput = {
  AND?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<FontSettingsWhereInput>,
  NOT?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type FontSettingsUpdateDataInput = {
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateInput = {
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateManyMutationInput = {
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  settingTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateOneInput = {
  connect?: Maybe<FontSettingsWhereUniqueInput>,
  create?: Maybe<FontSettingsCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<FontSettingsUpdateDataInput>,
  upsert?: Maybe<FontSettingsUpsertNestedInput>,
};

export type FontSettingsUpsertNestedInput = {
  create: FontSettingsCreateInput,
  update: FontSettingsUpdateDataInput,
};

export type FontSettingsWhereInput = {
  AND?: Maybe<Array<FontSettingsWhereInput>>,
  body?: Maybe<Scalars['String']>,
  body_contains?: Maybe<Scalars['String']>,
  body_ends_with?: Maybe<Scalars['String']>,
  body_gt?: Maybe<Scalars['String']>,
  body_gte?: Maybe<Scalars['String']>,
  body_in?: Maybe<Array<Scalars['String']>>,
  body_lt?: Maybe<Scalars['String']>,
  body_lte?: Maybe<Scalars['String']>,
  body_not?: Maybe<Scalars['String']>,
  body_not_contains?: Maybe<Scalars['String']>,
  body_not_ends_with?: Maybe<Scalars['String']>,
  body_not_in?: Maybe<Array<Scalars['String']>>,
  body_not_starts_with?: Maybe<Scalars['String']>,
  body_starts_with?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  fontTitle_contains?: Maybe<Scalars['String']>,
  fontTitle_ends_with?: Maybe<Scalars['String']>,
  fontTitle_gt?: Maybe<Scalars['String']>,
  fontTitle_gte?: Maybe<Scalars['String']>,
  fontTitle_in?: Maybe<Array<Scalars['String']>>,
  fontTitle_lt?: Maybe<Scalars['String']>,
  fontTitle_lte?: Maybe<Scalars['String']>,
  fontTitle_not?: Maybe<Scalars['String']>,
  fontTitle_not_contains?: Maybe<Scalars['String']>,
  fontTitle_not_ends_with?: Maybe<Scalars['String']>,
  fontTitle_not_in?: Maybe<Array<Scalars['String']>>,
  fontTitle_not_starts_with?: Maybe<Scalars['String']>,
  fontTitle_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<FontSettingsWhereInput>>,
  OR?: Maybe<Array<FontSettingsWhereInput>>,
  settingTitle?: Maybe<Scalars['String']>,
  settingTitle_contains?: Maybe<Scalars['String']>,
  settingTitle_ends_with?: Maybe<Scalars['String']>,
  settingTitle_gt?: Maybe<Scalars['String']>,
  settingTitle_gte?: Maybe<Scalars['String']>,
  settingTitle_in?: Maybe<Array<Scalars['String']>>,
  settingTitle_lt?: Maybe<Scalars['String']>,
  settingTitle_lte?: Maybe<Scalars['String']>,
  settingTitle_not?: Maybe<Scalars['String']>,
  settingTitle_not_contains?: Maybe<Scalars['String']>,
  settingTitle_not_ends_with?: Maybe<Scalars['String']>,
  settingTitle_not_in?: Maybe<Array<Scalars['String']>>,
  settingTitle_not_starts_with?: Maybe<Scalars['String']>,
  settingTitle_starts_with?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
  special_contains?: Maybe<Scalars['String']>,
  special_ends_with?: Maybe<Scalars['String']>,
  special_gt?: Maybe<Scalars['String']>,
  special_gte?: Maybe<Scalars['String']>,
  special_in?: Maybe<Array<Scalars['String']>>,
  special_lt?: Maybe<Scalars['String']>,
  special_lte?: Maybe<Scalars['String']>,
  special_not?: Maybe<Scalars['String']>,
  special_not_contains?: Maybe<Scalars['String']>,
  special_not_ends_with?: Maybe<Scalars['String']>,
  special_not_in?: Maybe<Array<Scalars['String']>>,
  special_not_starts_with?: Maybe<Scalars['String']>,
  special_starts_with?: Maybe<Scalars['String']>,
};

export type FontSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type LeafNode = {
   __typename?: 'LeafNode',
  id: Scalars['ID'],
  nodeId?: Maybe<Scalars['Int']>,
  title: Scalars['String'],
  type?: Maybe<NodeType>,
};

export type LeafNodeConnection = {
   __typename?: 'LeafNodeConnection',
  aggregate: AggregateLeafNode,
  edges: Array<Maybe<LeafNodeEdge>>,
  pageInfo: PageInfo,
};

export type LeafNodeCreateInput = {
  id?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
  title: Scalars['String'],
  type?: Maybe<NodeType>,
};

export type LeafNodeCreateManyInput = {
  connect?: Maybe<Array<LeafNodeWhereUniqueInput>>,
  create?: Maybe<Array<LeafNodeCreateInput>>,
};

export type LeafNodeCreateOneInput = {
  connect?: Maybe<LeafNodeWhereUniqueInput>,
  create?: Maybe<LeafNodeCreateInput>,
};

export type LeafNodeEdge = {
   __typename?: 'LeafNodeEdge',
  cursor: Scalars['String'],
  node: LeafNode,
};

export enum LeafNodeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeIdAsc = 'nodeId_ASC',
  NodeIdDesc = 'nodeId_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC'
}

export type LeafNodePreviousValues = {
   __typename?: 'LeafNodePreviousValues',
  id: Scalars['ID'],
  nodeId?: Maybe<Scalars['Int']>,
  title: Scalars['String'],
  type?: Maybe<NodeType>,
};

export type LeafNodeScalarWhereInput = {
  AND?: Maybe<Array<LeafNodeScalarWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
  nodeId_gt?: Maybe<Scalars['Int']>,
  nodeId_gte?: Maybe<Scalars['Int']>,
  nodeId_in?: Maybe<Array<Scalars['Int']>>,
  nodeId_lt?: Maybe<Scalars['Int']>,
  nodeId_lte?: Maybe<Scalars['Int']>,
  nodeId_not?: Maybe<Scalars['Int']>,
  nodeId_not_in?: Maybe<Array<Scalars['Int']>>,
  NOT?: Maybe<Array<LeafNodeScalarWhereInput>>,
  OR?: Maybe<Array<LeafNodeScalarWhereInput>>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
  type_in?: Maybe<Array<NodeType>>,
  type_not?: Maybe<NodeType>,
  type_not_in?: Maybe<Array<NodeType>>,
};

export type LeafNodeSubscriptionPayload = {
   __typename?: 'LeafNodeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<LeafNode>,
  previousValues?: Maybe<LeafNodePreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type LeafNodeSubscriptionWhereInput = {
  AND?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<LeafNodeWhereInput>,
  NOT?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
  OR?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type LeafNodeUpdateDataInput = {
  nodeId?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
};

export type LeafNodeUpdateInput = {
  nodeId?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
};

export type LeafNodeUpdateManyDataInput = {
  nodeId?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
};

export type LeafNodeUpdateManyInput = {
  connect?: Maybe<Array<LeafNodeWhereUniqueInput>>,
  create?: Maybe<Array<LeafNodeCreateInput>>,
  delete?: Maybe<Array<LeafNodeWhereUniqueInput>>,
  deleteMany?: Maybe<Array<LeafNodeScalarWhereInput>>,
  disconnect?: Maybe<Array<LeafNodeWhereUniqueInput>>,
  set?: Maybe<Array<LeafNodeWhereUniqueInput>>,
  update?: Maybe<Array<LeafNodeUpdateWithWhereUniqueNestedInput>>,
  updateMany?: Maybe<Array<LeafNodeUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<LeafNodeUpsertWithWhereUniqueNestedInput>>,
};

export type LeafNodeUpdateManyMutationInput = {
  nodeId?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
};

export type LeafNodeUpdateManyWithWhereNestedInput = {
  data: LeafNodeUpdateManyDataInput,
  where: LeafNodeScalarWhereInput,
};

export type LeafNodeUpdateOneInput = {
  connect?: Maybe<LeafNodeWhereUniqueInput>,
  create?: Maybe<LeafNodeCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<LeafNodeUpdateDataInput>,
  upsert?: Maybe<LeafNodeUpsertNestedInput>,
};

export type LeafNodeUpdateWithWhereUniqueNestedInput = {
  data: LeafNodeUpdateDataInput,
  where: LeafNodeWhereUniqueInput,
};

export type LeafNodeUpsertNestedInput = {
  create: LeafNodeCreateInput,
  update: LeafNodeUpdateDataInput,
};

export type LeafNodeUpsertWithWhereUniqueNestedInput = {
  create: LeafNodeCreateInput,
  update: LeafNodeUpdateDataInput,
  where: LeafNodeWhereUniqueInput,
};

export type LeafNodeWhereInput = {
  AND?: Maybe<Array<LeafNodeWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
  nodeId_gt?: Maybe<Scalars['Int']>,
  nodeId_gte?: Maybe<Scalars['Int']>,
  nodeId_in?: Maybe<Array<Scalars['Int']>>,
  nodeId_lt?: Maybe<Scalars['Int']>,
  nodeId_lte?: Maybe<Scalars['Int']>,
  nodeId_not?: Maybe<Scalars['Int']>,
  nodeId_not_in?: Maybe<Array<Scalars['Int']>>,
  NOT?: Maybe<Array<LeafNodeWhereInput>>,
  OR?: Maybe<Array<LeafNodeWhereInput>>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  type?: Maybe<NodeType>,
  type_in?: Maybe<Array<NodeType>>,
  type_not?: Maybe<NodeType>,
  type_not_in?: Maybe<Array<NodeType>>,
};

export type LeafNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
};


export type Mutation = {
   __typename?: 'Mutation',
  createColourSettings: ColourSettings,
  createCustomer: Customer,
  createCustomerSettings: CustomerSettings,
  createEdge: Edge,
  createFontSettings: FontSettings,
  createLeafNode: LeafNode,
  createNewCustomer: Customer,
  createQuestionCondition: QuestionCondition,
  createQuestionnaire: Questionnaire,
  createQuestionNode: QuestionNode,
  createQuestionOption: QuestionOption,
  deleteColourSettings?: Maybe<ColourSettings>,
  deleteCustomer?: Maybe<Customer>,
  deleteCustomerSettings?: Maybe<CustomerSettings>,
  deleteEdge?: Maybe<Edge>,
  deleteFontSettings?: Maybe<FontSettings>,
  deleteFullCustomer: Customer,
  deleteLeafNode?: Maybe<LeafNode>,
  deleteManyColourSettingses: BatchPayload,
  deleteManyCustomers: BatchPayload,
  deleteManyCustomerSettingses: BatchPayload,
  deleteManyEdges: BatchPayload,
  deleteManyFontSettingses: BatchPayload,
  deleteManyLeafNodes: BatchPayload,
  deleteManyQuestionConditions: BatchPayload,
  deleteManyQuestionnaires: BatchPayload,
  deleteManyQuestionNodes: BatchPayload,
  deleteManyQuestionOptions: BatchPayload,
  deleteQuestionCondition?: Maybe<QuestionCondition>,
  deleteQuestionnaire?: Maybe<Questionnaire>,
  deleteQuestionNode?: Maybe<QuestionNode>,
  deleteQuestionOption?: Maybe<QuestionOption>,
  updateColourSettings?: Maybe<ColourSettings>,
  updateCustomer?: Maybe<Customer>,
  updateCustomerSettings?: Maybe<CustomerSettings>,
  updateEdge?: Maybe<Edge>,
  updateFontSettings?: Maybe<FontSettings>,
  updateLeafNode?: Maybe<LeafNode>,
  updateManyColourSettingses: BatchPayload,
  updateManyCustomers: BatchPayload,
  updateManyCustomerSettingses: BatchPayload,
  updateManyFontSettingses: BatchPayload,
  updateManyLeafNodes: BatchPayload,
  updateManyQuestionConditions: BatchPayload,
  updateManyQuestionnaires: BatchPayload,
  updateManyQuestionNodes: BatchPayload,
  updateManyQuestionOptions: BatchPayload,
  updateQuestionCondition?: Maybe<QuestionCondition>,
  updateQuestionnaire?: Maybe<Questionnaire>,
  updateQuestionNode?: Maybe<QuestionNode>,
  updateQuestionOption?: Maybe<QuestionOption>,
  upsertColourSettings: ColourSettings,
  upsertCustomer: Customer,
  upsertCustomerSettings: CustomerSettings,
  upsertEdge: Edge,
  upsertFontSettings: FontSettings,
  upsertLeafNode: LeafNode,
  upsertQuestionCondition: QuestionCondition,
  upsertQuestionnaire: Questionnaire,
  upsertQuestionNode: QuestionNode,
  upsertQuestionOption: QuestionOption,
};


export type MutationCreateColourSettingsArgs = {
  data: ColourSettingsCreateInput
};


export type MutationCreateCustomerArgs = {
  data: CustomerCreateInput
};


export type MutationCreateCustomerSettingsArgs = {
  data: CustomerSettingsCreateInput
};


export type MutationCreateEdgeArgs = {
  data: EdgeCreateInput
};


export type MutationCreateFontSettingsArgs = {
  data: FontSettingsCreateInput
};


export type MutationCreateLeafNodeArgs = {
  data: LeafNodeCreateInput
};


export type MutationCreateNewCustomerArgs = {
  name?: Maybe<Scalars['String']>,
  options?: Maybe<CustomerCreateOptions>
};


export type MutationCreateQuestionConditionArgs = {
  data: QuestionConditionCreateInput
};


export type MutationCreateQuestionnaireArgs = {
  data: QuestionnaireCreateInput
};


export type MutationCreateQuestionNodeArgs = {
  data: QuestionNodeCreateInput
};


export type MutationCreateQuestionOptionArgs = {
  data: QuestionOptionCreateInput
};


export type MutationDeleteColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput
};


export type MutationDeleteCustomerArgs = {
  where: CustomerWhereUniqueInput
};


export type MutationDeleteCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput
};


export type MutationDeleteEdgeArgs = {
  where: EdgeWhereUniqueInput
};


export type MutationDeleteFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput
};


export type MutationDeleteFullCustomerArgs = {
  id: Scalars['ID']
};


export type MutationDeleteLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput
};


export type MutationDeleteManyColourSettingsesArgs = {
  where?: Maybe<ColourSettingsWhereInput>
};


export type MutationDeleteManyCustomersArgs = {
  where?: Maybe<CustomerWhereInput>
};


export type MutationDeleteManyCustomerSettingsesArgs = {
  where?: Maybe<CustomerSettingsWhereInput>
};


export type MutationDeleteManyEdgesArgs = {
  where?: Maybe<EdgeWhereInput>
};


export type MutationDeleteManyFontSettingsesArgs = {
  where?: Maybe<FontSettingsWhereInput>
};


export type MutationDeleteManyLeafNodesArgs = {
  where?: Maybe<LeafNodeWhereInput>
};


export type MutationDeleteManyQuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>
};


export type MutationDeleteManyQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>
};


export type MutationDeleteManyQuestionNodesArgs = {
  where?: Maybe<QuestionNodeWhereInput>
};


export type MutationDeleteManyQuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>
};


export type MutationDeleteQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput
};


export type MutationDeleteQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput
};


export type MutationDeleteQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput
};


export type MutationDeleteQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput
};


export type MutationUpdateColourSettingsArgs = {
  data: ColourSettingsUpdateInput,
  where: ColourSettingsWhereUniqueInput
};


export type MutationUpdateCustomerArgs = {
  data: CustomerUpdateInput,
  where: CustomerWhereUniqueInput
};


export type MutationUpdateCustomerSettingsArgs = {
  data: CustomerSettingsUpdateInput,
  where: CustomerSettingsWhereUniqueInput
};


export type MutationUpdateEdgeArgs = {
  data: EdgeUpdateInput,
  where: EdgeWhereUniqueInput
};


export type MutationUpdateFontSettingsArgs = {
  data: FontSettingsUpdateInput,
  where: FontSettingsWhereUniqueInput
};


export type MutationUpdateLeafNodeArgs = {
  data: LeafNodeUpdateInput,
  where: LeafNodeWhereUniqueInput
};


export type MutationUpdateManyColourSettingsesArgs = {
  data: ColourSettingsUpdateManyMutationInput,
  where?: Maybe<ColourSettingsWhereInput>
};


export type MutationUpdateManyCustomersArgs = {
  data: CustomerUpdateManyMutationInput,
  where?: Maybe<CustomerWhereInput>
};


export type MutationUpdateManyCustomerSettingsesArgs = {
  data: CustomerSettingsUpdateManyMutationInput,
  where?: Maybe<CustomerSettingsWhereInput>
};


export type MutationUpdateManyFontSettingsesArgs = {
  data: FontSettingsUpdateManyMutationInput,
  where?: Maybe<FontSettingsWhereInput>
};


export type MutationUpdateManyLeafNodesArgs = {
  data: LeafNodeUpdateManyMutationInput,
  where?: Maybe<LeafNodeWhereInput>
};


export type MutationUpdateManyQuestionConditionsArgs = {
  data: QuestionConditionUpdateManyMutationInput,
  where?: Maybe<QuestionConditionWhereInput>
};


export type MutationUpdateManyQuestionnairesArgs = {
  data: QuestionnaireUpdateManyMutationInput,
  where?: Maybe<QuestionnaireWhereInput>
};


export type MutationUpdateManyQuestionNodesArgs = {
  data: QuestionNodeUpdateManyMutationInput,
  where?: Maybe<QuestionNodeWhereInput>
};


export type MutationUpdateManyQuestionOptionsArgs = {
  data: QuestionOptionUpdateManyMutationInput,
  where?: Maybe<QuestionOptionWhereInput>
};


export type MutationUpdateQuestionConditionArgs = {
  data: QuestionConditionUpdateInput,
  where: QuestionConditionWhereUniqueInput
};


export type MutationUpdateQuestionnaireArgs = {
  data: QuestionnaireUpdateInput,
  where: QuestionnaireWhereUniqueInput
};


export type MutationUpdateQuestionNodeArgs = {
  data: QuestionNodeUpdateInput,
  where: QuestionNodeWhereUniqueInput
};


export type MutationUpdateQuestionOptionArgs = {
  data: QuestionOptionUpdateInput,
  where: QuestionOptionWhereUniqueInput
};


export type MutationUpsertColourSettingsArgs = {
  create: ColourSettingsCreateInput,
  update: ColourSettingsUpdateInput,
  where: ColourSettingsWhereUniqueInput
};


export type MutationUpsertCustomerArgs = {
  create: CustomerCreateInput,
  update: CustomerUpdateInput,
  where: CustomerWhereUniqueInput
};


export type MutationUpsertCustomerSettingsArgs = {
  create: CustomerSettingsCreateInput,
  update: CustomerSettingsUpdateInput,
  where: CustomerSettingsWhereUniqueInput
};


export type MutationUpsertEdgeArgs = {
  create: EdgeCreateInput,
  update: EdgeUpdateInput,
  where: EdgeWhereUniqueInput
};


export type MutationUpsertFontSettingsArgs = {
  create: FontSettingsCreateInput,
  update: FontSettingsUpdateInput,
  where: FontSettingsWhereUniqueInput
};


export type MutationUpsertLeafNodeArgs = {
  create: LeafNodeCreateInput,
  update: LeafNodeUpdateInput,
  where: LeafNodeWhereUniqueInput
};


export type MutationUpsertQuestionConditionArgs = {
  create: QuestionConditionCreateInput,
  update: QuestionConditionUpdateInput,
  where: QuestionConditionWhereUniqueInput
};


export type MutationUpsertQuestionnaireArgs = {
  create: QuestionnaireCreateInput,
  update: QuestionnaireUpdateInput,
  where: QuestionnaireWhereUniqueInput
};


export type MutationUpsertQuestionNodeArgs = {
  create: QuestionNodeCreateInput,
  update: QuestionNodeUpdateInput,
  where: QuestionNodeWhereUniqueInput
};


export type MutationUpsertQuestionOptionArgs = {
  create: QuestionOptionCreateInput,
  update: QuestionOptionUpdateInput,
  where: QuestionOptionWhereUniqueInput
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED'
}

export type Node = {
  id: Scalars['ID'],
};

export enum NodeType {
  MultiChoice = 'MULTI_CHOICE',
  Registration = 'REGISTRATION',
  Slider = 'SLIDER',
  SocialShare = 'SOCIAL_SHARE',
  Textbox = 'TEXTBOX'
}

export type PageInfo = {
   __typename?: 'PageInfo',
  endCursor?: Maybe<Scalars['String']>,
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
  startCursor?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  colourSettings?: Maybe<ColourSettings>,
  colourSettingses: Array<Maybe<ColourSettings>>,
  colourSettingsesConnection: ColourSettingsConnection,
  customer?: Maybe<Customer>,
  customers: Array<Maybe<Customer>>,
  customersConnection: CustomerConnection,
  customerSettings?: Maybe<CustomerSettings>,
  customerSettingses: Array<Maybe<CustomerSettings>>,
  customerSettingsesConnection: CustomerSettingsConnection,
  edge?: Maybe<Edge>,
  edges: Array<Maybe<Edge>>,
  edgesConnection: EdgeConnection,
  fontSettings?: Maybe<FontSettings>,
  fontSettingses: Array<Maybe<FontSettings>>,
  fontSettingsesConnection: FontSettingsConnection,
  leafNode?: Maybe<LeafNode>,
  leafNodes: Array<Maybe<LeafNode>>,
  leafNodesConnection: LeafNodeConnection,
  node?: Maybe<Node>,
  questionCondition?: Maybe<QuestionCondition>,
  questionConditions: Array<Maybe<QuestionCondition>>,
  questionConditionsConnection: QuestionConditionConnection,
  questionnaire?: Maybe<Questionnaire>,
  questionnaires: Array<Maybe<Questionnaire>>,
  questionnairesConnection: QuestionnaireConnection,
  questionNode?: Maybe<QuestionNode>,
  questionNodes: Array<Maybe<QuestionNode>>,
  questionNodesConnection: QuestionNodeConnection,
  questionOption?: Maybe<QuestionOption>,
  questionOptions: Array<Maybe<QuestionOption>>,
  questionOptionsConnection: QuestionOptionConnection,
};


export type QueryColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput
};


export type QueryColourSettingsesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ColourSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<ColourSettingsWhereInput>
};


export type QueryColourSettingsesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ColourSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<ColourSettingsWhereInput>
};


export type QueryCustomerArgs = {
  where: CustomerWhereUniqueInput
};


export type QueryCustomersArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CustomerOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<CustomerWhereInput>
};


export type QueryCustomersConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CustomerOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<CustomerWhereInput>
};


export type QueryCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput
};


export type QueryCustomerSettingsesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CustomerSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<CustomerSettingsWhereInput>
};


export type QueryCustomerSettingsesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CustomerSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<CustomerSettingsWhereInput>
};


export type QueryEdgeArgs = {
  where: EdgeWhereUniqueInput
};


export type QueryEdgesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<EdgeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<EdgeWhereInput>
};


export type QueryEdgesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<EdgeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<EdgeWhereInput>
};


export type QueryFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput
};


export type QueryFontSettingsesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<FontSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<FontSettingsWhereInput>
};


export type QueryFontSettingsesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<FontSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<FontSettingsWhereInput>
};


export type QueryLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput
};


export type QueryLeafNodesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<LeafNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<LeafNodeWhereInput>
};


export type QueryLeafNodesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<LeafNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<LeafNodeWhereInput>
};


export type QueryNodeArgs = {
  id: Scalars['ID']
};


export type QueryQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput
};


export type QueryQuestionConditionsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionConditionWhereInput>
};


export type QueryQuestionConditionsConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionConditionWhereInput>
};


export type QueryQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput
};


export type QueryQuestionnairesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionnaireWhereInput>
};


export type QueryQuestionnairesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionnaireWhereInput>
};


export type QueryQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput
};


export type QueryQuestionNodesArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionNodeWhereInput>
};


export type QueryQuestionNodesConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionNodeWhereInput>
};


export type QueryQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput
};


export type QueryQuestionOptionsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionOptionWhereInput>
};


export type QueryQuestionOptionsConnectionArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionOptionWhereInput>
};

export type QuestionCondition = {
   __typename?: 'QuestionCondition',
  conditionType: Scalars['String'],
  id: Scalars['ID'],
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionConnection = {
   __typename?: 'QuestionConditionConnection',
  aggregate: AggregateQuestionCondition,
  edges: Array<Maybe<QuestionConditionEdge>>,
  pageInfo: PageInfo,
};

export type QuestionConditionCreateInput = {
  conditionType: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionCreateManyInput = {
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  create?: Maybe<Array<QuestionConditionCreateInput>>,
};

export type QuestionConditionEdge = {
   __typename?: 'QuestionConditionEdge',
  cursor: Scalars['String'],
  node: QuestionCondition,
};

export enum QuestionConditionOrderByInput {
  ConditionTypeAsc = 'conditionType_ASC',
  ConditionTypeDesc = 'conditionType_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MatchValueAsc = 'matchValue_ASC',
  MatchValueDesc = 'matchValue_DESC',
  RenderMaxAsc = 'renderMax_ASC',
  RenderMaxDesc = 'renderMax_DESC',
  RenderMinAsc = 'renderMin_ASC',
  RenderMinDesc = 'renderMin_DESC'
}

export type QuestionConditionPreviousValues = {
   __typename?: 'QuestionConditionPreviousValues',
  conditionType: Scalars['String'],
  id: Scalars['ID'],
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionScalarWhereInput = {
  AND?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  conditionType?: Maybe<Scalars['String']>,
  conditionType_contains?: Maybe<Scalars['String']>,
  conditionType_ends_with?: Maybe<Scalars['String']>,
  conditionType_gt?: Maybe<Scalars['String']>,
  conditionType_gte?: Maybe<Scalars['String']>,
  conditionType_in?: Maybe<Array<Scalars['String']>>,
  conditionType_lt?: Maybe<Scalars['String']>,
  conditionType_lte?: Maybe<Scalars['String']>,
  conditionType_not?: Maybe<Scalars['String']>,
  conditionType_not_contains?: Maybe<Scalars['String']>,
  conditionType_not_ends_with?: Maybe<Scalars['String']>,
  conditionType_not_in?: Maybe<Array<Scalars['String']>>,
  conditionType_not_starts_with?: Maybe<Scalars['String']>,
  conditionType_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  matchValue?: Maybe<Scalars['String']>,
  matchValue_contains?: Maybe<Scalars['String']>,
  matchValue_ends_with?: Maybe<Scalars['String']>,
  matchValue_gt?: Maybe<Scalars['String']>,
  matchValue_gte?: Maybe<Scalars['String']>,
  matchValue_in?: Maybe<Array<Scalars['String']>>,
  matchValue_lt?: Maybe<Scalars['String']>,
  matchValue_lte?: Maybe<Scalars['String']>,
  matchValue_not?: Maybe<Scalars['String']>,
  matchValue_not_contains?: Maybe<Scalars['String']>,
  matchValue_not_ends_with?: Maybe<Scalars['String']>,
  matchValue_not_in?: Maybe<Array<Scalars['String']>>,
  matchValue_not_starts_with?: Maybe<Scalars['String']>,
  matchValue_starts_with?: Maybe<Scalars['String']>,
  NOT?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  OR?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMax_gt?: Maybe<Scalars['Int']>,
  renderMax_gte?: Maybe<Scalars['Int']>,
  renderMax_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_lt?: Maybe<Scalars['Int']>,
  renderMax_lte?: Maybe<Scalars['Int']>,
  renderMax_not?: Maybe<Scalars['Int']>,
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMin_gt?: Maybe<Scalars['Int']>,
  renderMin_gte?: Maybe<Scalars['Int']>,
  renderMin_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_lt?: Maybe<Scalars['Int']>,
  renderMin_lte?: Maybe<Scalars['Int']>,
  renderMin_not?: Maybe<Scalars['Int']>,
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>,
};

export type QuestionConditionSubscriptionPayload = {
   __typename?: 'QuestionConditionSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionCondition>,
  previousValues?: Maybe<QuestionConditionPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type QuestionConditionSubscriptionWhereInput = {
  AND?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<QuestionConditionWhereInput>,
  NOT?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type QuestionConditionUpdateDataInput = {
  conditionType?: Maybe<Scalars['String']>,
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionUpdateInput = {
  conditionType?: Maybe<Scalars['String']>,
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionUpdateManyDataInput = {
  conditionType?: Maybe<Scalars['String']>,
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionUpdateManyInput = {
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  create?: Maybe<Array<QuestionConditionCreateInput>>,
  delete?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  disconnect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  set?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  update?: Maybe<Array<QuestionConditionUpdateWithWhereUniqueNestedInput>>,
  updateMany?: Maybe<Array<QuestionConditionUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<QuestionConditionUpsertWithWhereUniqueNestedInput>>,
};

export type QuestionConditionUpdateManyMutationInput = {
  conditionType?: Maybe<Scalars['String']>,
  matchValue?: Maybe<Scalars['String']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMin?: Maybe<Scalars['Int']>,
};

export type QuestionConditionUpdateManyWithWhereNestedInput = {
  data: QuestionConditionUpdateManyDataInput,
  where: QuestionConditionScalarWhereInput,
};

export type QuestionConditionUpdateWithWhereUniqueNestedInput = {
  data: QuestionConditionUpdateDataInput,
  where: QuestionConditionWhereUniqueInput,
};

export type QuestionConditionUpsertWithWhereUniqueNestedInput = {
  create: QuestionConditionCreateInput,
  update: QuestionConditionUpdateDataInput,
  where: QuestionConditionWhereUniqueInput,
};

export type QuestionConditionWhereInput = {
  AND?: Maybe<Array<QuestionConditionWhereInput>>,
  conditionType?: Maybe<Scalars['String']>,
  conditionType_contains?: Maybe<Scalars['String']>,
  conditionType_ends_with?: Maybe<Scalars['String']>,
  conditionType_gt?: Maybe<Scalars['String']>,
  conditionType_gte?: Maybe<Scalars['String']>,
  conditionType_in?: Maybe<Array<Scalars['String']>>,
  conditionType_lt?: Maybe<Scalars['String']>,
  conditionType_lte?: Maybe<Scalars['String']>,
  conditionType_not?: Maybe<Scalars['String']>,
  conditionType_not_contains?: Maybe<Scalars['String']>,
  conditionType_not_ends_with?: Maybe<Scalars['String']>,
  conditionType_not_in?: Maybe<Array<Scalars['String']>>,
  conditionType_not_starts_with?: Maybe<Scalars['String']>,
  conditionType_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  matchValue?: Maybe<Scalars['String']>,
  matchValue_contains?: Maybe<Scalars['String']>,
  matchValue_ends_with?: Maybe<Scalars['String']>,
  matchValue_gt?: Maybe<Scalars['String']>,
  matchValue_gte?: Maybe<Scalars['String']>,
  matchValue_in?: Maybe<Array<Scalars['String']>>,
  matchValue_lt?: Maybe<Scalars['String']>,
  matchValue_lte?: Maybe<Scalars['String']>,
  matchValue_not?: Maybe<Scalars['String']>,
  matchValue_not_contains?: Maybe<Scalars['String']>,
  matchValue_not_ends_with?: Maybe<Scalars['String']>,
  matchValue_not_in?: Maybe<Array<Scalars['String']>>,
  matchValue_not_starts_with?: Maybe<Scalars['String']>,
  matchValue_starts_with?: Maybe<Scalars['String']>,
  NOT?: Maybe<Array<QuestionConditionWhereInput>>,
  OR?: Maybe<Array<QuestionConditionWhereInput>>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMax_gt?: Maybe<Scalars['Int']>,
  renderMax_gte?: Maybe<Scalars['Int']>,
  renderMax_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_lt?: Maybe<Scalars['Int']>,
  renderMax_lte?: Maybe<Scalars['Int']>,
  renderMax_not?: Maybe<Scalars['Int']>,
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMin_gt?: Maybe<Scalars['Int']>,
  renderMin_gte?: Maybe<Scalars['Int']>,
  renderMin_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_lt?: Maybe<Scalars['Int']>,
  renderMin_lte?: Maybe<Scalars['Int']>,
  renderMin_not?: Maybe<Scalars['Int']>,
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>,
};

export type QuestionConditionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Questionnaire = {
   __typename?: 'Questionnaire',
  creationDate: Scalars['DateTime'],
  customer: Customer,
  description: Scalars['String'],
  id: Scalars['ID'],
  leafs?: Maybe<Array<LeafNode>>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<Array<QuestionNode>>,
  title: Scalars['String'],
  updatedAt?: Maybe<Scalars['DateTime']>,
};


export type QuestionnaireLeafsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<LeafNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<LeafNodeWhereInput>
};


export type QuestionnaireQuestionsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionNodeWhereInput>
};

export type QuestionnaireConnection = {
   __typename?: 'QuestionnaireConnection',
  aggregate: AggregateQuestionnaire,
  edges: Array<Maybe<QuestionnaireEdge>>,
  pageInfo: PageInfo,
};

export type QuestionnaireCreateInput = {
  customer: CustomerCreateOneWithoutQuestionnairesInput,
  description: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  leafs?: Maybe<LeafNodeCreateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeCreateManyWithoutQuestionnaireInput>,
  title: Scalars['String'],
};

export type QuestionnaireCreateManyWithoutCustomerInput = {
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  create?: Maybe<Array<QuestionnaireCreateWithoutCustomerInput>>,
};

export type QuestionnaireCreateOneInput = {
  connect?: Maybe<QuestionnaireWhereUniqueInput>,
  create?: Maybe<QuestionnaireCreateInput>,
};

export type QuestionnaireCreateOneWithoutQuestionsInput = {
  connect?: Maybe<QuestionnaireWhereUniqueInput>,
  create?: Maybe<QuestionnaireCreateWithoutQuestionsInput>,
};

export type QuestionnaireCreateWithoutCustomerInput = {
  description: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  leafs?: Maybe<LeafNodeCreateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeCreateManyWithoutQuestionnaireInput>,
  title: Scalars['String'],
};

export type QuestionnaireCreateWithoutQuestionsInput = {
  customer: CustomerCreateOneWithoutQuestionnairesInput,
  description: Scalars['String'],
  id?: Maybe<Scalars['ID']>,
  leafs?: Maybe<LeafNodeCreateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  title: Scalars['String'],
};

export type QuestionnaireEdge = {
   __typename?: 'QuestionnaireEdge',
  cursor: Scalars['String'],
  node: Questionnaire,
};

export enum QuestionnaireOrderByInput {
  CreationDateAsc = 'creationDate_ASC',
  CreationDateDesc = 'creationDate_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublicTitleAsc = 'publicTitle_ASC',
  PublicTitleDesc = 'publicTitle_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type QuestionnairePreviousValues = {
   __typename?: 'QuestionnairePreviousValues',
  creationDate: Scalars['DateTime'],
  description: Scalars['String'],
  id: Scalars['ID'],
  publicTitle?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  updatedAt?: Maybe<Scalars['DateTime']>,
};

export type QuestionnaireScalarWhereInput = {
  AND?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  creationDate?: Maybe<Scalars['DateTime']>,
  creationDate_gt?: Maybe<Scalars['DateTime']>,
  creationDate_gte?: Maybe<Scalars['DateTime']>,
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>,
  creationDate_lt?: Maybe<Scalars['DateTime']>,
  creationDate_lte?: Maybe<Scalars['DateTime']>,
  creationDate_not?: Maybe<Scalars['DateTime']>,
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>,
  description?: Maybe<Scalars['String']>,
  description_contains?: Maybe<Scalars['String']>,
  description_ends_with?: Maybe<Scalars['String']>,
  description_gt?: Maybe<Scalars['String']>,
  description_gte?: Maybe<Scalars['String']>,
  description_in?: Maybe<Array<Scalars['String']>>,
  description_lt?: Maybe<Scalars['String']>,
  description_lte?: Maybe<Scalars['String']>,
  description_not?: Maybe<Scalars['String']>,
  description_not_contains?: Maybe<Scalars['String']>,
  description_not_ends_with?: Maybe<Scalars['String']>,
  description_not_in?: Maybe<Array<Scalars['String']>>,
  description_not_starts_with?: Maybe<Scalars['String']>,
  description_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  OR?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  publicTitle?: Maybe<Scalars['String']>,
  publicTitle_contains?: Maybe<Scalars['String']>,
  publicTitle_ends_with?: Maybe<Scalars['String']>,
  publicTitle_gt?: Maybe<Scalars['String']>,
  publicTitle_gte?: Maybe<Scalars['String']>,
  publicTitle_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_lt?: Maybe<Scalars['String']>,
  publicTitle_lte?: Maybe<Scalars['String']>,
  publicTitle_not?: Maybe<Scalars['String']>,
  publicTitle_not_contains?: Maybe<Scalars['String']>,
  publicTitle_not_ends_with?: Maybe<Scalars['String']>,
  publicTitle_not_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_not_starts_with?: Maybe<Scalars['String']>,
  publicTitle_starts_with?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  updatedAt_gt?: Maybe<Scalars['DateTime']>,
  updatedAt_gte?: Maybe<Scalars['DateTime']>,
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_lt?: Maybe<Scalars['DateTime']>,
  updatedAt_lte?: Maybe<Scalars['DateTime']>,
  updatedAt_not?: Maybe<Scalars['DateTime']>,
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
};

export type QuestionnaireSubscriptionPayload = {
   __typename?: 'QuestionnaireSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Questionnaire>,
  previousValues?: Maybe<QuestionnairePreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type QuestionnaireSubscriptionWhereInput = {
  AND?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<QuestionnaireWhereInput>,
  NOT?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type QuestionnaireUpdateDataInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>,
  description?: Maybe<Scalars['String']>,
  leafs?: Maybe<LeafNodeUpdateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>,
  description?: Maybe<Scalars['String']>,
  leafs?: Maybe<LeafNodeUpdateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateManyDataInput = {
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateManyMutationInput = {
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateManyWithoutCustomerInput = {
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  create?: Maybe<Array<QuestionnaireCreateWithoutCustomerInput>>,
  delete?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  disconnect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  set?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  update?: Maybe<Array<QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput>>,
  updateMany?: Maybe<Array<QuestionnaireUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput>>,
};

export type QuestionnaireUpdateManyWithWhereNestedInput = {
  data: QuestionnaireUpdateManyDataInput,
  where: QuestionnaireScalarWhereInput,
};

export type QuestionnaireUpdateOneInput = {
  connect?: Maybe<QuestionnaireWhereUniqueInput>,
  create?: Maybe<QuestionnaireCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<QuestionnaireUpdateDataInput>,
  upsert?: Maybe<QuestionnaireUpsertNestedInput>,
};

export type QuestionnaireUpdateOneWithoutQuestionsInput = {
  connect?: Maybe<QuestionnaireWhereUniqueInput>,
  create?: Maybe<QuestionnaireCreateWithoutQuestionsInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<QuestionnaireUpdateWithoutQuestionsDataInput>,
  upsert?: Maybe<QuestionnaireUpsertWithoutQuestionsInput>,
};

export type QuestionnaireUpdateWithoutCustomerDataInput = {
  description?: Maybe<Scalars['String']>,
  leafs?: Maybe<LeafNodeUpdateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateWithoutQuestionsDataInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>,
  description?: Maybe<Scalars['String']>,
  leafs?: Maybe<LeafNodeUpdateManyInput>,
  publicTitle?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput = {
  data: QuestionnaireUpdateWithoutCustomerDataInput,
  where: QuestionnaireWhereUniqueInput,
};

export type QuestionnaireUpsertNestedInput = {
  create: QuestionnaireCreateInput,
  update: QuestionnaireUpdateDataInput,
};

export type QuestionnaireUpsertWithoutQuestionsInput = {
  create: QuestionnaireCreateWithoutQuestionsInput,
  update: QuestionnaireUpdateWithoutQuestionsDataInput,
};

export type QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput = {
  create: QuestionnaireCreateWithoutCustomerInput,
  update: QuestionnaireUpdateWithoutCustomerDataInput,
  where: QuestionnaireWhereUniqueInput,
};

export type QuestionnaireWhereInput = {
  AND?: Maybe<Array<QuestionnaireWhereInput>>,
  creationDate?: Maybe<Scalars['DateTime']>,
  creationDate_gt?: Maybe<Scalars['DateTime']>,
  creationDate_gte?: Maybe<Scalars['DateTime']>,
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>,
  creationDate_lt?: Maybe<Scalars['DateTime']>,
  creationDate_lte?: Maybe<Scalars['DateTime']>,
  creationDate_not?: Maybe<Scalars['DateTime']>,
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>,
  customer?: Maybe<CustomerWhereInput>,
  description?: Maybe<Scalars['String']>,
  description_contains?: Maybe<Scalars['String']>,
  description_ends_with?: Maybe<Scalars['String']>,
  description_gt?: Maybe<Scalars['String']>,
  description_gte?: Maybe<Scalars['String']>,
  description_in?: Maybe<Array<Scalars['String']>>,
  description_lt?: Maybe<Scalars['String']>,
  description_lte?: Maybe<Scalars['String']>,
  description_not?: Maybe<Scalars['String']>,
  description_not_contains?: Maybe<Scalars['String']>,
  description_not_ends_with?: Maybe<Scalars['String']>,
  description_not_in?: Maybe<Array<Scalars['String']>>,
  description_not_starts_with?: Maybe<Scalars['String']>,
  description_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  leafs_every?: Maybe<LeafNodeWhereInput>,
  leafs_none?: Maybe<LeafNodeWhereInput>,
  leafs_some?: Maybe<LeafNodeWhereInput>,
  NOT?: Maybe<Array<QuestionnaireWhereInput>>,
  OR?: Maybe<Array<QuestionnaireWhereInput>>,
  publicTitle?: Maybe<Scalars['String']>,
  publicTitle_contains?: Maybe<Scalars['String']>,
  publicTitle_ends_with?: Maybe<Scalars['String']>,
  publicTitle_gt?: Maybe<Scalars['String']>,
  publicTitle_gte?: Maybe<Scalars['String']>,
  publicTitle_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_lt?: Maybe<Scalars['String']>,
  publicTitle_lte?: Maybe<Scalars['String']>,
  publicTitle_not?: Maybe<Scalars['String']>,
  publicTitle_not_contains?: Maybe<Scalars['String']>,
  publicTitle_not_ends_with?: Maybe<Scalars['String']>,
  publicTitle_not_in?: Maybe<Array<Scalars['String']>>,
  publicTitle_not_starts_with?: Maybe<Scalars['String']>,
  publicTitle_starts_with?: Maybe<Scalars['String']>,
  questions_every?: Maybe<QuestionNodeWhereInput>,
  questions_none?: Maybe<QuestionNodeWhereInput>,
  questions_some?: Maybe<QuestionNodeWhereInput>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  updatedAt_gt?: Maybe<Scalars['DateTime']>,
  updatedAt_gte?: Maybe<Scalars['DateTime']>,
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_lt?: Maybe<Scalars['DateTime']>,
  updatedAt_lte?: Maybe<Scalars['DateTime']>,
  updatedAt_not?: Maybe<Scalars['DateTime']>,
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
};

export type QuestionnaireWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type QuestionNode = {
   __typename?: 'QuestionNode',
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<Array<QuestionNode>>,
  edgeChildren?: Maybe<Array<Edge>>,
  id: Scalars['ID'],
  isRoot: Scalars['Boolean'],
  options?: Maybe<Array<QuestionOption>>,
  overrideLeaf?: Maybe<LeafNode>,
  questionnaire?: Maybe<Questionnaire>,
  questionType: NodeType,
  title: Scalars['String'],
};


export type QuestionNodeChildrenArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionNodeWhereInput>
};


export type QuestionNodeEdgeChildrenArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<EdgeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<EdgeWhereInput>
};


export type QuestionNodeOptionsArgs = {
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  where?: Maybe<QuestionOptionWhereInput>
};

export type QuestionNodeConnection = {
   __typename?: 'QuestionNodeConnection',
  aggregate: AggregateQuestionNode,
  edges: Array<Maybe<QuestionNodeEdge>>,
  pageInfo: PageInfo,
};

export type QuestionNodeCreateInput = {
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<QuestionNodeCreateManyInput>,
  edgeChildren?: Maybe<EdgeCreateManyInput>,
  id?: Maybe<Scalars['ID']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  options?: Maybe<QuestionOptionCreateManyInput>,
  overrideLeaf?: Maybe<LeafNodeCreateOneInput>,
  questionnaire?: Maybe<QuestionnaireCreateOneWithoutQuestionsInput>,
  questionType: NodeType,
  title: Scalars['String'],
};

export type QuestionNodeCreateManyInput = {
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  create?: Maybe<Array<QuestionNodeCreateInput>>,
};

export type QuestionNodeCreateManyWithoutQuestionnaireInput = {
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  create?: Maybe<Array<QuestionNodeCreateWithoutQuestionnaireInput>>,
};

export type QuestionNodeCreateOneInput = {
  connect?: Maybe<QuestionNodeWhereUniqueInput>,
  create?: Maybe<QuestionNodeCreateInput>,
};

export type QuestionNodeCreateWithoutQuestionnaireInput = {
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<QuestionNodeCreateManyInput>,
  edgeChildren?: Maybe<EdgeCreateManyInput>,
  id?: Maybe<Scalars['ID']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  options?: Maybe<QuestionOptionCreateManyInput>,
  overrideLeaf?: Maybe<LeafNodeCreateOneInput>,
  questionType: NodeType,
  title: Scalars['String'],
};

export type QuestionNodeEdge = {
   __typename?: 'QuestionNodeEdge',
  cursor: Scalars['String'],
  node: QuestionNode,
};

export enum QuestionNodeOrderByInput {
  BranchValAsc = 'branchVal_ASC',
  BranchValDesc = 'branchVal_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  IsRootAsc = 'isRoot_ASC',
  IsRootDesc = 'isRoot_DESC',
  QuestionTypeAsc = 'questionType_ASC',
  QuestionTypeDesc = 'questionType_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

export type QuestionNodePreviousValues = {
   __typename?: 'QuestionNodePreviousValues',
  branchVal?: Maybe<Scalars['String']>,
  id: Scalars['ID'],
  isRoot: Scalars['Boolean'],
  questionType: NodeType,
  title: Scalars['String'],
};

export type QuestionNodeScalarWhereInput = {
  AND?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  branchVal?: Maybe<Scalars['String']>,
  branchVal_contains?: Maybe<Scalars['String']>,
  branchVal_ends_with?: Maybe<Scalars['String']>,
  branchVal_gt?: Maybe<Scalars['String']>,
  branchVal_gte?: Maybe<Scalars['String']>,
  branchVal_in?: Maybe<Array<Scalars['String']>>,
  branchVal_lt?: Maybe<Scalars['String']>,
  branchVal_lte?: Maybe<Scalars['String']>,
  branchVal_not?: Maybe<Scalars['String']>,
  branchVal_not_contains?: Maybe<Scalars['String']>,
  branchVal_not_ends_with?: Maybe<Scalars['String']>,
  branchVal_not_in?: Maybe<Array<Scalars['String']>>,
  branchVal_not_starts_with?: Maybe<Scalars['String']>,
  branchVal_starts_with?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  isRoot_not?: Maybe<Scalars['Boolean']>,
  NOT?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  OR?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  questionType?: Maybe<NodeType>,
  questionType_in?: Maybe<Array<NodeType>>,
  questionType_not?: Maybe<NodeType>,
  questionType_not_in?: Maybe<Array<NodeType>>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
};

export type QuestionNodeSubscriptionPayload = {
   __typename?: 'QuestionNodeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionNode>,
  previousValues?: Maybe<QuestionNodePreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type QuestionNodeSubscriptionWhereInput = {
  AND?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<QuestionNodeWhereInput>,
  NOT?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type QuestionNodeUpdateDataInput = {
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<QuestionNodeUpdateManyInput>,
  edgeChildren?: Maybe<EdgeUpdateManyInput>,
  isRoot?: Maybe<Scalars['Boolean']>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>,
  questionnaire?: Maybe<QuestionnaireUpdateOneWithoutQuestionsInput>,
  questionType?: Maybe<NodeType>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionNodeUpdateInput = {
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<QuestionNodeUpdateManyInput>,
  edgeChildren?: Maybe<EdgeUpdateManyInput>,
  isRoot?: Maybe<Scalars['Boolean']>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>,
  questionnaire?: Maybe<QuestionnaireUpdateOneWithoutQuestionsInput>,
  questionType?: Maybe<NodeType>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionNodeUpdateManyDataInput = {
  branchVal?: Maybe<Scalars['String']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  questionType?: Maybe<NodeType>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionNodeUpdateManyInput = {
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  create?: Maybe<Array<QuestionNodeCreateInput>>,
  delete?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  disconnect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  set?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  update?: Maybe<Array<QuestionNodeUpdateWithWhereUniqueNestedInput>>,
  updateMany?: Maybe<Array<QuestionNodeUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<QuestionNodeUpsertWithWhereUniqueNestedInput>>,
};

export type QuestionNodeUpdateManyMutationInput = {
  branchVal?: Maybe<Scalars['String']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  questionType?: Maybe<NodeType>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionNodeUpdateManyWithoutQuestionnaireInput = {
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  create?: Maybe<Array<QuestionNodeCreateWithoutQuestionnaireInput>>,
  delete?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  disconnect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  set?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  update?: Maybe<Array<QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput>>,
  updateMany?: Maybe<Array<QuestionNodeUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput>>,
};

export type QuestionNodeUpdateManyWithWhereNestedInput = {
  data: QuestionNodeUpdateManyDataInput,
  where: QuestionNodeScalarWhereInput,
};

export type QuestionNodeUpdateOneInput = {
  connect?: Maybe<QuestionNodeWhereUniqueInput>,
  create?: Maybe<QuestionNodeCreateInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  update?: Maybe<QuestionNodeUpdateDataInput>,
  upsert?: Maybe<QuestionNodeUpsertNestedInput>,
};

export type QuestionNodeUpdateWithoutQuestionnaireDataInput = {
  branchVal?: Maybe<Scalars['String']>,
  children?: Maybe<QuestionNodeUpdateManyInput>,
  edgeChildren?: Maybe<EdgeUpdateManyInput>,
  isRoot?: Maybe<Scalars['Boolean']>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>,
  questionType?: Maybe<NodeType>,
  title?: Maybe<Scalars['String']>,
};

export type QuestionNodeUpdateWithWhereUniqueNestedInput = {
  data: QuestionNodeUpdateDataInput,
  where: QuestionNodeWhereUniqueInput,
};

export type QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput = {
  data: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  where: QuestionNodeWhereUniqueInput,
};

export type QuestionNodeUpsertNestedInput = {
  create: QuestionNodeCreateInput,
  update: QuestionNodeUpdateDataInput,
};

export type QuestionNodeUpsertWithWhereUniqueNestedInput = {
  create: QuestionNodeCreateInput,
  update: QuestionNodeUpdateDataInput,
  where: QuestionNodeWhereUniqueInput,
};

export type QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput = {
  create: QuestionNodeCreateWithoutQuestionnaireInput,
  update: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  where: QuestionNodeWhereUniqueInput,
};

export type QuestionNodeWhereInput = {
  AND?: Maybe<Array<QuestionNodeWhereInput>>,
  branchVal?: Maybe<Scalars['String']>,
  branchVal_contains?: Maybe<Scalars['String']>,
  branchVal_ends_with?: Maybe<Scalars['String']>,
  branchVal_gt?: Maybe<Scalars['String']>,
  branchVal_gte?: Maybe<Scalars['String']>,
  branchVal_in?: Maybe<Array<Scalars['String']>>,
  branchVal_lt?: Maybe<Scalars['String']>,
  branchVal_lte?: Maybe<Scalars['String']>,
  branchVal_not?: Maybe<Scalars['String']>,
  branchVal_not_contains?: Maybe<Scalars['String']>,
  branchVal_not_ends_with?: Maybe<Scalars['String']>,
  branchVal_not_in?: Maybe<Array<Scalars['String']>>,
  branchVal_not_starts_with?: Maybe<Scalars['String']>,
  branchVal_starts_with?: Maybe<Scalars['String']>,
  children_every?: Maybe<QuestionNodeWhereInput>,
  children_none?: Maybe<QuestionNodeWhereInput>,
  children_some?: Maybe<QuestionNodeWhereInput>,
  edgeChildren_every?: Maybe<EdgeWhereInput>,
  edgeChildren_none?: Maybe<EdgeWhereInput>,
  edgeChildren_some?: Maybe<EdgeWhereInput>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  isRoot?: Maybe<Scalars['Boolean']>,
  isRoot_not?: Maybe<Scalars['Boolean']>,
  NOT?: Maybe<Array<QuestionNodeWhereInput>>,
  options_every?: Maybe<QuestionOptionWhereInput>,
  options_none?: Maybe<QuestionOptionWhereInput>,
  options_some?: Maybe<QuestionOptionWhereInput>,
  OR?: Maybe<Array<QuestionNodeWhereInput>>,
  overrideLeaf?: Maybe<LeafNodeWhereInput>,
  questionnaire?: Maybe<QuestionnaireWhereInput>,
  questionType?: Maybe<NodeType>,
  questionType_in?: Maybe<Array<NodeType>>,
  questionType_not?: Maybe<NodeType>,
  questionType_not_in?: Maybe<Array<NodeType>>,
  title?: Maybe<Scalars['String']>,
  title_contains?: Maybe<Scalars['String']>,
  title_ends_with?: Maybe<Scalars['String']>,
  title_gt?: Maybe<Scalars['String']>,
  title_gte?: Maybe<Scalars['String']>,
  title_in?: Maybe<Array<Scalars['String']>>,
  title_lt?: Maybe<Scalars['String']>,
  title_lte?: Maybe<Scalars['String']>,
  title_not?: Maybe<Scalars['String']>,
  title_not_contains?: Maybe<Scalars['String']>,
  title_not_ends_with?: Maybe<Scalars['String']>,
  title_not_in?: Maybe<Array<Scalars['String']>>,
  title_not_starts_with?: Maybe<Scalars['String']>,
  title_starts_with?: Maybe<Scalars['String']>,
};

export type QuestionNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type QuestionOption = {
   __typename?: 'QuestionOption',
  id: Scalars['ID'],
  publicValue?: Maybe<Scalars['String']>,
  value: Scalars['String'],
};

export type QuestionOptionConnection = {
   __typename?: 'QuestionOptionConnection',
  aggregate: AggregateQuestionOption,
  edges: Array<Maybe<QuestionOptionEdge>>,
  pageInfo: PageInfo,
};

export type QuestionOptionCreateInput = {
  id?: Maybe<Scalars['ID']>,
  publicValue?: Maybe<Scalars['String']>,
  value: Scalars['String'],
};

export type QuestionOptionCreateManyInput = {
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  create?: Maybe<Array<QuestionOptionCreateInput>>,
};

export type QuestionOptionEdge = {
   __typename?: 'QuestionOptionEdge',
  cursor: Scalars['String'],
  node: QuestionOption,
};

export enum QuestionOptionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PublicValueAsc = 'publicValue_ASC',
  PublicValueDesc = 'publicValue_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC'
}

export type QuestionOptionPreviousValues = {
   __typename?: 'QuestionOptionPreviousValues',
  id: Scalars['ID'],
  publicValue?: Maybe<Scalars['String']>,
  value: Scalars['String'],
};

export type QuestionOptionScalarWhereInput = {
  AND?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  OR?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  publicValue?: Maybe<Scalars['String']>,
  publicValue_contains?: Maybe<Scalars['String']>,
  publicValue_ends_with?: Maybe<Scalars['String']>,
  publicValue_gt?: Maybe<Scalars['String']>,
  publicValue_gte?: Maybe<Scalars['String']>,
  publicValue_in?: Maybe<Array<Scalars['String']>>,
  publicValue_lt?: Maybe<Scalars['String']>,
  publicValue_lte?: Maybe<Scalars['String']>,
  publicValue_not?: Maybe<Scalars['String']>,
  publicValue_not_contains?: Maybe<Scalars['String']>,
  publicValue_not_ends_with?: Maybe<Scalars['String']>,
  publicValue_not_in?: Maybe<Array<Scalars['String']>>,
  publicValue_not_starts_with?: Maybe<Scalars['String']>,
  publicValue_starts_with?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
  value_contains?: Maybe<Scalars['String']>,
  value_ends_with?: Maybe<Scalars['String']>,
  value_gt?: Maybe<Scalars['String']>,
  value_gte?: Maybe<Scalars['String']>,
  value_in?: Maybe<Array<Scalars['String']>>,
  value_lt?: Maybe<Scalars['String']>,
  value_lte?: Maybe<Scalars['String']>,
  value_not?: Maybe<Scalars['String']>,
  value_not_contains?: Maybe<Scalars['String']>,
  value_not_ends_with?: Maybe<Scalars['String']>,
  value_not_in?: Maybe<Array<Scalars['String']>>,
  value_not_starts_with?: Maybe<Scalars['String']>,
  value_starts_with?: Maybe<Scalars['String']>,
};

export type QuestionOptionSubscriptionPayload = {
   __typename?: 'QuestionOptionSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionOption>,
  previousValues?: Maybe<QuestionOptionPreviousValues>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
};

export type QuestionOptionSubscriptionWhereInput = {
  AND?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
  mutation_in?: Maybe<Array<MutationType>>,
  node?: Maybe<QuestionOptionWhereInput>,
  NOT?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
};

export type QuestionOptionUpdateDataInput = {
  publicValue?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateInput = {
  publicValue?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyDataInput = {
  publicValue?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyInput = {
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  create?: Maybe<Array<QuestionOptionCreateInput>>,
  delete?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  disconnect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  set?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  update?: Maybe<Array<QuestionOptionUpdateWithWhereUniqueNestedInput>>,
  updateMany?: Maybe<Array<QuestionOptionUpdateManyWithWhereNestedInput>>,
  upsert?: Maybe<Array<QuestionOptionUpsertWithWhereUniqueNestedInput>>,
};

export type QuestionOptionUpdateManyMutationInput = {
  publicValue?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyWithWhereNestedInput = {
  data: QuestionOptionUpdateManyDataInput,
  where: QuestionOptionScalarWhereInput,
};

export type QuestionOptionUpdateWithWhereUniqueNestedInput = {
  data: QuestionOptionUpdateDataInput,
  where: QuestionOptionWhereUniqueInput,
};

export type QuestionOptionUpsertWithWhereUniqueNestedInput = {
  create: QuestionOptionCreateInput,
  update: QuestionOptionUpdateDataInput,
  where: QuestionOptionWhereUniqueInput,
};

export type QuestionOptionWhereInput = {
  AND?: Maybe<Array<QuestionOptionWhereInput>>,
  id?: Maybe<Scalars['ID']>,
  id_contains?: Maybe<Scalars['ID']>,
  id_ends_with?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_lt?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_not_contains?: Maybe<Scalars['ID']>,
  id_not_ends_with?: Maybe<Scalars['ID']>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  id_not_starts_with?: Maybe<Scalars['ID']>,
  id_starts_with?: Maybe<Scalars['ID']>,
  NOT?: Maybe<Array<QuestionOptionWhereInput>>,
  OR?: Maybe<Array<QuestionOptionWhereInput>>,
  publicValue?: Maybe<Scalars['String']>,
  publicValue_contains?: Maybe<Scalars['String']>,
  publicValue_ends_with?: Maybe<Scalars['String']>,
  publicValue_gt?: Maybe<Scalars['String']>,
  publicValue_gte?: Maybe<Scalars['String']>,
  publicValue_in?: Maybe<Array<Scalars['String']>>,
  publicValue_lt?: Maybe<Scalars['String']>,
  publicValue_lte?: Maybe<Scalars['String']>,
  publicValue_not?: Maybe<Scalars['String']>,
  publicValue_not_contains?: Maybe<Scalars['String']>,
  publicValue_not_ends_with?: Maybe<Scalars['String']>,
  publicValue_not_in?: Maybe<Array<Scalars['String']>>,
  publicValue_not_starts_with?: Maybe<Scalars['String']>,
  publicValue_starts_with?: Maybe<Scalars['String']>,
  value?: Maybe<Scalars['String']>,
  value_contains?: Maybe<Scalars['String']>,
  value_ends_with?: Maybe<Scalars['String']>,
  value_gt?: Maybe<Scalars['String']>,
  value_gte?: Maybe<Scalars['String']>,
  value_in?: Maybe<Array<Scalars['String']>>,
  value_lt?: Maybe<Scalars['String']>,
  value_lte?: Maybe<Scalars['String']>,
  value_not?: Maybe<Scalars['String']>,
  value_not_contains?: Maybe<Scalars['String']>,
  value_not_ends_with?: Maybe<Scalars['String']>,
  value_not_in?: Maybe<Array<Scalars['String']>>,
  value_not_starts_with?: Maybe<Scalars['String']>,
  value_starts_with?: Maybe<Scalars['String']>,
};

export type QuestionOptionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Subscription = {
   __typename?: 'Subscription',
  colourSettings?: Maybe<ColourSettingsSubscriptionPayload>,
  customer?: Maybe<CustomerSubscriptionPayload>,
  customerSettings?: Maybe<CustomerSettingsSubscriptionPayload>,
  edge?: Maybe<EdgeSubscriptionPayload>,
  fontSettings?: Maybe<FontSettingsSubscriptionPayload>,
  leafNode?: Maybe<LeafNodeSubscriptionPayload>,
  questionCondition?: Maybe<QuestionConditionSubscriptionPayload>,
  questionnaire?: Maybe<QuestionnaireSubscriptionPayload>,
  questionNode?: Maybe<QuestionNodeSubscriptionPayload>,
  questionOption?: Maybe<QuestionOptionSubscriptionPayload>,
};


export type SubscriptionColourSettingsArgs = {
  where?: Maybe<ColourSettingsSubscriptionWhereInput>
};


export type SubscriptionCustomerArgs = {
  where?: Maybe<CustomerSubscriptionWhereInput>
};


export type SubscriptionCustomerSettingsArgs = {
  where?: Maybe<CustomerSettingsSubscriptionWhereInput>
};


export type SubscriptionEdgeArgs = {
  where?: Maybe<EdgeSubscriptionWhereInput>
};


export type SubscriptionFontSettingsArgs = {
  where?: Maybe<FontSettingsSubscriptionWhereInput>
};


export type SubscriptionLeafNodeArgs = {
  where?: Maybe<LeafNodeSubscriptionWhereInput>
};


export type SubscriptionQuestionConditionArgs = {
  where?: Maybe<QuestionConditionSubscriptionWhereInput>
};


export type SubscriptionQuestionnaireArgs = {
  where?: Maybe<QuestionnaireSubscriptionWhereInput>
};


export type SubscriptionQuestionNodeArgs = {
  where?: Maybe<QuestionNodeSubscriptionWhereInput>
};


export type SubscriptionQuestionOptionArgs = {
  where?: Maybe<QuestionOptionSubscriptionWhereInput>
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
  ColourSettingsWhereUniqueInput: ColourSettingsWhereUniqueInput,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  ColourSettings: ResolverTypeWrapper<ColourSettings>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ColourSettingsOrderByInput: ColourSettingsOrderByInput,
  ColourSettingsWhereInput: ColourSettingsWhereInput,
  ColourSettingsConnection: ResolverTypeWrapper<ColourSettingsConnection>,
  AggregateColourSettings: ResolverTypeWrapper<AggregateColourSettings>,
  ColourSettingsEdge: ResolverTypeWrapper<ColourSettingsEdge>,
  PageInfo: ResolverTypeWrapper<PageInfo>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  CustomerWhereUniqueInput: CustomerWhereUniqueInput,
  Customer: ResolverTypeWrapper<Customer>,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  LeafNodeWhereInput: LeafNodeWhereInput,
  NodeType: NodeType,
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  EdgeWhereInput: EdgeWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  Questionnaire: ResolverTypeWrapper<Questionnaire>,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  LeafNode: ResolverTypeWrapper<LeafNode>,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  QuestionNode: ResolverTypeWrapper<QuestionNode>,
  EdgeOrderByInput: EdgeOrderByInput,
  Edge: ResolverTypeWrapper<Edge>,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: ResolverTypeWrapper<QuestionCondition>,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: ResolverTypeWrapper<QuestionOption>,
  CustomerSettings: ResolverTypeWrapper<CustomerSettings>,
  FontSettings: ResolverTypeWrapper<FontSettings>,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>,
  AggregateCustomer: ResolverTypeWrapper<AggregateCustomer>,
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: ResolverTypeWrapper<CustomerSettingsConnection>,
  AggregateCustomerSettings: ResolverTypeWrapper<AggregateCustomerSettings>,
  CustomerSettingsEdge: ResolverTypeWrapper<CustomerSettingsEdge>,
  EdgeWhereUniqueInput: EdgeWhereUniqueInput,
  EdgeConnection: ResolverTypeWrapper<EdgeConnection>,
  AggregateEdge: ResolverTypeWrapper<AggregateEdge>,
  EdgeEdge: ResolverTypeWrapper<EdgeEdge>,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: ResolverTypeWrapper<FontSettingsConnection>,
  AggregateFontSettings: ResolverTypeWrapper<AggregateFontSettings>,
  FontSettingsEdge: ResolverTypeWrapper<FontSettingsEdge>,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNodeConnection: ResolverTypeWrapper<LeafNodeConnection>,
  AggregateLeafNode: ResolverTypeWrapper<AggregateLeafNode>,
  LeafNodeEdge: ResolverTypeWrapper<LeafNodeEdge>,
  Node: ResolverTypeWrapper<Node>,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: ResolverTypeWrapper<QuestionConditionConnection>,
  AggregateQuestionCondition: ResolverTypeWrapper<AggregateQuestionCondition>,
  QuestionConditionEdge: ResolverTypeWrapper<QuestionConditionEdge>,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: ResolverTypeWrapper<QuestionnaireConnection>,
  AggregateQuestionnaire: ResolverTypeWrapper<AggregateQuestionnaire>,
  QuestionnaireEdge: ResolverTypeWrapper<QuestionnaireEdge>,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNodeConnection: ResolverTypeWrapper<QuestionNodeConnection>,
  AggregateQuestionNode: ResolverTypeWrapper<AggregateQuestionNode>,
  QuestionNodeEdge: ResolverTypeWrapper<QuestionNodeEdge>,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: ResolverTypeWrapper<QuestionOptionConnection>,
  AggregateQuestionOption: ResolverTypeWrapper<AggregateQuestionOption>,
  QuestionOptionEdge: ResolverTypeWrapper<QuestionOptionEdge>,
  Mutation: ResolverTypeWrapper<{}>,
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyWithoutCustomerInput: QuestionnaireCreateManyWithoutCustomerInput,
  QuestionnaireCreateWithoutCustomerInput: QuestionnaireCreateWithoutCustomerInput,
  LeafNodeCreateManyInput: LeafNodeCreateManyInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  QuestionNodeCreateManyWithoutQuestionnaireInput: QuestionNodeCreateManyWithoutQuestionnaireInput,
  QuestionNodeCreateWithoutQuestionnaireInput: QuestionNodeCreateWithoutQuestionnaireInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  EdgeCreateManyInput: EdgeCreateManyInput,
  EdgeCreateInput: EdgeCreateInput,
  QuestionNodeCreateOneInput: QuestionNodeCreateOneInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionnaireCreateOneInput: QuestionnaireCreateOneInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  CustomerCreateOneWithoutQuestionnairesInput: CustomerCreateOneWithoutQuestionnairesInput,
  CustomerCreateWithoutQuestionnairesInput: CustomerCreateWithoutQuestionnairesInput,
  CustomerSettingsCreateOneInput: CustomerSettingsCreateOneInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  LeafNodeCreateOneInput: LeafNodeCreateOneInput,
  QuestionnaireCreateOneWithoutQuestionsInput: QuestionnaireCreateOneWithoutQuestionsInput,
  QuestionnaireCreateWithoutQuestionsInput: QuestionnaireCreateWithoutQuestionsInput,
  CustomerCreateOptions: CustomerCreateOptions,
  BatchPayload: ResolverTypeWrapper<BatchPayload>,
  Long: ResolverTypeWrapper<Scalars['Long']>,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyWithoutCustomerInput: QuestionnaireUpdateManyWithoutCustomerInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput: QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput,
  QuestionnaireUpdateWithoutCustomerDataInput: QuestionnaireUpdateWithoutCustomerDataInput,
  LeafNodeUpdateManyInput: LeafNodeUpdateManyInput,
  LeafNodeScalarWhereInput: LeafNodeScalarWhereInput,
  LeafNodeUpdateWithWhereUniqueNestedInput: LeafNodeUpdateWithWhereUniqueNestedInput,
  LeafNodeUpdateDataInput: LeafNodeUpdateDataInput,
  LeafNodeUpdateManyWithWhereNestedInput: LeafNodeUpdateManyWithWhereNestedInput,
  LeafNodeUpdateManyDataInput: LeafNodeUpdateManyDataInput,
  LeafNodeUpsertWithWhereUniqueNestedInput: LeafNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeUpdateManyWithoutQuestionnaireInput: QuestionNodeUpdateManyWithoutQuestionnaireInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput,
  QuestionNodeUpdateWithoutQuestionnaireDataInput: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  EdgeUpdateManyInput: EdgeUpdateManyInput,
  EdgeScalarWhereInput: EdgeScalarWhereInput,
  EdgeUpdateWithWhereUniqueNestedInput: EdgeUpdateWithWhereUniqueNestedInput,
  EdgeUpdateDataInput: EdgeUpdateDataInput,
  QuestionNodeUpdateOneInput: QuestionNodeUpdateOneInput,
  QuestionNodeUpsertNestedInput: QuestionNodeUpsertNestedInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionnaireUpdateOneInput: QuestionnaireUpdateOneInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  CustomerUpdateOneRequiredWithoutQuestionnairesInput: CustomerUpdateOneRequiredWithoutQuestionnairesInput,
  CustomerUpdateWithoutQuestionnairesDataInput: CustomerUpdateWithoutQuestionnairesDataInput,
  CustomerSettingsUpdateOneInput: CustomerSettingsUpdateOneInput,
  CustomerSettingsUpdateDataInput: CustomerSettingsUpdateDataInput,
  ColourSettingsUpdateOneInput: ColourSettingsUpdateOneInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneInput: FontSettingsUpdateOneInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  CustomerSettingsUpsertNestedInput: CustomerSettingsUpsertNestedInput,
  CustomerUpsertWithoutQuestionnairesInput: CustomerUpsertWithoutQuestionnairesInput,
  QuestionnaireUpsertNestedInput: QuestionnaireUpsertNestedInput,
  EdgeUpsertWithWhereUniqueNestedInput: EdgeUpsertWithWhereUniqueNestedInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  LeafNodeUpdateOneInput: LeafNodeUpdateOneInput,
  LeafNodeUpsertNestedInput: LeafNodeUpsertNestedInput,
  QuestionnaireUpdateOneWithoutQuestionsInput: QuestionnaireUpdateOneWithoutQuestionsInput,
  QuestionnaireUpdateWithoutQuestionsDataInput: QuestionnaireUpdateWithoutQuestionsDataInput,
  QuestionnaireUpsertWithoutQuestionsInput: QuestionnaireUpsertWithoutQuestionsInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput: QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  EdgeUpdateInput: EdgeUpdateInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  Subscription: ResolverTypeWrapper<{}>,
  ColourSettingsSubscriptionWhereInput: ColourSettingsSubscriptionWhereInput,
  MutationType: MutationType,
  ColourSettingsSubscriptionPayload: ResolverTypeWrapper<ColourSettingsSubscriptionPayload>,
  ColourSettingsPreviousValues: ResolverTypeWrapper<ColourSettingsPreviousValues>,
  CustomerSubscriptionWhereInput: CustomerSubscriptionWhereInput,
  CustomerSubscriptionPayload: ResolverTypeWrapper<CustomerSubscriptionPayload>,
  CustomerPreviousValues: ResolverTypeWrapper<CustomerPreviousValues>,
  CustomerSettingsSubscriptionWhereInput: CustomerSettingsSubscriptionWhereInput,
  CustomerSettingsSubscriptionPayload: ResolverTypeWrapper<CustomerSettingsSubscriptionPayload>,
  CustomerSettingsPreviousValues: ResolverTypeWrapper<CustomerSettingsPreviousValues>,
  EdgeSubscriptionWhereInput: EdgeSubscriptionWhereInput,
  EdgeSubscriptionPayload: ResolverTypeWrapper<EdgeSubscriptionPayload>,
  EdgePreviousValues: ResolverTypeWrapper<EdgePreviousValues>,
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: ResolverTypeWrapper<FontSettingsSubscriptionPayload>,
  FontSettingsPreviousValues: ResolverTypeWrapper<FontSettingsPreviousValues>,
  LeafNodeSubscriptionWhereInput: LeafNodeSubscriptionWhereInput,
  LeafNodeSubscriptionPayload: ResolverTypeWrapper<LeafNodeSubscriptionPayload>,
  LeafNodePreviousValues: ResolverTypeWrapper<LeafNodePreviousValues>,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: ResolverTypeWrapper<QuestionConditionSubscriptionPayload>,
  QuestionConditionPreviousValues: ResolverTypeWrapper<QuestionConditionPreviousValues>,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: ResolverTypeWrapper<QuestionnaireSubscriptionPayload>,
  QuestionnairePreviousValues: ResolverTypeWrapper<QuestionnairePreviousValues>,
  QuestionNodeSubscriptionWhereInput: QuestionNodeSubscriptionWhereInput,
  QuestionNodeSubscriptionPayload: ResolverTypeWrapper<QuestionNodeSubscriptionPayload>,
  QuestionNodePreviousValues: ResolverTypeWrapper<QuestionNodePreviousValues>,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: ResolverTypeWrapper<QuestionOptionSubscriptionPayload>,
  QuestionOptionPreviousValues: ResolverTypeWrapper<QuestionOptionPreviousValues>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  ColourSettingsWhereUniqueInput: ColourSettingsWhereUniqueInput,
  ID: Scalars['ID'],
  ColourSettings: ColourSettings,
  String: Scalars['String'],
  Int: Scalars['Int'],
  ColourSettingsOrderByInput: ColourSettingsOrderByInput,
  ColourSettingsWhereInput: ColourSettingsWhereInput,
  ColourSettingsConnection: ColourSettingsConnection,
  AggregateColourSettings: AggregateColourSettings,
  ColourSettingsEdge: ColourSettingsEdge,
  PageInfo: PageInfo,
  Boolean: Scalars['Boolean'],
  CustomerWhereUniqueInput: CustomerWhereUniqueInput,
  Customer: Customer,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  DateTime: Scalars['DateTime'],
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  LeafNodeWhereInput: LeafNodeWhereInput,
  NodeType: NodeType,
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  EdgeWhereInput: EdgeWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  Questionnaire: Questionnaire,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  LeafNode: LeafNode,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  QuestionNode: QuestionNode,
  EdgeOrderByInput: EdgeOrderByInput,
  Edge: Edge,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: QuestionCondition,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: QuestionOption,
  CustomerSettings: CustomerSettings,
  FontSettings: FontSettings,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: CustomerConnection,
  AggregateCustomer: AggregateCustomer,
  CustomerEdge: CustomerEdge,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: CustomerSettingsConnection,
  AggregateCustomerSettings: AggregateCustomerSettings,
  CustomerSettingsEdge: CustomerSettingsEdge,
  EdgeWhereUniqueInput: EdgeWhereUniqueInput,
  EdgeConnection: EdgeConnection,
  AggregateEdge: AggregateEdge,
  EdgeEdge: EdgeEdge,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: FontSettingsConnection,
  AggregateFontSettings: AggregateFontSettings,
  FontSettingsEdge: FontSettingsEdge,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNodeConnection: LeafNodeConnection,
  AggregateLeafNode: AggregateLeafNode,
  LeafNodeEdge: LeafNodeEdge,
  Node: Node,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: QuestionConditionConnection,
  AggregateQuestionCondition: AggregateQuestionCondition,
  QuestionConditionEdge: QuestionConditionEdge,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: QuestionnaireConnection,
  AggregateQuestionnaire: AggregateQuestionnaire,
  QuestionnaireEdge: QuestionnaireEdge,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNodeConnection: QuestionNodeConnection,
  AggregateQuestionNode: AggregateQuestionNode,
  QuestionNodeEdge: QuestionNodeEdge,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: QuestionOptionConnection,
  AggregateQuestionOption: AggregateQuestionOption,
  QuestionOptionEdge: QuestionOptionEdge,
  Mutation: {},
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyWithoutCustomerInput: QuestionnaireCreateManyWithoutCustomerInput,
  QuestionnaireCreateWithoutCustomerInput: QuestionnaireCreateWithoutCustomerInput,
  LeafNodeCreateManyInput: LeafNodeCreateManyInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  QuestionNodeCreateManyWithoutQuestionnaireInput: QuestionNodeCreateManyWithoutQuestionnaireInput,
  QuestionNodeCreateWithoutQuestionnaireInput: QuestionNodeCreateWithoutQuestionnaireInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  EdgeCreateManyInput: EdgeCreateManyInput,
  EdgeCreateInput: EdgeCreateInput,
  QuestionNodeCreateOneInput: QuestionNodeCreateOneInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionnaireCreateOneInput: QuestionnaireCreateOneInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  CustomerCreateOneWithoutQuestionnairesInput: CustomerCreateOneWithoutQuestionnairesInput,
  CustomerCreateWithoutQuestionnairesInput: CustomerCreateWithoutQuestionnairesInput,
  CustomerSettingsCreateOneInput: CustomerSettingsCreateOneInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  LeafNodeCreateOneInput: LeafNodeCreateOneInput,
  QuestionnaireCreateOneWithoutQuestionsInput: QuestionnaireCreateOneWithoutQuestionsInput,
  QuestionnaireCreateWithoutQuestionsInput: QuestionnaireCreateWithoutQuestionsInput,
  CustomerCreateOptions: CustomerCreateOptions,
  BatchPayload: BatchPayload,
  Long: Scalars['Long'],
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyWithoutCustomerInput: QuestionnaireUpdateManyWithoutCustomerInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput: QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput,
  QuestionnaireUpdateWithoutCustomerDataInput: QuestionnaireUpdateWithoutCustomerDataInput,
  LeafNodeUpdateManyInput: LeafNodeUpdateManyInput,
  LeafNodeScalarWhereInput: LeafNodeScalarWhereInput,
  LeafNodeUpdateWithWhereUniqueNestedInput: LeafNodeUpdateWithWhereUniqueNestedInput,
  LeafNodeUpdateDataInput: LeafNodeUpdateDataInput,
  LeafNodeUpdateManyWithWhereNestedInput: LeafNodeUpdateManyWithWhereNestedInput,
  LeafNodeUpdateManyDataInput: LeafNodeUpdateManyDataInput,
  LeafNodeUpsertWithWhereUniqueNestedInput: LeafNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeUpdateManyWithoutQuestionnaireInput: QuestionNodeUpdateManyWithoutQuestionnaireInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput,
  QuestionNodeUpdateWithoutQuestionnaireDataInput: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  EdgeUpdateManyInput: EdgeUpdateManyInput,
  EdgeScalarWhereInput: EdgeScalarWhereInput,
  EdgeUpdateWithWhereUniqueNestedInput: EdgeUpdateWithWhereUniqueNestedInput,
  EdgeUpdateDataInput: EdgeUpdateDataInput,
  QuestionNodeUpdateOneInput: QuestionNodeUpdateOneInput,
  QuestionNodeUpsertNestedInput: QuestionNodeUpsertNestedInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionnaireUpdateOneInput: QuestionnaireUpdateOneInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  CustomerUpdateOneRequiredWithoutQuestionnairesInput: CustomerUpdateOneRequiredWithoutQuestionnairesInput,
  CustomerUpdateWithoutQuestionnairesDataInput: CustomerUpdateWithoutQuestionnairesDataInput,
  CustomerSettingsUpdateOneInput: CustomerSettingsUpdateOneInput,
  CustomerSettingsUpdateDataInput: CustomerSettingsUpdateDataInput,
  ColourSettingsUpdateOneInput: ColourSettingsUpdateOneInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneInput: FontSettingsUpdateOneInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  CustomerSettingsUpsertNestedInput: CustomerSettingsUpsertNestedInput,
  CustomerUpsertWithoutQuestionnairesInput: CustomerUpsertWithoutQuestionnairesInput,
  QuestionnaireUpsertNestedInput: QuestionnaireUpsertNestedInput,
  EdgeUpsertWithWhereUniqueNestedInput: EdgeUpsertWithWhereUniqueNestedInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  LeafNodeUpdateOneInput: LeafNodeUpdateOneInput,
  LeafNodeUpsertNestedInput: LeafNodeUpsertNestedInput,
  QuestionnaireUpdateOneWithoutQuestionsInput: QuestionnaireUpdateOneWithoutQuestionsInput,
  QuestionnaireUpdateWithoutQuestionsDataInput: QuestionnaireUpdateWithoutQuestionsDataInput,
  QuestionnaireUpsertWithoutQuestionsInput: QuestionnaireUpsertWithoutQuestionsInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput: QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  EdgeUpdateInput: EdgeUpdateInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  Subscription: {},
  ColourSettingsSubscriptionWhereInput: ColourSettingsSubscriptionWhereInput,
  MutationType: MutationType,
  ColourSettingsSubscriptionPayload: ColourSettingsSubscriptionPayload,
  ColourSettingsPreviousValues: ColourSettingsPreviousValues,
  CustomerSubscriptionWhereInput: CustomerSubscriptionWhereInput,
  CustomerSubscriptionPayload: CustomerSubscriptionPayload,
  CustomerPreviousValues: CustomerPreviousValues,
  CustomerSettingsSubscriptionWhereInput: CustomerSettingsSubscriptionWhereInput,
  CustomerSettingsSubscriptionPayload: CustomerSettingsSubscriptionPayload,
  CustomerSettingsPreviousValues: CustomerSettingsPreviousValues,
  EdgeSubscriptionWhereInput: EdgeSubscriptionWhereInput,
  EdgeSubscriptionPayload: EdgeSubscriptionPayload,
  EdgePreviousValues: EdgePreviousValues,
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: FontSettingsSubscriptionPayload,
  FontSettingsPreviousValues: FontSettingsPreviousValues,
  LeafNodeSubscriptionWhereInput: LeafNodeSubscriptionWhereInput,
  LeafNodeSubscriptionPayload: LeafNodeSubscriptionPayload,
  LeafNodePreviousValues: LeafNodePreviousValues,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: QuestionConditionSubscriptionPayload,
  QuestionConditionPreviousValues: QuestionConditionPreviousValues,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: QuestionnaireSubscriptionPayload,
  QuestionnairePreviousValues: QuestionnairePreviousValues,
  QuestionNodeSubscriptionWhereInput: QuestionNodeSubscriptionWhereInput,
  QuestionNodeSubscriptionPayload: QuestionNodeSubscriptionPayload,
  QuestionNodePreviousValues: QuestionNodePreviousValues,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: QuestionOptionSubscriptionPayload,
  QuestionOptionPreviousValues: QuestionOptionPreviousValues,
}>;

export type AggregateColourSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateColourSettings'] = ResolversParentTypes['AggregateColourSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateCustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateCustomer'] = ResolversParentTypes['AggregateCustomer']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateCustomerSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateCustomerSettings'] = ResolversParentTypes['AggregateCustomerSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateEdge'] = ResolversParentTypes['AggregateEdge']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateFontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateFontSettings'] = ResolversParentTypes['AggregateFontSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateLeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateLeafNode'] = ResolversParentTypes['AggregateLeafNode']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionCondition'] = ResolversParentTypes['AggregateQuestionCondition']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionnaire'] = ResolversParentTypes['AggregateQuestionnaire']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionNode'] = ResolversParentTypes['AggregateQuestionNode']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionOption'] = ResolversParentTypes['AggregateQuestionOption']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type BatchPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchPayload'] = ResolversParentTypes['BatchPayload']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Long'], ParentType, ContextType>,
}>;

export type ColourSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettings'] = ResolversParentTypes['ColourSettings']> = ResolversObject<{
  dark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  darkest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  light?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lightest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  muted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  normal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  secondary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tertiary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  warning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type ColourSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsConnection'] = ResolversParentTypes['ColourSettingsConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateColourSettings'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['ColourSettingsEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type ColourSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsEdge'] = ResolversParentTypes['ColourSettingsEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType>,
}>;

export type ColourSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsPreviousValues'] = ResolversParentTypes['ColourSettingsPreviousValues']> = ResolversObject<{
  dark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  darkest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  light?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lightest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  muted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  normal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  secondary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tertiary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  warning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type ColourSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsSubscriptionPayload'] = ResolversParentTypes['ColourSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['ColourSettingsPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  questionnaires?: Resolver<Maybe<Array<ResolversTypes['Questionnaire']>>, ParentType, ContextType, CustomerQuestionnairesArgs>,
  settings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
}>;

export type CustomerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateCustomer'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type CustomerEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerEdge'] = ResolversParentTypes['CustomerEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
}>;

export type CustomerPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerPreviousValues'] = ResolversParentTypes['CustomerPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type CustomerSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettings'] = ResolversParentTypes['CustomerSettings']> = ResolversObject<{
  colourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType>,
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type CustomerSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsConnection'] = ResolversParentTypes['CustomerSettingsConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateCustomerSettings'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerSettingsEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type CustomerSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsEdge'] = ResolversParentTypes['CustomerSettingsEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType>,
}>;

export type CustomerSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsPreviousValues'] = ResolversParentTypes['CustomerSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type CustomerSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsSubscriptionPayload'] = ResolversParentTypes['CustomerSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerSettingsPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type CustomerSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSubscriptionPayload'] = ResolversParentTypes['CustomerSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type EdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = ResolversObject<{
  childNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  conditions?: Resolver<Maybe<Array<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, EdgeConditionsArgs>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  parentNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
}>;

export type EdgeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeConnection'] = ResolversParentTypes['EdgeConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateEdge'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['EdgeEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type EdgeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeEdge'] = ResolversParentTypes['EdgeEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>,
}>;

export type EdgePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgePreviousValues'] = ResolversParentTypes['EdgePreviousValues']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
}>;

export type EdgeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeSubscriptionPayload'] = ResolversParentTypes['EdgeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['EdgePreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type FontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettings'] = ResolversParentTypes['FontSettings']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type FontSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsConnection'] = ResolversParentTypes['FontSettingsConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateFontSettings'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['FontSettingsEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type FontSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsEdge'] = ResolversParentTypes['FontSettingsEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType>,
}>;

export type FontSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsPreviousValues'] = ResolversParentTypes['FontSettingsPreviousValues']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type FontSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsSubscriptionPayload'] = ResolversParentTypes['FontSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['FontSettingsPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type LeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNode'] = ResolversParentTypes['LeafNode']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
}>;

export type LeafNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeConnection'] = ResolversParentTypes['LeafNodeConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateLeafNode'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['LeafNodeEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type LeafNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeEdge'] = ResolversParentTypes['LeafNodeEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType>,
}>;

export type LeafNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodePreviousValues'] = ResolversParentTypes['LeafNodePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
}>;

export type LeafNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeSubscriptionPayload'] = ResolversParentTypes['LeafNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['LeafNodePreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createColourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType, RequireFields<MutationCreateColourSettingsArgs, 'data'>>,
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'data'>>,
  createCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationCreateCustomerSettingsArgs, 'data'>>,
  createEdge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType, RequireFields<MutationCreateEdgeArgs, 'data'>>,
  createFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationCreateFontSettingsArgs, 'data'>>,
  createLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationCreateLeafNodeArgs, 'data'>>,
  createNewCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, MutationCreateNewCustomerArgs>,
  createQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationCreateQuestionConditionArgs, 'data'>>,
  createQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationCreateQuestionnaireArgs, 'data'>>,
  createQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationCreateQuestionNodeArgs, 'data'>>,
  createQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationCreateQuestionOptionArgs, 'data'>>,
  deleteColourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<MutationDeleteColourSettingsArgs, 'where'>>,
  deleteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'where'>>,
  deleteCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerSettingsArgs, 'where'>>,
  deleteEdge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<MutationDeleteEdgeArgs, 'where'>>,
  deleteFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationDeleteFontSettingsArgs, 'where'>>,
  deleteFullCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationDeleteFullCustomerArgs, 'id'>>,
  deleteLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationDeleteLeafNodeArgs, 'where'>>,
  deleteManyColourSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyColourSettingsesArgs>,
  deleteManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyCustomersArgs>,
  deleteManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyCustomerSettingsesArgs>,
  deleteManyEdges?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyEdgesArgs>,
  deleteManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyFontSettingsesArgs>,
  deleteManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyLeafNodesArgs>,
  deleteManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionConditionsArgs>,
  deleteManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionnairesArgs>,
  deleteManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionNodesArgs>,
  deleteManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionOptionsArgs>,
  deleteQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionConditionArgs, 'where'>>,
  deleteQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionnaireArgs, 'where'>>,
  deleteQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionNodeArgs, 'where'>>,
  deleteQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionOptionArgs, 'where'>>,
  updateColourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<MutationUpdateColourSettingsArgs, 'data' | 'where'>>,
  updateCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'data' | 'where'>>,
  updateCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerSettingsArgs, 'data' | 'where'>>,
  updateEdge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<MutationUpdateEdgeArgs, 'data' | 'where'>>,
  updateFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationUpdateFontSettingsArgs, 'data' | 'where'>>,
  updateLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationUpdateLeafNodeArgs, 'data' | 'where'>>,
  updateManyColourSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyColourSettingsesArgs, 'data'>>,
  updateManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomersArgs, 'data'>>,
  updateManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomerSettingsesArgs, 'data'>>,
  updateManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyFontSettingsesArgs, 'data'>>,
  updateManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyLeafNodesArgs, 'data'>>,
  updateManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionConditionsArgs, 'data'>>,
  updateManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionnairesArgs, 'data'>>,
  updateManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionNodesArgs, 'data'>>,
  updateManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionOptionsArgs, 'data'>>,
  updateQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionConditionArgs, 'data' | 'where'>>,
  updateQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionnaireArgs, 'data' | 'where'>>,
  updateQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionNodeArgs, 'data' | 'where'>>,
  updateQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionOptionArgs, 'data' | 'where'>>,
  upsertColourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType, RequireFields<MutationUpsertColourSettingsArgs, 'create' | 'update' | 'where'>>,
  upsertCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpsertCustomerArgs, 'create' | 'update' | 'where'>>,
  upsertCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationUpsertCustomerSettingsArgs, 'create' | 'update' | 'where'>>,
  upsertEdge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType, RequireFields<MutationUpsertEdgeArgs, 'create' | 'update' | 'where'>>,
  upsertFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationUpsertFontSettingsArgs, 'create' | 'update' | 'where'>>,
  upsertLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationUpsertLeafNodeArgs, 'create' | 'update' | 'where'>>,
  upsertQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationUpsertQuestionConditionArgs, 'create' | 'update' | 'where'>>,
  upsertQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationUpsertQuestionnaireArgs, 'create' | 'update' | 'where'>>,
  upsertQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationUpsertQuestionNodeArgs, 'create' | 'update' | 'where'>>,
  upsertQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationUpsertQuestionOptionArgs, 'create' | 'update' | 'where'>>,
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  colourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<QueryColourSettingsArgs, 'where'>>,
  colourSettingses?: Resolver<Array<Maybe<ResolversTypes['ColourSettings']>>, ParentType, ContextType, QueryColourSettingsesArgs>,
  colourSettingsesConnection?: Resolver<ResolversTypes['ColourSettingsConnection'], ParentType, ContextType, QueryColourSettingsesConnectionArgs>,
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'where'>>,
  customers?: Resolver<Array<Maybe<ResolversTypes['Customer']>>, ParentType, ContextType, QueryCustomersArgs>,
  customersConnection?: Resolver<ResolversTypes['CustomerConnection'], ParentType, ContextType, QueryCustomersConnectionArgs>,
  customerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<QueryCustomerSettingsArgs, 'where'>>,
  customerSettingses?: Resolver<Array<Maybe<ResolversTypes['CustomerSettings']>>, ParentType, ContextType, QueryCustomerSettingsesArgs>,
  customerSettingsesConnection?: Resolver<ResolversTypes['CustomerSettingsConnection'], ParentType, ContextType, QueryCustomerSettingsesConnectionArgs>,
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<QueryEdgeArgs, 'where'>>,
  edges?: Resolver<Array<Maybe<ResolversTypes['Edge']>>, ParentType, ContextType, QueryEdgesArgs>,
  edgesConnection?: Resolver<ResolversTypes['EdgeConnection'], ParentType, ContextType, QueryEdgesConnectionArgs>,
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<QueryFontSettingsArgs, 'where'>>,
  fontSettingses?: Resolver<Array<Maybe<ResolversTypes['FontSettings']>>, ParentType, ContextType, QueryFontSettingsesArgs>,
  fontSettingsesConnection?: Resolver<ResolversTypes['FontSettingsConnection'], ParentType, ContextType, QueryFontSettingsesConnectionArgs>,
  leafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<QueryLeafNodeArgs, 'where'>>,
  leafNodes?: Resolver<Array<Maybe<ResolversTypes['LeafNode']>>, ParentType, ContextType, QueryLeafNodesArgs>,
  leafNodesConnection?: Resolver<ResolversTypes['LeafNodeConnection'], ParentType, ContextType, QueryLeafNodesConnectionArgs>,
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
  questionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<QueryQuestionConditionArgs, 'where'>>,
  questionConditions?: Resolver<Array<Maybe<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, QueryQuestionConditionsArgs>,
  questionConditionsConnection?: Resolver<ResolversTypes['QuestionConditionConnection'], ParentType, ContextType, QueryQuestionConditionsConnectionArgs>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<QueryQuestionnaireArgs, 'where'>>,
  questionnaires?: Resolver<Array<Maybe<ResolversTypes['Questionnaire']>>, ParentType, ContextType, QueryQuestionnairesArgs>,
  questionnairesConnection?: Resolver<ResolversTypes['QuestionnaireConnection'], ParentType, ContextType, QueryQuestionnairesConnectionArgs>,
  questionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<QueryQuestionNodeArgs, 'where'>>,
  questionNodes?: Resolver<Array<Maybe<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QueryQuestionNodesArgs>,
  questionNodesConnection?: Resolver<ResolversTypes['QuestionNodeConnection'], ParentType, ContextType, QueryQuestionNodesConnectionArgs>,
  questionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<QueryQuestionOptionArgs, 'where'>>,
  questionOptions?: Resolver<Array<Maybe<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QueryQuestionOptionsArgs>,
  questionOptionsConnection?: Resolver<ResolversTypes['QuestionOptionConnection'], ParentType, ContextType, QueryQuestionOptionsConnectionArgs>,
}>;

export type QuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionCondition'] = ResolversParentTypes['QuestionCondition']> = ResolversObject<{
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
}>;

export type QuestionConditionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionConnection'] = ResolversParentTypes['QuestionConditionConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateQuestionCondition'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionConditionEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type QuestionConditionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionEdge'] = ResolversParentTypes['QuestionConditionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType>,
}>;

export type QuestionConditionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionPreviousValues'] = ResolversParentTypes['QuestionConditionPreviousValues']> = ResolversObject<{
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
}>;

export type QuestionConditionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionSubscriptionPayload'] = ResolversParentTypes['QuestionConditionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionConditionPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type QuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['Questionnaire'] = ResolversParentTypes['Questionnaire']> = ResolversObject<{
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  leafs?: Resolver<Maybe<Array<ResolversTypes['LeafNode']>>, ParentType, ContextType, QuestionnaireLeafsArgs>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  questions?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QuestionnaireQuestionsArgs>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
}>;

export type QuestionnaireConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireConnection'] = ResolversParentTypes['QuestionnaireConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateQuestionnaire'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionnaireEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type QuestionnaireEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireEdge'] = ResolversParentTypes['QuestionnaireEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType>,
}>;

export type QuestionnairePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnairePreviousValues'] = ResolversParentTypes['QuestionnairePreviousValues']> = ResolversObject<{
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
}>;

export type QuestionnaireSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSubscriptionPayload'] = ResolversParentTypes['QuestionnaireSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionnairePreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type QuestionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNode'] = ResolversParentTypes['QuestionNode']> = ResolversObject<{
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  children?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QuestionNodeChildrenArgs>,
  edgeChildren?: Resolver<Maybe<Array<ResolversTypes['Edge']>>, ParentType, ContextType, QuestionNodeEdgeChildrenArgs>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isRoot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  options?: Resolver<Maybe<Array<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QuestionNodeOptionsArgs>,
  overrideLeaf?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  questionType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeConnection'] = ResolversParentTypes['QuestionNodeConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateQuestionNode'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionNodeEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type QuestionNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeEdge'] = ResolversParentTypes['QuestionNodeEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType>,
}>;

export type QuestionNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodePreviousValues'] = ResolversParentTypes['QuestionNodePreviousValues']> = ResolversObject<{
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isRoot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  questionType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeSubscriptionPayload'] = ResolversParentTypes['QuestionNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionNodePreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type QuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOption'] = ResolversParentTypes['QuestionOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionOptionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionConnection'] = ResolversParentTypes['QuestionOptionConnection']> = ResolversObject<{
  aggregate?: Resolver<ResolversTypes['AggregateQuestionOption'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionOptionEdge']>>, ParentType, ContextType>,
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
}>;

export type QuestionOptionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionEdge'] = ResolversParentTypes['QuestionOptionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  node?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType>,
}>;

export type QuestionOptionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionPreviousValues'] = ResolversParentTypes['QuestionOptionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionOptionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionSubscriptionPayload'] = ResolversParentTypes['QuestionOptionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionOptionPreviousValues']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  colourSettings?: SubscriptionResolver<Maybe<ResolversTypes['ColourSettingsSubscriptionPayload']>, "colourSettings", ParentType, ContextType, SubscriptionColourSettingsArgs>,
  customer?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSubscriptionPayload']>, "customer", ParentType, ContextType, SubscriptionCustomerArgs>,
  customerSettings?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSettingsSubscriptionPayload']>, "customerSettings", ParentType, ContextType, SubscriptionCustomerSettingsArgs>,
  edge?: SubscriptionResolver<Maybe<ResolversTypes['EdgeSubscriptionPayload']>, "edge", ParentType, ContextType, SubscriptionEdgeArgs>,
  fontSettings?: SubscriptionResolver<Maybe<ResolversTypes['FontSettingsSubscriptionPayload']>, "fontSettings", ParentType, ContextType, SubscriptionFontSettingsArgs>,
  leafNode?: SubscriptionResolver<Maybe<ResolversTypes['LeafNodeSubscriptionPayload']>, "leafNode", ParentType, ContextType, SubscriptionLeafNodeArgs>,
  questionCondition?: SubscriptionResolver<Maybe<ResolversTypes['QuestionConditionSubscriptionPayload']>, "questionCondition", ParentType, ContextType, SubscriptionQuestionConditionArgs>,
  questionnaire?: SubscriptionResolver<Maybe<ResolversTypes['QuestionnaireSubscriptionPayload']>, "questionnaire", ParentType, ContextType, SubscriptionQuestionnaireArgs>,
  questionNode?: SubscriptionResolver<Maybe<ResolversTypes['QuestionNodeSubscriptionPayload']>, "questionNode", ParentType, ContextType, SubscriptionQuestionNodeArgs>,
  questionOption?: SubscriptionResolver<Maybe<ResolversTypes['QuestionOptionSubscriptionPayload']>, "questionOption", ParentType, ContextType, SubscriptionQuestionOptionArgs>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AggregateColourSettings?: AggregateColourSettingsResolvers<ContextType>,
  AggregateCustomer?: AggregateCustomerResolvers<ContextType>,
  AggregateCustomerSettings?: AggregateCustomerSettingsResolvers<ContextType>,
  AggregateEdge?: AggregateEdgeResolvers<ContextType>,
  AggregateFontSettings?: AggregateFontSettingsResolvers<ContextType>,
  AggregateLeafNode?: AggregateLeafNodeResolvers<ContextType>,
  AggregateQuestionCondition?: AggregateQuestionConditionResolvers<ContextType>,
  AggregateQuestionnaire?: AggregateQuestionnaireResolvers<ContextType>,
  AggregateQuestionNode?: AggregateQuestionNodeResolvers<ContextType>,
  AggregateQuestionOption?: AggregateQuestionOptionResolvers<ContextType>,
  BatchPayload?: BatchPayloadResolvers<ContextType>,
  ColourSettings?: ColourSettingsResolvers<ContextType>,
  ColourSettingsConnection?: ColourSettingsConnectionResolvers<ContextType>,
  ColourSettingsEdge?: ColourSettingsEdgeResolvers<ContextType>,
  ColourSettingsPreviousValues?: ColourSettingsPreviousValuesResolvers<ContextType>,
  ColourSettingsSubscriptionPayload?: ColourSettingsSubscriptionPayloadResolvers<ContextType>,
  Customer?: CustomerResolvers<ContextType>,
  CustomerConnection?: CustomerConnectionResolvers<ContextType>,
  CustomerEdge?: CustomerEdgeResolvers<ContextType>,
  CustomerPreviousValues?: CustomerPreviousValuesResolvers<ContextType>,
  CustomerSettings?: CustomerSettingsResolvers<ContextType>,
  CustomerSettingsConnection?: CustomerSettingsConnectionResolvers<ContextType>,
  CustomerSettingsEdge?: CustomerSettingsEdgeResolvers<ContextType>,
  CustomerSettingsPreviousValues?: CustomerSettingsPreviousValuesResolvers<ContextType>,
  CustomerSettingsSubscriptionPayload?: CustomerSettingsSubscriptionPayloadResolvers<ContextType>,
  CustomerSubscriptionPayload?: CustomerSubscriptionPayloadResolvers<ContextType>,
  DateTime?: GraphQLScalarType,
  Edge?: EdgeResolvers<ContextType>,
  EdgeConnection?: EdgeConnectionResolvers<ContextType>,
  EdgeEdge?: EdgeEdgeResolvers<ContextType>,
  EdgePreviousValues?: EdgePreviousValuesResolvers<ContextType>,
  EdgeSubscriptionPayload?: EdgeSubscriptionPayloadResolvers<ContextType>,
  FontSettings?: FontSettingsResolvers<ContextType>,
  FontSettingsConnection?: FontSettingsConnectionResolvers<ContextType>,
  FontSettingsEdge?: FontSettingsEdgeResolvers<ContextType>,
  FontSettingsPreviousValues?: FontSettingsPreviousValuesResolvers<ContextType>,
  FontSettingsSubscriptionPayload?: FontSettingsSubscriptionPayloadResolvers<ContextType>,
  LeafNode?: LeafNodeResolvers<ContextType>,
  LeafNodeConnection?: LeafNodeConnectionResolvers<ContextType>,
  LeafNodeEdge?: LeafNodeEdgeResolvers<ContextType>,
  LeafNodePreviousValues?: LeafNodePreviousValuesResolvers<ContextType>,
  LeafNodeSubscriptionPayload?: LeafNodeSubscriptionPayloadResolvers<ContextType>,
  Long?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Node?: NodeResolvers,
  PageInfo?: PageInfoResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  QuestionCondition?: QuestionConditionResolvers<ContextType>,
  QuestionConditionConnection?: QuestionConditionConnectionResolvers<ContextType>,
  QuestionConditionEdge?: QuestionConditionEdgeResolvers<ContextType>,
  QuestionConditionPreviousValues?: QuestionConditionPreviousValuesResolvers<ContextType>,
  QuestionConditionSubscriptionPayload?: QuestionConditionSubscriptionPayloadResolvers<ContextType>,
  Questionnaire?: QuestionnaireResolvers<ContextType>,
  QuestionnaireConnection?: QuestionnaireConnectionResolvers<ContextType>,
  QuestionnaireEdge?: QuestionnaireEdgeResolvers<ContextType>,
  QuestionnairePreviousValues?: QuestionnairePreviousValuesResolvers<ContextType>,
  QuestionnaireSubscriptionPayload?: QuestionnaireSubscriptionPayloadResolvers<ContextType>,
  QuestionNode?: QuestionNodeResolvers<ContextType>,
  QuestionNodeConnection?: QuestionNodeConnectionResolvers<ContextType>,
  QuestionNodeEdge?: QuestionNodeEdgeResolvers<ContextType>,
  QuestionNodePreviousValues?: QuestionNodePreviousValuesResolvers<ContextType>,
  QuestionNodeSubscriptionPayload?: QuestionNodeSubscriptionPayloadResolvers<ContextType>,
  QuestionOption?: QuestionOptionResolvers<ContextType>,
  QuestionOptionConnection?: QuestionOptionConnectionResolvers<ContextType>,
  QuestionOptionEdge?: QuestionOptionEdgeResolvers<ContextType>,
  QuestionOptionPreviousValues?: QuestionOptionPreviousValuesResolvers<ContextType>,
  QuestionOptionSubscriptionPayload?: QuestionOptionSubscriptionPayloadResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
