import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Long: any;
};

export type AggregateColourSettings = {
   __typename?: 'AggregateColourSettings';
  count: Scalars['Int'];
};

export type AggregateCustomer = {
   __typename?: 'AggregateCustomer';
  count: Scalars['Int'];
};

export type AggregateCustomerSettings = {
   __typename?: 'AggregateCustomerSettings';
  count: Scalars['Int'];
};

export type AggregateEdge = {
   __typename?: 'AggregateEdge';
  count: Scalars['Int'];
};

export type AggregateFontSettings = {
   __typename?: 'AggregateFontSettings';
  count: Scalars['Int'];
};

export type AggregateLeafNode = {
   __typename?: 'AggregateLeafNode';
  count: Scalars['Int'];
};

export type AggregateNodeEntry = {
   __typename?: 'AggregateNodeEntry';
  count: Scalars['Int'];
};

export type AggregateNodeEntryValue = {
   __typename?: 'AggregateNodeEntryValue';
  count: Scalars['Int'];
};

export type AggregateQuestionCondition = {
   __typename?: 'AggregateQuestionCondition';
  count: Scalars['Int'];
};

export type AggregateQuestionnaire = {
   __typename?: 'AggregateQuestionnaire';
  count: Scalars['Int'];
};

export type AggregateQuestionNode = {
   __typename?: 'AggregateQuestionNode';
  count: Scalars['Int'];
};

export type AggregateQuestionOption = {
   __typename?: 'AggregateQuestionOption';
  count: Scalars['Int'];
};

export type AggregateSession = {
   __typename?: 'AggregateSession';
  count: Scalars['Int'];
};

export type BatchPayload = {
   __typename?: 'BatchPayload';
  count: Scalars['Long'];
};

export type ColourSettings = {
   __typename?: 'ColourSettings';
  id: Scalars['ID'];
  primary: Scalars['String'];
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsConnection = {
   __typename?: 'ColourSettingsConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<ColourSettingsEdge>>;
  aggregate: AggregateColourSettings;
};

export type ColourSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>;
  primary: Scalars['String'];
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsCreateOneInput = {
  create?: Maybe<ColourSettingsCreateInput>;
  connect?: Maybe<ColourSettingsWhereUniqueInput>;
};

export type ColourSettingsEdge = {
   __typename?: 'ColourSettingsEdge';
  node: ColourSettings;
  cursor: Scalars['String'];
};

export enum ColourSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  PrimaryAsc = 'primary_ASC',
  PrimaryDesc = 'primary_DESC',
  PrimaryAltAsc = 'primaryAlt_ASC',
  PrimaryAltDesc = 'primaryAlt_DESC',
  SecondaryAsc = 'secondary_ASC',
  SecondaryDesc = 'secondary_DESC',
  TertiaryAsc = 'tertiary_ASC',
  TertiaryDesc = 'tertiary_DESC',
  SuccessAsc = 'success_ASC',
  SuccessDesc = 'success_DESC',
  WarningAsc = 'warning_ASC',
  WarningDesc = 'warning_DESC',
  ErrorAsc = 'error_ASC',
  ErrorDesc = 'error_DESC',
  LightestAsc = 'lightest_ASC',
  LightestDesc = 'lightest_DESC',
  LightAsc = 'light_ASC',
  LightDesc = 'light_DESC',
  NormalAsc = 'normal_ASC',
  NormalDesc = 'normal_DESC',
  DarkAsc = 'dark_ASC',
  DarkDesc = 'dark_DESC',
  DarkestAsc = 'darkest_ASC',
  DarkestDesc = 'darkest_DESC',
  MutedAsc = 'muted_ASC',
  MutedDesc = 'muted_DESC',
  TextAsc = 'text_ASC',
  TextDesc = 'text_DESC'
}

export type ColourSettingsPreviousValues = {
   __typename?: 'ColourSettingsPreviousValues';
  id: Scalars['ID'];
  primary: Scalars['String'];
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsSubscriptionPayload = {
   __typename?: 'ColourSettingsSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<ColourSettings>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<ColourSettingsPreviousValues>;
};

export type ColourSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<ColourSettingsWhereInput>;
  AND?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>;
  OR?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>;
  NOT?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>;
};

export type ColourSettingsUpdateDataInput = {
  primary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsUpdateInput = {
  primary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsUpdateManyMutationInput = {
  primary?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ColourSettingsUpdateOneInput = {
  create?: Maybe<ColourSettingsCreateInput>;
  update?: Maybe<ColourSettingsUpdateDataInput>;
  upsert?: Maybe<ColourSettingsUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<ColourSettingsWhereUniqueInput>;
};

export type ColourSettingsUpsertNestedInput = {
  update: ColourSettingsUpdateDataInput;
  create: ColourSettingsCreateInput;
};

export type ColourSettingsWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  primary?: Maybe<Scalars['String']>;
  primary_not?: Maybe<Scalars['String']>;
  primary_in?: Maybe<Array<Scalars['String']>>;
  primary_not_in?: Maybe<Array<Scalars['String']>>;
  primary_lt?: Maybe<Scalars['String']>;
  primary_lte?: Maybe<Scalars['String']>;
  primary_gt?: Maybe<Scalars['String']>;
  primary_gte?: Maybe<Scalars['String']>;
  primary_contains?: Maybe<Scalars['String']>;
  primary_not_contains?: Maybe<Scalars['String']>;
  primary_starts_with?: Maybe<Scalars['String']>;
  primary_not_starts_with?: Maybe<Scalars['String']>;
  primary_ends_with?: Maybe<Scalars['String']>;
  primary_not_ends_with?: Maybe<Scalars['String']>;
  primaryAlt?: Maybe<Scalars['String']>;
  primaryAlt_not?: Maybe<Scalars['String']>;
  primaryAlt_in?: Maybe<Array<Scalars['String']>>;
  primaryAlt_not_in?: Maybe<Array<Scalars['String']>>;
  primaryAlt_lt?: Maybe<Scalars['String']>;
  primaryAlt_lte?: Maybe<Scalars['String']>;
  primaryAlt_gt?: Maybe<Scalars['String']>;
  primaryAlt_gte?: Maybe<Scalars['String']>;
  primaryAlt_contains?: Maybe<Scalars['String']>;
  primaryAlt_not_contains?: Maybe<Scalars['String']>;
  primaryAlt_starts_with?: Maybe<Scalars['String']>;
  primaryAlt_not_starts_with?: Maybe<Scalars['String']>;
  primaryAlt_ends_with?: Maybe<Scalars['String']>;
  primaryAlt_not_ends_with?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  secondary_not?: Maybe<Scalars['String']>;
  secondary_in?: Maybe<Array<Scalars['String']>>;
  secondary_not_in?: Maybe<Array<Scalars['String']>>;
  secondary_lt?: Maybe<Scalars['String']>;
  secondary_lte?: Maybe<Scalars['String']>;
  secondary_gt?: Maybe<Scalars['String']>;
  secondary_gte?: Maybe<Scalars['String']>;
  secondary_contains?: Maybe<Scalars['String']>;
  secondary_not_contains?: Maybe<Scalars['String']>;
  secondary_starts_with?: Maybe<Scalars['String']>;
  secondary_not_starts_with?: Maybe<Scalars['String']>;
  secondary_ends_with?: Maybe<Scalars['String']>;
  secondary_not_ends_with?: Maybe<Scalars['String']>;
  tertiary?: Maybe<Scalars['String']>;
  tertiary_not?: Maybe<Scalars['String']>;
  tertiary_in?: Maybe<Array<Scalars['String']>>;
  tertiary_not_in?: Maybe<Array<Scalars['String']>>;
  tertiary_lt?: Maybe<Scalars['String']>;
  tertiary_lte?: Maybe<Scalars['String']>;
  tertiary_gt?: Maybe<Scalars['String']>;
  tertiary_gte?: Maybe<Scalars['String']>;
  tertiary_contains?: Maybe<Scalars['String']>;
  tertiary_not_contains?: Maybe<Scalars['String']>;
  tertiary_starts_with?: Maybe<Scalars['String']>;
  tertiary_not_starts_with?: Maybe<Scalars['String']>;
  tertiary_ends_with?: Maybe<Scalars['String']>;
  tertiary_not_ends_with?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['String']>;
  success_not?: Maybe<Scalars['String']>;
  success_in?: Maybe<Array<Scalars['String']>>;
  success_not_in?: Maybe<Array<Scalars['String']>>;
  success_lt?: Maybe<Scalars['String']>;
  success_lte?: Maybe<Scalars['String']>;
  success_gt?: Maybe<Scalars['String']>;
  success_gte?: Maybe<Scalars['String']>;
  success_contains?: Maybe<Scalars['String']>;
  success_not_contains?: Maybe<Scalars['String']>;
  success_starts_with?: Maybe<Scalars['String']>;
  success_not_starts_with?: Maybe<Scalars['String']>;
  success_ends_with?: Maybe<Scalars['String']>;
  success_not_ends_with?: Maybe<Scalars['String']>;
  warning?: Maybe<Scalars['String']>;
  warning_not?: Maybe<Scalars['String']>;
  warning_in?: Maybe<Array<Scalars['String']>>;
  warning_not_in?: Maybe<Array<Scalars['String']>>;
  warning_lt?: Maybe<Scalars['String']>;
  warning_lte?: Maybe<Scalars['String']>;
  warning_gt?: Maybe<Scalars['String']>;
  warning_gte?: Maybe<Scalars['String']>;
  warning_contains?: Maybe<Scalars['String']>;
  warning_not_contains?: Maybe<Scalars['String']>;
  warning_starts_with?: Maybe<Scalars['String']>;
  warning_not_starts_with?: Maybe<Scalars['String']>;
  warning_ends_with?: Maybe<Scalars['String']>;
  warning_not_ends_with?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  error_not?: Maybe<Scalars['String']>;
  error_in?: Maybe<Array<Scalars['String']>>;
  error_not_in?: Maybe<Array<Scalars['String']>>;
  error_lt?: Maybe<Scalars['String']>;
  error_lte?: Maybe<Scalars['String']>;
  error_gt?: Maybe<Scalars['String']>;
  error_gte?: Maybe<Scalars['String']>;
  error_contains?: Maybe<Scalars['String']>;
  error_not_contains?: Maybe<Scalars['String']>;
  error_starts_with?: Maybe<Scalars['String']>;
  error_not_starts_with?: Maybe<Scalars['String']>;
  error_ends_with?: Maybe<Scalars['String']>;
  error_not_ends_with?: Maybe<Scalars['String']>;
  lightest?: Maybe<Scalars['String']>;
  lightest_not?: Maybe<Scalars['String']>;
  lightest_in?: Maybe<Array<Scalars['String']>>;
  lightest_not_in?: Maybe<Array<Scalars['String']>>;
  lightest_lt?: Maybe<Scalars['String']>;
  lightest_lte?: Maybe<Scalars['String']>;
  lightest_gt?: Maybe<Scalars['String']>;
  lightest_gte?: Maybe<Scalars['String']>;
  lightest_contains?: Maybe<Scalars['String']>;
  lightest_not_contains?: Maybe<Scalars['String']>;
  lightest_starts_with?: Maybe<Scalars['String']>;
  lightest_not_starts_with?: Maybe<Scalars['String']>;
  lightest_ends_with?: Maybe<Scalars['String']>;
  lightest_not_ends_with?: Maybe<Scalars['String']>;
  light?: Maybe<Scalars['String']>;
  light_not?: Maybe<Scalars['String']>;
  light_in?: Maybe<Array<Scalars['String']>>;
  light_not_in?: Maybe<Array<Scalars['String']>>;
  light_lt?: Maybe<Scalars['String']>;
  light_lte?: Maybe<Scalars['String']>;
  light_gt?: Maybe<Scalars['String']>;
  light_gte?: Maybe<Scalars['String']>;
  light_contains?: Maybe<Scalars['String']>;
  light_not_contains?: Maybe<Scalars['String']>;
  light_starts_with?: Maybe<Scalars['String']>;
  light_not_starts_with?: Maybe<Scalars['String']>;
  light_ends_with?: Maybe<Scalars['String']>;
  light_not_ends_with?: Maybe<Scalars['String']>;
  normal?: Maybe<Scalars['String']>;
  normal_not?: Maybe<Scalars['String']>;
  normal_in?: Maybe<Array<Scalars['String']>>;
  normal_not_in?: Maybe<Array<Scalars['String']>>;
  normal_lt?: Maybe<Scalars['String']>;
  normal_lte?: Maybe<Scalars['String']>;
  normal_gt?: Maybe<Scalars['String']>;
  normal_gte?: Maybe<Scalars['String']>;
  normal_contains?: Maybe<Scalars['String']>;
  normal_not_contains?: Maybe<Scalars['String']>;
  normal_starts_with?: Maybe<Scalars['String']>;
  normal_not_starts_with?: Maybe<Scalars['String']>;
  normal_ends_with?: Maybe<Scalars['String']>;
  normal_not_ends_with?: Maybe<Scalars['String']>;
  dark?: Maybe<Scalars['String']>;
  dark_not?: Maybe<Scalars['String']>;
  dark_in?: Maybe<Array<Scalars['String']>>;
  dark_not_in?: Maybe<Array<Scalars['String']>>;
  dark_lt?: Maybe<Scalars['String']>;
  dark_lte?: Maybe<Scalars['String']>;
  dark_gt?: Maybe<Scalars['String']>;
  dark_gte?: Maybe<Scalars['String']>;
  dark_contains?: Maybe<Scalars['String']>;
  dark_not_contains?: Maybe<Scalars['String']>;
  dark_starts_with?: Maybe<Scalars['String']>;
  dark_not_starts_with?: Maybe<Scalars['String']>;
  dark_ends_with?: Maybe<Scalars['String']>;
  dark_not_ends_with?: Maybe<Scalars['String']>;
  darkest?: Maybe<Scalars['String']>;
  darkest_not?: Maybe<Scalars['String']>;
  darkest_in?: Maybe<Array<Scalars['String']>>;
  darkest_not_in?: Maybe<Array<Scalars['String']>>;
  darkest_lt?: Maybe<Scalars['String']>;
  darkest_lte?: Maybe<Scalars['String']>;
  darkest_gt?: Maybe<Scalars['String']>;
  darkest_gte?: Maybe<Scalars['String']>;
  darkest_contains?: Maybe<Scalars['String']>;
  darkest_not_contains?: Maybe<Scalars['String']>;
  darkest_starts_with?: Maybe<Scalars['String']>;
  darkest_not_starts_with?: Maybe<Scalars['String']>;
  darkest_ends_with?: Maybe<Scalars['String']>;
  darkest_not_ends_with?: Maybe<Scalars['String']>;
  muted?: Maybe<Scalars['String']>;
  muted_not?: Maybe<Scalars['String']>;
  muted_in?: Maybe<Array<Scalars['String']>>;
  muted_not_in?: Maybe<Array<Scalars['String']>>;
  muted_lt?: Maybe<Scalars['String']>;
  muted_lte?: Maybe<Scalars['String']>;
  muted_gt?: Maybe<Scalars['String']>;
  muted_gte?: Maybe<Scalars['String']>;
  muted_contains?: Maybe<Scalars['String']>;
  muted_not_contains?: Maybe<Scalars['String']>;
  muted_starts_with?: Maybe<Scalars['String']>;
  muted_not_starts_with?: Maybe<Scalars['String']>;
  muted_ends_with?: Maybe<Scalars['String']>;
  muted_not_ends_with?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  text_not?: Maybe<Scalars['String']>;
  text_in?: Maybe<Array<Scalars['String']>>;
  text_not_in?: Maybe<Array<Scalars['String']>>;
  text_lt?: Maybe<Scalars['String']>;
  text_lte?: Maybe<Scalars['String']>;
  text_gt?: Maybe<Scalars['String']>;
  text_gte?: Maybe<Scalars['String']>;
  text_contains?: Maybe<Scalars['String']>;
  text_not_contains?: Maybe<Scalars['String']>;
  text_starts_with?: Maybe<Scalars['String']>;
  text_not_starts_with?: Maybe<Scalars['String']>;
  text_ends_with?: Maybe<Scalars['String']>;
  text_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<ColourSettingsWhereInput>>;
  OR?: Maybe<Array<ColourSettingsWhereInput>>;
  NOT?: Maybe<Array<ColourSettingsWhereInput>>;
};

export type ColourSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type Customer = {
   __typename?: 'Customer';
  id: Scalars['ID'];
  name: Scalars['String'];
  questionnaires?: Maybe<Array<Questionnaire>>;
  settings?: Maybe<CustomerSettings>;
};


export type CustomerQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>;
  orderBy?: Maybe<QuestionnaireOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type CustomerConnection = {
   __typename?: 'CustomerConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<CustomerEdge>>;
  aggregate: AggregateCustomer;
};

export type CustomerCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  questionnaires?: Maybe<QuestionnaireCreateManyWithoutCustomerInput>;
  settings?: Maybe<CustomerSettingsCreateOneInput>;
};

export type CustomerCreateOneWithoutQuestionnairesInput = {
  create?: Maybe<CustomerCreateWithoutQuestionnairesInput>;
  connect?: Maybe<CustomerWhereUniqueInput>;
};

export type CustomerCreateWithoutQuestionnairesInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  settings?: Maybe<CustomerSettingsCreateOneInput>;
};

export type CustomerEdge = {
   __typename?: 'CustomerEdge';
  node: Customer;
  cursor: Scalars['String'];
};

export enum CustomerOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type CustomerPreviousValues = {
   __typename?: 'CustomerPreviousValues';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CustomerSettings = {
   __typename?: 'CustomerSettings';
  id: Scalars['ID'];
  logoUrl?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettings>;
  fontSettings?: Maybe<FontSettings>;
};

export type CustomerSettingsConnection = {
   __typename?: 'CustomerSettingsConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<CustomerSettingsEdge>>;
  aggregate: AggregateCustomerSettings;
};

export type CustomerSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>;
  logoUrl?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettingsCreateOneInput>;
  fontSettings?: Maybe<FontSettingsCreateOneInput>;
};

export type CustomerSettingsCreateOneInput = {
  create?: Maybe<CustomerSettingsCreateInput>;
  connect?: Maybe<CustomerSettingsWhereUniqueInput>;
};

export type CustomerSettingsEdge = {
   __typename?: 'CustomerSettingsEdge';
  node: CustomerSettings;
  cursor: Scalars['String'];
};

export enum CustomerSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  LogoUrlAsc = 'logoUrl_ASC',
  LogoUrlDesc = 'logoUrl_DESC'
}

export type CustomerSettingsPreviousValues = {
   __typename?: 'CustomerSettingsPreviousValues';
  id: Scalars['ID'];
  logoUrl?: Maybe<Scalars['String']>;
};

export type CustomerSettingsSubscriptionPayload = {
   __typename?: 'CustomerSettingsSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<CustomerSettings>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<CustomerSettingsPreviousValues>;
};

export type CustomerSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<CustomerSettingsWhereInput>;
  AND?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>;
  OR?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>;
  NOT?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>;
};

export type CustomerSettingsUpdateDataInput = {
  logoUrl?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettingsUpdateOneInput>;
  fontSettings?: Maybe<FontSettingsUpdateOneInput>;
};

export type CustomerSettingsUpdateInput = {
  logoUrl?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettingsUpdateOneInput>;
  fontSettings?: Maybe<FontSettingsUpdateOneInput>;
};

export type CustomerSettingsUpdateManyMutationInput = {
  logoUrl?: Maybe<Scalars['String']>;
};

export type CustomerSettingsUpdateOneInput = {
  create?: Maybe<CustomerSettingsCreateInput>;
  update?: Maybe<CustomerSettingsUpdateDataInput>;
  upsert?: Maybe<CustomerSettingsUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<CustomerSettingsWhereUniqueInput>;
};

export type CustomerSettingsUpsertNestedInput = {
  update: CustomerSettingsUpdateDataInput;
  create: CustomerSettingsCreateInput;
};

export type CustomerSettingsWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  logoUrl?: Maybe<Scalars['String']>;
  logoUrl_not?: Maybe<Scalars['String']>;
  logoUrl_in?: Maybe<Array<Scalars['String']>>;
  logoUrl_not_in?: Maybe<Array<Scalars['String']>>;
  logoUrl_lt?: Maybe<Scalars['String']>;
  logoUrl_lte?: Maybe<Scalars['String']>;
  logoUrl_gt?: Maybe<Scalars['String']>;
  logoUrl_gte?: Maybe<Scalars['String']>;
  logoUrl_contains?: Maybe<Scalars['String']>;
  logoUrl_not_contains?: Maybe<Scalars['String']>;
  logoUrl_starts_with?: Maybe<Scalars['String']>;
  logoUrl_not_starts_with?: Maybe<Scalars['String']>;
  logoUrl_ends_with?: Maybe<Scalars['String']>;
  logoUrl_not_ends_with?: Maybe<Scalars['String']>;
  colourSettings?: Maybe<ColourSettingsWhereInput>;
  fontSettings?: Maybe<FontSettingsWhereInput>;
  AND?: Maybe<Array<CustomerSettingsWhereInput>>;
  OR?: Maybe<Array<CustomerSettingsWhereInput>>;
  NOT?: Maybe<Array<CustomerSettingsWhereInput>>;
};

export type CustomerSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type CustomerSubscriptionPayload = {
   __typename?: 'CustomerSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<Customer>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<CustomerPreviousValues>;
};

export type CustomerSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<CustomerWhereInput>;
  AND?: Maybe<Array<CustomerSubscriptionWhereInput>>;
  OR?: Maybe<Array<CustomerSubscriptionWhereInput>>;
  NOT?: Maybe<Array<CustomerSubscriptionWhereInput>>;
};

export type CustomerUpdateInput = {
  name?: Maybe<Scalars['String']>;
  questionnaires?: Maybe<QuestionnaireUpdateManyWithoutCustomerInput>;
  settings?: Maybe<CustomerSettingsUpdateOneInput>;
};

export type CustomerUpdateManyMutationInput = {
  name?: Maybe<Scalars['String']>;
};

export type CustomerUpdateOneRequiredWithoutQuestionnairesInput = {
  create?: Maybe<CustomerCreateWithoutQuestionnairesInput>;
  update?: Maybe<CustomerUpdateWithoutQuestionnairesDataInput>;
  upsert?: Maybe<CustomerUpsertWithoutQuestionnairesInput>;
  connect?: Maybe<CustomerWhereUniqueInput>;
};

export type CustomerUpdateWithoutQuestionnairesDataInput = {
  name?: Maybe<Scalars['String']>;
  settings?: Maybe<CustomerSettingsUpdateOneInput>;
};

export type CustomerUpsertWithoutQuestionnairesInput = {
  update: CustomerUpdateWithoutQuestionnairesDataInput;
  create: CustomerCreateWithoutQuestionnairesInput;
};

export type CustomerWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_lt?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  questionnaires_every?: Maybe<QuestionnaireWhereInput>;
  questionnaires_some?: Maybe<QuestionnaireWhereInput>;
  questionnaires_none?: Maybe<QuestionnaireWhereInput>;
  settings?: Maybe<CustomerSettingsWhereInput>;
  AND?: Maybe<Array<CustomerWhereInput>>;
  OR?: Maybe<Array<CustomerWhereInput>>;
  NOT?: Maybe<Array<CustomerWhereInput>>;
};

export type CustomerWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};


export type Edge = {
   __typename?: 'Edge';
  id: Scalars['ID'];
  questionnaire?: Maybe<Questionnaire>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  conditions?: Maybe<Array<QuestionCondition>>;
  parentNode?: Maybe<QuestionNode>;
  childNode?: Maybe<QuestionNode>;
};


export type EdgeConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>;
  orderBy?: Maybe<QuestionConditionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type EdgeConnection = {
   __typename?: 'EdgeConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<EdgeEdge>>;
  aggregate: AggregateEdge;
};

export type EdgeCreateInput = {
  id?: Maybe<Scalars['ID']>;
  questionnaire?: Maybe<QuestionnaireCreateOneInput>;
  conditions?: Maybe<QuestionConditionCreateManyInput>;
  parentNode?: Maybe<QuestionNodeCreateOneInput>;
  childNode?: Maybe<QuestionNodeCreateOneInput>;
};

export type EdgeCreateManyInput = {
  create?: Maybe<Array<EdgeCreateInput>>;
  connect?: Maybe<Array<EdgeWhereUniqueInput>>;
};

export type EdgeCreateOneInput = {
  create?: Maybe<EdgeCreateInput>;
  connect?: Maybe<EdgeWhereUniqueInput>;
};

export type EdgeEdge = {
   __typename?: 'EdgeEdge';
  node: Edge;
  cursor: Scalars['String'];
};

export enum EdgeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type EdgePreviousValues = {
   __typename?: 'EdgePreviousValues';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type EdgeScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdAt_not?: Maybe<Scalars['DateTime']>;
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_lt?: Maybe<Scalars['DateTime']>;
  createdAt_lte?: Maybe<Scalars['DateTime']>;
  createdAt_gt?: Maybe<Scalars['DateTime']>;
  createdAt_gte?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedAt_not?: Maybe<Scalars['DateTime']>;
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_lte?: Maybe<Scalars['DateTime']>;
  updatedAt_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_gte?: Maybe<Scalars['DateTime']>;
  AND?: Maybe<Array<EdgeScalarWhereInput>>;
  OR?: Maybe<Array<EdgeScalarWhereInput>>;
  NOT?: Maybe<Array<EdgeScalarWhereInput>>;
};

export type EdgeSubscriptionPayload = {
   __typename?: 'EdgeSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<Edge>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<EdgePreviousValues>;
};

export type EdgeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<EdgeWhereInput>;
  AND?: Maybe<Array<EdgeSubscriptionWhereInput>>;
  OR?: Maybe<Array<EdgeSubscriptionWhereInput>>;
  NOT?: Maybe<Array<EdgeSubscriptionWhereInput>>;
};

export type EdgeUpdateDataInput = {
  questionnaire?: Maybe<QuestionnaireUpdateOneInput>;
  conditions?: Maybe<QuestionConditionUpdateManyInput>;
  parentNode?: Maybe<QuestionNodeUpdateOneInput>;
  childNode?: Maybe<QuestionNodeUpdateOneInput>;
};

export type EdgeUpdateInput = {
  questionnaire?: Maybe<QuestionnaireUpdateOneInput>;
  conditions?: Maybe<QuestionConditionUpdateManyInput>;
  parentNode?: Maybe<QuestionNodeUpdateOneInput>;
  childNode?: Maybe<QuestionNodeUpdateOneInput>;
};

export type EdgeUpdateManyInput = {
  create?: Maybe<Array<EdgeCreateInput>>;
  update?: Maybe<Array<EdgeUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<EdgeUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<EdgeWhereUniqueInput>>;
  connect?: Maybe<Array<EdgeWhereUniqueInput>>;
  set?: Maybe<Array<EdgeWhereUniqueInput>>;
  disconnect?: Maybe<Array<EdgeWhereUniqueInput>>;
  deleteMany?: Maybe<Array<EdgeScalarWhereInput>>;
};

export type EdgeUpdateOneInput = {
  create?: Maybe<EdgeCreateInput>;
  update?: Maybe<EdgeUpdateDataInput>;
  upsert?: Maybe<EdgeUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<EdgeWhereUniqueInput>;
};

export type EdgeUpdateWithWhereUniqueNestedInput = {
  where: EdgeWhereUniqueInput;
  data: EdgeUpdateDataInput;
};

export type EdgeUpsertNestedInput = {
  update: EdgeUpdateDataInput;
  create: EdgeCreateInput;
};

export type EdgeUpsertWithWhereUniqueNestedInput = {
  where: EdgeWhereUniqueInput;
  update: EdgeUpdateDataInput;
  create: EdgeCreateInput;
};

export type EdgeWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  questionnaire?: Maybe<QuestionnaireWhereInput>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdAt_not?: Maybe<Scalars['DateTime']>;
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_lt?: Maybe<Scalars['DateTime']>;
  createdAt_lte?: Maybe<Scalars['DateTime']>;
  createdAt_gt?: Maybe<Scalars['DateTime']>;
  createdAt_gte?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedAt_not?: Maybe<Scalars['DateTime']>;
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_lte?: Maybe<Scalars['DateTime']>;
  updatedAt_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_gte?: Maybe<Scalars['DateTime']>;
  conditions_every?: Maybe<QuestionConditionWhereInput>;
  conditions_some?: Maybe<QuestionConditionWhereInput>;
  conditions_none?: Maybe<QuestionConditionWhereInput>;
  parentNode?: Maybe<QuestionNodeWhereInput>;
  childNode?: Maybe<QuestionNodeWhereInput>;
  AND?: Maybe<Array<EdgeWhereInput>>;
  OR?: Maybe<Array<EdgeWhereInput>>;
  NOT?: Maybe<Array<EdgeWhereInput>>;
};

export type EdgeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type FontSettings = {
   __typename?: 'FontSettings';
  id: Scalars['ID'];
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsConnection = {
   __typename?: 'FontSettingsConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<FontSettingsEdge>>;
  aggregate: AggregateFontSettings;
};

export type FontSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>;
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsCreateOneInput = {
  create?: Maybe<FontSettingsCreateInput>;
  connect?: Maybe<FontSettingsWhereUniqueInput>;
};

export type FontSettingsEdge = {
   __typename?: 'FontSettingsEdge';
  node: FontSettings;
  cursor: Scalars['String'];
};

export enum FontSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  SettingTitleAsc = 'settingTitle_ASC',
  SettingTitleDesc = 'settingTitle_DESC',
  BodyAsc = 'body_ASC',
  BodyDesc = 'body_DESC',
  FontTitleAsc = 'fontTitle_ASC',
  FontTitleDesc = 'fontTitle_DESC',
  SpecialAsc = 'special_ASC',
  SpecialDesc = 'special_DESC'
}

export type FontSettingsPreviousValues = {
   __typename?: 'FontSettingsPreviousValues';
  id: Scalars['ID'];
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsSubscriptionPayload = {
   __typename?: 'FontSettingsSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<FontSettings>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<FontSettingsPreviousValues>;
};

export type FontSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<FontSettingsWhereInput>;
  AND?: Maybe<Array<FontSettingsSubscriptionWhereInput>>;
  OR?: Maybe<Array<FontSettingsSubscriptionWhereInput>>;
  NOT?: Maybe<Array<FontSettingsSubscriptionWhereInput>>;
};

export type FontSettingsUpdateDataInput = {
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsUpdateInput = {
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsUpdateManyMutationInput = {
  settingTitle?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
};

export type FontSettingsUpdateOneInput = {
  create?: Maybe<FontSettingsCreateInput>;
  update?: Maybe<FontSettingsUpdateDataInput>;
  upsert?: Maybe<FontSettingsUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<FontSettingsWhereUniqueInput>;
};

export type FontSettingsUpsertNestedInput = {
  update: FontSettingsUpdateDataInput;
  create: FontSettingsCreateInput;
};

export type FontSettingsWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  settingTitle?: Maybe<Scalars['String']>;
  settingTitle_not?: Maybe<Scalars['String']>;
  settingTitle_in?: Maybe<Array<Scalars['String']>>;
  settingTitle_not_in?: Maybe<Array<Scalars['String']>>;
  settingTitle_lt?: Maybe<Scalars['String']>;
  settingTitle_lte?: Maybe<Scalars['String']>;
  settingTitle_gt?: Maybe<Scalars['String']>;
  settingTitle_gte?: Maybe<Scalars['String']>;
  settingTitle_contains?: Maybe<Scalars['String']>;
  settingTitle_not_contains?: Maybe<Scalars['String']>;
  settingTitle_starts_with?: Maybe<Scalars['String']>;
  settingTitle_not_starts_with?: Maybe<Scalars['String']>;
  settingTitle_ends_with?: Maybe<Scalars['String']>;
  settingTitle_not_ends_with?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  body_not?: Maybe<Scalars['String']>;
  body_in?: Maybe<Array<Scalars['String']>>;
  body_not_in?: Maybe<Array<Scalars['String']>>;
  body_lt?: Maybe<Scalars['String']>;
  body_lte?: Maybe<Scalars['String']>;
  body_gt?: Maybe<Scalars['String']>;
  body_gte?: Maybe<Scalars['String']>;
  body_contains?: Maybe<Scalars['String']>;
  body_not_contains?: Maybe<Scalars['String']>;
  body_starts_with?: Maybe<Scalars['String']>;
  body_not_starts_with?: Maybe<Scalars['String']>;
  body_ends_with?: Maybe<Scalars['String']>;
  body_not_ends_with?: Maybe<Scalars['String']>;
  fontTitle?: Maybe<Scalars['String']>;
  fontTitle_not?: Maybe<Scalars['String']>;
  fontTitle_in?: Maybe<Array<Scalars['String']>>;
  fontTitle_not_in?: Maybe<Array<Scalars['String']>>;
  fontTitle_lt?: Maybe<Scalars['String']>;
  fontTitle_lte?: Maybe<Scalars['String']>;
  fontTitle_gt?: Maybe<Scalars['String']>;
  fontTitle_gte?: Maybe<Scalars['String']>;
  fontTitle_contains?: Maybe<Scalars['String']>;
  fontTitle_not_contains?: Maybe<Scalars['String']>;
  fontTitle_starts_with?: Maybe<Scalars['String']>;
  fontTitle_not_starts_with?: Maybe<Scalars['String']>;
  fontTitle_ends_with?: Maybe<Scalars['String']>;
  fontTitle_not_ends_with?: Maybe<Scalars['String']>;
  special?: Maybe<Scalars['String']>;
  special_not?: Maybe<Scalars['String']>;
  special_in?: Maybe<Array<Scalars['String']>>;
  special_not_in?: Maybe<Array<Scalars['String']>>;
  special_lt?: Maybe<Scalars['String']>;
  special_lte?: Maybe<Scalars['String']>;
  special_gt?: Maybe<Scalars['String']>;
  special_gte?: Maybe<Scalars['String']>;
  special_contains?: Maybe<Scalars['String']>;
  special_not_contains?: Maybe<Scalars['String']>;
  special_starts_with?: Maybe<Scalars['String']>;
  special_not_starts_with?: Maybe<Scalars['String']>;
  special_ends_with?: Maybe<Scalars['String']>;
  special_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<FontSettingsWhereInput>>;
  OR?: Maybe<Array<FontSettingsWhereInput>>;
  NOT?: Maybe<Array<FontSettingsWhereInput>>;
};

export type FontSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type LeafNode = {
   __typename?: 'LeafNode';
  id: Scalars['ID'];
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title: Scalars['String'];
};

export type LeafNodeConnection = {
   __typename?: 'LeafNodeConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<LeafNodeEdge>>;
  aggregate: AggregateLeafNode;
};

export type LeafNodeCreateInput = {
  id?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title: Scalars['String'];
};

export type LeafNodeCreateManyInput = {
  create?: Maybe<Array<LeafNodeCreateInput>>;
  connect?: Maybe<Array<LeafNodeWhereUniqueInput>>;
};

export type LeafNodeCreateOneInput = {
  create?: Maybe<LeafNodeCreateInput>;
  connect?: Maybe<LeafNodeWhereUniqueInput>;
};

export type LeafNodeEdge = {
   __typename?: 'LeafNodeEdge';
  node: LeafNode;
  cursor: Scalars['String'];
};

export enum LeafNodeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeIdAsc = 'nodeId_ASC',
  NodeIdDesc = 'nodeId_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

export type LeafNodePreviousValues = {
   __typename?: 'LeafNodePreviousValues';
  id: Scalars['ID'];
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title: Scalars['String'];
};

export type LeafNodeScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['Int']>;
  nodeId_not?: Maybe<Scalars['Int']>;
  nodeId_in?: Maybe<Array<Scalars['Int']>>;
  nodeId_not_in?: Maybe<Array<Scalars['Int']>>;
  nodeId_lt?: Maybe<Scalars['Int']>;
  nodeId_lte?: Maybe<Scalars['Int']>;
  nodeId_gt?: Maybe<Scalars['Int']>;
  nodeId_gte?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  type_not?: Maybe<NodeType>;
  type_in?: Maybe<Array<NodeType>>;
  type_not_in?: Maybe<Array<NodeType>>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<LeafNodeScalarWhereInput>>;
  OR?: Maybe<Array<LeafNodeScalarWhereInput>>;
  NOT?: Maybe<Array<LeafNodeScalarWhereInput>>;
};

export type LeafNodeSubscriptionPayload = {
   __typename?: 'LeafNodeSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<LeafNode>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<LeafNodePreviousValues>;
};

export type LeafNodeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<LeafNodeWhereInput>;
  AND?: Maybe<Array<LeafNodeSubscriptionWhereInput>>;
  OR?: Maybe<Array<LeafNodeSubscriptionWhereInput>>;
  NOT?: Maybe<Array<LeafNodeSubscriptionWhereInput>>;
};

export type LeafNodeUpdateDataInput = {
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title?: Maybe<Scalars['String']>;
};

export type LeafNodeUpdateInput = {
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title?: Maybe<Scalars['String']>;
};

export type LeafNodeUpdateManyDataInput = {
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title?: Maybe<Scalars['String']>;
};

export type LeafNodeUpdateManyInput = {
  create?: Maybe<Array<LeafNodeCreateInput>>;
  update?: Maybe<Array<LeafNodeUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<LeafNodeUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<LeafNodeWhereUniqueInput>>;
  connect?: Maybe<Array<LeafNodeWhereUniqueInput>>;
  set?: Maybe<Array<LeafNodeWhereUniqueInput>>;
  disconnect?: Maybe<Array<LeafNodeWhereUniqueInput>>;
  deleteMany?: Maybe<Array<LeafNodeScalarWhereInput>>;
  updateMany?: Maybe<Array<LeafNodeUpdateManyWithWhereNestedInput>>;
};

export type LeafNodeUpdateManyMutationInput = {
  nodeId?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  title?: Maybe<Scalars['String']>;
};

export type LeafNodeUpdateManyWithWhereNestedInput = {
  where: LeafNodeScalarWhereInput;
  data: LeafNodeUpdateManyDataInput;
};

export type LeafNodeUpdateOneInput = {
  create?: Maybe<LeafNodeCreateInput>;
  update?: Maybe<LeafNodeUpdateDataInput>;
  upsert?: Maybe<LeafNodeUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<LeafNodeWhereUniqueInput>;
};

export type LeafNodeUpdateWithWhereUniqueNestedInput = {
  where: LeafNodeWhereUniqueInput;
  data: LeafNodeUpdateDataInput;
};

export type LeafNodeUpsertNestedInput = {
  update: LeafNodeUpdateDataInput;
  create: LeafNodeCreateInput;
};

export type LeafNodeUpsertWithWhereUniqueNestedInput = {
  where: LeafNodeWhereUniqueInput;
  update: LeafNodeUpdateDataInput;
  create: LeafNodeCreateInput;
};

export type LeafNodeWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['Int']>;
  nodeId_not?: Maybe<Scalars['Int']>;
  nodeId_in?: Maybe<Array<Scalars['Int']>>;
  nodeId_not_in?: Maybe<Array<Scalars['Int']>>;
  nodeId_lt?: Maybe<Scalars['Int']>;
  nodeId_lte?: Maybe<Scalars['Int']>;
  nodeId_gt?: Maybe<Scalars['Int']>;
  nodeId_gte?: Maybe<Scalars['Int']>;
  type?: Maybe<NodeType>;
  type_not?: Maybe<NodeType>;
  type_in?: Maybe<Array<NodeType>>;
  type_not_in?: Maybe<Array<NodeType>>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<LeafNodeWhereInput>>;
  OR?: Maybe<Array<LeafNodeWhereInput>>;
  NOT?: Maybe<Array<LeafNodeWhereInput>>;
};

export type LeafNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  nodeId?: Maybe<Scalars['Int']>;
};


export type Mutation = {
   __typename?: 'Mutation';
  createColourSettings: ColourSettings;
  updateColourSettings?: Maybe<ColourSettings>;
  updateManyColourSettingses: BatchPayload;
  upsertColourSettings: ColourSettings;
  deleteColourSettings?: Maybe<ColourSettings>;
  deleteManyColourSettingses: BatchPayload;
  createCustomer: Customer;
  updateCustomer?: Maybe<Customer>;
  updateManyCustomers: BatchPayload;
  upsertCustomer: Customer;
  deleteCustomer?: Maybe<Customer>;
  deleteManyCustomers: BatchPayload;
  createCustomerSettings: CustomerSettings;
  updateCustomerSettings?: Maybe<CustomerSettings>;
  updateManyCustomerSettingses: BatchPayload;
  upsertCustomerSettings: CustomerSettings;
  deleteCustomerSettings?: Maybe<CustomerSettings>;
  deleteManyCustomerSettingses: BatchPayload;
  createEdge: Edge;
  updateEdge?: Maybe<Edge>;
  upsertEdge: Edge;
  deleteEdge?: Maybe<Edge>;
  deleteManyEdges: BatchPayload;
  createFontSettings: FontSettings;
  updateFontSettings?: Maybe<FontSettings>;
  updateManyFontSettingses: BatchPayload;
  upsertFontSettings: FontSettings;
  deleteFontSettings?: Maybe<FontSettings>;
  deleteManyFontSettingses: BatchPayload;
  createLeafNode: LeafNode;
  updateLeafNode?: Maybe<LeafNode>;
  updateManyLeafNodes: BatchPayload;
  upsertLeafNode: LeafNode;
  deleteLeafNode?: Maybe<LeafNode>;
  deleteManyLeafNodes: BatchPayload;
  createNodeEntry: NodeEntry;
  updateNodeEntry?: Maybe<NodeEntry>;
  updateManyNodeEntries: BatchPayload;
  upsertNodeEntry: NodeEntry;
  deleteNodeEntry?: Maybe<NodeEntry>;
  deleteManyNodeEntries: BatchPayload;
  createNodeEntryValue: NodeEntryValue;
  updateNodeEntryValue?: Maybe<NodeEntryValue>;
  updateManyNodeEntryValues: BatchPayload;
  upsertNodeEntryValue: NodeEntryValue;
  deleteNodeEntryValue?: Maybe<NodeEntryValue>;
  deleteManyNodeEntryValues: BatchPayload;
  createQuestionCondition: QuestionCondition;
  updateQuestionCondition?: Maybe<QuestionCondition>;
  updateManyQuestionConditions: BatchPayload;
  upsertQuestionCondition: QuestionCondition;
  deleteQuestionCondition?: Maybe<QuestionCondition>;
  deleteManyQuestionConditions: BatchPayload;
  createQuestionNode: QuestionNode;
  updateQuestionNode?: Maybe<QuestionNode>;
  updateManyQuestionNodes: BatchPayload;
  upsertQuestionNode: QuestionNode;
  deleteQuestionNode?: Maybe<QuestionNode>;
  deleteManyQuestionNodes: BatchPayload;
  createQuestionOption: QuestionOption;
  updateQuestionOption?: Maybe<QuestionOption>;
  updateManyQuestionOptions: BatchPayload;
  upsertQuestionOption: QuestionOption;
  deleteQuestionOption?: Maybe<QuestionOption>;
  deleteManyQuestionOptions: BatchPayload;
  createQuestionnaire: Questionnaire;
  updateQuestionnaire?: Maybe<Questionnaire>;
  updateManyQuestionnaires: BatchPayload;
  upsertQuestionnaire: Questionnaire;
  deleteQuestionnaire?: Maybe<Questionnaire>;
  deleteManyQuestionnaires: BatchPayload;
  createSession: Session;
  updateSession?: Maybe<Session>;
  upsertSession: Session;
  deleteSession?: Maybe<Session>;
  deleteManySessions: BatchPayload;
};


export type MutationCreateColourSettingsArgs = {
  data: ColourSettingsCreateInput;
};


export type MutationUpdateColourSettingsArgs = {
  data: ColourSettingsUpdateInput;
  where: ColourSettingsWhereUniqueInput;
};


export type MutationUpdateManyColourSettingsesArgs = {
  data: ColourSettingsUpdateManyMutationInput;
  where?: Maybe<ColourSettingsWhereInput>;
};


export type MutationUpsertColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput;
  create: ColourSettingsCreateInput;
  update: ColourSettingsUpdateInput;
};


export type MutationDeleteColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput;
};


export type MutationDeleteManyColourSettingsesArgs = {
  where?: Maybe<ColourSettingsWhereInput>;
};


export type MutationCreateCustomerArgs = {
  data: CustomerCreateInput;
};


export type MutationUpdateCustomerArgs = {
  data: CustomerUpdateInput;
  where: CustomerWhereUniqueInput;
};


export type MutationUpdateManyCustomersArgs = {
  data: CustomerUpdateManyMutationInput;
  where?: Maybe<CustomerWhereInput>;
};


export type MutationUpsertCustomerArgs = {
  where: CustomerWhereUniqueInput;
  create: CustomerCreateInput;
  update: CustomerUpdateInput;
};


export type MutationDeleteCustomerArgs = {
  where: CustomerWhereUniqueInput;
};


export type MutationDeleteManyCustomersArgs = {
  where?: Maybe<CustomerWhereInput>;
};


export type MutationCreateCustomerSettingsArgs = {
  data: CustomerSettingsCreateInput;
};


export type MutationUpdateCustomerSettingsArgs = {
  data: CustomerSettingsUpdateInput;
  where: CustomerSettingsWhereUniqueInput;
};


export type MutationUpdateManyCustomerSettingsesArgs = {
  data: CustomerSettingsUpdateManyMutationInput;
  where?: Maybe<CustomerSettingsWhereInput>;
};


export type MutationUpsertCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput;
  create: CustomerSettingsCreateInput;
  update: CustomerSettingsUpdateInput;
};


export type MutationDeleteCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput;
};


export type MutationDeleteManyCustomerSettingsesArgs = {
  where?: Maybe<CustomerSettingsWhereInput>;
};


export type MutationCreateEdgeArgs = {
  data: EdgeCreateInput;
};


export type MutationUpdateEdgeArgs = {
  data: EdgeUpdateInput;
  where: EdgeWhereUniqueInput;
};


export type MutationUpsertEdgeArgs = {
  where: EdgeWhereUniqueInput;
  create: EdgeCreateInput;
  update: EdgeUpdateInput;
};


export type MutationDeleteEdgeArgs = {
  where: EdgeWhereUniqueInput;
};


export type MutationDeleteManyEdgesArgs = {
  where?: Maybe<EdgeWhereInput>;
};


export type MutationCreateFontSettingsArgs = {
  data: FontSettingsCreateInput;
};


export type MutationUpdateFontSettingsArgs = {
  data: FontSettingsUpdateInput;
  where: FontSettingsWhereUniqueInput;
};


export type MutationUpdateManyFontSettingsesArgs = {
  data: FontSettingsUpdateManyMutationInput;
  where?: Maybe<FontSettingsWhereInput>;
};


export type MutationUpsertFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput;
  create: FontSettingsCreateInput;
  update: FontSettingsUpdateInput;
};


export type MutationDeleteFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput;
};


export type MutationDeleteManyFontSettingsesArgs = {
  where?: Maybe<FontSettingsWhereInput>;
};


export type MutationCreateLeafNodeArgs = {
  data: LeafNodeCreateInput;
};


export type MutationUpdateLeafNodeArgs = {
  data: LeafNodeUpdateInput;
  where: LeafNodeWhereUniqueInput;
};


export type MutationUpdateManyLeafNodesArgs = {
  data: LeafNodeUpdateManyMutationInput;
  where?: Maybe<LeafNodeWhereInput>;
};


export type MutationUpsertLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput;
  create: LeafNodeCreateInput;
  update: LeafNodeUpdateInput;
};


export type MutationDeleteLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput;
};


export type MutationDeleteManyLeafNodesArgs = {
  where?: Maybe<LeafNodeWhereInput>;
};


export type MutationCreateNodeEntryArgs = {
  data: NodeEntryCreateInput;
};


export type MutationUpdateNodeEntryArgs = {
  data: NodeEntryUpdateInput;
  where: NodeEntryWhereUniqueInput;
};


export type MutationUpdateManyNodeEntriesArgs = {
  data: NodeEntryUpdateManyMutationInput;
  where?: Maybe<NodeEntryWhereInput>;
};


export type MutationUpsertNodeEntryArgs = {
  where: NodeEntryWhereUniqueInput;
  create: NodeEntryCreateInput;
  update: NodeEntryUpdateInput;
};


export type MutationDeleteNodeEntryArgs = {
  where: NodeEntryWhereUniqueInput;
};


export type MutationDeleteManyNodeEntriesArgs = {
  where?: Maybe<NodeEntryWhereInput>;
};


export type MutationCreateNodeEntryValueArgs = {
  data: NodeEntryValueCreateInput;
};


export type MutationUpdateNodeEntryValueArgs = {
  data: NodeEntryValueUpdateInput;
  where: NodeEntryValueWhereUniqueInput;
};


export type MutationUpdateManyNodeEntryValuesArgs = {
  data: NodeEntryValueUpdateManyMutationInput;
  where?: Maybe<NodeEntryValueWhereInput>;
};


export type MutationUpsertNodeEntryValueArgs = {
  where: NodeEntryValueWhereUniqueInput;
  create: NodeEntryValueCreateInput;
  update: NodeEntryValueUpdateInput;
};


export type MutationDeleteNodeEntryValueArgs = {
  where: NodeEntryValueWhereUniqueInput;
};


export type MutationDeleteManyNodeEntryValuesArgs = {
  where?: Maybe<NodeEntryValueWhereInput>;
};


export type MutationCreateQuestionConditionArgs = {
  data: QuestionConditionCreateInput;
};


export type MutationUpdateQuestionConditionArgs = {
  data: QuestionConditionUpdateInput;
  where: QuestionConditionWhereUniqueInput;
};


export type MutationUpdateManyQuestionConditionsArgs = {
  data: QuestionConditionUpdateManyMutationInput;
  where?: Maybe<QuestionConditionWhereInput>;
};


export type MutationUpsertQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput;
  create: QuestionConditionCreateInput;
  update: QuestionConditionUpdateInput;
};


export type MutationDeleteQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput;
};


export type MutationDeleteManyQuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>;
};


export type MutationCreateQuestionNodeArgs = {
  data: QuestionNodeCreateInput;
};


export type MutationUpdateQuestionNodeArgs = {
  data: QuestionNodeUpdateInput;
  where: QuestionNodeWhereUniqueInput;
};


export type MutationUpdateManyQuestionNodesArgs = {
  data: QuestionNodeUpdateManyMutationInput;
  where?: Maybe<QuestionNodeWhereInput>;
};


export type MutationUpsertQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput;
  create: QuestionNodeCreateInput;
  update: QuestionNodeUpdateInput;
};


export type MutationDeleteQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput;
};


export type MutationDeleteManyQuestionNodesArgs = {
  where?: Maybe<QuestionNodeWhereInput>;
};


export type MutationCreateQuestionOptionArgs = {
  data: QuestionOptionCreateInput;
};


export type MutationUpdateQuestionOptionArgs = {
  data: QuestionOptionUpdateInput;
  where: QuestionOptionWhereUniqueInput;
};


export type MutationUpdateManyQuestionOptionsArgs = {
  data: QuestionOptionUpdateManyMutationInput;
  where?: Maybe<QuestionOptionWhereInput>;
};


export type MutationUpsertQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput;
  create: QuestionOptionCreateInput;
  update: QuestionOptionUpdateInput;
};


export type MutationDeleteQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput;
};


export type MutationDeleteManyQuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>;
};


export type MutationCreateQuestionnaireArgs = {
  data: QuestionnaireCreateInput;
};


export type MutationUpdateQuestionnaireArgs = {
  data: QuestionnaireUpdateInput;
  where: QuestionnaireWhereUniqueInput;
};


export type MutationUpdateManyQuestionnairesArgs = {
  data: QuestionnaireUpdateManyMutationInput;
  where?: Maybe<QuestionnaireWhereInput>;
};


export type MutationUpsertQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput;
  create: QuestionnaireCreateInput;
  update: QuestionnaireUpdateInput;
};


export type MutationDeleteQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput;
};


export type MutationDeleteManyQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>;
};


export type MutationCreateSessionArgs = {
  data: SessionCreateInput;
};


export type MutationUpdateSessionArgs = {
  data: SessionUpdateInput;
  where: SessionWhereUniqueInput;
};


export type MutationUpsertSessionArgs = {
  where: SessionWhereUniqueInput;
  create: SessionCreateInput;
  update: SessionUpdateInput;
};


export type MutationDeleteSessionArgs = {
  where: SessionWhereUniqueInput;
};


export type MutationDeleteManySessionsArgs = {
  where?: Maybe<SessionWhereInput>;
};

export enum MutationType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED'
}

export type Node = {
  id: Scalars['ID'];
};

export type NodeEntry = {
   __typename?: 'NodeEntry';
  id: Scalars['ID'];
  session: Session;
  relatedNode: QuestionNode;
  edgeChild?: Maybe<Edge>;
  values?: Maybe<Array<NodeEntryValue>>;
  depth?: Maybe<Scalars['Int']>;
  creationDate: Scalars['DateTime'];
};


export type NodeEntryValuesArgs = {
  where?: Maybe<NodeEntryValueWhereInput>;
  orderBy?: Maybe<NodeEntryValueOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type NodeEntryConnection = {
   __typename?: 'NodeEntryConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<NodeEntryEdge>>;
  aggregate: AggregateNodeEntry;
};

export type NodeEntryCreateInput = {
  id?: Maybe<Scalars['ID']>;
  session: SessionCreateOneWithoutNodeEntriesInput;
  relatedNode: QuestionNodeCreateOneInput;
  edgeChild?: Maybe<EdgeCreateOneInput>;
  values?: Maybe<NodeEntryValueCreateManyInput>;
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryCreateManyWithoutSessionInput = {
  create?: Maybe<Array<NodeEntryCreateWithoutSessionInput>>;
  connect?: Maybe<Array<NodeEntryWhereUniqueInput>>;
};

export type NodeEntryCreateWithoutSessionInput = {
  id?: Maybe<Scalars['ID']>;
  relatedNode: QuestionNodeCreateOneInput;
  edgeChild?: Maybe<EdgeCreateOneInput>;
  values?: Maybe<NodeEntryValueCreateManyInput>;
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryEdge = {
   __typename?: 'NodeEntryEdge';
  node: NodeEntry;
  cursor: Scalars['String'];
};

export enum NodeEntryOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  DepthAsc = 'depth_ASC',
  DepthDesc = 'depth_DESC',
  CreationDateAsc = 'creationDate_ASC',
  CreationDateDesc = 'creationDate_DESC'
}

export type NodeEntryPreviousValues = {
   __typename?: 'NodeEntryPreviousValues';
  id: Scalars['ID'];
  depth?: Maybe<Scalars['Int']>;
  creationDate: Scalars['DateTime'];
};

export type NodeEntryScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  depth?: Maybe<Scalars['Int']>;
  depth_not?: Maybe<Scalars['Int']>;
  depth_in?: Maybe<Array<Scalars['Int']>>;
  depth_not_in?: Maybe<Array<Scalars['Int']>>;
  depth_lt?: Maybe<Scalars['Int']>;
  depth_lte?: Maybe<Scalars['Int']>;
  depth_gt?: Maybe<Scalars['Int']>;
  depth_gte?: Maybe<Scalars['Int']>;
  creationDate?: Maybe<Scalars['DateTime']>;
  creationDate_not?: Maybe<Scalars['DateTime']>;
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_lt?: Maybe<Scalars['DateTime']>;
  creationDate_lte?: Maybe<Scalars['DateTime']>;
  creationDate_gt?: Maybe<Scalars['DateTime']>;
  creationDate_gte?: Maybe<Scalars['DateTime']>;
  AND?: Maybe<Array<NodeEntryScalarWhereInput>>;
  OR?: Maybe<Array<NodeEntryScalarWhereInput>>;
  NOT?: Maybe<Array<NodeEntryScalarWhereInput>>;
};

export type NodeEntrySubscriptionPayload = {
   __typename?: 'NodeEntrySubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<NodeEntry>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<NodeEntryPreviousValues>;
};

export type NodeEntrySubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<NodeEntryWhereInput>;
  AND?: Maybe<Array<NodeEntrySubscriptionWhereInput>>;
  OR?: Maybe<Array<NodeEntrySubscriptionWhereInput>>;
  NOT?: Maybe<Array<NodeEntrySubscriptionWhereInput>>;
};

export type NodeEntryUpdateInput = {
  session?: Maybe<SessionUpdateOneRequiredWithoutNodeEntriesInput>;
  relatedNode?: Maybe<QuestionNodeUpdateOneRequiredInput>;
  edgeChild?: Maybe<EdgeUpdateOneInput>;
  values?: Maybe<NodeEntryValueUpdateManyInput>;
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryUpdateManyDataInput = {
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryUpdateManyMutationInput = {
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryUpdateManyWithoutSessionInput = {
  create?: Maybe<Array<NodeEntryCreateWithoutSessionInput>>;
  delete?: Maybe<Array<NodeEntryWhereUniqueInput>>;
  connect?: Maybe<Array<NodeEntryWhereUniqueInput>>;
  set?: Maybe<Array<NodeEntryWhereUniqueInput>>;
  disconnect?: Maybe<Array<NodeEntryWhereUniqueInput>>;
  update?: Maybe<Array<NodeEntryUpdateWithWhereUniqueWithoutSessionInput>>;
  upsert?: Maybe<Array<NodeEntryUpsertWithWhereUniqueWithoutSessionInput>>;
  deleteMany?: Maybe<Array<NodeEntryScalarWhereInput>>;
  updateMany?: Maybe<Array<NodeEntryUpdateManyWithWhereNestedInput>>;
};

export type NodeEntryUpdateManyWithWhereNestedInput = {
  where: NodeEntryScalarWhereInput;
  data: NodeEntryUpdateManyDataInput;
};

export type NodeEntryUpdateWithoutSessionDataInput = {
  relatedNode?: Maybe<QuestionNodeUpdateOneRequiredInput>;
  edgeChild?: Maybe<EdgeUpdateOneInput>;
  values?: Maybe<NodeEntryValueUpdateManyInput>;
  depth?: Maybe<Scalars['Int']>;
};

export type NodeEntryUpdateWithWhereUniqueWithoutSessionInput = {
  where: NodeEntryWhereUniqueInput;
  data: NodeEntryUpdateWithoutSessionDataInput;
};

export type NodeEntryUpsertWithWhereUniqueWithoutSessionInput = {
  where: NodeEntryWhereUniqueInput;
  update: NodeEntryUpdateWithoutSessionDataInput;
  create: NodeEntryCreateWithoutSessionInput;
};

export type NodeEntryValue = {
   __typename?: 'NodeEntryValue';
  id: Scalars['ID'];
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  multiValues?: Maybe<Array<NodeEntryValue>>;
};


export type NodeEntryValueMultiValuesArgs = {
  where?: Maybe<NodeEntryValueWhereInput>;
  orderBy?: Maybe<NodeEntryValueOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type NodeEntryValueConnection = {
   __typename?: 'NodeEntryValueConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<NodeEntryValueEdge>>;
  aggregate: AggregateNodeEntryValue;
};

export type NodeEntryValueCreateInput = {
  id?: Maybe<Scalars['ID']>;
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  multiValues?: Maybe<NodeEntryValueCreateManyInput>;
};

export type NodeEntryValueCreateManyInput = {
  create?: Maybe<Array<NodeEntryValueCreateInput>>;
  connect?: Maybe<Array<NodeEntryValueWhereUniqueInput>>;
};

export type NodeEntryValueEdge = {
   __typename?: 'NodeEntryValueEdge';
  node: NodeEntryValue;
  cursor: Scalars['String'];
};

export enum NodeEntryValueOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TextValueAsc = 'textValue_ASC',
  TextValueDesc = 'textValue_DESC',
  NumberValueAsc = 'numberValue_ASC',
  NumberValueDesc = 'numberValue_DESC'
}

export type NodeEntryValuePreviousValues = {
   __typename?: 'NodeEntryValuePreviousValues';
  id: Scalars['ID'];
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
};

export type NodeEntryValueScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  textValue?: Maybe<Scalars['String']>;
  textValue_not?: Maybe<Scalars['String']>;
  textValue_in?: Maybe<Array<Scalars['String']>>;
  textValue_not_in?: Maybe<Array<Scalars['String']>>;
  textValue_lt?: Maybe<Scalars['String']>;
  textValue_lte?: Maybe<Scalars['String']>;
  textValue_gt?: Maybe<Scalars['String']>;
  textValue_gte?: Maybe<Scalars['String']>;
  textValue_contains?: Maybe<Scalars['String']>;
  textValue_not_contains?: Maybe<Scalars['String']>;
  textValue_starts_with?: Maybe<Scalars['String']>;
  textValue_not_starts_with?: Maybe<Scalars['String']>;
  textValue_ends_with?: Maybe<Scalars['String']>;
  textValue_not_ends_with?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  numberValue_not?: Maybe<Scalars['Int']>;
  numberValue_in?: Maybe<Array<Scalars['Int']>>;
  numberValue_not_in?: Maybe<Array<Scalars['Int']>>;
  numberValue_lt?: Maybe<Scalars['Int']>;
  numberValue_lte?: Maybe<Scalars['Int']>;
  numberValue_gt?: Maybe<Scalars['Int']>;
  numberValue_gte?: Maybe<Scalars['Int']>;
  AND?: Maybe<Array<NodeEntryValueScalarWhereInput>>;
  OR?: Maybe<Array<NodeEntryValueScalarWhereInput>>;
  NOT?: Maybe<Array<NodeEntryValueScalarWhereInput>>;
};

export type NodeEntryValueSubscriptionPayload = {
   __typename?: 'NodeEntryValueSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<NodeEntryValue>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<NodeEntryValuePreviousValues>;
};

export type NodeEntryValueSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<NodeEntryValueWhereInput>;
  AND?: Maybe<Array<NodeEntryValueSubscriptionWhereInput>>;
  OR?: Maybe<Array<NodeEntryValueSubscriptionWhereInput>>;
  NOT?: Maybe<Array<NodeEntryValueSubscriptionWhereInput>>;
};

export type NodeEntryValueUpdateDataInput = {
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  multiValues?: Maybe<NodeEntryValueUpdateManyInput>;
};

export type NodeEntryValueUpdateInput = {
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  multiValues?: Maybe<NodeEntryValueUpdateManyInput>;
};

export type NodeEntryValueUpdateManyDataInput = {
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
};

export type NodeEntryValueUpdateManyInput = {
  create?: Maybe<Array<NodeEntryValueCreateInput>>;
  update?: Maybe<Array<NodeEntryValueUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<NodeEntryValueUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<NodeEntryValueWhereUniqueInput>>;
  connect?: Maybe<Array<NodeEntryValueWhereUniqueInput>>;
  set?: Maybe<Array<NodeEntryValueWhereUniqueInput>>;
  disconnect?: Maybe<Array<NodeEntryValueWhereUniqueInput>>;
  deleteMany?: Maybe<Array<NodeEntryValueScalarWhereInput>>;
  updateMany?: Maybe<Array<NodeEntryValueUpdateManyWithWhereNestedInput>>;
};

export type NodeEntryValueUpdateManyMutationInput = {
  textValue?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
};

export type NodeEntryValueUpdateManyWithWhereNestedInput = {
  where: NodeEntryValueScalarWhereInput;
  data: NodeEntryValueUpdateManyDataInput;
};

export type NodeEntryValueUpdateWithWhereUniqueNestedInput = {
  where: NodeEntryValueWhereUniqueInput;
  data: NodeEntryValueUpdateDataInput;
};

export type NodeEntryValueUpsertWithWhereUniqueNestedInput = {
  where: NodeEntryValueWhereUniqueInput;
  update: NodeEntryValueUpdateDataInput;
  create: NodeEntryValueCreateInput;
};

export type NodeEntryValueWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  textValue?: Maybe<Scalars['String']>;
  textValue_not?: Maybe<Scalars['String']>;
  textValue_in?: Maybe<Array<Scalars['String']>>;
  textValue_not_in?: Maybe<Array<Scalars['String']>>;
  textValue_lt?: Maybe<Scalars['String']>;
  textValue_lte?: Maybe<Scalars['String']>;
  textValue_gt?: Maybe<Scalars['String']>;
  textValue_gte?: Maybe<Scalars['String']>;
  textValue_contains?: Maybe<Scalars['String']>;
  textValue_not_contains?: Maybe<Scalars['String']>;
  textValue_starts_with?: Maybe<Scalars['String']>;
  textValue_not_starts_with?: Maybe<Scalars['String']>;
  textValue_ends_with?: Maybe<Scalars['String']>;
  textValue_not_ends_with?: Maybe<Scalars['String']>;
  numberValue?: Maybe<Scalars['Int']>;
  numberValue_not?: Maybe<Scalars['Int']>;
  numberValue_in?: Maybe<Array<Scalars['Int']>>;
  numberValue_not_in?: Maybe<Array<Scalars['Int']>>;
  numberValue_lt?: Maybe<Scalars['Int']>;
  numberValue_lte?: Maybe<Scalars['Int']>;
  numberValue_gt?: Maybe<Scalars['Int']>;
  numberValue_gte?: Maybe<Scalars['Int']>;
  multiValues_every?: Maybe<NodeEntryValueWhereInput>;
  multiValues_some?: Maybe<NodeEntryValueWhereInput>;
  multiValues_none?: Maybe<NodeEntryValueWhereInput>;
  AND?: Maybe<Array<NodeEntryValueWhereInput>>;
  OR?: Maybe<Array<NodeEntryValueWhereInput>>;
  NOT?: Maybe<Array<NodeEntryValueWhereInput>>;
};

export type NodeEntryValueWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type NodeEntryWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  session?: Maybe<SessionWhereInput>;
  relatedNode?: Maybe<QuestionNodeWhereInput>;
  edgeChild?: Maybe<EdgeWhereInput>;
  values_every?: Maybe<NodeEntryValueWhereInput>;
  values_some?: Maybe<NodeEntryValueWhereInput>;
  values_none?: Maybe<NodeEntryValueWhereInput>;
  depth?: Maybe<Scalars['Int']>;
  depth_not?: Maybe<Scalars['Int']>;
  depth_in?: Maybe<Array<Scalars['Int']>>;
  depth_not_in?: Maybe<Array<Scalars['Int']>>;
  depth_lt?: Maybe<Scalars['Int']>;
  depth_lte?: Maybe<Scalars['Int']>;
  depth_gt?: Maybe<Scalars['Int']>;
  depth_gte?: Maybe<Scalars['Int']>;
  creationDate?: Maybe<Scalars['DateTime']>;
  creationDate_not?: Maybe<Scalars['DateTime']>;
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_lt?: Maybe<Scalars['DateTime']>;
  creationDate_lte?: Maybe<Scalars['DateTime']>;
  creationDate_gt?: Maybe<Scalars['DateTime']>;
  creationDate_gte?: Maybe<Scalars['DateTime']>;
  AND?: Maybe<Array<NodeEntryWhereInput>>;
  OR?: Maybe<Array<NodeEntryWhereInput>>;
  NOT?: Maybe<Array<NodeEntryWhereInput>>;
};

export type NodeEntryWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export enum NodeType {
  Slider = 'SLIDER',
  MultiChoice = 'MULTI_CHOICE',
  Textbox = 'TEXTBOX',
  SocialShare = 'SOCIAL_SHARE',
  Registration = 'REGISTRATION'
}

export type PageInfo = {
   __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

export type Query = {
   __typename?: 'Query';
  colourSettings?: Maybe<ColourSettings>;
  colourSettingses: Array<Maybe<ColourSettings>>;
  colourSettingsesConnection: ColourSettingsConnection;
  customer?: Maybe<Customer>;
  customers: Array<Maybe<Customer>>;
  customersConnection: CustomerConnection;
  customerSettings?: Maybe<CustomerSettings>;
  customerSettingses: Array<Maybe<CustomerSettings>>;
  customerSettingsesConnection: CustomerSettingsConnection;
  edge?: Maybe<Edge>;
  edges: Array<Maybe<Edge>>;
  edgesConnection: EdgeConnection;
  fontSettings?: Maybe<FontSettings>;
  fontSettingses: Array<Maybe<FontSettings>>;
  fontSettingsesConnection: FontSettingsConnection;
  leafNode?: Maybe<LeafNode>;
  leafNodes: Array<Maybe<LeafNode>>;
  leafNodesConnection: LeafNodeConnection;
  nodeEntry?: Maybe<NodeEntry>;
  nodeEntries: Array<Maybe<NodeEntry>>;
  nodeEntriesConnection: NodeEntryConnection;
  nodeEntryValue?: Maybe<NodeEntryValue>;
  nodeEntryValues: Array<Maybe<NodeEntryValue>>;
  nodeEntryValuesConnection: NodeEntryValueConnection;
  questionCondition?: Maybe<QuestionCondition>;
  questionConditions: Array<Maybe<QuestionCondition>>;
  questionConditionsConnection: QuestionConditionConnection;
  questionNode?: Maybe<QuestionNode>;
  questionNodes: Array<Maybe<QuestionNode>>;
  questionNodesConnection: QuestionNodeConnection;
  questionOption?: Maybe<QuestionOption>;
  questionOptions: Array<Maybe<QuestionOption>>;
  questionOptionsConnection: QuestionOptionConnection;
  questionnaire?: Maybe<Questionnaire>;
  questionnaires: Array<Maybe<Questionnaire>>;
  questionnairesConnection: QuestionnaireConnection;
  session?: Maybe<Session>;
  sessions: Array<Maybe<Session>>;
  sessionsConnection: SessionConnection;
  node?: Maybe<Node>;
};


export type QueryColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput;
};


export type QueryColourSettingsesArgs = {
  where?: Maybe<ColourSettingsWhereInput>;
  orderBy?: Maybe<ColourSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryColourSettingsesConnectionArgs = {
  where?: Maybe<ColourSettingsWhereInput>;
  orderBy?: Maybe<ColourSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCustomerArgs = {
  where: CustomerWhereUniqueInput;
};


export type QueryCustomersArgs = {
  where?: Maybe<CustomerWhereInput>;
  orderBy?: Maybe<CustomerOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCustomersConnectionArgs = {
  where?: Maybe<CustomerWhereInput>;
  orderBy?: Maybe<CustomerOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput;
};


export type QueryCustomerSettingsesArgs = {
  where?: Maybe<CustomerSettingsWhereInput>;
  orderBy?: Maybe<CustomerSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryCustomerSettingsesConnectionArgs = {
  where?: Maybe<CustomerSettingsWhereInput>;
  orderBy?: Maybe<CustomerSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryEdgeArgs = {
  where: EdgeWhereUniqueInput;
};


export type QueryEdgesArgs = {
  where?: Maybe<EdgeWhereInput>;
  orderBy?: Maybe<EdgeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryEdgesConnectionArgs = {
  where?: Maybe<EdgeWhereInput>;
  orderBy?: Maybe<EdgeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput;
};


export type QueryFontSettingsesArgs = {
  where?: Maybe<FontSettingsWhereInput>;
  orderBy?: Maybe<FontSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryFontSettingsesConnectionArgs = {
  where?: Maybe<FontSettingsWhereInput>;
  orderBy?: Maybe<FontSettingsOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput;
};


export type QueryLeafNodesArgs = {
  where?: Maybe<LeafNodeWhereInput>;
  orderBy?: Maybe<LeafNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryLeafNodesConnectionArgs = {
  where?: Maybe<LeafNodeWhereInput>;
  orderBy?: Maybe<LeafNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryNodeEntryArgs = {
  where: NodeEntryWhereUniqueInput;
};


export type QueryNodeEntriesArgs = {
  where?: Maybe<NodeEntryWhereInput>;
  orderBy?: Maybe<NodeEntryOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryNodeEntriesConnectionArgs = {
  where?: Maybe<NodeEntryWhereInput>;
  orderBy?: Maybe<NodeEntryOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryNodeEntryValueArgs = {
  where: NodeEntryValueWhereUniqueInput;
};


export type QueryNodeEntryValuesArgs = {
  where?: Maybe<NodeEntryValueWhereInput>;
  orderBy?: Maybe<NodeEntryValueOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryNodeEntryValuesConnectionArgs = {
  where?: Maybe<NodeEntryValueWhereInput>;
  orderBy?: Maybe<NodeEntryValueOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput;
};


export type QueryQuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>;
  orderBy?: Maybe<QuestionConditionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionConditionsConnectionArgs = {
  where?: Maybe<QuestionConditionWhereInput>;
  orderBy?: Maybe<QuestionConditionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput;
};


export type QueryQuestionNodesArgs = {
  where?: Maybe<QuestionNodeWhereInput>;
  orderBy?: Maybe<QuestionNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionNodesConnectionArgs = {
  where?: Maybe<QuestionNodeWhereInput>;
  orderBy?: Maybe<QuestionNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput;
};


export type QueryQuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>;
  orderBy?: Maybe<QuestionOptionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionOptionsConnectionArgs = {
  where?: Maybe<QuestionOptionWhereInput>;
  orderBy?: Maybe<QuestionOptionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput;
};


export type QueryQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>;
  orderBy?: Maybe<QuestionnaireOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryQuestionnairesConnectionArgs = {
  where?: Maybe<QuestionnaireWhereInput>;
  orderBy?: Maybe<QuestionnaireOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuerySessionArgs = {
  where: SessionWhereUniqueInput;
};


export type QuerySessionsArgs = {
  where?: Maybe<SessionWhereInput>;
  orderBy?: Maybe<SessionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuerySessionsConnectionArgs = {
  where?: Maybe<SessionWhereInput>;
  orderBy?: Maybe<SessionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type QuestionCondition = {
   __typename?: 'QuestionCondition';
  id: Scalars['ID'];
  conditionType: Scalars['String'];
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionConnection = {
   __typename?: 'QuestionConditionConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<QuestionConditionEdge>>;
  aggregate: AggregateQuestionCondition;
};

export type QuestionConditionCreateInput = {
  id?: Maybe<Scalars['ID']>;
  conditionType: Scalars['String'];
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionCreateManyInput = {
  create?: Maybe<Array<QuestionConditionCreateInput>>;
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>;
};

export type QuestionConditionEdge = {
   __typename?: 'QuestionConditionEdge';
  node: QuestionCondition;
  cursor: Scalars['String'];
};

export enum QuestionConditionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ConditionTypeAsc = 'conditionType_ASC',
  ConditionTypeDesc = 'conditionType_DESC',
  RenderMinAsc = 'renderMin_ASC',
  RenderMinDesc = 'renderMin_DESC',
  RenderMaxAsc = 'renderMax_ASC',
  RenderMaxDesc = 'renderMax_DESC',
  MatchValueAsc = 'matchValue_ASC',
  MatchValueDesc = 'matchValue_DESC'
}

export type QuestionConditionPreviousValues = {
   __typename?: 'QuestionConditionPreviousValues';
  id: Scalars['ID'];
  conditionType: Scalars['String'];
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  conditionType?: Maybe<Scalars['String']>;
  conditionType_not?: Maybe<Scalars['String']>;
  conditionType_in?: Maybe<Array<Scalars['String']>>;
  conditionType_not_in?: Maybe<Array<Scalars['String']>>;
  conditionType_lt?: Maybe<Scalars['String']>;
  conditionType_lte?: Maybe<Scalars['String']>;
  conditionType_gt?: Maybe<Scalars['String']>;
  conditionType_gte?: Maybe<Scalars['String']>;
  conditionType_contains?: Maybe<Scalars['String']>;
  conditionType_not_contains?: Maybe<Scalars['String']>;
  conditionType_starts_with?: Maybe<Scalars['String']>;
  conditionType_not_starts_with?: Maybe<Scalars['String']>;
  conditionType_ends_with?: Maybe<Scalars['String']>;
  conditionType_not_ends_with?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMin_not?: Maybe<Scalars['Int']>;
  renderMin_in?: Maybe<Array<Scalars['Int']>>;
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>;
  renderMin_lt?: Maybe<Scalars['Int']>;
  renderMin_lte?: Maybe<Scalars['Int']>;
  renderMin_gt?: Maybe<Scalars['Int']>;
  renderMin_gte?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  renderMax_not?: Maybe<Scalars['Int']>;
  renderMax_in?: Maybe<Array<Scalars['Int']>>;
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>;
  renderMax_lt?: Maybe<Scalars['Int']>;
  renderMax_lte?: Maybe<Scalars['Int']>;
  renderMax_gt?: Maybe<Scalars['Int']>;
  renderMax_gte?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
  matchValue_not?: Maybe<Scalars['String']>;
  matchValue_in?: Maybe<Array<Scalars['String']>>;
  matchValue_not_in?: Maybe<Array<Scalars['String']>>;
  matchValue_lt?: Maybe<Scalars['String']>;
  matchValue_lte?: Maybe<Scalars['String']>;
  matchValue_gt?: Maybe<Scalars['String']>;
  matchValue_gte?: Maybe<Scalars['String']>;
  matchValue_contains?: Maybe<Scalars['String']>;
  matchValue_not_contains?: Maybe<Scalars['String']>;
  matchValue_starts_with?: Maybe<Scalars['String']>;
  matchValue_not_starts_with?: Maybe<Scalars['String']>;
  matchValue_ends_with?: Maybe<Scalars['String']>;
  matchValue_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<QuestionConditionScalarWhereInput>>;
  OR?: Maybe<Array<QuestionConditionScalarWhereInput>>;
  NOT?: Maybe<Array<QuestionConditionScalarWhereInput>>;
};

export type QuestionConditionSubscriptionPayload = {
   __typename?: 'QuestionConditionSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<QuestionCondition>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<QuestionConditionPreviousValues>;
};

export type QuestionConditionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<QuestionConditionWhereInput>;
  AND?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>;
  OR?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>;
  NOT?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>;
};

export type QuestionConditionUpdateDataInput = {
  conditionType?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionUpdateInput = {
  conditionType?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionUpdateManyDataInput = {
  conditionType?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionUpdateManyInput = {
  create?: Maybe<Array<QuestionConditionCreateInput>>;
  update?: Maybe<Array<QuestionConditionUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<QuestionConditionUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<QuestionConditionWhereUniqueInput>>;
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>;
  set?: Maybe<Array<QuestionConditionWhereUniqueInput>>;
  disconnect?: Maybe<Array<QuestionConditionWhereUniqueInput>>;
  deleteMany?: Maybe<Array<QuestionConditionScalarWhereInput>>;
  updateMany?: Maybe<Array<QuestionConditionUpdateManyWithWhereNestedInput>>;
};

export type QuestionConditionUpdateManyMutationInput = {
  conditionType?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type QuestionConditionUpdateManyWithWhereNestedInput = {
  where: QuestionConditionScalarWhereInput;
  data: QuestionConditionUpdateManyDataInput;
};

export type QuestionConditionUpdateWithWhereUniqueNestedInput = {
  where: QuestionConditionWhereUniqueInput;
  data: QuestionConditionUpdateDataInput;
};

export type QuestionConditionUpsertWithWhereUniqueNestedInput = {
  where: QuestionConditionWhereUniqueInput;
  update: QuestionConditionUpdateDataInput;
  create: QuestionConditionCreateInput;
};

export type QuestionConditionWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  conditionType?: Maybe<Scalars['String']>;
  conditionType_not?: Maybe<Scalars['String']>;
  conditionType_in?: Maybe<Array<Scalars['String']>>;
  conditionType_not_in?: Maybe<Array<Scalars['String']>>;
  conditionType_lt?: Maybe<Scalars['String']>;
  conditionType_lte?: Maybe<Scalars['String']>;
  conditionType_gt?: Maybe<Scalars['String']>;
  conditionType_gte?: Maybe<Scalars['String']>;
  conditionType_contains?: Maybe<Scalars['String']>;
  conditionType_not_contains?: Maybe<Scalars['String']>;
  conditionType_starts_with?: Maybe<Scalars['String']>;
  conditionType_not_starts_with?: Maybe<Scalars['String']>;
  conditionType_ends_with?: Maybe<Scalars['String']>;
  conditionType_not_ends_with?: Maybe<Scalars['String']>;
  renderMin?: Maybe<Scalars['Int']>;
  renderMin_not?: Maybe<Scalars['Int']>;
  renderMin_in?: Maybe<Array<Scalars['Int']>>;
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>;
  renderMin_lt?: Maybe<Scalars['Int']>;
  renderMin_lte?: Maybe<Scalars['Int']>;
  renderMin_gt?: Maybe<Scalars['Int']>;
  renderMin_gte?: Maybe<Scalars['Int']>;
  renderMax?: Maybe<Scalars['Int']>;
  renderMax_not?: Maybe<Scalars['Int']>;
  renderMax_in?: Maybe<Array<Scalars['Int']>>;
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>;
  renderMax_lt?: Maybe<Scalars['Int']>;
  renderMax_lte?: Maybe<Scalars['Int']>;
  renderMax_gt?: Maybe<Scalars['Int']>;
  renderMax_gte?: Maybe<Scalars['Int']>;
  matchValue?: Maybe<Scalars['String']>;
  matchValue_not?: Maybe<Scalars['String']>;
  matchValue_in?: Maybe<Array<Scalars['String']>>;
  matchValue_not_in?: Maybe<Array<Scalars['String']>>;
  matchValue_lt?: Maybe<Scalars['String']>;
  matchValue_lte?: Maybe<Scalars['String']>;
  matchValue_gt?: Maybe<Scalars['String']>;
  matchValue_gte?: Maybe<Scalars['String']>;
  matchValue_contains?: Maybe<Scalars['String']>;
  matchValue_not_contains?: Maybe<Scalars['String']>;
  matchValue_starts_with?: Maybe<Scalars['String']>;
  matchValue_not_starts_with?: Maybe<Scalars['String']>;
  matchValue_ends_with?: Maybe<Scalars['String']>;
  matchValue_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<QuestionConditionWhereInput>>;
  OR?: Maybe<Array<QuestionConditionWhereInput>>;
  NOT?: Maybe<Array<QuestionConditionWhereInput>>;
};

export type QuestionConditionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type Questionnaire = {
   __typename?: 'Questionnaire';
  id: Scalars['ID'];
  customer: Customer;
  title: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  creationDate: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  rootQuestion?: Maybe<QuestionNode>;
  questions?: Maybe<Array<QuestionNode>>;
  leafs?: Maybe<Array<LeafNode>>;
};


export type QuestionnaireQuestionsArgs = {
  where?: Maybe<QuestionNodeWhereInput>;
  orderBy?: Maybe<QuestionNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuestionnaireLeafsArgs = {
  where?: Maybe<LeafNodeWhereInput>;
  orderBy?: Maybe<LeafNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type QuestionnaireConnection = {
   __typename?: 'QuestionnaireConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<QuestionnaireEdge>>;
  aggregate: AggregateQuestionnaire;
};

export type QuestionnaireCreateInput = {
  id?: Maybe<Scalars['ID']>;
  customer: CustomerCreateOneWithoutQuestionnairesInput;
  title: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeCreateOneInput>;
  questions?: Maybe<QuestionNodeCreateManyWithoutQuestionnaireInput>;
  leafs?: Maybe<LeafNodeCreateManyInput>;
};

export type QuestionnaireCreateManyWithoutCustomerInput = {
  create?: Maybe<Array<QuestionnaireCreateWithoutCustomerInput>>;
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>;
};

export type QuestionnaireCreateOneInput = {
  create?: Maybe<QuestionnaireCreateInput>;
  connect?: Maybe<QuestionnaireWhereUniqueInput>;
};

export type QuestionnaireCreateOneWithoutQuestionsInput = {
  create?: Maybe<QuestionnaireCreateWithoutQuestionsInput>;
  connect?: Maybe<QuestionnaireWhereUniqueInput>;
};

export type QuestionnaireCreateWithoutCustomerInput = {
  id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeCreateOneInput>;
  questions?: Maybe<QuestionNodeCreateManyWithoutQuestionnaireInput>;
  leafs?: Maybe<LeafNodeCreateManyInput>;
};

export type QuestionnaireCreateWithoutQuestionsInput = {
  id?: Maybe<Scalars['ID']>;
  customer: CustomerCreateOneWithoutQuestionnairesInput;
  title: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeCreateOneInput>;
  leafs?: Maybe<LeafNodeCreateManyInput>;
};

export type QuestionnaireEdge = {
   __typename?: 'QuestionnaireEdge';
  node: Questionnaire;
  cursor: Scalars['String'];
};

export enum QuestionnaireOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  PublicTitleAsc = 'publicTitle_ASC',
  PublicTitleDesc = 'publicTitle_DESC',
  CreationDateAsc = 'creationDate_ASC',
  CreationDateDesc = 'creationDate_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type QuestionnairePreviousValues = {
   __typename?: 'QuestionnairePreviousValues';
  id: Scalars['ID'];
  title: Scalars['String'];
  description: Scalars['String'];
  publicTitle?: Maybe<Scalars['String']>;
  creationDate: Scalars['DateTime'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type QuestionnaireScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_lt?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  publicTitle_not?: Maybe<Scalars['String']>;
  publicTitle_in?: Maybe<Array<Scalars['String']>>;
  publicTitle_not_in?: Maybe<Array<Scalars['String']>>;
  publicTitle_lt?: Maybe<Scalars['String']>;
  publicTitle_lte?: Maybe<Scalars['String']>;
  publicTitle_gt?: Maybe<Scalars['String']>;
  publicTitle_gte?: Maybe<Scalars['String']>;
  publicTitle_contains?: Maybe<Scalars['String']>;
  publicTitle_not_contains?: Maybe<Scalars['String']>;
  publicTitle_starts_with?: Maybe<Scalars['String']>;
  publicTitle_not_starts_with?: Maybe<Scalars['String']>;
  publicTitle_ends_with?: Maybe<Scalars['String']>;
  publicTitle_not_ends_with?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['DateTime']>;
  creationDate_not?: Maybe<Scalars['DateTime']>;
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_lt?: Maybe<Scalars['DateTime']>;
  creationDate_lte?: Maybe<Scalars['DateTime']>;
  creationDate_gt?: Maybe<Scalars['DateTime']>;
  creationDate_gte?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedAt_not?: Maybe<Scalars['DateTime']>;
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_lte?: Maybe<Scalars['DateTime']>;
  updatedAt_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_gte?: Maybe<Scalars['DateTime']>;
  AND?: Maybe<Array<QuestionnaireScalarWhereInput>>;
  OR?: Maybe<Array<QuestionnaireScalarWhereInput>>;
  NOT?: Maybe<Array<QuestionnaireScalarWhereInput>>;
};

export type QuestionnaireSubscriptionPayload = {
   __typename?: 'QuestionnaireSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<Questionnaire>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<QuestionnairePreviousValues>;
};

export type QuestionnaireSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<QuestionnaireWhereInput>;
  AND?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>;
  OR?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>;
  NOT?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>;
};

export type QuestionnaireUpdateDataInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeUpdateOneInput>;
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>;
  leafs?: Maybe<LeafNodeUpdateManyInput>;
};

export type QuestionnaireUpdateInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeUpdateOneInput>;
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>;
  leafs?: Maybe<LeafNodeUpdateManyInput>;
};

export type QuestionnaireUpdateManyDataInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
};

export type QuestionnaireUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
};

export type QuestionnaireUpdateManyWithoutCustomerInput = {
  create?: Maybe<Array<QuestionnaireCreateWithoutCustomerInput>>;
  delete?: Maybe<Array<QuestionnaireWhereUniqueInput>>;
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>;
  set?: Maybe<Array<QuestionnaireWhereUniqueInput>>;
  disconnect?: Maybe<Array<QuestionnaireWhereUniqueInput>>;
  update?: Maybe<Array<QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput>>;
  upsert?: Maybe<Array<QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput>>;
  deleteMany?: Maybe<Array<QuestionnaireScalarWhereInput>>;
  updateMany?: Maybe<Array<QuestionnaireUpdateManyWithWhereNestedInput>>;
};

export type QuestionnaireUpdateManyWithWhereNestedInput = {
  where: QuestionnaireScalarWhereInput;
  data: QuestionnaireUpdateManyDataInput;
};

export type QuestionnaireUpdateOneInput = {
  create?: Maybe<QuestionnaireCreateInput>;
  update?: Maybe<QuestionnaireUpdateDataInput>;
  upsert?: Maybe<QuestionnaireUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<QuestionnaireWhereUniqueInput>;
};

export type QuestionnaireUpdateOneWithoutQuestionsInput = {
  create?: Maybe<QuestionnaireCreateWithoutQuestionsInput>;
  update?: Maybe<QuestionnaireUpdateWithoutQuestionsDataInput>;
  upsert?: Maybe<QuestionnaireUpsertWithoutQuestionsInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<QuestionnaireWhereUniqueInput>;
};

export type QuestionnaireUpdateWithoutCustomerDataInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeUpdateOneInput>;
  questions?: Maybe<QuestionNodeUpdateManyWithoutQuestionnaireInput>;
  leafs?: Maybe<LeafNodeUpdateManyInput>;
};

export type QuestionnaireUpdateWithoutQuestionsDataInput = {
  customer?: Maybe<CustomerUpdateOneRequiredWithoutQuestionnairesInput>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  rootQuestion?: Maybe<QuestionNodeUpdateOneInput>;
  leafs?: Maybe<LeafNodeUpdateManyInput>;
};

export type QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput = {
  where: QuestionnaireWhereUniqueInput;
  data: QuestionnaireUpdateWithoutCustomerDataInput;
};

export type QuestionnaireUpsertNestedInput = {
  update: QuestionnaireUpdateDataInput;
  create: QuestionnaireCreateInput;
};

export type QuestionnaireUpsertWithoutQuestionsInput = {
  update: QuestionnaireUpdateWithoutQuestionsDataInput;
  create: QuestionnaireCreateWithoutQuestionsInput;
};

export type QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput = {
  where: QuestionnaireWhereUniqueInput;
  update: QuestionnaireUpdateWithoutCustomerDataInput;
  create: QuestionnaireCreateWithoutCustomerInput;
};

export type QuestionnaireWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  customer?: Maybe<CustomerWhereInput>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_lt?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  publicTitle?: Maybe<Scalars['String']>;
  publicTitle_not?: Maybe<Scalars['String']>;
  publicTitle_in?: Maybe<Array<Scalars['String']>>;
  publicTitle_not_in?: Maybe<Array<Scalars['String']>>;
  publicTitle_lt?: Maybe<Scalars['String']>;
  publicTitle_lte?: Maybe<Scalars['String']>;
  publicTitle_gt?: Maybe<Scalars['String']>;
  publicTitle_gte?: Maybe<Scalars['String']>;
  publicTitle_contains?: Maybe<Scalars['String']>;
  publicTitle_not_contains?: Maybe<Scalars['String']>;
  publicTitle_starts_with?: Maybe<Scalars['String']>;
  publicTitle_not_starts_with?: Maybe<Scalars['String']>;
  publicTitle_ends_with?: Maybe<Scalars['String']>;
  publicTitle_not_ends_with?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['DateTime']>;
  creationDate_not?: Maybe<Scalars['DateTime']>;
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>;
  creationDate_lt?: Maybe<Scalars['DateTime']>;
  creationDate_lte?: Maybe<Scalars['DateTime']>;
  creationDate_gt?: Maybe<Scalars['DateTime']>;
  creationDate_gte?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  updatedAt_not?: Maybe<Scalars['DateTime']>;
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  updatedAt_lt?: Maybe<Scalars['DateTime']>;
  updatedAt_lte?: Maybe<Scalars['DateTime']>;
  updatedAt_gt?: Maybe<Scalars['DateTime']>;
  updatedAt_gte?: Maybe<Scalars['DateTime']>;
  rootQuestion?: Maybe<QuestionNodeWhereInput>;
  questions_every?: Maybe<QuestionNodeWhereInput>;
  questions_some?: Maybe<QuestionNodeWhereInput>;
  questions_none?: Maybe<QuestionNodeWhereInput>;
  leafs_every?: Maybe<LeafNodeWhereInput>;
  leafs_some?: Maybe<LeafNodeWhereInput>;
  leafs_none?: Maybe<LeafNodeWhereInput>;
  AND?: Maybe<Array<QuestionnaireWhereInput>>;
  OR?: Maybe<Array<QuestionnaireWhereInput>>;
  NOT?: Maybe<Array<QuestionnaireWhereInput>>;
};

export type QuestionnaireWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type QuestionNode = {
   __typename?: 'QuestionNode';
  id: Scalars['ID'];
  questionnaire?: Maybe<Questionnaire>;
  title: Scalars['String'];
  branchVal?: Maybe<Scalars['String']>;
  isRoot: Scalars['Boolean'];
  questionType: NodeType;
  overrideLeaf?: Maybe<LeafNode>;
  options?: Maybe<Array<QuestionOption>>;
  children?: Maybe<Array<QuestionNode>>;
  edgeChildren?: Maybe<Array<Edge>>;
};


export type QuestionNodeOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>;
  orderBy?: Maybe<QuestionOptionOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuestionNodeChildrenArgs = {
  where?: Maybe<QuestionNodeWhereInput>;
  orderBy?: Maybe<QuestionNodeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QuestionNodeEdgeChildrenArgs = {
  where?: Maybe<EdgeWhereInput>;
  orderBy?: Maybe<EdgeOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type QuestionNodeConnection = {
   __typename?: 'QuestionNodeConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<QuestionNodeEdge>>;
  aggregate: AggregateQuestionNode;
};

export type QuestionNodeCreateInput = {
  id?: Maybe<Scalars['ID']>;
  questionnaire?: Maybe<QuestionnaireCreateOneWithoutQuestionsInput>;
  title: Scalars['String'];
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType: NodeType;
  overrideLeaf?: Maybe<LeafNodeCreateOneInput>;
  options?: Maybe<QuestionOptionCreateManyInput>;
  children?: Maybe<QuestionNodeCreateManyInput>;
  edgeChildren?: Maybe<EdgeCreateManyInput>;
};

export type QuestionNodeCreateManyInput = {
  create?: Maybe<Array<QuestionNodeCreateInput>>;
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
};

export type QuestionNodeCreateManyWithoutQuestionnaireInput = {
  create?: Maybe<Array<QuestionNodeCreateWithoutQuestionnaireInput>>;
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
};

export type QuestionNodeCreateOneInput = {
  create?: Maybe<QuestionNodeCreateInput>;
  connect?: Maybe<QuestionNodeWhereUniqueInput>;
};

export type QuestionNodeCreateWithoutQuestionnaireInput = {
  id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType: NodeType;
  overrideLeaf?: Maybe<LeafNodeCreateOneInput>;
  options?: Maybe<QuestionOptionCreateManyInput>;
  children?: Maybe<QuestionNodeCreateManyInput>;
  edgeChildren?: Maybe<EdgeCreateManyInput>;
};

export type QuestionNodeEdge = {
   __typename?: 'QuestionNodeEdge';
  node: QuestionNode;
  cursor: Scalars['String'];
};

export enum QuestionNodeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  BranchValAsc = 'branchVal_ASC',
  BranchValDesc = 'branchVal_DESC',
  IsRootAsc = 'isRoot_ASC',
  IsRootDesc = 'isRoot_DESC',
  QuestionTypeAsc = 'questionType_ASC',
  QuestionTypeDesc = 'questionType_DESC'
}

export type QuestionNodePreviousValues = {
   __typename?: 'QuestionNodePreviousValues';
  id: Scalars['ID'];
  title: Scalars['String'];
  branchVal?: Maybe<Scalars['String']>;
  isRoot: Scalars['Boolean'];
  questionType: NodeType;
};

export type QuestionNodeScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  branchVal_not?: Maybe<Scalars['String']>;
  branchVal_in?: Maybe<Array<Scalars['String']>>;
  branchVal_not_in?: Maybe<Array<Scalars['String']>>;
  branchVal_lt?: Maybe<Scalars['String']>;
  branchVal_lte?: Maybe<Scalars['String']>;
  branchVal_gt?: Maybe<Scalars['String']>;
  branchVal_gte?: Maybe<Scalars['String']>;
  branchVal_contains?: Maybe<Scalars['String']>;
  branchVal_not_contains?: Maybe<Scalars['String']>;
  branchVal_starts_with?: Maybe<Scalars['String']>;
  branchVal_not_starts_with?: Maybe<Scalars['String']>;
  branchVal_ends_with?: Maybe<Scalars['String']>;
  branchVal_not_ends_with?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  isRoot_not?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
  questionType_not?: Maybe<NodeType>;
  questionType_in?: Maybe<Array<NodeType>>;
  questionType_not_in?: Maybe<Array<NodeType>>;
  AND?: Maybe<Array<QuestionNodeScalarWhereInput>>;
  OR?: Maybe<Array<QuestionNodeScalarWhereInput>>;
  NOT?: Maybe<Array<QuestionNodeScalarWhereInput>>;
};

export type QuestionNodeSubscriptionPayload = {
   __typename?: 'QuestionNodeSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<QuestionNode>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<QuestionNodePreviousValues>;
};

export type QuestionNodeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<QuestionNodeWhereInput>;
  AND?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>;
  OR?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>;
  NOT?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>;
};

export type QuestionNodeUpdateDataInput = {
  questionnaire?: Maybe<QuestionnaireUpdateOneWithoutQuestionsInput>;
  title?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>;
  options?: Maybe<QuestionOptionUpdateManyInput>;
  children?: Maybe<QuestionNodeUpdateManyInput>;
  edgeChildren?: Maybe<EdgeUpdateManyInput>;
};

export type QuestionNodeUpdateInput = {
  questionnaire?: Maybe<QuestionnaireUpdateOneWithoutQuestionsInput>;
  title?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>;
  options?: Maybe<QuestionOptionUpdateManyInput>;
  children?: Maybe<QuestionNodeUpdateManyInput>;
  edgeChildren?: Maybe<EdgeUpdateManyInput>;
};

export type QuestionNodeUpdateManyDataInput = {
  title?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
};

export type QuestionNodeUpdateManyInput = {
  create?: Maybe<Array<QuestionNodeCreateInput>>;
  update?: Maybe<Array<QuestionNodeUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<QuestionNodeUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  set?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  disconnect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  deleteMany?: Maybe<Array<QuestionNodeScalarWhereInput>>;
  updateMany?: Maybe<Array<QuestionNodeUpdateManyWithWhereNestedInput>>;
};

export type QuestionNodeUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
};

export type QuestionNodeUpdateManyWithoutQuestionnaireInput = {
  create?: Maybe<Array<QuestionNodeCreateWithoutQuestionnaireInput>>;
  delete?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  set?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  disconnect?: Maybe<Array<QuestionNodeWhereUniqueInput>>;
  update?: Maybe<Array<QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput>>;
  upsert?: Maybe<Array<QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput>>;
  deleteMany?: Maybe<Array<QuestionNodeScalarWhereInput>>;
  updateMany?: Maybe<Array<QuestionNodeUpdateManyWithWhereNestedInput>>;
};

export type QuestionNodeUpdateManyWithWhereNestedInput = {
  where: QuestionNodeScalarWhereInput;
  data: QuestionNodeUpdateManyDataInput;
};

export type QuestionNodeUpdateOneInput = {
  create?: Maybe<QuestionNodeCreateInput>;
  update?: Maybe<QuestionNodeUpdateDataInput>;
  upsert?: Maybe<QuestionNodeUpsertNestedInput>;
  delete?: Maybe<Scalars['Boolean']>;
  disconnect?: Maybe<Scalars['Boolean']>;
  connect?: Maybe<QuestionNodeWhereUniqueInput>;
};

export type QuestionNodeUpdateOneRequiredInput = {
  create?: Maybe<QuestionNodeCreateInput>;
  update?: Maybe<QuestionNodeUpdateDataInput>;
  upsert?: Maybe<QuestionNodeUpsertNestedInput>;
  connect?: Maybe<QuestionNodeWhereUniqueInput>;
};

export type QuestionNodeUpdateWithoutQuestionnaireDataInput = {
  title?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
  overrideLeaf?: Maybe<LeafNodeUpdateOneInput>;
  options?: Maybe<QuestionOptionUpdateManyInput>;
  children?: Maybe<QuestionNodeUpdateManyInput>;
  edgeChildren?: Maybe<EdgeUpdateManyInput>;
};

export type QuestionNodeUpdateWithWhereUniqueNestedInput = {
  where: QuestionNodeWhereUniqueInput;
  data: QuestionNodeUpdateDataInput;
};

export type QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput = {
  where: QuestionNodeWhereUniqueInput;
  data: QuestionNodeUpdateWithoutQuestionnaireDataInput;
};

export type QuestionNodeUpsertNestedInput = {
  update: QuestionNodeUpdateDataInput;
  create: QuestionNodeCreateInput;
};

export type QuestionNodeUpsertWithWhereUniqueNestedInput = {
  where: QuestionNodeWhereUniqueInput;
  update: QuestionNodeUpdateDataInput;
  create: QuestionNodeCreateInput;
};

export type QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput = {
  where: QuestionNodeWhereUniqueInput;
  update: QuestionNodeUpdateWithoutQuestionnaireDataInput;
  create: QuestionNodeCreateWithoutQuestionnaireInput;
};

export type QuestionNodeWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  questionnaire?: Maybe<QuestionnaireWhereInput>;
  title?: Maybe<Scalars['String']>;
  title_not?: Maybe<Scalars['String']>;
  title_in?: Maybe<Array<Scalars['String']>>;
  title_not_in?: Maybe<Array<Scalars['String']>>;
  title_lt?: Maybe<Scalars['String']>;
  title_lte?: Maybe<Scalars['String']>;
  title_gt?: Maybe<Scalars['String']>;
  title_gte?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_starts_with?: Maybe<Scalars['String']>;
  title_not_starts_with?: Maybe<Scalars['String']>;
  title_ends_with?: Maybe<Scalars['String']>;
  title_not_ends_with?: Maybe<Scalars['String']>;
  branchVal?: Maybe<Scalars['String']>;
  branchVal_not?: Maybe<Scalars['String']>;
  branchVal_in?: Maybe<Array<Scalars['String']>>;
  branchVal_not_in?: Maybe<Array<Scalars['String']>>;
  branchVal_lt?: Maybe<Scalars['String']>;
  branchVal_lte?: Maybe<Scalars['String']>;
  branchVal_gt?: Maybe<Scalars['String']>;
  branchVal_gte?: Maybe<Scalars['String']>;
  branchVal_contains?: Maybe<Scalars['String']>;
  branchVal_not_contains?: Maybe<Scalars['String']>;
  branchVal_starts_with?: Maybe<Scalars['String']>;
  branchVal_not_starts_with?: Maybe<Scalars['String']>;
  branchVal_ends_with?: Maybe<Scalars['String']>;
  branchVal_not_ends_with?: Maybe<Scalars['String']>;
  isRoot?: Maybe<Scalars['Boolean']>;
  isRoot_not?: Maybe<Scalars['Boolean']>;
  questionType?: Maybe<NodeType>;
  questionType_not?: Maybe<NodeType>;
  questionType_in?: Maybe<Array<NodeType>>;
  questionType_not_in?: Maybe<Array<NodeType>>;
  overrideLeaf?: Maybe<LeafNodeWhereInput>;
  options_every?: Maybe<QuestionOptionWhereInput>;
  options_some?: Maybe<QuestionOptionWhereInput>;
  options_none?: Maybe<QuestionOptionWhereInput>;
  children_every?: Maybe<QuestionNodeWhereInput>;
  children_some?: Maybe<QuestionNodeWhereInput>;
  children_none?: Maybe<QuestionNodeWhereInput>;
  edgeChildren_every?: Maybe<EdgeWhereInput>;
  edgeChildren_some?: Maybe<EdgeWhereInput>;
  edgeChildren_none?: Maybe<EdgeWhereInput>;
  AND?: Maybe<Array<QuestionNodeWhereInput>>;
  OR?: Maybe<Array<QuestionNodeWhereInput>>;
  NOT?: Maybe<Array<QuestionNodeWhereInput>>;
};

export type QuestionNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type QuestionOption = {
   __typename?: 'QuestionOption';
  id: Scalars['ID'];
  value: Scalars['String'];
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionConnection = {
   __typename?: 'QuestionOptionConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<QuestionOptionEdge>>;
  aggregate: AggregateQuestionOption;
};

export type QuestionOptionCreateInput = {
  id?: Maybe<Scalars['ID']>;
  value: Scalars['String'];
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionCreateManyInput = {
  create?: Maybe<Array<QuestionOptionCreateInput>>;
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>;
};

export type QuestionOptionEdge = {
   __typename?: 'QuestionOptionEdge';
  node: QuestionOption;
  cursor: Scalars['String'];
};

export enum QuestionOptionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ValueAsc = 'value_ASC',
  ValueDesc = 'value_DESC',
  PublicValueAsc = 'publicValue_ASC',
  PublicValueDesc = 'publicValue_DESC'
}

export type QuestionOptionPreviousValues = {
   __typename?: 'QuestionOptionPreviousValues';
  id: Scalars['ID'];
  value: Scalars['String'];
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionScalarWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  value?: Maybe<Scalars['String']>;
  value_not?: Maybe<Scalars['String']>;
  value_in?: Maybe<Array<Scalars['String']>>;
  value_not_in?: Maybe<Array<Scalars['String']>>;
  value_lt?: Maybe<Scalars['String']>;
  value_lte?: Maybe<Scalars['String']>;
  value_gt?: Maybe<Scalars['String']>;
  value_gte?: Maybe<Scalars['String']>;
  value_contains?: Maybe<Scalars['String']>;
  value_not_contains?: Maybe<Scalars['String']>;
  value_starts_with?: Maybe<Scalars['String']>;
  value_not_starts_with?: Maybe<Scalars['String']>;
  value_ends_with?: Maybe<Scalars['String']>;
  value_not_ends_with?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  publicValue_not?: Maybe<Scalars['String']>;
  publicValue_in?: Maybe<Array<Scalars['String']>>;
  publicValue_not_in?: Maybe<Array<Scalars['String']>>;
  publicValue_lt?: Maybe<Scalars['String']>;
  publicValue_lte?: Maybe<Scalars['String']>;
  publicValue_gt?: Maybe<Scalars['String']>;
  publicValue_gte?: Maybe<Scalars['String']>;
  publicValue_contains?: Maybe<Scalars['String']>;
  publicValue_not_contains?: Maybe<Scalars['String']>;
  publicValue_starts_with?: Maybe<Scalars['String']>;
  publicValue_not_starts_with?: Maybe<Scalars['String']>;
  publicValue_ends_with?: Maybe<Scalars['String']>;
  publicValue_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<QuestionOptionScalarWhereInput>>;
  OR?: Maybe<Array<QuestionOptionScalarWhereInput>>;
  NOT?: Maybe<Array<QuestionOptionScalarWhereInput>>;
};

export type QuestionOptionSubscriptionPayload = {
   __typename?: 'QuestionOptionSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<QuestionOption>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<QuestionOptionPreviousValues>;
};

export type QuestionOptionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<QuestionOptionWhereInput>;
  AND?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>;
  OR?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>;
  NOT?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>;
};

export type QuestionOptionUpdateDataInput = {
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionUpdateInput = {
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionUpdateManyDataInput = {
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionUpdateManyInput = {
  create?: Maybe<Array<QuestionOptionCreateInput>>;
  update?: Maybe<Array<QuestionOptionUpdateWithWhereUniqueNestedInput>>;
  upsert?: Maybe<Array<QuestionOptionUpsertWithWhereUniqueNestedInput>>;
  delete?: Maybe<Array<QuestionOptionWhereUniqueInput>>;
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>;
  set?: Maybe<Array<QuestionOptionWhereUniqueInput>>;
  disconnect?: Maybe<Array<QuestionOptionWhereUniqueInput>>;
  deleteMany?: Maybe<Array<QuestionOptionScalarWhereInput>>;
  updateMany?: Maybe<Array<QuestionOptionUpdateManyWithWhereNestedInput>>;
};

export type QuestionOptionUpdateManyMutationInput = {
  value?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
};

export type QuestionOptionUpdateManyWithWhereNestedInput = {
  where: QuestionOptionScalarWhereInput;
  data: QuestionOptionUpdateManyDataInput;
};

export type QuestionOptionUpdateWithWhereUniqueNestedInput = {
  where: QuestionOptionWhereUniqueInput;
  data: QuestionOptionUpdateDataInput;
};

export type QuestionOptionUpsertWithWhereUniqueNestedInput = {
  where: QuestionOptionWhereUniqueInput;
  update: QuestionOptionUpdateDataInput;
  create: QuestionOptionCreateInput;
};

export type QuestionOptionWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  value?: Maybe<Scalars['String']>;
  value_not?: Maybe<Scalars['String']>;
  value_in?: Maybe<Array<Scalars['String']>>;
  value_not_in?: Maybe<Array<Scalars['String']>>;
  value_lt?: Maybe<Scalars['String']>;
  value_lte?: Maybe<Scalars['String']>;
  value_gt?: Maybe<Scalars['String']>;
  value_gte?: Maybe<Scalars['String']>;
  value_contains?: Maybe<Scalars['String']>;
  value_not_contains?: Maybe<Scalars['String']>;
  value_starts_with?: Maybe<Scalars['String']>;
  value_not_starts_with?: Maybe<Scalars['String']>;
  value_ends_with?: Maybe<Scalars['String']>;
  value_not_ends_with?: Maybe<Scalars['String']>;
  publicValue?: Maybe<Scalars['String']>;
  publicValue_not?: Maybe<Scalars['String']>;
  publicValue_in?: Maybe<Array<Scalars['String']>>;
  publicValue_not_in?: Maybe<Array<Scalars['String']>>;
  publicValue_lt?: Maybe<Scalars['String']>;
  publicValue_lte?: Maybe<Scalars['String']>;
  publicValue_gt?: Maybe<Scalars['String']>;
  publicValue_gte?: Maybe<Scalars['String']>;
  publicValue_contains?: Maybe<Scalars['String']>;
  publicValue_not_contains?: Maybe<Scalars['String']>;
  publicValue_starts_with?: Maybe<Scalars['String']>;
  publicValue_not_starts_with?: Maybe<Scalars['String']>;
  publicValue_ends_with?: Maybe<Scalars['String']>;
  publicValue_not_ends_with?: Maybe<Scalars['String']>;
  AND?: Maybe<Array<QuestionOptionWhereInput>>;
  OR?: Maybe<Array<QuestionOptionWhereInput>>;
  NOT?: Maybe<Array<QuestionOptionWhereInput>>;
};

export type QuestionOptionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type Session = {
   __typename?: 'Session';
  id: Scalars['ID'];
  nodeEntries?: Maybe<Array<NodeEntry>>;
  createdAt: Scalars['DateTime'];
};


export type SessionNodeEntriesArgs = {
  where?: Maybe<NodeEntryWhereInput>;
  orderBy?: Maybe<NodeEntryOrderByInput>;
  skip?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type SessionConnection = {
   __typename?: 'SessionConnection';
  pageInfo: PageInfo;
  edges: Array<Maybe<SessionEdge>>;
  aggregate: AggregateSession;
};

export type SessionCreateInput = {
  id?: Maybe<Scalars['ID']>;
  nodeEntries?: Maybe<NodeEntryCreateManyWithoutSessionInput>;
};

export type SessionCreateOneWithoutNodeEntriesInput = {
  create?: Maybe<SessionCreateWithoutNodeEntriesInput>;
  connect?: Maybe<SessionWhereUniqueInput>;
};

export type SessionCreateWithoutNodeEntriesInput = {
  id?: Maybe<Scalars['ID']>;
};

export type SessionEdge = {
   __typename?: 'SessionEdge';
  node: Session;
  cursor: Scalars['String'];
};

export enum SessionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC'
}

export type SessionPreviousValues = {
   __typename?: 'SessionPreviousValues';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
};

export type SessionSubscriptionPayload = {
   __typename?: 'SessionSubscriptionPayload';
  mutation: MutationType;
  node?: Maybe<Session>;
  updatedFields?: Maybe<Array<Scalars['String']>>;
  previousValues?: Maybe<SessionPreviousValues>;
};

export type SessionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>;
  updatedFields_contains?: Maybe<Scalars['String']>;
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>;
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>;
  node?: Maybe<SessionWhereInput>;
  AND?: Maybe<Array<SessionSubscriptionWhereInput>>;
  OR?: Maybe<Array<SessionSubscriptionWhereInput>>;
  NOT?: Maybe<Array<SessionSubscriptionWhereInput>>;
};

export type SessionUpdateInput = {
  nodeEntries?: Maybe<NodeEntryUpdateManyWithoutSessionInput>;
};

export type SessionUpdateOneRequiredWithoutNodeEntriesInput = {
  create?: Maybe<SessionCreateWithoutNodeEntriesInput>;
  connect?: Maybe<SessionWhereUniqueInput>;
};

export type SessionWhereInput = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  id_lt?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_contains?: Maybe<Scalars['ID']>;
  id_not_contains?: Maybe<Scalars['ID']>;
  id_starts_with?: Maybe<Scalars['ID']>;
  id_not_starts_with?: Maybe<Scalars['ID']>;
  id_ends_with?: Maybe<Scalars['ID']>;
  id_not_ends_with?: Maybe<Scalars['ID']>;
  nodeEntries_every?: Maybe<NodeEntryWhereInput>;
  nodeEntries_some?: Maybe<NodeEntryWhereInput>;
  nodeEntries_none?: Maybe<NodeEntryWhereInput>;
  createdAt?: Maybe<Scalars['DateTime']>;
  createdAt_not?: Maybe<Scalars['DateTime']>;
  createdAt_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_not_in?: Maybe<Array<Scalars['DateTime']>>;
  createdAt_lt?: Maybe<Scalars['DateTime']>;
  createdAt_lte?: Maybe<Scalars['DateTime']>;
  createdAt_gt?: Maybe<Scalars['DateTime']>;
  createdAt_gte?: Maybe<Scalars['DateTime']>;
  AND?: Maybe<Array<SessionWhereInput>>;
  OR?: Maybe<Array<SessionWhereInput>>;
  NOT?: Maybe<Array<SessionWhereInput>>;
};

export type SessionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
};

export type Subscription = {
   __typename?: 'Subscription';
  colourSettings?: Maybe<ColourSettingsSubscriptionPayload>;
  customer?: Maybe<CustomerSubscriptionPayload>;
  customerSettings?: Maybe<CustomerSettingsSubscriptionPayload>;
  edge?: Maybe<EdgeSubscriptionPayload>;
  fontSettings?: Maybe<FontSettingsSubscriptionPayload>;
  leafNode?: Maybe<LeafNodeSubscriptionPayload>;
  nodeEntry?: Maybe<NodeEntrySubscriptionPayload>;
  nodeEntryValue?: Maybe<NodeEntryValueSubscriptionPayload>;
  questionCondition?: Maybe<QuestionConditionSubscriptionPayload>;
  questionNode?: Maybe<QuestionNodeSubscriptionPayload>;
  questionOption?: Maybe<QuestionOptionSubscriptionPayload>;
  questionnaire?: Maybe<QuestionnaireSubscriptionPayload>;
  session?: Maybe<SessionSubscriptionPayload>;
};


export type SubscriptionColourSettingsArgs = {
  where?: Maybe<ColourSettingsSubscriptionWhereInput>;
};


export type SubscriptionCustomerArgs = {
  where?: Maybe<CustomerSubscriptionWhereInput>;
};


export type SubscriptionCustomerSettingsArgs = {
  where?: Maybe<CustomerSettingsSubscriptionWhereInput>;
};


export type SubscriptionEdgeArgs = {
  where?: Maybe<EdgeSubscriptionWhereInput>;
};


export type SubscriptionFontSettingsArgs = {
  where?: Maybe<FontSettingsSubscriptionWhereInput>;
};


export type SubscriptionLeafNodeArgs = {
  where?: Maybe<LeafNodeSubscriptionWhereInput>;
};


export type SubscriptionNodeEntryArgs = {
  where?: Maybe<NodeEntrySubscriptionWhereInput>;
};


export type SubscriptionNodeEntryValueArgs = {
  where?: Maybe<NodeEntryValueSubscriptionWhereInput>;
};


export type SubscriptionQuestionConditionArgs = {
  where?: Maybe<QuestionConditionSubscriptionWhereInput>;
};


export type SubscriptionQuestionNodeArgs = {
  where?: Maybe<QuestionNodeSubscriptionWhereInput>;
};


export type SubscriptionQuestionOptionArgs = {
  where?: Maybe<QuestionOptionSubscriptionWhereInput>;
};


export type SubscriptionQuestionnaireArgs = {
  where?: Maybe<QuestionnaireSubscriptionWhereInput>;
};


export type SubscriptionSessionArgs = {
  where?: Maybe<SessionSubscriptionWhereInput>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  ColourSettingsWhereInput: ColourSettingsWhereInput,
  ColourSettingsOrderByInput: ColourSettingsOrderByInput,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ColourSettingsConnection: ResolverTypeWrapper<ColourSettingsConnection>,
  PageInfo: ResolverTypeWrapper<PageInfo>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  ColourSettingsEdge: ResolverTypeWrapper<ColourSettingsEdge>,
  AggregateColourSettings: ResolverTypeWrapper<AggregateColourSettings>,
  CustomerWhereUniqueInput: CustomerWhereUniqueInput,
  Customer: ResolverTypeWrapper<Customer>,
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  NodeType: NodeType,
  LeafNodeWhereInput: LeafNodeWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  EdgeWhereInput: EdgeWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  Questionnaire: ResolverTypeWrapper<Questionnaire>,
  QuestionNode: ResolverTypeWrapper<QuestionNode>,
  LeafNode: ResolverTypeWrapper<LeafNode>,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: ResolverTypeWrapper<QuestionOption>,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  EdgeOrderByInput: EdgeOrderByInput,
  Edge: ResolverTypeWrapper<Edge>,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: ResolverTypeWrapper<QuestionCondition>,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  CustomerSettings: ResolverTypeWrapper<CustomerSettings>,
  FontSettings: ResolverTypeWrapper<FontSettings>,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>,
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>,
  AggregateCustomer: ResolverTypeWrapper<AggregateCustomer>,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: ResolverTypeWrapper<CustomerSettingsConnection>,
  CustomerSettingsEdge: ResolverTypeWrapper<CustomerSettingsEdge>,
  AggregateCustomerSettings: ResolverTypeWrapper<AggregateCustomerSettings>,
  EdgeWhereUniqueInput: EdgeWhereUniqueInput,
  EdgeConnection: ResolverTypeWrapper<EdgeConnection>,
  EdgeEdge: ResolverTypeWrapper<EdgeEdge>,
  AggregateEdge: ResolverTypeWrapper<AggregateEdge>,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: ResolverTypeWrapper<FontSettingsConnection>,
  FontSettingsEdge: ResolverTypeWrapper<FontSettingsEdge>,
  AggregateFontSettings: ResolverTypeWrapper<AggregateFontSettings>,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNodeConnection: ResolverTypeWrapper<LeafNodeConnection>,
  LeafNodeEdge: ResolverTypeWrapper<LeafNodeEdge>,
  AggregateLeafNode: ResolverTypeWrapper<AggregateLeafNode>,
  NodeEntryWhereUniqueInput: NodeEntryWhereUniqueInput,
  NodeEntry: ResolverTypeWrapper<NodeEntry>,
  Session: ResolverTypeWrapper<Session>,
  NodeEntryWhereInput: NodeEntryWhereInput,
  SessionWhereInput: SessionWhereInput,
  NodeEntryValueWhereInput: NodeEntryValueWhereInput,
  NodeEntryOrderByInput: NodeEntryOrderByInput,
  NodeEntryValueOrderByInput: NodeEntryValueOrderByInput,
  NodeEntryValue: ResolverTypeWrapper<NodeEntryValue>,
  NodeEntryConnection: ResolverTypeWrapper<NodeEntryConnection>,
  NodeEntryEdge: ResolverTypeWrapper<NodeEntryEdge>,
  AggregateNodeEntry: ResolverTypeWrapper<AggregateNodeEntry>,
  NodeEntryValueWhereUniqueInput: NodeEntryValueWhereUniqueInput,
  NodeEntryValueConnection: ResolverTypeWrapper<NodeEntryValueConnection>,
  NodeEntryValueEdge: ResolverTypeWrapper<NodeEntryValueEdge>,
  AggregateNodeEntryValue: ResolverTypeWrapper<AggregateNodeEntryValue>,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: ResolverTypeWrapper<QuestionConditionConnection>,
  QuestionConditionEdge: ResolverTypeWrapper<QuestionConditionEdge>,
  AggregateQuestionCondition: ResolverTypeWrapper<AggregateQuestionCondition>,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNodeConnection: ResolverTypeWrapper<QuestionNodeConnection>,
  QuestionNodeEdge: ResolverTypeWrapper<QuestionNodeEdge>,
  AggregateQuestionNode: ResolverTypeWrapper<AggregateQuestionNode>,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: ResolverTypeWrapper<QuestionOptionConnection>,
  QuestionOptionEdge: ResolverTypeWrapper<QuestionOptionEdge>,
  AggregateQuestionOption: ResolverTypeWrapper<AggregateQuestionOption>,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: ResolverTypeWrapper<QuestionnaireConnection>,
  QuestionnaireEdge: ResolverTypeWrapper<QuestionnaireEdge>,
  AggregateQuestionnaire: ResolverTypeWrapper<AggregateQuestionnaire>,
  SessionWhereUniqueInput: SessionWhereUniqueInput,
  SessionOrderByInput: SessionOrderByInput,
  SessionConnection: ResolverTypeWrapper<SessionConnection>,
  SessionEdge: ResolverTypeWrapper<SessionEdge>,
  AggregateSession: ResolverTypeWrapper<AggregateSession>,
  Node: ResolverTypeWrapper<Node>,
  Mutation: ResolverTypeWrapper<{}>,
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: ResolverTypeWrapper<BatchPayload>,
  Long: ResolverTypeWrapper<Scalars['Long']>,
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyWithoutCustomerInput: QuestionnaireCreateManyWithoutCustomerInput,
  QuestionnaireCreateWithoutCustomerInput: QuestionnaireCreateWithoutCustomerInput,
  QuestionNodeCreateOneInput: QuestionNodeCreateOneInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  QuestionnaireCreateOneWithoutQuestionsInput: QuestionnaireCreateOneWithoutQuestionsInput,
  QuestionnaireCreateWithoutQuestionsInput: QuestionnaireCreateWithoutQuestionsInput,
  CustomerCreateOneWithoutQuestionnairesInput: CustomerCreateOneWithoutQuestionnairesInput,
  CustomerCreateWithoutQuestionnairesInput: CustomerCreateWithoutQuestionnairesInput,
  CustomerSettingsCreateOneInput: CustomerSettingsCreateOneInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  LeafNodeCreateManyInput: LeafNodeCreateManyInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  LeafNodeCreateOneInput: LeafNodeCreateOneInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  EdgeCreateManyInput: EdgeCreateManyInput,
  EdgeCreateInput: EdgeCreateInput,
  QuestionnaireCreateOneInput: QuestionnaireCreateOneInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  QuestionNodeCreateManyWithoutQuestionnaireInput: QuestionNodeCreateManyWithoutQuestionnaireInput,
  QuestionNodeCreateWithoutQuestionnaireInput: QuestionNodeCreateWithoutQuestionnaireInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyWithoutCustomerInput: QuestionnaireUpdateManyWithoutCustomerInput,
  QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput: QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput,
  QuestionnaireUpdateWithoutCustomerDataInput: QuestionnaireUpdateWithoutCustomerDataInput,
  QuestionNodeUpdateOneInput: QuestionNodeUpdateOneInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  QuestionnaireUpdateOneWithoutQuestionsInput: QuestionnaireUpdateOneWithoutQuestionsInput,
  QuestionnaireUpdateWithoutQuestionsDataInput: QuestionnaireUpdateWithoutQuestionsDataInput,
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
  LeafNodeUpdateManyInput: LeafNodeUpdateManyInput,
  LeafNodeUpdateWithWhereUniqueNestedInput: LeafNodeUpdateWithWhereUniqueNestedInput,
  LeafNodeUpdateDataInput: LeafNodeUpdateDataInput,
  LeafNodeUpsertWithWhereUniqueNestedInput: LeafNodeUpsertWithWhereUniqueNestedInput,
  LeafNodeScalarWhereInput: LeafNodeScalarWhereInput,
  LeafNodeUpdateManyWithWhereNestedInput: LeafNodeUpdateManyWithWhereNestedInput,
  LeafNodeUpdateManyDataInput: LeafNodeUpdateManyDataInput,
  QuestionnaireUpsertWithoutQuestionsInput: QuestionnaireUpsertWithoutQuestionsInput,
  LeafNodeUpdateOneInput: LeafNodeUpdateOneInput,
  LeafNodeUpsertNestedInput: LeafNodeUpsertNestedInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  EdgeUpdateManyInput: EdgeUpdateManyInput,
  EdgeUpdateWithWhereUniqueNestedInput: EdgeUpdateWithWhereUniqueNestedInput,
  EdgeUpdateDataInput: EdgeUpdateDataInput,
  QuestionnaireUpdateOneInput: QuestionnaireUpdateOneInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  QuestionNodeUpdateManyWithoutQuestionnaireInput: QuestionNodeUpdateManyWithoutQuestionnaireInput,
  QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput,
  QuestionNodeUpdateWithoutQuestionnaireDataInput: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput,
  QuestionnaireUpsertNestedInput: QuestionnaireUpsertNestedInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  EdgeUpsertWithWhereUniqueNestedInput: EdgeUpsertWithWhereUniqueNestedInput,
  EdgeScalarWhereInput: EdgeScalarWhereInput,
  QuestionNodeUpsertNestedInput: QuestionNodeUpsertNestedInput,
  QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput: QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  EdgeUpdateInput: EdgeUpdateInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  NodeEntryCreateInput: NodeEntryCreateInput,
  SessionCreateOneWithoutNodeEntriesInput: SessionCreateOneWithoutNodeEntriesInput,
  SessionCreateWithoutNodeEntriesInput: SessionCreateWithoutNodeEntriesInput,
  EdgeCreateOneInput: EdgeCreateOneInput,
  NodeEntryValueCreateManyInput: NodeEntryValueCreateManyInput,
  NodeEntryValueCreateInput: NodeEntryValueCreateInput,
  NodeEntryUpdateInput: NodeEntryUpdateInput,
  SessionUpdateOneRequiredWithoutNodeEntriesInput: SessionUpdateOneRequiredWithoutNodeEntriesInput,
  QuestionNodeUpdateOneRequiredInput: QuestionNodeUpdateOneRequiredInput,
  EdgeUpdateOneInput: EdgeUpdateOneInput,
  EdgeUpsertNestedInput: EdgeUpsertNestedInput,
  NodeEntryValueUpdateManyInput: NodeEntryValueUpdateManyInput,
  NodeEntryValueUpdateWithWhereUniqueNestedInput: NodeEntryValueUpdateWithWhereUniqueNestedInput,
  NodeEntryValueUpdateDataInput: NodeEntryValueUpdateDataInput,
  NodeEntryValueUpsertWithWhereUniqueNestedInput: NodeEntryValueUpsertWithWhereUniqueNestedInput,
  NodeEntryValueScalarWhereInput: NodeEntryValueScalarWhereInput,
  NodeEntryValueUpdateManyWithWhereNestedInput: NodeEntryValueUpdateManyWithWhereNestedInput,
  NodeEntryValueUpdateManyDataInput: NodeEntryValueUpdateManyDataInput,
  NodeEntryUpdateManyMutationInput: NodeEntryUpdateManyMutationInput,
  NodeEntryValueUpdateInput: NodeEntryValueUpdateInput,
  NodeEntryValueUpdateManyMutationInput: NodeEntryValueUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  SessionCreateInput: SessionCreateInput,
  NodeEntryCreateManyWithoutSessionInput: NodeEntryCreateManyWithoutSessionInput,
  NodeEntryCreateWithoutSessionInput: NodeEntryCreateWithoutSessionInput,
  SessionUpdateInput: SessionUpdateInput,
  NodeEntryUpdateManyWithoutSessionInput: NodeEntryUpdateManyWithoutSessionInput,
  NodeEntryUpdateWithWhereUniqueWithoutSessionInput: NodeEntryUpdateWithWhereUniqueWithoutSessionInput,
  NodeEntryUpdateWithoutSessionDataInput: NodeEntryUpdateWithoutSessionDataInput,
  NodeEntryUpsertWithWhereUniqueWithoutSessionInput: NodeEntryUpsertWithWhereUniqueWithoutSessionInput,
  NodeEntryScalarWhereInput: NodeEntryScalarWhereInput,
  NodeEntryUpdateManyWithWhereNestedInput: NodeEntryUpdateManyWithWhereNestedInput,
  NodeEntryUpdateManyDataInput: NodeEntryUpdateManyDataInput,
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
  NodeEntrySubscriptionWhereInput: NodeEntrySubscriptionWhereInput,
  NodeEntrySubscriptionPayload: ResolverTypeWrapper<NodeEntrySubscriptionPayload>,
  NodeEntryPreviousValues: ResolverTypeWrapper<NodeEntryPreviousValues>,
  NodeEntryValueSubscriptionWhereInput: NodeEntryValueSubscriptionWhereInput,
  NodeEntryValueSubscriptionPayload: ResolverTypeWrapper<NodeEntryValueSubscriptionPayload>,
  NodeEntryValuePreviousValues: ResolverTypeWrapper<NodeEntryValuePreviousValues>,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: ResolverTypeWrapper<QuestionConditionSubscriptionPayload>,
  QuestionConditionPreviousValues: ResolverTypeWrapper<QuestionConditionPreviousValues>,
  QuestionNodeSubscriptionWhereInput: QuestionNodeSubscriptionWhereInput,
  QuestionNodeSubscriptionPayload: ResolverTypeWrapper<QuestionNodeSubscriptionPayload>,
  QuestionNodePreviousValues: ResolverTypeWrapper<QuestionNodePreviousValues>,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: ResolverTypeWrapper<QuestionOptionSubscriptionPayload>,
  QuestionOptionPreviousValues: ResolverTypeWrapper<QuestionOptionPreviousValues>,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: ResolverTypeWrapper<QuestionnaireSubscriptionPayload>,
  QuestionnairePreviousValues: ResolverTypeWrapper<QuestionnairePreviousValues>,
  SessionSubscriptionWhereInput: SessionSubscriptionWhereInput,
  SessionSubscriptionPayload: ResolverTypeWrapper<SessionSubscriptionPayload>,
  SessionPreviousValues: ResolverTypeWrapper<SessionPreviousValues>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  ColourSettingsWhereUniqueInput: ColourSettingsWhereUniqueInput,
  ID: Scalars['ID'],
  ColourSettings: ColourSettings,
  String: Scalars['String'],
  ColourSettingsWhereInput: ColourSettingsWhereInput,
  ColourSettingsOrderByInput: ColourSettingsOrderByInput,
  Int: Scalars['Int'],
  ColourSettingsConnection: ColourSettingsConnection,
  PageInfo: PageInfo,
  Boolean: Scalars['Boolean'],
  ColourSettingsEdge: ColourSettingsEdge,
  AggregateColourSettings: AggregateColourSettings,
  CustomerWhereUniqueInput: CustomerWhereUniqueInput,
  Customer: Customer,
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  DateTime: Scalars['DateTime'],
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  NodeType: NodeType,
  LeafNodeWhereInput: LeafNodeWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  EdgeWhereInput: EdgeWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  Questionnaire: Questionnaire,
  QuestionNode: QuestionNode,
  LeafNode: LeafNode,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: QuestionOption,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  EdgeOrderByInput: EdgeOrderByInput,
  Edge: Edge,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: QuestionCondition,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  CustomerSettings: CustomerSettings,
  FontSettings: FontSettings,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: CustomerConnection,
  CustomerEdge: CustomerEdge,
  AggregateCustomer: AggregateCustomer,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: CustomerSettingsConnection,
  CustomerSettingsEdge: CustomerSettingsEdge,
  AggregateCustomerSettings: AggregateCustomerSettings,
  EdgeWhereUniqueInput: EdgeWhereUniqueInput,
  EdgeConnection: EdgeConnection,
  EdgeEdge: EdgeEdge,
  AggregateEdge: AggregateEdge,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: FontSettingsConnection,
  FontSettingsEdge: FontSettingsEdge,
  AggregateFontSettings: AggregateFontSettings,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNodeConnection: LeafNodeConnection,
  LeafNodeEdge: LeafNodeEdge,
  AggregateLeafNode: AggregateLeafNode,
  NodeEntryWhereUniqueInput: NodeEntryWhereUniqueInput,
  NodeEntry: NodeEntry,
  Session: Session,
  NodeEntryWhereInput: NodeEntryWhereInput,
  SessionWhereInput: SessionWhereInput,
  NodeEntryValueWhereInput: NodeEntryValueWhereInput,
  NodeEntryOrderByInput: NodeEntryOrderByInput,
  NodeEntryValueOrderByInput: NodeEntryValueOrderByInput,
  NodeEntryValue: NodeEntryValue,
  NodeEntryConnection: NodeEntryConnection,
  NodeEntryEdge: NodeEntryEdge,
  AggregateNodeEntry: AggregateNodeEntry,
  NodeEntryValueWhereUniqueInput: NodeEntryValueWhereUniqueInput,
  NodeEntryValueConnection: NodeEntryValueConnection,
  NodeEntryValueEdge: NodeEntryValueEdge,
  AggregateNodeEntryValue: AggregateNodeEntryValue,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: QuestionConditionConnection,
  QuestionConditionEdge: QuestionConditionEdge,
  AggregateQuestionCondition: AggregateQuestionCondition,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNodeConnection: QuestionNodeConnection,
  QuestionNodeEdge: QuestionNodeEdge,
  AggregateQuestionNode: AggregateQuestionNode,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: QuestionOptionConnection,
  QuestionOptionEdge: QuestionOptionEdge,
  AggregateQuestionOption: AggregateQuestionOption,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: QuestionnaireConnection,
  QuestionnaireEdge: QuestionnaireEdge,
  AggregateQuestionnaire: AggregateQuestionnaire,
  SessionWhereUniqueInput: SessionWhereUniqueInput,
  SessionOrderByInput: SessionOrderByInput,
  SessionConnection: SessionConnection,
  SessionEdge: SessionEdge,
  AggregateSession: AggregateSession,
  Node: Node,
  Mutation: {},
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: BatchPayload,
  Long: Scalars['Long'],
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyWithoutCustomerInput: QuestionnaireCreateManyWithoutCustomerInput,
  QuestionnaireCreateWithoutCustomerInput: QuestionnaireCreateWithoutCustomerInput,
  QuestionNodeCreateOneInput: QuestionNodeCreateOneInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  QuestionnaireCreateOneWithoutQuestionsInput: QuestionnaireCreateOneWithoutQuestionsInput,
  QuestionnaireCreateWithoutQuestionsInput: QuestionnaireCreateWithoutQuestionsInput,
  CustomerCreateOneWithoutQuestionnairesInput: CustomerCreateOneWithoutQuestionnairesInput,
  CustomerCreateWithoutQuestionnairesInput: CustomerCreateWithoutQuestionnairesInput,
  CustomerSettingsCreateOneInput: CustomerSettingsCreateOneInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  LeafNodeCreateManyInput: LeafNodeCreateManyInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  LeafNodeCreateOneInput: LeafNodeCreateOneInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  EdgeCreateManyInput: EdgeCreateManyInput,
  EdgeCreateInput: EdgeCreateInput,
  QuestionnaireCreateOneInput: QuestionnaireCreateOneInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  QuestionNodeCreateManyWithoutQuestionnaireInput: QuestionNodeCreateManyWithoutQuestionnaireInput,
  QuestionNodeCreateWithoutQuestionnaireInput: QuestionNodeCreateWithoutQuestionnaireInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyWithoutCustomerInput: QuestionnaireUpdateManyWithoutCustomerInput,
  QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput: QuestionnaireUpdateWithWhereUniqueWithoutCustomerInput,
  QuestionnaireUpdateWithoutCustomerDataInput: QuestionnaireUpdateWithoutCustomerDataInput,
  QuestionNodeUpdateOneInput: QuestionNodeUpdateOneInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  QuestionnaireUpdateOneWithoutQuestionsInput: QuestionnaireUpdateOneWithoutQuestionsInput,
  QuestionnaireUpdateWithoutQuestionsDataInput: QuestionnaireUpdateWithoutQuestionsDataInput,
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
  LeafNodeUpdateManyInput: LeafNodeUpdateManyInput,
  LeafNodeUpdateWithWhereUniqueNestedInput: LeafNodeUpdateWithWhereUniqueNestedInput,
  LeafNodeUpdateDataInput: LeafNodeUpdateDataInput,
  LeafNodeUpsertWithWhereUniqueNestedInput: LeafNodeUpsertWithWhereUniqueNestedInput,
  LeafNodeScalarWhereInput: LeafNodeScalarWhereInput,
  LeafNodeUpdateManyWithWhereNestedInput: LeafNodeUpdateManyWithWhereNestedInput,
  LeafNodeUpdateManyDataInput: LeafNodeUpdateManyDataInput,
  QuestionnaireUpsertWithoutQuestionsInput: QuestionnaireUpsertWithoutQuestionsInput,
  LeafNodeUpdateOneInput: LeafNodeUpdateOneInput,
  LeafNodeUpsertNestedInput: LeafNodeUpsertNestedInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  EdgeUpdateManyInput: EdgeUpdateManyInput,
  EdgeUpdateWithWhereUniqueNestedInput: EdgeUpdateWithWhereUniqueNestedInput,
  EdgeUpdateDataInput: EdgeUpdateDataInput,
  QuestionnaireUpdateOneInput: QuestionnaireUpdateOneInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  QuestionNodeUpdateManyWithoutQuestionnaireInput: QuestionNodeUpdateManyWithoutQuestionnaireInput,
  QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpdateWithWhereUniqueWithoutQuestionnaireInput,
  QuestionNodeUpdateWithoutQuestionnaireDataInput: QuestionNodeUpdateWithoutQuestionnaireDataInput,
  QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput: QuestionNodeUpsertWithWhereUniqueWithoutQuestionnaireInput,
  QuestionnaireUpsertNestedInput: QuestionnaireUpsertNestedInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  EdgeUpsertWithWhereUniqueNestedInput: EdgeUpsertWithWhereUniqueNestedInput,
  EdgeScalarWhereInput: EdgeScalarWhereInput,
  QuestionNodeUpsertNestedInput: QuestionNodeUpsertNestedInput,
  QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput: QuestionnaireUpsertWithWhereUniqueWithoutCustomerInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  EdgeUpdateInput: EdgeUpdateInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  NodeEntryCreateInput: NodeEntryCreateInput,
  SessionCreateOneWithoutNodeEntriesInput: SessionCreateOneWithoutNodeEntriesInput,
  SessionCreateWithoutNodeEntriesInput: SessionCreateWithoutNodeEntriesInput,
  EdgeCreateOneInput: EdgeCreateOneInput,
  NodeEntryValueCreateManyInput: NodeEntryValueCreateManyInput,
  NodeEntryValueCreateInput: NodeEntryValueCreateInput,
  NodeEntryUpdateInput: NodeEntryUpdateInput,
  SessionUpdateOneRequiredWithoutNodeEntriesInput: SessionUpdateOneRequiredWithoutNodeEntriesInput,
  QuestionNodeUpdateOneRequiredInput: QuestionNodeUpdateOneRequiredInput,
  EdgeUpdateOneInput: EdgeUpdateOneInput,
  EdgeUpsertNestedInput: EdgeUpsertNestedInput,
  NodeEntryValueUpdateManyInput: NodeEntryValueUpdateManyInput,
  NodeEntryValueUpdateWithWhereUniqueNestedInput: NodeEntryValueUpdateWithWhereUniqueNestedInput,
  NodeEntryValueUpdateDataInput: NodeEntryValueUpdateDataInput,
  NodeEntryValueUpsertWithWhereUniqueNestedInput: NodeEntryValueUpsertWithWhereUniqueNestedInput,
  NodeEntryValueScalarWhereInput: NodeEntryValueScalarWhereInput,
  NodeEntryValueUpdateManyWithWhereNestedInput: NodeEntryValueUpdateManyWithWhereNestedInput,
  NodeEntryValueUpdateManyDataInput: NodeEntryValueUpdateManyDataInput,
  NodeEntryUpdateManyMutationInput: NodeEntryUpdateManyMutationInput,
  NodeEntryValueUpdateInput: NodeEntryValueUpdateInput,
  NodeEntryValueUpdateManyMutationInput: NodeEntryValueUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  SessionCreateInput: SessionCreateInput,
  NodeEntryCreateManyWithoutSessionInput: NodeEntryCreateManyWithoutSessionInput,
  NodeEntryCreateWithoutSessionInput: NodeEntryCreateWithoutSessionInput,
  SessionUpdateInput: SessionUpdateInput,
  NodeEntryUpdateManyWithoutSessionInput: NodeEntryUpdateManyWithoutSessionInput,
  NodeEntryUpdateWithWhereUniqueWithoutSessionInput: NodeEntryUpdateWithWhereUniqueWithoutSessionInput,
  NodeEntryUpdateWithoutSessionDataInput: NodeEntryUpdateWithoutSessionDataInput,
  NodeEntryUpsertWithWhereUniqueWithoutSessionInput: NodeEntryUpsertWithWhereUniqueWithoutSessionInput,
  NodeEntryScalarWhereInput: NodeEntryScalarWhereInput,
  NodeEntryUpdateManyWithWhereNestedInput: NodeEntryUpdateManyWithWhereNestedInput,
  NodeEntryUpdateManyDataInput: NodeEntryUpdateManyDataInput,
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
  NodeEntrySubscriptionWhereInput: NodeEntrySubscriptionWhereInput,
  NodeEntrySubscriptionPayload: NodeEntrySubscriptionPayload,
  NodeEntryPreviousValues: NodeEntryPreviousValues,
  NodeEntryValueSubscriptionWhereInput: NodeEntryValueSubscriptionWhereInput,
  NodeEntryValueSubscriptionPayload: NodeEntryValueSubscriptionPayload,
  NodeEntryValuePreviousValues: NodeEntryValuePreviousValues,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: QuestionConditionSubscriptionPayload,
  QuestionConditionPreviousValues: QuestionConditionPreviousValues,
  QuestionNodeSubscriptionWhereInput: QuestionNodeSubscriptionWhereInput,
  QuestionNodeSubscriptionPayload: QuestionNodeSubscriptionPayload,
  QuestionNodePreviousValues: QuestionNodePreviousValues,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: QuestionOptionSubscriptionPayload,
  QuestionOptionPreviousValues: QuestionOptionPreviousValues,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: QuestionnaireSubscriptionPayload,
  QuestionnairePreviousValues: QuestionnairePreviousValues,
  SessionSubscriptionWhereInput: SessionSubscriptionWhereInput,
  SessionSubscriptionPayload: SessionSubscriptionPayload,
  SessionPreviousValues: SessionPreviousValues,
}>;

export type AggregateColourSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateColourSettings'] = ResolversParentTypes['AggregateColourSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateCustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateCustomer'] = ResolversParentTypes['AggregateCustomer']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateCustomerSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateCustomerSettings'] = ResolversParentTypes['AggregateCustomerSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateEdge'] = ResolversParentTypes['AggregateEdge']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateFontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateFontSettings'] = ResolversParentTypes['AggregateFontSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateLeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateLeafNode'] = ResolversParentTypes['AggregateLeafNode']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateNodeEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateNodeEntry'] = ResolversParentTypes['AggregateNodeEntry']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateNodeEntryValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateNodeEntryValue'] = ResolversParentTypes['AggregateNodeEntryValue']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateQuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionCondition'] = ResolversParentTypes['AggregateQuestionCondition']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateQuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionnaire'] = ResolversParentTypes['AggregateQuestionnaire']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateQuestionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionNode'] = ResolversParentTypes['AggregateQuestionNode']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionOption'] = ResolversParentTypes['AggregateQuestionOption']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type AggregateSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateSession'] = ResolversParentTypes['AggregateSession']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type BatchPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['BatchPayload'] = ResolversParentTypes['BatchPayload']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Long'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ColourSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettings'] = ResolversParentTypes['ColourSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  primaryAlt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  secondary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tertiary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  warning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lightest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  light?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  normal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  darkest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  muted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ColourSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsConnection'] = ResolversParentTypes['ColourSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['ColourSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateColourSettings'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ColourSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsEdge'] = ResolversParentTypes['ColourSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ColourSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsPreviousValues'] = ResolversParentTypes['ColourSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  primaryAlt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  secondary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tertiary?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  success?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  warning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lightest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  light?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  normal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  dark?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  darkest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  muted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ColourSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsSubscriptionPayload'] = ResolversParentTypes['ColourSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['ColourSettingsPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  questionnaires?: Resolver<Maybe<Array<ResolversTypes['Questionnaire']>>, ParentType, ContextType, RequireFields<CustomerQuestionnairesArgs, never>>,
  settings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateCustomer'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerEdge'] = ResolversParentTypes['CustomerEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerPreviousValues'] = ResolversParentTypes['CustomerPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettings'] = ResolversParentTypes['CustomerSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  colourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType>,
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsConnection'] = ResolversParentTypes['CustomerSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateCustomerSettings'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsEdge'] = ResolversParentTypes['CustomerSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsPreviousValues'] = ResolversParentTypes['CustomerSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsSubscriptionPayload'] = ResolversParentTypes['CustomerSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerSettingsPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type CustomerSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSubscriptionPayload'] = ResolversParentTypes['CustomerSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type EdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  conditions?: Resolver<Maybe<Array<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, RequireFields<EdgeConditionsArgs, never>>,
  parentNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  childNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type EdgeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeConnection'] = ResolversParentTypes['EdgeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['EdgeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateEdge'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type EdgeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeEdge'] = ResolversParentTypes['EdgeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type EdgePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgePreviousValues'] = ResolversParentTypes['EdgePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type EdgeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EdgeSubscriptionPayload'] = ResolversParentTypes['EdgeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['EdgePreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettings'] = ResolversParentTypes['FontSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FontSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsConnection'] = ResolversParentTypes['FontSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['FontSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateFontSettings'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FontSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsEdge'] = ResolversParentTypes['FontSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FontSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsPreviousValues'] = ResolversParentTypes['FontSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type FontSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsSubscriptionPayload'] = ResolversParentTypes['FontSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['FontSettingsPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNode'] = ResolversParentTypes['LeafNode']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LeafNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeConnection'] = ResolversParentTypes['LeafNodeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['LeafNodeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateLeafNode'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LeafNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeEdge'] = ResolversParentTypes['LeafNodeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LeafNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodePreviousValues'] = ResolversParentTypes['LeafNodePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LeafNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeSubscriptionPayload'] = ResolversParentTypes['LeafNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['LeafNodePreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createColourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType, RequireFields<MutationCreateColourSettingsArgs, 'data'>>,
  updateColourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<MutationUpdateColourSettingsArgs, 'data' | 'where'>>,
  updateManyColourSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyColourSettingsesArgs, 'data'>>,
  upsertColourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType, RequireFields<MutationUpsertColourSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteColourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<MutationDeleteColourSettingsArgs, 'where'>>,
  deleteManyColourSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyColourSettingsesArgs, never>>,
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'data'>>,
  updateCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'data' | 'where'>>,
  updateManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomersArgs, 'data'>>,
  upsertCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpsertCustomerArgs, 'where' | 'create' | 'update'>>,
  deleteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'where'>>,
  deleteManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyCustomersArgs, never>>,
  createCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationCreateCustomerSettingsArgs, 'data'>>,
  updateCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerSettingsArgs, 'data' | 'where'>>,
  updateManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomerSettingsesArgs, 'data'>>,
  upsertCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationUpsertCustomerSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerSettingsArgs, 'where'>>,
  deleteManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyCustomerSettingsesArgs, never>>,
  createEdge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType, RequireFields<MutationCreateEdgeArgs, 'data'>>,
  updateEdge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<MutationUpdateEdgeArgs, 'data' | 'where'>>,
  upsertEdge?: Resolver<ResolversTypes['Edge'], ParentType, ContextType, RequireFields<MutationUpsertEdgeArgs, 'where' | 'create' | 'update'>>,
  deleteEdge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<MutationDeleteEdgeArgs, 'where'>>,
  deleteManyEdges?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyEdgesArgs, never>>,
  createFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationCreateFontSettingsArgs, 'data'>>,
  updateFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationUpdateFontSettingsArgs, 'data' | 'where'>>,
  updateManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyFontSettingsesArgs, 'data'>>,
  upsertFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationUpsertFontSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationDeleteFontSettingsArgs, 'where'>>,
  deleteManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyFontSettingsesArgs, never>>,
  createLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationCreateLeafNodeArgs, 'data'>>,
  updateLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationUpdateLeafNodeArgs, 'data' | 'where'>>,
  updateManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyLeafNodesArgs, 'data'>>,
  upsertLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationUpsertLeafNodeArgs, 'where' | 'create' | 'update'>>,
  deleteLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationDeleteLeafNodeArgs, 'where'>>,
  deleteManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyLeafNodesArgs, never>>,
  createNodeEntry?: Resolver<ResolversTypes['NodeEntry'], ParentType, ContextType, RequireFields<MutationCreateNodeEntryArgs, 'data'>>,
  updateNodeEntry?: Resolver<Maybe<ResolversTypes['NodeEntry']>, ParentType, ContextType, RequireFields<MutationUpdateNodeEntryArgs, 'data' | 'where'>>,
  updateManyNodeEntries?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyNodeEntriesArgs, 'data'>>,
  upsertNodeEntry?: Resolver<ResolversTypes['NodeEntry'], ParentType, ContextType, RequireFields<MutationUpsertNodeEntryArgs, 'where' | 'create' | 'update'>>,
  deleteNodeEntry?: Resolver<Maybe<ResolversTypes['NodeEntry']>, ParentType, ContextType, RequireFields<MutationDeleteNodeEntryArgs, 'where'>>,
  deleteManyNodeEntries?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyNodeEntriesArgs, never>>,
  createNodeEntryValue?: Resolver<ResolversTypes['NodeEntryValue'], ParentType, ContextType, RequireFields<MutationCreateNodeEntryValueArgs, 'data'>>,
  updateNodeEntryValue?: Resolver<Maybe<ResolversTypes['NodeEntryValue']>, ParentType, ContextType, RequireFields<MutationUpdateNodeEntryValueArgs, 'data' | 'where'>>,
  updateManyNodeEntryValues?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyNodeEntryValuesArgs, 'data'>>,
  upsertNodeEntryValue?: Resolver<ResolversTypes['NodeEntryValue'], ParentType, ContextType, RequireFields<MutationUpsertNodeEntryValueArgs, 'where' | 'create' | 'update'>>,
  deleteNodeEntryValue?: Resolver<Maybe<ResolversTypes['NodeEntryValue']>, ParentType, ContextType, RequireFields<MutationDeleteNodeEntryValueArgs, 'where'>>,
  deleteManyNodeEntryValues?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyNodeEntryValuesArgs, never>>,
  createQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationCreateQuestionConditionArgs, 'data'>>,
  updateQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionConditionArgs, 'data' | 'where'>>,
  updateManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionConditionsArgs, 'data'>>,
  upsertQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationUpsertQuestionConditionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionConditionArgs, 'where'>>,
  deleteManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyQuestionConditionsArgs, never>>,
  createQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationCreateQuestionNodeArgs, 'data'>>,
  updateQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionNodeArgs, 'data' | 'where'>>,
  updateManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionNodesArgs, 'data'>>,
  upsertQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationUpsertQuestionNodeArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionNodeArgs, 'where'>>,
  deleteManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyQuestionNodesArgs, never>>,
  createQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationCreateQuestionOptionArgs, 'data'>>,
  updateQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionOptionArgs, 'data' | 'where'>>,
  updateManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionOptionsArgs, 'data'>>,
  upsertQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationUpsertQuestionOptionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionOptionArgs, 'where'>>,
  deleteManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyQuestionOptionsArgs, never>>,
  createQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationCreateQuestionnaireArgs, 'data'>>,
  updateQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionnaireArgs, 'data' | 'where'>>,
  updateManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionnairesArgs, 'data'>>,
  upsertQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationUpsertQuestionnaireArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionnaireArgs, 'where'>>,
  deleteManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManyQuestionnairesArgs, never>>,
  createSession?: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationCreateSessionArgs, 'data'>>,
  updateSession?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<MutationUpdateSessionArgs, 'data' | 'where'>>,
  upsertSession?: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationUpsertSessionArgs, 'where' | 'create' | 'update'>>,
  deleteSession?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<MutationDeleteSessionArgs, 'where'>>,
  deleteManySessions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationDeleteManySessionsArgs, never>>,
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type NodeEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntry'] = ResolversParentTypes['NodeEntry']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  session?: Resolver<ResolversTypes['Session'], ParentType, ContextType>,
  relatedNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType>,
  edgeChild?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType>,
  values?: Resolver<Maybe<Array<ResolversTypes['NodeEntryValue']>>, ParentType, ContextType, RequireFields<NodeEntryValuesArgs, never>>,
  depth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryConnection'] = ResolversParentTypes['NodeEntryConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['NodeEntryEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateNodeEntry'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryEdge'] = ResolversParentTypes['NodeEntryEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['NodeEntry'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryPreviousValues'] = ResolversParentTypes['NodeEntryPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  depth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntrySubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntrySubscriptionPayload'] = ResolversParentTypes['NodeEntrySubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['NodeEntry']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['NodeEntryPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryValue'] = ResolversParentTypes['NodeEntryValue']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  textValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  numberValue?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  multiValues?: Resolver<Maybe<Array<ResolversTypes['NodeEntryValue']>>, ParentType, ContextType, RequireFields<NodeEntryValueMultiValuesArgs, never>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryValueConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryValueConnection'] = ResolversParentTypes['NodeEntryValueConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['NodeEntryValueEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateNodeEntryValue'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryValueEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryValueEdge'] = ResolversParentTypes['NodeEntryValueEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['NodeEntryValue'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryValuePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryValuePreviousValues'] = ResolversParentTypes['NodeEntryValuePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  textValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  numberValue?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type NodeEntryValueSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeEntryValueSubscriptionPayload'] = ResolversParentTypes['NodeEntryValueSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['NodeEntryValue']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['NodeEntryValuePreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  colourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<QueryColourSettingsArgs, 'where'>>,
  colourSettingses?: Resolver<Array<Maybe<ResolversTypes['ColourSettings']>>, ParentType, ContextType, RequireFields<QueryColourSettingsesArgs, never>>,
  colourSettingsesConnection?: Resolver<ResolversTypes['ColourSettingsConnection'], ParentType, ContextType, RequireFields<QueryColourSettingsesConnectionArgs, never>>,
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'where'>>,
  customers?: Resolver<Array<Maybe<ResolversTypes['Customer']>>, ParentType, ContextType, RequireFields<QueryCustomersArgs, never>>,
  customersConnection?: Resolver<ResolversTypes['CustomerConnection'], ParentType, ContextType, RequireFields<QueryCustomersConnectionArgs, never>>,
  customerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<QueryCustomerSettingsArgs, 'where'>>,
  customerSettingses?: Resolver<Array<Maybe<ResolversTypes['CustomerSettings']>>, ParentType, ContextType, RequireFields<QueryCustomerSettingsesArgs, never>>,
  customerSettingsesConnection?: Resolver<ResolversTypes['CustomerSettingsConnection'], ParentType, ContextType, RequireFields<QueryCustomerSettingsesConnectionArgs, never>>,
  edge?: Resolver<Maybe<ResolversTypes['Edge']>, ParentType, ContextType, RequireFields<QueryEdgeArgs, 'where'>>,
  edges?: Resolver<Array<Maybe<ResolversTypes['Edge']>>, ParentType, ContextType, RequireFields<QueryEdgesArgs, never>>,
  edgesConnection?: Resolver<ResolversTypes['EdgeConnection'], ParentType, ContextType, RequireFields<QueryEdgesConnectionArgs, never>>,
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<QueryFontSettingsArgs, 'where'>>,
  fontSettingses?: Resolver<Array<Maybe<ResolversTypes['FontSettings']>>, ParentType, ContextType, RequireFields<QueryFontSettingsesArgs, never>>,
  fontSettingsesConnection?: Resolver<ResolversTypes['FontSettingsConnection'], ParentType, ContextType, RequireFields<QueryFontSettingsesConnectionArgs, never>>,
  leafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<QueryLeafNodeArgs, 'where'>>,
  leafNodes?: Resolver<Array<Maybe<ResolversTypes['LeafNode']>>, ParentType, ContextType, RequireFields<QueryLeafNodesArgs, never>>,
  leafNodesConnection?: Resolver<ResolversTypes['LeafNodeConnection'], ParentType, ContextType, RequireFields<QueryLeafNodesConnectionArgs, never>>,
  nodeEntry?: Resolver<Maybe<ResolversTypes['NodeEntry']>, ParentType, ContextType, RequireFields<QueryNodeEntryArgs, 'where'>>,
  nodeEntries?: Resolver<Array<Maybe<ResolversTypes['NodeEntry']>>, ParentType, ContextType, RequireFields<QueryNodeEntriesArgs, never>>,
  nodeEntriesConnection?: Resolver<ResolversTypes['NodeEntryConnection'], ParentType, ContextType, RequireFields<QueryNodeEntriesConnectionArgs, never>>,
  nodeEntryValue?: Resolver<Maybe<ResolversTypes['NodeEntryValue']>, ParentType, ContextType, RequireFields<QueryNodeEntryValueArgs, 'where'>>,
  nodeEntryValues?: Resolver<Array<Maybe<ResolversTypes['NodeEntryValue']>>, ParentType, ContextType, RequireFields<QueryNodeEntryValuesArgs, never>>,
  nodeEntryValuesConnection?: Resolver<ResolversTypes['NodeEntryValueConnection'], ParentType, ContextType, RequireFields<QueryNodeEntryValuesConnectionArgs, never>>,
  questionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<QueryQuestionConditionArgs, 'where'>>,
  questionConditions?: Resolver<Array<Maybe<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, RequireFields<QueryQuestionConditionsArgs, never>>,
  questionConditionsConnection?: Resolver<ResolversTypes['QuestionConditionConnection'], ParentType, ContextType, RequireFields<QueryQuestionConditionsConnectionArgs, never>>,
  questionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<QueryQuestionNodeArgs, 'where'>>,
  questionNodes?: Resolver<Array<Maybe<ResolversTypes['QuestionNode']>>, ParentType, ContextType, RequireFields<QueryQuestionNodesArgs, never>>,
  questionNodesConnection?: Resolver<ResolversTypes['QuestionNodeConnection'], ParentType, ContextType, RequireFields<QueryQuestionNodesConnectionArgs, never>>,
  questionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<QueryQuestionOptionArgs, 'where'>>,
  questionOptions?: Resolver<Array<Maybe<ResolversTypes['QuestionOption']>>, ParentType, ContextType, RequireFields<QueryQuestionOptionsArgs, never>>,
  questionOptionsConnection?: Resolver<ResolversTypes['QuestionOptionConnection'], ParentType, ContextType, RequireFields<QueryQuestionOptionsConnectionArgs, never>>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<QueryQuestionnaireArgs, 'where'>>,
  questionnaires?: Resolver<Array<Maybe<ResolversTypes['Questionnaire']>>, ParentType, ContextType, RequireFields<QueryQuestionnairesArgs, never>>,
  questionnairesConnection?: Resolver<ResolversTypes['QuestionnaireConnection'], ParentType, ContextType, RequireFields<QueryQuestionnairesConnectionArgs, never>>,
  session?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<QuerySessionArgs, 'where'>>,
  sessions?: Resolver<Array<Maybe<ResolversTypes['Session']>>, ParentType, ContextType, RequireFields<QuerySessionsArgs, never>>,
  sessionsConnection?: Resolver<ResolversTypes['SessionConnection'], ParentType, ContextType, RequireFields<QuerySessionsConnectionArgs, never>>,
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
}>;

export type QuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionCondition'] = ResolversParentTypes['QuestionCondition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionConditionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionConnection'] = ResolversParentTypes['QuestionConditionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionConditionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionCondition'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionConditionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionEdge'] = ResolversParentTypes['QuestionConditionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionConditionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionPreviousValues'] = ResolversParentTypes['QuestionConditionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionConditionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionSubscriptionPayload'] = ResolversParentTypes['QuestionConditionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionConditionPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['Questionnaire'] = ResolversParentTypes['Questionnaire']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  rootQuestion?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  questions?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, RequireFields<QuestionnaireQuestionsArgs, never>>,
  leafs?: Resolver<Maybe<Array<ResolversTypes['LeafNode']>>, ParentType, ContextType, RequireFields<QuestionnaireLeafsArgs, never>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionnaireConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireConnection'] = ResolversParentTypes['QuestionnaireConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionnaireEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionnaire'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionnaireEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireEdge'] = ResolversParentTypes['QuestionnaireEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionnairePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnairePreviousValues'] = ResolversParentTypes['QuestionnairePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionnaireSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSubscriptionPayload'] = ResolversParentTypes['QuestionnaireSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionnairePreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNode'] = ResolversParentTypes['QuestionNode']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isRoot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  questionType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  overrideLeaf?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType>,
  options?: Resolver<Maybe<Array<ResolversTypes['QuestionOption']>>, ParentType, ContextType, RequireFields<QuestionNodeOptionsArgs, never>>,
  children?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, RequireFields<QuestionNodeChildrenArgs, never>>,
  edgeChildren?: Resolver<Maybe<Array<ResolversTypes['Edge']>>, ParentType, ContextType, RequireFields<QuestionNodeEdgeChildrenArgs, never>>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeConnection'] = ResolversParentTypes['QuestionNodeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionNodeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionNode'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeEdge'] = ResolversParentTypes['QuestionNodeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodePreviousValues'] = ResolversParentTypes['QuestionNodePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isRoot?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  questionType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeSubscriptionPayload'] = ResolversParentTypes['QuestionNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionNodePreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOption'] = ResolversParentTypes['QuestionOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionOptionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionConnection'] = ResolversParentTypes['QuestionOptionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionOptionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionOption'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionOptionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionEdge'] = ResolversParentTypes['QuestionOptionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionOptionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionPreviousValues'] = ResolversParentTypes['QuestionOptionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QuestionOptionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionSubscriptionPayload'] = ResolversParentTypes['QuestionOptionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionOptionPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeEntries?: Resolver<Maybe<Array<ResolversTypes['NodeEntry']>>, ParentType, ContextType, RequireFields<SessionNodeEntriesArgs, never>>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SessionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionConnection'] = ResolversParentTypes['SessionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['SessionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateSession'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SessionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionEdge'] = ResolversParentTypes['SessionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Session'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SessionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionPreviousValues'] = ResolversParentTypes['SessionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SessionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionSubscriptionPayload'] = ResolversParentTypes['SessionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['SessionPreviousValues']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  colourSettings?: SubscriptionResolver<Maybe<ResolversTypes['ColourSettingsSubscriptionPayload']>, "colourSettings", ParentType, ContextType, RequireFields<SubscriptionColourSettingsArgs, never>>,
  customer?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSubscriptionPayload']>, "customer", ParentType, ContextType, RequireFields<SubscriptionCustomerArgs, never>>,
  customerSettings?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSettingsSubscriptionPayload']>, "customerSettings", ParentType, ContextType, RequireFields<SubscriptionCustomerSettingsArgs, never>>,
  edge?: SubscriptionResolver<Maybe<ResolversTypes['EdgeSubscriptionPayload']>, "edge", ParentType, ContextType, RequireFields<SubscriptionEdgeArgs, never>>,
  fontSettings?: SubscriptionResolver<Maybe<ResolversTypes['FontSettingsSubscriptionPayload']>, "fontSettings", ParentType, ContextType, RequireFields<SubscriptionFontSettingsArgs, never>>,
  leafNode?: SubscriptionResolver<Maybe<ResolversTypes['LeafNodeSubscriptionPayload']>, "leafNode", ParentType, ContextType, RequireFields<SubscriptionLeafNodeArgs, never>>,
  nodeEntry?: SubscriptionResolver<Maybe<ResolversTypes['NodeEntrySubscriptionPayload']>, "nodeEntry", ParentType, ContextType, RequireFields<SubscriptionNodeEntryArgs, never>>,
  nodeEntryValue?: SubscriptionResolver<Maybe<ResolversTypes['NodeEntryValueSubscriptionPayload']>, "nodeEntryValue", ParentType, ContextType, RequireFields<SubscriptionNodeEntryValueArgs, never>>,
  questionCondition?: SubscriptionResolver<Maybe<ResolversTypes['QuestionConditionSubscriptionPayload']>, "questionCondition", ParentType, ContextType, RequireFields<SubscriptionQuestionConditionArgs, never>>,
  questionNode?: SubscriptionResolver<Maybe<ResolversTypes['QuestionNodeSubscriptionPayload']>, "questionNode", ParentType, ContextType, RequireFields<SubscriptionQuestionNodeArgs, never>>,
  questionOption?: SubscriptionResolver<Maybe<ResolversTypes['QuestionOptionSubscriptionPayload']>, "questionOption", ParentType, ContextType, RequireFields<SubscriptionQuestionOptionArgs, never>>,
  questionnaire?: SubscriptionResolver<Maybe<ResolversTypes['QuestionnaireSubscriptionPayload']>, "questionnaire", ParentType, ContextType, RequireFields<SubscriptionQuestionnaireArgs, never>>,
  session?: SubscriptionResolver<Maybe<ResolversTypes['SessionSubscriptionPayload']>, "session", ParentType, ContextType, RequireFields<SubscriptionSessionArgs, never>>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AggregateColourSettings?: AggregateColourSettingsResolvers<ContextType>,
  AggregateCustomer?: AggregateCustomerResolvers<ContextType>,
  AggregateCustomerSettings?: AggregateCustomerSettingsResolvers<ContextType>,
  AggregateEdge?: AggregateEdgeResolvers<ContextType>,
  AggregateFontSettings?: AggregateFontSettingsResolvers<ContextType>,
  AggregateLeafNode?: AggregateLeafNodeResolvers<ContextType>,
  AggregateNodeEntry?: AggregateNodeEntryResolvers<ContextType>,
  AggregateNodeEntryValue?: AggregateNodeEntryValueResolvers<ContextType>,
  AggregateQuestionCondition?: AggregateQuestionConditionResolvers<ContextType>,
  AggregateQuestionnaire?: AggregateQuestionnaireResolvers<ContextType>,
  AggregateQuestionNode?: AggregateQuestionNodeResolvers<ContextType>,
  AggregateQuestionOption?: AggregateQuestionOptionResolvers<ContextType>,
  AggregateSession?: AggregateSessionResolvers<ContextType>,
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
  NodeEntry?: NodeEntryResolvers<ContextType>,
  NodeEntryConnection?: NodeEntryConnectionResolvers<ContextType>,
  NodeEntryEdge?: NodeEntryEdgeResolvers<ContextType>,
  NodeEntryPreviousValues?: NodeEntryPreviousValuesResolvers<ContextType>,
  NodeEntrySubscriptionPayload?: NodeEntrySubscriptionPayloadResolvers<ContextType>,
  NodeEntryValue?: NodeEntryValueResolvers<ContextType>,
  NodeEntryValueConnection?: NodeEntryValueConnectionResolvers<ContextType>,
  NodeEntryValueEdge?: NodeEntryValueEdgeResolvers<ContextType>,
  NodeEntryValuePreviousValues?: NodeEntryValuePreviousValuesResolvers<ContextType>,
  NodeEntryValueSubscriptionPayload?: NodeEntryValueSubscriptionPayloadResolvers<ContextType>,
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
  Session?: SessionResolvers<ContextType>,
  SessionConnection?: SessionConnectionResolvers<ContextType>,
  SessionEdge?: SessionEdgeResolvers<ContextType>,
  SessionPreviousValues?: SessionPreviousValuesResolvers<ContextType>,
  SessionSubscriptionPayload?: SessionSubscriptionPayloadResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
