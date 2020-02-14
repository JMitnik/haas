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

export type AggregateFontSettings = {
   __typename?: 'AggregateFontSettings',
  count: Scalars['Int'],
};

export type AggregateLeafNode = {
   __typename?: 'AggregateLeafNode',
  count: Scalars['Int'],
};

export type AggregateNodeType = {
   __typename?: 'AggregateNodeType',
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
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary: Scalars['String'],
  tertiary: Scalars['String'],
  success: Scalars['String'],
  warning: Scalars['String'],
  error: Scalars['String'],
  lightest: Scalars['String'],
  light: Scalars['String'],
  normal: Scalars['String'],
  dark: Scalars['String'],
  darkest: Scalars['String'],
  muted: Scalars['String'],
  text: Scalars['String'],
};

export type ColourSettingsConnection = {
   __typename?: 'ColourSettingsConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<ColourSettingsEdge>>,
  aggregate: AggregateColourSettings,
};

export type ColourSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary: Scalars['String'],
  tertiary: Scalars['String'],
  success: Scalars['String'],
  warning: Scalars['String'],
  error: Scalars['String'],
  lightest: Scalars['String'],
  light: Scalars['String'],
  normal: Scalars['String'],
  dark: Scalars['String'],
  darkest: Scalars['String'],
  muted: Scalars['String'],
  text: Scalars['String'],
};

export type ColourSettingsCreateOneInput = {
  create?: Maybe<ColourSettingsCreateInput>,
  connect?: Maybe<ColourSettingsWhereUniqueInput>,
};

export type ColourSettingsEdge = {
   __typename?: 'ColourSettingsEdge',
  node: ColourSettings,
  cursor: Scalars['String'],
};

export enum ColourSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  PrimaryAsc = 'primary_ASC',
  PrimaryDesc = 'primary_DESC',
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
   __typename?: 'ColourSettingsPreviousValues',
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  primary: Scalars['String'],
  secondary: Scalars['String'],
  tertiary: Scalars['String'],
  success: Scalars['String'],
  warning: Scalars['String'],
  error: Scalars['String'],
  lightest: Scalars['String'],
  light: Scalars['String'],
  normal: Scalars['String'],
  dark: Scalars['String'],
  darkest: Scalars['String'],
  muted: Scalars['String'],
  text: Scalars['String'],
};

export type ColourSettingsSubscriptionPayload = {
   __typename?: 'ColourSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<ColourSettings>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<ColourSettingsPreviousValues>,
};

export type ColourSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<ColourSettingsWhereInput>,
  AND?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
  NOT?: Maybe<Array<ColourSettingsSubscriptionWhereInput>>,
};

export type ColourSettingsUpdateDataInput = {
  title?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateInput = {
  title?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>,
  primary?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  dark?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
};

export type ColourSettingsUpdateOneRequiredInput = {
  create?: Maybe<ColourSettingsCreateInput>,
  update?: Maybe<ColourSettingsUpdateDataInput>,
  upsert?: Maybe<ColourSettingsUpsertNestedInput>,
  connect?: Maybe<ColourSettingsWhereUniqueInput>,
};

export type ColourSettingsUpsertNestedInput = {
  update: ColourSettingsUpdateDataInput,
  create: ColourSettingsCreateInput,
};

export type ColourSettingsWhereInput = {
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
  primary?: Maybe<Scalars['String']>,
  primary_not?: Maybe<Scalars['String']>,
  primary_in?: Maybe<Array<Scalars['String']>>,
  primary_not_in?: Maybe<Array<Scalars['String']>>,
  primary_lt?: Maybe<Scalars['String']>,
  primary_lte?: Maybe<Scalars['String']>,
  primary_gt?: Maybe<Scalars['String']>,
  primary_gte?: Maybe<Scalars['String']>,
  primary_contains?: Maybe<Scalars['String']>,
  primary_not_contains?: Maybe<Scalars['String']>,
  primary_starts_with?: Maybe<Scalars['String']>,
  primary_not_starts_with?: Maybe<Scalars['String']>,
  primary_ends_with?: Maybe<Scalars['String']>,
  primary_not_ends_with?: Maybe<Scalars['String']>,
  secondary?: Maybe<Scalars['String']>,
  secondary_not?: Maybe<Scalars['String']>,
  secondary_in?: Maybe<Array<Scalars['String']>>,
  secondary_not_in?: Maybe<Array<Scalars['String']>>,
  secondary_lt?: Maybe<Scalars['String']>,
  secondary_lte?: Maybe<Scalars['String']>,
  secondary_gt?: Maybe<Scalars['String']>,
  secondary_gte?: Maybe<Scalars['String']>,
  secondary_contains?: Maybe<Scalars['String']>,
  secondary_not_contains?: Maybe<Scalars['String']>,
  secondary_starts_with?: Maybe<Scalars['String']>,
  secondary_not_starts_with?: Maybe<Scalars['String']>,
  secondary_ends_with?: Maybe<Scalars['String']>,
  secondary_not_ends_with?: Maybe<Scalars['String']>,
  tertiary?: Maybe<Scalars['String']>,
  tertiary_not?: Maybe<Scalars['String']>,
  tertiary_in?: Maybe<Array<Scalars['String']>>,
  tertiary_not_in?: Maybe<Array<Scalars['String']>>,
  tertiary_lt?: Maybe<Scalars['String']>,
  tertiary_lte?: Maybe<Scalars['String']>,
  tertiary_gt?: Maybe<Scalars['String']>,
  tertiary_gte?: Maybe<Scalars['String']>,
  tertiary_contains?: Maybe<Scalars['String']>,
  tertiary_not_contains?: Maybe<Scalars['String']>,
  tertiary_starts_with?: Maybe<Scalars['String']>,
  tertiary_not_starts_with?: Maybe<Scalars['String']>,
  tertiary_ends_with?: Maybe<Scalars['String']>,
  tertiary_not_ends_with?: Maybe<Scalars['String']>,
  success?: Maybe<Scalars['String']>,
  success_not?: Maybe<Scalars['String']>,
  success_in?: Maybe<Array<Scalars['String']>>,
  success_not_in?: Maybe<Array<Scalars['String']>>,
  success_lt?: Maybe<Scalars['String']>,
  success_lte?: Maybe<Scalars['String']>,
  success_gt?: Maybe<Scalars['String']>,
  success_gte?: Maybe<Scalars['String']>,
  success_contains?: Maybe<Scalars['String']>,
  success_not_contains?: Maybe<Scalars['String']>,
  success_starts_with?: Maybe<Scalars['String']>,
  success_not_starts_with?: Maybe<Scalars['String']>,
  success_ends_with?: Maybe<Scalars['String']>,
  success_not_ends_with?: Maybe<Scalars['String']>,
  warning?: Maybe<Scalars['String']>,
  warning_not?: Maybe<Scalars['String']>,
  warning_in?: Maybe<Array<Scalars['String']>>,
  warning_not_in?: Maybe<Array<Scalars['String']>>,
  warning_lt?: Maybe<Scalars['String']>,
  warning_lte?: Maybe<Scalars['String']>,
  warning_gt?: Maybe<Scalars['String']>,
  warning_gte?: Maybe<Scalars['String']>,
  warning_contains?: Maybe<Scalars['String']>,
  warning_not_contains?: Maybe<Scalars['String']>,
  warning_starts_with?: Maybe<Scalars['String']>,
  warning_not_starts_with?: Maybe<Scalars['String']>,
  warning_ends_with?: Maybe<Scalars['String']>,
  warning_not_ends_with?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  error_not?: Maybe<Scalars['String']>,
  error_in?: Maybe<Array<Scalars['String']>>,
  error_not_in?: Maybe<Array<Scalars['String']>>,
  error_lt?: Maybe<Scalars['String']>,
  error_lte?: Maybe<Scalars['String']>,
  error_gt?: Maybe<Scalars['String']>,
  error_gte?: Maybe<Scalars['String']>,
  error_contains?: Maybe<Scalars['String']>,
  error_not_contains?: Maybe<Scalars['String']>,
  error_starts_with?: Maybe<Scalars['String']>,
  error_not_starts_with?: Maybe<Scalars['String']>,
  error_ends_with?: Maybe<Scalars['String']>,
  error_not_ends_with?: Maybe<Scalars['String']>,
  lightest?: Maybe<Scalars['String']>,
  lightest_not?: Maybe<Scalars['String']>,
  lightest_in?: Maybe<Array<Scalars['String']>>,
  lightest_not_in?: Maybe<Array<Scalars['String']>>,
  lightest_lt?: Maybe<Scalars['String']>,
  lightest_lte?: Maybe<Scalars['String']>,
  lightest_gt?: Maybe<Scalars['String']>,
  lightest_gte?: Maybe<Scalars['String']>,
  lightest_contains?: Maybe<Scalars['String']>,
  lightest_not_contains?: Maybe<Scalars['String']>,
  lightest_starts_with?: Maybe<Scalars['String']>,
  lightest_not_starts_with?: Maybe<Scalars['String']>,
  lightest_ends_with?: Maybe<Scalars['String']>,
  lightest_not_ends_with?: Maybe<Scalars['String']>,
  light?: Maybe<Scalars['String']>,
  light_not?: Maybe<Scalars['String']>,
  light_in?: Maybe<Array<Scalars['String']>>,
  light_not_in?: Maybe<Array<Scalars['String']>>,
  light_lt?: Maybe<Scalars['String']>,
  light_lte?: Maybe<Scalars['String']>,
  light_gt?: Maybe<Scalars['String']>,
  light_gte?: Maybe<Scalars['String']>,
  light_contains?: Maybe<Scalars['String']>,
  light_not_contains?: Maybe<Scalars['String']>,
  light_starts_with?: Maybe<Scalars['String']>,
  light_not_starts_with?: Maybe<Scalars['String']>,
  light_ends_with?: Maybe<Scalars['String']>,
  light_not_ends_with?: Maybe<Scalars['String']>,
  normal?: Maybe<Scalars['String']>,
  normal_not?: Maybe<Scalars['String']>,
  normal_in?: Maybe<Array<Scalars['String']>>,
  normal_not_in?: Maybe<Array<Scalars['String']>>,
  normal_lt?: Maybe<Scalars['String']>,
  normal_lte?: Maybe<Scalars['String']>,
  normal_gt?: Maybe<Scalars['String']>,
  normal_gte?: Maybe<Scalars['String']>,
  normal_contains?: Maybe<Scalars['String']>,
  normal_not_contains?: Maybe<Scalars['String']>,
  normal_starts_with?: Maybe<Scalars['String']>,
  normal_not_starts_with?: Maybe<Scalars['String']>,
  normal_ends_with?: Maybe<Scalars['String']>,
  normal_not_ends_with?: Maybe<Scalars['String']>,
  dark?: Maybe<Scalars['String']>,
  dark_not?: Maybe<Scalars['String']>,
  dark_in?: Maybe<Array<Scalars['String']>>,
  dark_not_in?: Maybe<Array<Scalars['String']>>,
  dark_lt?: Maybe<Scalars['String']>,
  dark_lte?: Maybe<Scalars['String']>,
  dark_gt?: Maybe<Scalars['String']>,
  dark_gte?: Maybe<Scalars['String']>,
  dark_contains?: Maybe<Scalars['String']>,
  dark_not_contains?: Maybe<Scalars['String']>,
  dark_starts_with?: Maybe<Scalars['String']>,
  dark_not_starts_with?: Maybe<Scalars['String']>,
  dark_ends_with?: Maybe<Scalars['String']>,
  dark_not_ends_with?: Maybe<Scalars['String']>,
  darkest?: Maybe<Scalars['String']>,
  darkest_not?: Maybe<Scalars['String']>,
  darkest_in?: Maybe<Array<Scalars['String']>>,
  darkest_not_in?: Maybe<Array<Scalars['String']>>,
  darkest_lt?: Maybe<Scalars['String']>,
  darkest_lte?: Maybe<Scalars['String']>,
  darkest_gt?: Maybe<Scalars['String']>,
  darkest_gte?: Maybe<Scalars['String']>,
  darkest_contains?: Maybe<Scalars['String']>,
  darkest_not_contains?: Maybe<Scalars['String']>,
  darkest_starts_with?: Maybe<Scalars['String']>,
  darkest_not_starts_with?: Maybe<Scalars['String']>,
  darkest_ends_with?: Maybe<Scalars['String']>,
  darkest_not_ends_with?: Maybe<Scalars['String']>,
  muted?: Maybe<Scalars['String']>,
  muted_not?: Maybe<Scalars['String']>,
  muted_in?: Maybe<Array<Scalars['String']>>,
  muted_not_in?: Maybe<Array<Scalars['String']>>,
  muted_lt?: Maybe<Scalars['String']>,
  muted_lte?: Maybe<Scalars['String']>,
  muted_gt?: Maybe<Scalars['String']>,
  muted_gte?: Maybe<Scalars['String']>,
  muted_contains?: Maybe<Scalars['String']>,
  muted_not_contains?: Maybe<Scalars['String']>,
  muted_starts_with?: Maybe<Scalars['String']>,
  muted_not_starts_with?: Maybe<Scalars['String']>,
  muted_ends_with?: Maybe<Scalars['String']>,
  muted_not_ends_with?: Maybe<Scalars['String']>,
  text?: Maybe<Scalars['String']>,
  text_not?: Maybe<Scalars['String']>,
  text_in?: Maybe<Array<Scalars['String']>>,
  text_not_in?: Maybe<Array<Scalars['String']>>,
  text_lt?: Maybe<Scalars['String']>,
  text_lte?: Maybe<Scalars['String']>,
  text_gt?: Maybe<Scalars['String']>,
  text_gte?: Maybe<Scalars['String']>,
  text_contains?: Maybe<Scalars['String']>,
  text_not_contains?: Maybe<Scalars['String']>,
  text_starts_with?: Maybe<Scalars['String']>,
  text_not_starts_with?: Maybe<Scalars['String']>,
  text_ends_with?: Maybe<Scalars['String']>,
  text_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<ColourSettingsWhereInput>>,
  OR?: Maybe<Array<ColourSettingsWhereInput>>,
  NOT?: Maybe<Array<ColourSettingsWhereInput>>,
};

export type ColourSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Customer = {
   __typename?: 'Customer',
  id: Scalars['ID'],
  name: Scalars['String'],
  settings?: Maybe<CustomerSettings>,
};

export type CustomerConnection = {
   __typename?: 'CustomerConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<CustomerEdge>>,
  aggregate: AggregateCustomer,
};

export type CustomerCreateInput = {
  id?: Maybe<Scalars['ID']>,
  name: Scalars['String'],
  settings?: Maybe<CustomerSettingsCreateOneWithoutCustomerInput>,
};

export type CustomerCreateOneInput = {
  create?: Maybe<CustomerCreateInput>,
  connect?: Maybe<CustomerWhereUniqueInput>,
};

export type CustomerCreateOneWithoutSettingsInput = {
  create?: Maybe<CustomerCreateWithoutSettingsInput>,
  connect?: Maybe<CustomerWhereUniqueInput>,
};

export type CustomerCreateWithoutSettingsInput = {
  id?: Maybe<Scalars['ID']>,
  name: Scalars['String'],
};

export type CustomerEdge = {
   __typename?: 'CustomerEdge',
  node: Customer,
  cursor: Scalars['String'],
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
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  customer: Customer,
  logo?: Maybe<Scalars['String']>,
  colourSettings: ColourSettings,
  fontSettings: FontSettings,
};

export type CustomerSettingsConnection = {
   __typename?: 'CustomerSettingsConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<CustomerSettingsEdge>>,
  aggregate: AggregateCustomerSettings,
};

export type CustomerSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  customer: CustomerCreateOneWithoutSettingsInput,
  logo?: Maybe<Scalars['String']>,
  colourSettings: ColourSettingsCreateOneInput,
  fontSettings: FontSettingsCreateOneInput,
};

export type CustomerSettingsCreateOneWithoutCustomerInput = {
  create?: Maybe<CustomerSettingsCreateWithoutCustomerInput>,
  connect?: Maybe<CustomerSettingsWhereUniqueInput>,
};

export type CustomerSettingsCreateWithoutCustomerInput = {
  id?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings: ColourSettingsCreateOneInput,
  fontSettings: FontSettingsCreateOneInput,
};

export type CustomerSettingsEdge = {
   __typename?: 'CustomerSettingsEdge',
  node: CustomerSettings,
  cursor: Scalars['String'],
};

export enum CustomerSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  LogoAsc = 'logo_ASC',
  LogoDesc = 'logo_DESC'
}

export type CustomerSettingsPreviousValues = {
   __typename?: 'CustomerSettingsPreviousValues',
  id: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
};

export type CustomerSettingsSubscriptionPayload = {
   __typename?: 'CustomerSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<CustomerSettings>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<CustomerSettingsPreviousValues>,
};

export type CustomerSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<CustomerSettingsWhereInput>,
  AND?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
  NOT?: Maybe<Array<CustomerSettingsSubscriptionWhereInput>>,
};

export type CustomerSettingsUpdateInput = {
  title?: Maybe<Scalars['String']>,
  customer?: Maybe<CustomerUpdateOneRequiredWithoutSettingsInput>,
  logo?: Maybe<Scalars['String']>,
  colourSettings?: Maybe<ColourSettingsUpdateOneRequiredInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneRequiredInput>,
};

export type CustomerSettingsUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
};

export type CustomerSettingsUpdateOneWithoutCustomerInput = {
  create?: Maybe<CustomerSettingsCreateWithoutCustomerInput>,
  update?: Maybe<CustomerSettingsUpdateWithoutCustomerDataInput>,
  upsert?: Maybe<CustomerSettingsUpsertWithoutCustomerInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  connect?: Maybe<CustomerSettingsWhereUniqueInput>,
};

export type CustomerSettingsUpdateWithoutCustomerDataInput = {
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings?: Maybe<ColourSettingsUpdateOneRequiredInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneRequiredInput>,
};

export type CustomerSettingsUpsertWithoutCustomerInput = {
  update: CustomerSettingsUpdateWithoutCustomerDataInput,
  create: CustomerSettingsCreateWithoutCustomerInput,
};

export type CustomerSettingsWhereInput = {
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
  customer?: Maybe<CustomerWhereInput>,
  logo?: Maybe<Scalars['String']>,
  logo_not?: Maybe<Scalars['String']>,
  logo_in?: Maybe<Array<Scalars['String']>>,
  logo_not_in?: Maybe<Array<Scalars['String']>>,
  logo_lt?: Maybe<Scalars['String']>,
  logo_lte?: Maybe<Scalars['String']>,
  logo_gt?: Maybe<Scalars['String']>,
  logo_gte?: Maybe<Scalars['String']>,
  logo_contains?: Maybe<Scalars['String']>,
  logo_not_contains?: Maybe<Scalars['String']>,
  logo_starts_with?: Maybe<Scalars['String']>,
  logo_not_starts_with?: Maybe<Scalars['String']>,
  logo_ends_with?: Maybe<Scalars['String']>,
  logo_not_ends_with?: Maybe<Scalars['String']>,
  colourSettings?: Maybe<ColourSettingsWhereInput>,
  fontSettings?: Maybe<FontSettingsWhereInput>,
  AND?: Maybe<Array<CustomerSettingsWhereInput>>,
  OR?: Maybe<Array<CustomerSettingsWhereInput>>,
  NOT?: Maybe<Array<CustomerSettingsWhereInput>>,
};

export type CustomerSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type CustomerSubscriptionPayload = {
   __typename?: 'CustomerSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Customer>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<CustomerPreviousValues>,
};

export type CustomerSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<CustomerWhereInput>,
  AND?: Maybe<Array<CustomerSubscriptionWhereInput>>,
  OR?: Maybe<Array<CustomerSubscriptionWhereInput>>,
  NOT?: Maybe<Array<CustomerSubscriptionWhereInput>>,
};

export type CustomerUpdateDataInput = {
  name?: Maybe<Scalars['String']>,
  settings?: Maybe<CustomerSettingsUpdateOneWithoutCustomerInput>,
};

export type CustomerUpdateInput = {
  name?: Maybe<Scalars['String']>,
  settings?: Maybe<CustomerSettingsUpdateOneWithoutCustomerInput>,
};

export type CustomerUpdateManyMutationInput = {
  name?: Maybe<Scalars['String']>,
};

export type CustomerUpdateOneRequiredInput = {
  create?: Maybe<CustomerCreateInput>,
  update?: Maybe<CustomerUpdateDataInput>,
  upsert?: Maybe<CustomerUpsertNestedInput>,
  connect?: Maybe<CustomerWhereUniqueInput>,
};

export type CustomerUpdateOneRequiredWithoutSettingsInput = {
  create?: Maybe<CustomerCreateWithoutSettingsInput>,
  update?: Maybe<CustomerUpdateWithoutSettingsDataInput>,
  upsert?: Maybe<CustomerUpsertWithoutSettingsInput>,
  connect?: Maybe<CustomerWhereUniqueInput>,
};

export type CustomerUpdateWithoutSettingsDataInput = {
  name?: Maybe<Scalars['String']>,
};

export type CustomerUpsertNestedInput = {
  update: CustomerUpdateDataInput,
  create: CustomerCreateInput,
};

export type CustomerUpsertWithoutSettingsInput = {
  update: CustomerUpdateWithoutSettingsDataInput,
  create: CustomerCreateWithoutSettingsInput,
};

export type CustomerWhereInput = {
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
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_lt?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  settings?: Maybe<CustomerSettingsWhereInput>,
  AND?: Maybe<Array<CustomerWhereInput>>,
  OR?: Maybe<Array<CustomerWhereInput>>,
  NOT?: Maybe<Array<CustomerWhereInput>>,
};

export type CustomerWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};


export type FontSettings = {
   __typename?: 'FontSettings',
  id: Scalars['ID'],
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsConnection = {
   __typename?: 'FontSettingsConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<FontSettingsEdge>>,
  aggregate: AggregateFontSettings,
};

export type FontSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>,
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsCreateOneInput = {
  create?: Maybe<FontSettingsCreateInput>,
  connect?: Maybe<FontSettingsWhereUniqueInput>,
};

export type FontSettingsEdge = {
   __typename?: 'FontSettingsEdge',
  node: FontSettings,
  cursor: Scalars['String'],
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
   __typename?: 'FontSettingsPreviousValues',
  id: Scalars['ID'],
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsSubscriptionPayload = {
   __typename?: 'FontSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<FontSettings>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<FontSettingsPreviousValues>,
};

export type FontSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<FontSettingsWhereInput>,
  AND?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
  NOT?: Maybe<Array<FontSettingsSubscriptionWhereInput>>,
};

export type FontSettingsUpdateDataInput = {
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateInput = {
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateManyMutationInput = {
  settingTitle?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
};

export type FontSettingsUpdateOneRequiredInput = {
  create?: Maybe<FontSettingsCreateInput>,
  update?: Maybe<FontSettingsUpdateDataInput>,
  upsert?: Maybe<FontSettingsUpsertNestedInput>,
  connect?: Maybe<FontSettingsWhereUniqueInput>,
};

export type FontSettingsUpsertNestedInput = {
  update: FontSettingsUpdateDataInput,
  create: FontSettingsCreateInput,
};

export type FontSettingsWhereInput = {
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
  settingTitle?: Maybe<Scalars['String']>,
  settingTitle_not?: Maybe<Scalars['String']>,
  settingTitle_in?: Maybe<Array<Scalars['String']>>,
  settingTitle_not_in?: Maybe<Array<Scalars['String']>>,
  settingTitle_lt?: Maybe<Scalars['String']>,
  settingTitle_lte?: Maybe<Scalars['String']>,
  settingTitle_gt?: Maybe<Scalars['String']>,
  settingTitle_gte?: Maybe<Scalars['String']>,
  settingTitle_contains?: Maybe<Scalars['String']>,
  settingTitle_not_contains?: Maybe<Scalars['String']>,
  settingTitle_starts_with?: Maybe<Scalars['String']>,
  settingTitle_not_starts_with?: Maybe<Scalars['String']>,
  settingTitle_ends_with?: Maybe<Scalars['String']>,
  settingTitle_not_ends_with?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  body_not?: Maybe<Scalars['String']>,
  body_in?: Maybe<Array<Scalars['String']>>,
  body_not_in?: Maybe<Array<Scalars['String']>>,
  body_lt?: Maybe<Scalars['String']>,
  body_lte?: Maybe<Scalars['String']>,
  body_gt?: Maybe<Scalars['String']>,
  body_gte?: Maybe<Scalars['String']>,
  body_contains?: Maybe<Scalars['String']>,
  body_not_contains?: Maybe<Scalars['String']>,
  body_starts_with?: Maybe<Scalars['String']>,
  body_not_starts_with?: Maybe<Scalars['String']>,
  body_ends_with?: Maybe<Scalars['String']>,
  body_not_ends_with?: Maybe<Scalars['String']>,
  fontTitle?: Maybe<Scalars['String']>,
  fontTitle_not?: Maybe<Scalars['String']>,
  fontTitle_in?: Maybe<Array<Scalars['String']>>,
  fontTitle_not_in?: Maybe<Array<Scalars['String']>>,
  fontTitle_lt?: Maybe<Scalars['String']>,
  fontTitle_lte?: Maybe<Scalars['String']>,
  fontTitle_gt?: Maybe<Scalars['String']>,
  fontTitle_gte?: Maybe<Scalars['String']>,
  fontTitle_contains?: Maybe<Scalars['String']>,
  fontTitle_not_contains?: Maybe<Scalars['String']>,
  fontTitle_starts_with?: Maybe<Scalars['String']>,
  fontTitle_not_starts_with?: Maybe<Scalars['String']>,
  fontTitle_ends_with?: Maybe<Scalars['String']>,
  fontTitle_not_ends_with?: Maybe<Scalars['String']>,
  special?: Maybe<Scalars['String']>,
  special_not?: Maybe<Scalars['String']>,
  special_in?: Maybe<Array<Scalars['String']>>,
  special_not_in?: Maybe<Array<Scalars['String']>>,
  special_lt?: Maybe<Scalars['String']>,
  special_lte?: Maybe<Scalars['String']>,
  special_gt?: Maybe<Scalars['String']>,
  special_gte?: Maybe<Scalars['String']>,
  special_contains?: Maybe<Scalars['String']>,
  special_not_contains?: Maybe<Scalars['String']>,
  special_starts_with?: Maybe<Scalars['String']>,
  special_not_starts_with?: Maybe<Scalars['String']>,
  special_ends_with?: Maybe<Scalars['String']>,
  special_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<FontSettingsWhereInput>>,
  OR?: Maybe<Array<FontSettingsWhereInput>>,
  NOT?: Maybe<Array<FontSettingsWhereInput>>,
};

export type FontSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type LeafNode = {
   __typename?: 'LeafNode',
  id: Scalars['ID'],
  nodeId?: Maybe<Scalars['Int']>,
  type?: Maybe<NodeType>,
  title: Scalars['String'],
};

export type LeafNodeConnection = {
   __typename?: 'LeafNodeConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<LeafNodeEdge>>,
  aggregate: AggregateLeafNode,
};

export type LeafNodeCreateInput = {
  id?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
  type?: Maybe<NodeTypeCreateOneInput>,
  title: Scalars['String'],
};

export type LeafNodeEdge = {
   __typename?: 'LeafNodeEdge',
  node: LeafNode,
  cursor: Scalars['String'],
};

export enum LeafNodeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NodeIdAsc = 'nodeId_ASC',
  NodeIdDesc = 'nodeId_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

export type LeafNodePreviousValues = {
   __typename?: 'LeafNodePreviousValues',
  id: Scalars['ID'],
  nodeId?: Maybe<Scalars['Int']>,
  title: Scalars['String'],
};

export type LeafNodeSubscriptionPayload = {
   __typename?: 'LeafNodeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<LeafNode>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<LeafNodePreviousValues>,
};

export type LeafNodeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<LeafNodeWhereInput>,
  AND?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
  OR?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
  NOT?: Maybe<Array<LeafNodeSubscriptionWhereInput>>,
};

export type LeafNodeUpdateInput = {
  nodeId?: Maybe<Scalars['Int']>,
  type?: Maybe<NodeTypeUpdateOneInput>,
  title?: Maybe<Scalars['String']>,
};

export type LeafNodeUpdateManyMutationInput = {
  nodeId?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
};

export type LeafNodeWhereInput = {
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
  nodeId?: Maybe<Scalars['Int']>,
  nodeId_not?: Maybe<Scalars['Int']>,
  nodeId_in?: Maybe<Array<Scalars['Int']>>,
  nodeId_not_in?: Maybe<Array<Scalars['Int']>>,
  nodeId_lt?: Maybe<Scalars['Int']>,
  nodeId_lte?: Maybe<Scalars['Int']>,
  nodeId_gt?: Maybe<Scalars['Int']>,
  nodeId_gte?: Maybe<Scalars['Int']>,
  type?: Maybe<NodeTypeWhereInput>,
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
  AND?: Maybe<Array<LeafNodeWhereInput>>,
  OR?: Maybe<Array<LeafNodeWhereInput>>,
  NOT?: Maybe<Array<LeafNodeWhereInput>>,
};

export type LeafNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
  nodeId?: Maybe<Scalars['Int']>,
};


export type Mutation = {
   __typename?: 'Mutation',
  createColourSettings: ColourSettings,
  updateColourSettings?: Maybe<ColourSettings>,
  updateManyColourSettingses: BatchPayload,
  upsertColourSettings: ColourSettings,
  deleteColourSettings?: Maybe<ColourSettings>,
  deleteManyColourSettingses: BatchPayload,
  createCustomer: Customer,
  updateCustomer?: Maybe<Customer>,
  updateManyCustomers: BatchPayload,
  upsertCustomer: Customer,
  deleteCustomer?: Maybe<Customer>,
  deleteManyCustomers: BatchPayload,
  createCustomerSettings: CustomerSettings,
  updateCustomerSettings?: Maybe<CustomerSettings>,
  updateManyCustomerSettingses: BatchPayload,
  upsertCustomerSettings: CustomerSettings,
  deleteCustomerSettings?: Maybe<CustomerSettings>,
  deleteManyCustomerSettingses: BatchPayload,
  createFontSettings: FontSettings,
  updateFontSettings?: Maybe<FontSettings>,
  updateManyFontSettingses: BatchPayload,
  upsertFontSettings: FontSettings,
  deleteFontSettings?: Maybe<FontSettings>,
  deleteManyFontSettingses: BatchPayload,
  createLeafNode: LeafNode,
  updateLeafNode?: Maybe<LeafNode>,
  updateManyLeafNodes: BatchPayload,
  upsertLeafNode: LeafNode,
  deleteLeafNode?: Maybe<LeafNode>,
  deleteManyLeafNodes: BatchPayload,
  createNodeType: NodeType,
  updateNodeType?: Maybe<NodeType>,
  updateManyNodeTypes: BatchPayload,
  upsertNodeType: NodeType,
  deleteNodeType?: Maybe<NodeType>,
  deleteManyNodeTypes: BatchPayload,
  createQuestionCondition: QuestionCondition,
  updateQuestionCondition?: Maybe<QuestionCondition>,
  updateManyQuestionConditions: BatchPayload,
  upsertQuestionCondition: QuestionCondition,
  deleteQuestionCondition?: Maybe<QuestionCondition>,
  deleteManyQuestionConditions: BatchPayload,
  createQuestionNode: QuestionNode,
  updateQuestionNode?: Maybe<QuestionNode>,
  updateManyQuestionNodes: BatchPayload,
  upsertQuestionNode: QuestionNode,
  deleteQuestionNode?: Maybe<QuestionNode>,
  deleteManyQuestionNodes: BatchPayload,
  createQuestionOption: QuestionOption,
  updateQuestionOption?: Maybe<QuestionOption>,
  updateManyQuestionOptions: BatchPayload,
  upsertQuestionOption: QuestionOption,
  deleteQuestionOption?: Maybe<QuestionOption>,
  deleteManyQuestionOptions: BatchPayload,
  createQuestionnaire: Questionnaire,
  updateQuestionnaire?: Maybe<Questionnaire>,
  updateManyQuestionnaires: BatchPayload,
  upsertQuestionnaire: Questionnaire,
  deleteQuestionnaire?: Maybe<Questionnaire>,
  deleteManyQuestionnaires: BatchPayload,
};


export type MutationCreateColourSettingsArgs = {
  data: ColourSettingsCreateInput
};


export type MutationUpdateColourSettingsArgs = {
  data: ColourSettingsUpdateInput,
  where: ColourSettingsWhereUniqueInput
};


export type MutationUpdateManyColourSettingsesArgs = {
  data: ColourSettingsUpdateManyMutationInput,
  where?: Maybe<ColourSettingsWhereInput>
};


export type MutationUpsertColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput,
  create: ColourSettingsCreateInput,
  update: ColourSettingsUpdateInput
};


export type MutationDeleteColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput
};


export type MutationDeleteManyColourSettingsesArgs = {
  where?: Maybe<ColourSettingsWhereInput>
};


export type MutationCreateCustomerArgs = {
  data: CustomerCreateInput
};


export type MutationUpdateCustomerArgs = {
  data: CustomerUpdateInput,
  where: CustomerWhereUniqueInput
};


export type MutationUpdateManyCustomersArgs = {
  data: CustomerUpdateManyMutationInput,
  where?: Maybe<CustomerWhereInput>
};


export type MutationUpsertCustomerArgs = {
  where: CustomerWhereUniqueInput,
  create: CustomerCreateInput,
  update: CustomerUpdateInput
};


export type MutationDeleteCustomerArgs = {
  where: CustomerWhereUniqueInput
};


export type MutationDeleteManyCustomersArgs = {
  where?: Maybe<CustomerWhereInput>
};


export type MutationCreateCustomerSettingsArgs = {
  data: CustomerSettingsCreateInput
};


export type MutationUpdateCustomerSettingsArgs = {
  data: CustomerSettingsUpdateInput,
  where: CustomerSettingsWhereUniqueInput
};


export type MutationUpdateManyCustomerSettingsesArgs = {
  data: CustomerSettingsUpdateManyMutationInput,
  where?: Maybe<CustomerSettingsWhereInput>
};


export type MutationUpsertCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput,
  create: CustomerSettingsCreateInput,
  update: CustomerSettingsUpdateInput
};


export type MutationDeleteCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput
};


export type MutationDeleteManyCustomerSettingsesArgs = {
  where?: Maybe<CustomerSettingsWhereInput>
};


export type MutationCreateFontSettingsArgs = {
  data: FontSettingsCreateInput
};


export type MutationUpdateFontSettingsArgs = {
  data: FontSettingsUpdateInput,
  where: FontSettingsWhereUniqueInput
};


export type MutationUpdateManyFontSettingsesArgs = {
  data: FontSettingsUpdateManyMutationInput,
  where?: Maybe<FontSettingsWhereInput>
};


export type MutationUpsertFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput,
  create: FontSettingsCreateInput,
  update: FontSettingsUpdateInput
};


export type MutationDeleteFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput
};


export type MutationDeleteManyFontSettingsesArgs = {
  where?: Maybe<FontSettingsWhereInput>
};


export type MutationCreateLeafNodeArgs = {
  data: LeafNodeCreateInput
};


export type MutationUpdateLeafNodeArgs = {
  data: LeafNodeUpdateInput,
  where: LeafNodeWhereUniqueInput
};


export type MutationUpdateManyLeafNodesArgs = {
  data: LeafNodeUpdateManyMutationInput,
  where?: Maybe<LeafNodeWhereInput>
};


export type MutationUpsertLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput,
  create: LeafNodeCreateInput,
  update: LeafNodeUpdateInput
};


export type MutationDeleteLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput
};


export type MutationDeleteManyLeafNodesArgs = {
  where?: Maybe<LeafNodeWhereInput>
};


export type MutationCreateNodeTypeArgs = {
  data: NodeTypeCreateInput
};


export type MutationUpdateNodeTypeArgs = {
  data: NodeTypeUpdateInput,
  where: NodeTypeWhereUniqueInput
};


export type MutationUpdateManyNodeTypesArgs = {
  data: NodeTypeUpdateManyMutationInput,
  where?: Maybe<NodeTypeWhereInput>
};


export type MutationUpsertNodeTypeArgs = {
  where: NodeTypeWhereUniqueInput,
  create: NodeTypeCreateInput,
  update: NodeTypeUpdateInput
};


export type MutationDeleteNodeTypeArgs = {
  where: NodeTypeWhereUniqueInput
};


export type MutationDeleteManyNodeTypesArgs = {
  where?: Maybe<NodeTypeWhereInput>
};


export type MutationCreateQuestionConditionArgs = {
  data: QuestionConditionCreateInput
};


export type MutationUpdateQuestionConditionArgs = {
  data: QuestionConditionUpdateInput,
  where: QuestionConditionWhereUniqueInput
};


export type MutationUpdateManyQuestionConditionsArgs = {
  data: QuestionConditionUpdateManyMutationInput,
  where?: Maybe<QuestionConditionWhereInput>
};


export type MutationUpsertQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput,
  create: QuestionConditionCreateInput,
  update: QuestionConditionUpdateInput
};


export type MutationDeleteQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput
};


export type MutationDeleteManyQuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>
};


export type MutationCreateQuestionNodeArgs = {
  data: QuestionNodeCreateInput
};


export type MutationUpdateQuestionNodeArgs = {
  data: QuestionNodeUpdateInput,
  where: QuestionNodeWhereUniqueInput
};


export type MutationUpdateManyQuestionNodesArgs = {
  data: QuestionNodeUpdateManyMutationInput,
  where?: Maybe<QuestionNodeWhereInput>
};


export type MutationUpsertQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput,
  create: QuestionNodeCreateInput,
  update: QuestionNodeUpdateInput
};


export type MutationDeleteQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput
};


export type MutationDeleteManyQuestionNodesArgs = {
  where?: Maybe<QuestionNodeWhereInput>
};


export type MutationCreateQuestionOptionArgs = {
  data: QuestionOptionCreateInput
};


export type MutationUpdateQuestionOptionArgs = {
  data: QuestionOptionUpdateInput,
  where: QuestionOptionWhereUniqueInput
};


export type MutationUpdateManyQuestionOptionsArgs = {
  data: QuestionOptionUpdateManyMutationInput,
  where?: Maybe<QuestionOptionWhereInput>
};


export type MutationUpsertQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput,
  create: QuestionOptionCreateInput,
  update: QuestionOptionUpdateInput
};


export type MutationDeleteQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput
};


export type MutationDeleteManyQuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>
};


export type MutationCreateQuestionnaireArgs = {
  data: QuestionnaireCreateInput
};


export type MutationUpdateQuestionnaireArgs = {
  data: QuestionnaireUpdateInput,
  where: QuestionnaireWhereUniqueInput
};


export type MutationUpdateManyQuestionnairesArgs = {
  data: QuestionnaireUpdateManyMutationInput,
  where?: Maybe<QuestionnaireWhereInput>
};


export type MutationUpsertQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput,
  create: QuestionnaireCreateInput,
  update: QuestionnaireUpdateInput
};


export type MutationDeleteQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput
};


export type MutationDeleteManyQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>
};

export enum MutationType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Deleted = 'DELETED'
}

export type Node = {
  id: Scalars['ID'],
};

export type NodeType = {
   __typename?: 'NodeType',
  id: Scalars['ID'],
  type: Scalars['String'],
};

export type NodeTypeConnection = {
   __typename?: 'NodeTypeConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<NodeTypeEdge>>,
  aggregate: AggregateNodeType,
};

export type NodeTypeCreateInput = {
  id?: Maybe<Scalars['ID']>,
  type: Scalars['String'],
};

export type NodeTypeCreateOneInput = {
  create?: Maybe<NodeTypeCreateInput>,
  connect?: Maybe<NodeTypeWhereUniqueInput>,
};

export type NodeTypeEdge = {
   __typename?: 'NodeTypeEdge',
  node: NodeType,
  cursor: Scalars['String'],
};

export enum NodeTypeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC'
}

export type NodeTypePreviousValues = {
   __typename?: 'NodeTypePreviousValues',
  id: Scalars['ID'],
  type: Scalars['String'],
};

export type NodeTypeSubscriptionPayload = {
   __typename?: 'NodeTypeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<NodeType>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<NodeTypePreviousValues>,
};

export type NodeTypeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<NodeTypeWhereInput>,
  AND?: Maybe<Array<NodeTypeSubscriptionWhereInput>>,
  OR?: Maybe<Array<NodeTypeSubscriptionWhereInput>>,
  NOT?: Maybe<Array<NodeTypeSubscriptionWhereInput>>,
};

export type NodeTypeUpdateDataInput = {
  type?: Maybe<Scalars['String']>,
};

export type NodeTypeUpdateInput = {
  type?: Maybe<Scalars['String']>,
};

export type NodeTypeUpdateManyMutationInput = {
  type?: Maybe<Scalars['String']>,
};

export type NodeTypeUpdateOneInput = {
  create?: Maybe<NodeTypeCreateInput>,
  update?: Maybe<NodeTypeUpdateDataInput>,
  upsert?: Maybe<NodeTypeUpsertNestedInput>,
  delete?: Maybe<Scalars['Boolean']>,
  disconnect?: Maybe<Scalars['Boolean']>,
  connect?: Maybe<NodeTypeWhereUniqueInput>,
};

export type NodeTypeUpdateOneRequiredInput = {
  create?: Maybe<NodeTypeCreateInput>,
  update?: Maybe<NodeTypeUpdateDataInput>,
  upsert?: Maybe<NodeTypeUpsertNestedInput>,
  connect?: Maybe<NodeTypeWhereUniqueInput>,
};

export type NodeTypeUpsertNestedInput = {
  update: NodeTypeUpdateDataInput,
  create: NodeTypeCreateInput,
};

export type NodeTypeWhereInput = {
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
  type?: Maybe<Scalars['String']>,
  type_not?: Maybe<Scalars['String']>,
  type_in?: Maybe<Array<Scalars['String']>>,
  type_not_in?: Maybe<Array<Scalars['String']>>,
  type_lt?: Maybe<Scalars['String']>,
  type_lte?: Maybe<Scalars['String']>,
  type_gt?: Maybe<Scalars['String']>,
  type_gte?: Maybe<Scalars['String']>,
  type_contains?: Maybe<Scalars['String']>,
  type_not_contains?: Maybe<Scalars['String']>,
  type_starts_with?: Maybe<Scalars['String']>,
  type_not_starts_with?: Maybe<Scalars['String']>,
  type_ends_with?: Maybe<Scalars['String']>,
  type_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<NodeTypeWhereInput>>,
  OR?: Maybe<Array<NodeTypeWhereInput>>,
  NOT?: Maybe<Array<NodeTypeWhereInput>>,
};

export type NodeTypeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
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
  colourSettings?: Maybe<ColourSettings>,
  colourSettingses: Array<Maybe<ColourSettings>>,
  colourSettingsesConnection: ColourSettingsConnection,
  customer?: Maybe<Customer>,
  customers: Array<Maybe<Customer>>,
  customersConnection: CustomerConnection,
  customerSettings?: Maybe<CustomerSettings>,
  customerSettingses: Array<Maybe<CustomerSettings>>,
  customerSettingsesConnection: CustomerSettingsConnection,
  fontSettings?: Maybe<FontSettings>,
  fontSettingses: Array<Maybe<FontSettings>>,
  fontSettingsesConnection: FontSettingsConnection,
  leafNode?: Maybe<LeafNode>,
  leafNodes: Array<Maybe<LeafNode>>,
  leafNodesConnection: LeafNodeConnection,
  nodeType?: Maybe<NodeType>,
  nodeTypes: Array<Maybe<NodeType>>,
  nodeTypesConnection: NodeTypeConnection,
  questionCondition?: Maybe<QuestionCondition>,
  questionConditions: Array<Maybe<QuestionCondition>>,
  questionConditionsConnection: QuestionConditionConnection,
  questionNode?: Maybe<QuestionNode>,
  questionNodes: Array<Maybe<QuestionNode>>,
  questionNodesConnection: QuestionNodeConnection,
  questionOption?: Maybe<QuestionOption>,
  questionOptions: Array<Maybe<QuestionOption>>,
  questionOptionsConnection: QuestionOptionConnection,
  questionnaire?: Maybe<Questionnaire>,
  questionnaires: Array<Maybe<Questionnaire>>,
  questionnairesConnection: QuestionnaireConnection,
  node?: Maybe<Node>,
};


export type QueryColourSettingsArgs = {
  where: ColourSettingsWhereUniqueInput
};


export type QueryColourSettingsesArgs = {
  where?: Maybe<ColourSettingsWhereInput>,
  orderBy?: Maybe<ColourSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryColourSettingsesConnectionArgs = {
  where?: Maybe<ColourSettingsWhereInput>,
  orderBy?: Maybe<ColourSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryCustomerArgs = {
  where: CustomerWhereUniqueInput
};


export type QueryCustomersArgs = {
  where?: Maybe<CustomerWhereInput>,
  orderBy?: Maybe<CustomerOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryCustomersConnectionArgs = {
  where?: Maybe<CustomerWhereInput>,
  orderBy?: Maybe<CustomerOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryCustomerSettingsArgs = {
  where: CustomerSettingsWhereUniqueInput
};


export type QueryCustomerSettingsesArgs = {
  where?: Maybe<CustomerSettingsWhereInput>,
  orderBy?: Maybe<CustomerSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryCustomerSettingsesConnectionArgs = {
  where?: Maybe<CustomerSettingsWhereInput>,
  orderBy?: Maybe<CustomerSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryFontSettingsArgs = {
  where: FontSettingsWhereUniqueInput
};


export type QueryFontSettingsesArgs = {
  where?: Maybe<FontSettingsWhereInput>,
  orderBy?: Maybe<FontSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryFontSettingsesConnectionArgs = {
  where?: Maybe<FontSettingsWhereInput>,
  orderBy?: Maybe<FontSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryLeafNodeArgs = {
  where: LeafNodeWhereUniqueInput
};


export type QueryLeafNodesArgs = {
  where?: Maybe<LeafNodeWhereInput>,
  orderBy?: Maybe<LeafNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryLeafNodesConnectionArgs = {
  where?: Maybe<LeafNodeWhereInput>,
  orderBy?: Maybe<LeafNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryNodeTypeArgs = {
  where: NodeTypeWhereUniqueInput
};


export type QueryNodeTypesArgs = {
  where?: Maybe<NodeTypeWhereInput>,
  orderBy?: Maybe<NodeTypeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryNodeTypesConnectionArgs = {
  where?: Maybe<NodeTypeWhereInput>,
  orderBy?: Maybe<NodeTypeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionConditionArgs = {
  where: QuestionConditionWhereUniqueInput
};


export type QueryQuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionConditionsConnectionArgs = {
  where?: Maybe<QuestionConditionWhereInput>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionNodeArgs = {
  where: QuestionNodeWhereUniqueInput
};


export type QueryQuestionNodesArgs = {
  where?: Maybe<QuestionNodeWhereInput>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionNodesConnectionArgs = {
  where?: Maybe<QuestionNodeWhereInput>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionOptionArgs = {
  where: QuestionOptionWhereUniqueInput
};


export type QueryQuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionOptionsConnectionArgs = {
  where?: Maybe<QuestionOptionWhereInput>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionnaireArgs = {
  where: QuestionnaireWhereUniqueInput
};


export type QueryQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionnairesConnectionArgs = {
  where?: Maybe<QuestionnaireWhereInput>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryNodeArgs = {
  id: Scalars['ID']
};

export type QuestionCondition = {
   __typename?: 'QuestionCondition',
  id: Scalars['ID'],
  conditionType: Scalars['String'],
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionConnection = {
   __typename?: 'QuestionConditionConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionConditionEdge>>,
  aggregate: AggregateQuestionCondition,
};

export type QuestionConditionCreateInput = {
  id?: Maybe<Scalars['ID']>,
  conditionType: Scalars['String'],
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionCreateManyInput = {
  create?: Maybe<Array<QuestionConditionCreateInput>>,
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
};

export type QuestionConditionEdge = {
   __typename?: 'QuestionConditionEdge',
  node: QuestionCondition,
  cursor: Scalars['String'],
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
   __typename?: 'QuestionConditionPreviousValues',
  id: Scalars['ID'],
  conditionType: Scalars['String'],
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionScalarWhereInput = {
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
  conditionType?: Maybe<Scalars['String']>,
  conditionType_not?: Maybe<Scalars['String']>,
  conditionType_in?: Maybe<Array<Scalars['String']>>,
  conditionType_not_in?: Maybe<Array<Scalars['String']>>,
  conditionType_lt?: Maybe<Scalars['String']>,
  conditionType_lte?: Maybe<Scalars['String']>,
  conditionType_gt?: Maybe<Scalars['String']>,
  conditionType_gte?: Maybe<Scalars['String']>,
  conditionType_contains?: Maybe<Scalars['String']>,
  conditionType_not_contains?: Maybe<Scalars['String']>,
  conditionType_starts_with?: Maybe<Scalars['String']>,
  conditionType_not_starts_with?: Maybe<Scalars['String']>,
  conditionType_ends_with?: Maybe<Scalars['String']>,
  conditionType_not_ends_with?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMin_not?: Maybe<Scalars['Int']>,
  renderMin_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_lt?: Maybe<Scalars['Int']>,
  renderMin_lte?: Maybe<Scalars['Int']>,
  renderMin_gt?: Maybe<Scalars['Int']>,
  renderMin_gte?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMax_not?: Maybe<Scalars['Int']>,
  renderMax_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_lt?: Maybe<Scalars['Int']>,
  renderMax_lte?: Maybe<Scalars['Int']>,
  renderMax_gt?: Maybe<Scalars['Int']>,
  renderMax_gte?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
  matchValue_not?: Maybe<Scalars['String']>,
  matchValue_in?: Maybe<Array<Scalars['String']>>,
  matchValue_not_in?: Maybe<Array<Scalars['String']>>,
  matchValue_lt?: Maybe<Scalars['String']>,
  matchValue_lte?: Maybe<Scalars['String']>,
  matchValue_gt?: Maybe<Scalars['String']>,
  matchValue_gte?: Maybe<Scalars['String']>,
  matchValue_contains?: Maybe<Scalars['String']>,
  matchValue_not_contains?: Maybe<Scalars['String']>,
  matchValue_starts_with?: Maybe<Scalars['String']>,
  matchValue_not_starts_with?: Maybe<Scalars['String']>,
  matchValue_ends_with?: Maybe<Scalars['String']>,
  matchValue_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  OR?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  NOT?: Maybe<Array<QuestionConditionScalarWhereInput>>,
};

export type QuestionConditionSubscriptionPayload = {
   __typename?: 'QuestionConditionSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionCondition>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionConditionPreviousValues>,
};

export type QuestionConditionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionConditionWhereInput>,
  AND?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionConditionSubscriptionWhereInput>>,
};

export type QuestionConditionUpdateDataInput = {
  conditionType?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateInput = {
  conditionType?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateManyDataInput = {
  conditionType?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateManyInput = {
  create?: Maybe<Array<QuestionConditionCreateInput>>,
  update?: Maybe<Array<QuestionConditionUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<QuestionConditionUpsertWithWhereUniqueNestedInput>>,
  delete?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  connect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  set?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  disconnect?: Maybe<Array<QuestionConditionWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionConditionScalarWhereInput>>,
  updateMany?: Maybe<Array<QuestionConditionUpdateManyWithWhereNestedInput>>,
};

export type QuestionConditionUpdateManyMutationInput = {
  conditionType?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateManyWithWhereNestedInput = {
  where: QuestionConditionScalarWhereInput,
  data: QuestionConditionUpdateManyDataInput,
};

export type QuestionConditionUpdateWithWhereUniqueNestedInput = {
  where: QuestionConditionWhereUniqueInput,
  data: QuestionConditionUpdateDataInput,
};

export type QuestionConditionUpsertWithWhereUniqueNestedInput = {
  where: QuestionConditionWhereUniqueInput,
  update: QuestionConditionUpdateDataInput,
  create: QuestionConditionCreateInput,
};

export type QuestionConditionWhereInput = {
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
  conditionType?: Maybe<Scalars['String']>,
  conditionType_not?: Maybe<Scalars['String']>,
  conditionType_in?: Maybe<Array<Scalars['String']>>,
  conditionType_not_in?: Maybe<Array<Scalars['String']>>,
  conditionType_lt?: Maybe<Scalars['String']>,
  conditionType_lte?: Maybe<Scalars['String']>,
  conditionType_gt?: Maybe<Scalars['String']>,
  conditionType_gte?: Maybe<Scalars['String']>,
  conditionType_contains?: Maybe<Scalars['String']>,
  conditionType_not_contains?: Maybe<Scalars['String']>,
  conditionType_starts_with?: Maybe<Scalars['String']>,
  conditionType_not_starts_with?: Maybe<Scalars['String']>,
  conditionType_ends_with?: Maybe<Scalars['String']>,
  conditionType_not_ends_with?: Maybe<Scalars['String']>,
  renderMin?: Maybe<Scalars['Int']>,
  renderMin_not?: Maybe<Scalars['Int']>,
  renderMin_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMin_lt?: Maybe<Scalars['Int']>,
  renderMin_lte?: Maybe<Scalars['Int']>,
  renderMin_gt?: Maybe<Scalars['Int']>,
  renderMin_gte?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  renderMax_not?: Maybe<Scalars['Int']>,
  renderMax_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_not_in?: Maybe<Array<Scalars['Int']>>,
  renderMax_lt?: Maybe<Scalars['Int']>,
  renderMax_lte?: Maybe<Scalars['Int']>,
  renderMax_gt?: Maybe<Scalars['Int']>,
  renderMax_gte?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
  matchValue_not?: Maybe<Scalars['String']>,
  matchValue_in?: Maybe<Array<Scalars['String']>>,
  matchValue_not_in?: Maybe<Array<Scalars['String']>>,
  matchValue_lt?: Maybe<Scalars['String']>,
  matchValue_lte?: Maybe<Scalars['String']>,
  matchValue_gt?: Maybe<Scalars['String']>,
  matchValue_gte?: Maybe<Scalars['String']>,
  matchValue_contains?: Maybe<Scalars['String']>,
  matchValue_not_contains?: Maybe<Scalars['String']>,
  matchValue_starts_with?: Maybe<Scalars['String']>,
  matchValue_not_starts_with?: Maybe<Scalars['String']>,
  matchValue_ends_with?: Maybe<Scalars['String']>,
  matchValue_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<QuestionConditionWhereInput>>,
  OR?: Maybe<Array<QuestionConditionWhereInput>>,
  NOT?: Maybe<Array<QuestionConditionWhereInput>>,
};

export type QuestionConditionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Questionnaire = {
   __typename?: 'Questionnaire',
  id: Scalars['ID'],
  customer: Customer,
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  creationDate: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  questions?: Maybe<Array<QuestionNode>>,
};


export type QuestionnaireQuestionsArgs = {
  where?: Maybe<QuestionNodeWhereInput>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type QuestionnaireConnection = {
   __typename?: 'QuestionnaireConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionnaireEdge>>,
  aggregate: AggregateQuestionnaire,
};

export type QuestionnaireCreateInput = {
  id?: Maybe<Scalars['ID']>,
  customer: CustomerCreateOneInput,
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeCreateManyInput>,
};

export type QuestionnaireEdge = {
   __typename?: 'QuestionnaireEdge',
  node: Questionnaire,
  cursor: Scalars['String'],
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
   __typename?: 'QuestionnairePreviousValues',
  id: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  creationDate: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
};

export type QuestionnaireSubscriptionPayload = {
   __typename?: 'QuestionnaireSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<Questionnaire>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionnairePreviousValues>,
};

export type QuestionnaireSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionnaireWhereInput>,
  AND?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireSubscriptionWhereInput>>,
};

export type QuestionnaireUpdateInput = {
  customer?: Maybe<CustomerUpdateOneRequiredInput>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionNodeUpdateManyInput>,
};

export type QuestionnaireUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
};

export type QuestionnaireWhereInput = {
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
  customer?: Maybe<CustomerWhereInput>,
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
  creationDate?: Maybe<Scalars['DateTime']>,
  creationDate_not?: Maybe<Scalars['DateTime']>,
  creationDate_in?: Maybe<Array<Scalars['DateTime']>>,
  creationDate_not_in?: Maybe<Array<Scalars['DateTime']>>,
  creationDate_lt?: Maybe<Scalars['DateTime']>,
  creationDate_lte?: Maybe<Scalars['DateTime']>,
  creationDate_gt?: Maybe<Scalars['DateTime']>,
  creationDate_gte?: Maybe<Scalars['DateTime']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  updatedAt_not?: Maybe<Scalars['DateTime']>,
  updatedAt_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_not_in?: Maybe<Array<Scalars['DateTime']>>,
  updatedAt_lt?: Maybe<Scalars['DateTime']>,
  updatedAt_lte?: Maybe<Scalars['DateTime']>,
  updatedAt_gt?: Maybe<Scalars['DateTime']>,
  updatedAt_gte?: Maybe<Scalars['DateTime']>,
  questions_every?: Maybe<QuestionNodeWhereInput>,
  questions_some?: Maybe<QuestionNodeWhereInput>,
  questions_none?: Maybe<QuestionNodeWhereInput>,
  AND?: Maybe<Array<QuestionnaireWhereInput>>,
  OR?: Maybe<Array<QuestionnaireWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireWhereInput>>,
};

export type QuestionnaireWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type QuestionNode = {
   __typename?: 'QuestionNode',
  id: Scalars['ID'],
  title: Scalars['String'],
  branchVal?: Maybe<Scalars['String']>,
  questionType: NodeType,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<Array<QuestionCondition>>,
  options?: Maybe<Array<QuestionOption>>,
  children?: Maybe<Array<QuestionNode>>,
};


export type QuestionNodeConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QuestionNodeOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QuestionNodeChildrenArgs = {
  where?: Maybe<QuestionNodeWhereInput>,
  orderBy?: Maybe<QuestionNodeOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type QuestionNodeConnection = {
   __typename?: 'QuestionNodeConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionNodeEdge>>,
  aggregate: AggregateQuestionNode,
};

export type QuestionNodeCreateInput = {
  id?: Maybe<Scalars['ID']>,
  title: Scalars['String'],
  branchVal?: Maybe<Scalars['String']>,
  questionType: NodeTypeCreateOneInput,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionCreateManyInput>,
  options?: Maybe<QuestionOptionCreateManyInput>,
  children?: Maybe<QuestionNodeCreateManyInput>,
};

export type QuestionNodeCreateManyInput = {
  create?: Maybe<Array<QuestionNodeCreateInput>>,
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
};

export type QuestionNodeEdge = {
   __typename?: 'QuestionNodeEdge',
  node: QuestionNode,
  cursor: Scalars['String'],
};

export enum QuestionNodeOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  BranchValAsc = 'branchVal_ASC',
  BranchValDesc = 'branchVal_DESC',
  OverrideLeafIdAsc = 'overrideLeafId_ASC',
  OverrideLeafIdDesc = 'overrideLeafId_DESC'
}

export type QuestionNodePreviousValues = {
   __typename?: 'QuestionNodePreviousValues',
  id: Scalars['ID'],
  title: Scalars['String'],
  branchVal?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
};

export type QuestionNodeScalarWhereInput = {
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
  branchVal?: Maybe<Scalars['String']>,
  branchVal_not?: Maybe<Scalars['String']>,
  branchVal_in?: Maybe<Array<Scalars['String']>>,
  branchVal_not_in?: Maybe<Array<Scalars['String']>>,
  branchVal_lt?: Maybe<Scalars['String']>,
  branchVal_lte?: Maybe<Scalars['String']>,
  branchVal_gt?: Maybe<Scalars['String']>,
  branchVal_gte?: Maybe<Scalars['String']>,
  branchVal_contains?: Maybe<Scalars['String']>,
  branchVal_not_contains?: Maybe<Scalars['String']>,
  branchVal_starts_with?: Maybe<Scalars['String']>,
  branchVal_not_starts_with?: Maybe<Scalars['String']>,
  branchVal_ends_with?: Maybe<Scalars['String']>,
  branchVal_not_ends_with?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  overrideLeafId_not?: Maybe<Scalars['Int']>,
  overrideLeafId_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_not_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_lt?: Maybe<Scalars['Int']>,
  overrideLeafId_lte?: Maybe<Scalars['Int']>,
  overrideLeafId_gt?: Maybe<Scalars['Int']>,
  overrideLeafId_gte?: Maybe<Scalars['Int']>,
  AND?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  OR?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  NOT?: Maybe<Array<QuestionNodeScalarWhereInput>>,
};

export type QuestionNodeSubscriptionPayload = {
   __typename?: 'QuestionNodeSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionNode>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionNodePreviousValues>,
};

export type QuestionNodeSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionNodeWhereInput>,
  AND?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionNodeSubscriptionWhereInput>>,
};

export type QuestionNodeUpdateDataInput = {
  title?: Maybe<Scalars['String']>,
  branchVal?: Maybe<Scalars['String']>,
  questionType?: Maybe<NodeTypeUpdateOneRequiredInput>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  children?: Maybe<QuestionNodeUpdateManyInput>,
};

export type QuestionNodeUpdateInput = {
  title?: Maybe<Scalars['String']>,
  branchVal?: Maybe<Scalars['String']>,
  questionType?: Maybe<NodeTypeUpdateOneRequiredInput>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  children?: Maybe<QuestionNodeUpdateManyInput>,
};

export type QuestionNodeUpdateManyDataInput = {
  title?: Maybe<Scalars['String']>,
  branchVal?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
};

export type QuestionNodeUpdateManyInput = {
  create?: Maybe<Array<QuestionNodeCreateInput>>,
  update?: Maybe<Array<QuestionNodeUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<QuestionNodeUpsertWithWhereUniqueNestedInput>>,
  delete?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  connect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  set?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  disconnect?: Maybe<Array<QuestionNodeWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionNodeScalarWhereInput>>,
  updateMany?: Maybe<Array<QuestionNodeUpdateManyWithWhereNestedInput>>,
};

export type QuestionNodeUpdateManyMutationInput = {
  title?: Maybe<Scalars['String']>,
  branchVal?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
};

export type QuestionNodeUpdateManyWithWhereNestedInput = {
  where: QuestionNodeScalarWhereInput,
  data: QuestionNodeUpdateManyDataInput,
};

export type QuestionNodeUpdateWithWhereUniqueNestedInput = {
  where: QuestionNodeWhereUniqueInput,
  data: QuestionNodeUpdateDataInput,
};

export type QuestionNodeUpsertWithWhereUniqueNestedInput = {
  where: QuestionNodeWhereUniqueInput,
  update: QuestionNodeUpdateDataInput,
  create: QuestionNodeCreateInput,
};

export type QuestionNodeWhereInput = {
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
  branchVal?: Maybe<Scalars['String']>,
  branchVal_not?: Maybe<Scalars['String']>,
  branchVal_in?: Maybe<Array<Scalars['String']>>,
  branchVal_not_in?: Maybe<Array<Scalars['String']>>,
  branchVal_lt?: Maybe<Scalars['String']>,
  branchVal_lte?: Maybe<Scalars['String']>,
  branchVal_gt?: Maybe<Scalars['String']>,
  branchVal_gte?: Maybe<Scalars['String']>,
  branchVal_contains?: Maybe<Scalars['String']>,
  branchVal_not_contains?: Maybe<Scalars['String']>,
  branchVal_starts_with?: Maybe<Scalars['String']>,
  branchVal_not_starts_with?: Maybe<Scalars['String']>,
  branchVal_ends_with?: Maybe<Scalars['String']>,
  branchVal_not_ends_with?: Maybe<Scalars['String']>,
  questionType?: Maybe<NodeTypeWhereInput>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  overrideLeafId_not?: Maybe<Scalars['Int']>,
  overrideLeafId_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_not_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_lt?: Maybe<Scalars['Int']>,
  overrideLeafId_lte?: Maybe<Scalars['Int']>,
  overrideLeafId_gt?: Maybe<Scalars['Int']>,
  overrideLeafId_gte?: Maybe<Scalars['Int']>,
  conditions_every?: Maybe<QuestionConditionWhereInput>,
  conditions_some?: Maybe<QuestionConditionWhereInput>,
  conditions_none?: Maybe<QuestionConditionWhereInput>,
  options_every?: Maybe<QuestionOptionWhereInput>,
  options_some?: Maybe<QuestionOptionWhereInput>,
  options_none?: Maybe<QuestionOptionWhereInput>,
  children_every?: Maybe<QuestionNodeWhereInput>,
  children_some?: Maybe<QuestionNodeWhereInput>,
  children_none?: Maybe<QuestionNodeWhereInput>,
  AND?: Maybe<Array<QuestionNodeWhereInput>>,
  OR?: Maybe<Array<QuestionNodeWhereInput>>,
  NOT?: Maybe<Array<QuestionNodeWhereInput>>,
};

export type QuestionNodeWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type QuestionOption = {
   __typename?: 'QuestionOption',
  id: Scalars['ID'],
  value: Scalars['String'],
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionConnection = {
   __typename?: 'QuestionOptionConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionOptionEdge>>,
  aggregate: AggregateQuestionOption,
};

export type QuestionOptionCreateInput = {
  id?: Maybe<Scalars['ID']>,
  value: Scalars['String'],
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionCreateManyInput = {
  create?: Maybe<Array<QuestionOptionCreateInput>>,
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
};

export type QuestionOptionEdge = {
   __typename?: 'QuestionOptionEdge',
  node: QuestionOption,
  cursor: Scalars['String'],
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
   __typename?: 'QuestionOptionPreviousValues',
  id: Scalars['ID'],
  value: Scalars['String'],
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionScalarWhereInput = {
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
  value?: Maybe<Scalars['String']>,
  value_not?: Maybe<Scalars['String']>,
  value_in?: Maybe<Array<Scalars['String']>>,
  value_not_in?: Maybe<Array<Scalars['String']>>,
  value_lt?: Maybe<Scalars['String']>,
  value_lte?: Maybe<Scalars['String']>,
  value_gt?: Maybe<Scalars['String']>,
  value_gte?: Maybe<Scalars['String']>,
  value_contains?: Maybe<Scalars['String']>,
  value_not_contains?: Maybe<Scalars['String']>,
  value_starts_with?: Maybe<Scalars['String']>,
  value_not_starts_with?: Maybe<Scalars['String']>,
  value_ends_with?: Maybe<Scalars['String']>,
  value_not_ends_with?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
  publicValue_not?: Maybe<Scalars['String']>,
  publicValue_in?: Maybe<Array<Scalars['String']>>,
  publicValue_not_in?: Maybe<Array<Scalars['String']>>,
  publicValue_lt?: Maybe<Scalars['String']>,
  publicValue_lte?: Maybe<Scalars['String']>,
  publicValue_gt?: Maybe<Scalars['String']>,
  publicValue_gte?: Maybe<Scalars['String']>,
  publicValue_contains?: Maybe<Scalars['String']>,
  publicValue_not_contains?: Maybe<Scalars['String']>,
  publicValue_starts_with?: Maybe<Scalars['String']>,
  publicValue_not_starts_with?: Maybe<Scalars['String']>,
  publicValue_ends_with?: Maybe<Scalars['String']>,
  publicValue_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  OR?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  NOT?: Maybe<Array<QuestionOptionScalarWhereInput>>,
};

export type QuestionOptionSubscriptionPayload = {
   __typename?: 'QuestionOptionSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionOption>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionOptionPreviousValues>,
};

export type QuestionOptionSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionOptionWhereInput>,
  AND?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionOptionSubscriptionWhereInput>>,
};

export type QuestionOptionUpdateDataInput = {
  value?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateInput = {
  value?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyDataInput = {
  value?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyInput = {
  create?: Maybe<Array<QuestionOptionCreateInput>>,
  update?: Maybe<Array<QuestionOptionUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<QuestionOptionUpsertWithWhereUniqueNestedInput>>,
  delete?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  connect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  set?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  disconnect?: Maybe<Array<QuestionOptionWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionOptionScalarWhereInput>>,
  updateMany?: Maybe<Array<QuestionOptionUpdateManyWithWhereNestedInput>>,
};

export type QuestionOptionUpdateManyMutationInput = {
  value?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
};

export type QuestionOptionUpdateManyWithWhereNestedInput = {
  where: QuestionOptionScalarWhereInput,
  data: QuestionOptionUpdateManyDataInput,
};

export type QuestionOptionUpdateWithWhereUniqueNestedInput = {
  where: QuestionOptionWhereUniqueInput,
  data: QuestionOptionUpdateDataInput,
};

export type QuestionOptionUpsertWithWhereUniqueNestedInput = {
  where: QuestionOptionWhereUniqueInput,
  update: QuestionOptionUpdateDataInput,
  create: QuestionOptionCreateInput,
};

export type QuestionOptionWhereInput = {
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
  value?: Maybe<Scalars['String']>,
  value_not?: Maybe<Scalars['String']>,
  value_in?: Maybe<Array<Scalars['String']>>,
  value_not_in?: Maybe<Array<Scalars['String']>>,
  value_lt?: Maybe<Scalars['String']>,
  value_lte?: Maybe<Scalars['String']>,
  value_gt?: Maybe<Scalars['String']>,
  value_gte?: Maybe<Scalars['String']>,
  value_contains?: Maybe<Scalars['String']>,
  value_not_contains?: Maybe<Scalars['String']>,
  value_starts_with?: Maybe<Scalars['String']>,
  value_not_starts_with?: Maybe<Scalars['String']>,
  value_ends_with?: Maybe<Scalars['String']>,
  value_not_ends_with?: Maybe<Scalars['String']>,
  publicValue?: Maybe<Scalars['String']>,
  publicValue_not?: Maybe<Scalars['String']>,
  publicValue_in?: Maybe<Array<Scalars['String']>>,
  publicValue_not_in?: Maybe<Array<Scalars['String']>>,
  publicValue_lt?: Maybe<Scalars['String']>,
  publicValue_lte?: Maybe<Scalars['String']>,
  publicValue_gt?: Maybe<Scalars['String']>,
  publicValue_gte?: Maybe<Scalars['String']>,
  publicValue_contains?: Maybe<Scalars['String']>,
  publicValue_not_contains?: Maybe<Scalars['String']>,
  publicValue_starts_with?: Maybe<Scalars['String']>,
  publicValue_not_starts_with?: Maybe<Scalars['String']>,
  publicValue_ends_with?: Maybe<Scalars['String']>,
  publicValue_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<QuestionOptionWhereInput>>,
  OR?: Maybe<Array<QuestionOptionWhereInput>>,
  NOT?: Maybe<Array<QuestionOptionWhereInput>>,
};

export type QuestionOptionWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
};

export type Subscription = {
   __typename?: 'Subscription',
  colourSettings?: Maybe<ColourSettingsSubscriptionPayload>,
  customer?: Maybe<CustomerSubscriptionPayload>,
  customerSettings?: Maybe<CustomerSettingsSubscriptionPayload>,
  fontSettings?: Maybe<FontSettingsSubscriptionPayload>,
  leafNode?: Maybe<LeafNodeSubscriptionPayload>,
  nodeType?: Maybe<NodeTypeSubscriptionPayload>,
  questionCondition?: Maybe<QuestionConditionSubscriptionPayload>,
  questionNode?: Maybe<QuestionNodeSubscriptionPayload>,
  questionOption?: Maybe<QuestionOptionSubscriptionPayload>,
  questionnaire?: Maybe<QuestionnaireSubscriptionPayload>,
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


export type SubscriptionFontSettingsArgs = {
  where?: Maybe<FontSettingsSubscriptionWhereInput>
};


export type SubscriptionLeafNodeArgs = {
  where?: Maybe<LeafNodeSubscriptionWhereInput>
};


export type SubscriptionNodeTypeArgs = {
  where?: Maybe<NodeTypeSubscriptionWhereInput>
};


export type SubscriptionQuestionConditionArgs = {
  where?: Maybe<QuestionConditionSubscriptionWhereInput>
};


export type SubscriptionQuestionNodeArgs = {
  where?: Maybe<QuestionNodeSubscriptionWhereInput>
};


export type SubscriptionQuestionOptionArgs = {
  where?: Maybe<QuestionOptionSubscriptionWhereInput>
};


export type SubscriptionQuestionnaireArgs = {
  where?: Maybe<QuestionnaireSubscriptionWhereInput>
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
  CustomerSettings: ResolverTypeWrapper<CustomerSettings>,
  FontSettings: ResolverTypeWrapper<FontSettings>,
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>,
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>,
  AggregateCustomer: ResolverTypeWrapper<AggregateCustomer>,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: ResolverTypeWrapper<CustomerSettingsConnection>,
  CustomerSettingsEdge: ResolverTypeWrapper<CustomerSettingsEdge>,
  AggregateCustomerSettings: ResolverTypeWrapper<AggregateCustomerSettings>,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: ResolverTypeWrapper<FontSettingsConnection>,
  FontSettingsEdge: ResolverTypeWrapper<FontSettingsEdge>,
  AggregateFontSettings: ResolverTypeWrapper<AggregateFontSettings>,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNode: ResolverTypeWrapper<LeafNode>,
  NodeType: ResolverTypeWrapper<NodeType>,
  LeafNodeWhereInput: LeafNodeWhereInput,
  NodeTypeWhereInput: NodeTypeWhereInput,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  LeafNodeConnection: ResolverTypeWrapper<LeafNodeConnection>,
  LeafNodeEdge: ResolverTypeWrapper<LeafNodeEdge>,
  AggregateLeafNode: ResolverTypeWrapper<AggregateLeafNode>,
  NodeTypeWhereUniqueInput: NodeTypeWhereUniqueInput,
  NodeTypeOrderByInput: NodeTypeOrderByInput,
  NodeTypeConnection: ResolverTypeWrapper<NodeTypeConnection>,
  NodeTypeEdge: ResolverTypeWrapper<NodeTypeEdge>,
  AggregateNodeType: ResolverTypeWrapper<AggregateNodeType>,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionCondition: ResolverTypeWrapper<QuestionCondition>,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionConditionConnection: ResolverTypeWrapper<QuestionConditionConnection>,
  QuestionConditionEdge: ResolverTypeWrapper<QuestionConditionEdge>,
  AggregateQuestionCondition: ResolverTypeWrapper<AggregateQuestionCondition>,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNode: ResolverTypeWrapper<QuestionNode>,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: ResolverTypeWrapper<QuestionOption>,
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  QuestionNodeConnection: ResolverTypeWrapper<QuestionNodeConnection>,
  QuestionNodeEdge: ResolverTypeWrapper<QuestionNodeEdge>,
  AggregateQuestionNode: ResolverTypeWrapper<AggregateQuestionNode>,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: ResolverTypeWrapper<QuestionOptionConnection>,
  QuestionOptionEdge: ResolverTypeWrapper<QuestionOptionEdge>,
  AggregateQuestionOption: ResolverTypeWrapper<AggregateQuestionOption>,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  Questionnaire: ResolverTypeWrapper<Questionnaire>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  QuestionnaireConnection: ResolverTypeWrapper<QuestionnaireConnection>,
  QuestionnaireEdge: ResolverTypeWrapper<QuestionnaireEdge>,
  AggregateQuestionnaire: ResolverTypeWrapper<AggregateQuestionnaire>,
  Node: ResolverTypeWrapper<Node>,
  Mutation: ResolverTypeWrapper<{}>,
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: ResolverTypeWrapper<BatchPayload>,
  Long: ResolverTypeWrapper<Scalars['Long']>,
  CustomerCreateInput: CustomerCreateInput,
  CustomerSettingsCreateOneWithoutCustomerInput: CustomerSettingsCreateOneWithoutCustomerInput,
  CustomerSettingsCreateWithoutCustomerInput: CustomerSettingsCreateWithoutCustomerInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  CustomerSettingsUpdateOneWithoutCustomerInput: CustomerSettingsUpdateOneWithoutCustomerInput,
  CustomerSettingsUpdateWithoutCustomerDataInput: CustomerSettingsUpdateWithoutCustomerDataInput,
  ColourSettingsUpdateOneRequiredInput: ColourSettingsUpdateOneRequiredInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneRequiredInput: FontSettingsUpdateOneRequiredInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  CustomerSettingsUpsertWithoutCustomerInput: CustomerSettingsUpsertWithoutCustomerInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  CustomerCreateOneWithoutSettingsInput: CustomerCreateOneWithoutSettingsInput,
  CustomerCreateWithoutSettingsInput: CustomerCreateWithoutSettingsInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  CustomerUpdateOneRequiredWithoutSettingsInput: CustomerUpdateOneRequiredWithoutSettingsInput,
  CustomerUpdateWithoutSettingsDataInput: CustomerUpdateWithoutSettingsDataInput,
  CustomerUpsertWithoutSettingsInput: CustomerUpsertWithoutSettingsInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  NodeTypeCreateOneInput: NodeTypeCreateOneInput,
  NodeTypeCreateInput: NodeTypeCreateInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  NodeTypeUpdateOneInput: NodeTypeUpdateOneInput,
  NodeTypeUpdateDataInput: NodeTypeUpdateDataInput,
  NodeTypeUpsertNestedInput: NodeTypeUpsertNestedInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  NodeTypeUpdateInput: NodeTypeUpdateInput,
  NodeTypeUpdateManyMutationInput: NodeTypeUpdateManyMutationInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  NodeTypeUpdateOneRequiredInput: NodeTypeUpdateOneRequiredInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  CustomerCreateOneInput: CustomerCreateOneInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  CustomerUpdateOneRequiredInput: CustomerUpdateOneRequiredInput,
  CustomerUpdateDataInput: CustomerUpdateDataInput,
  CustomerUpsertNestedInput: CustomerUpsertNestedInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
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
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: ResolverTypeWrapper<FontSettingsSubscriptionPayload>,
  FontSettingsPreviousValues: ResolverTypeWrapper<FontSettingsPreviousValues>,
  LeafNodeSubscriptionWhereInput: LeafNodeSubscriptionWhereInput,
  LeafNodeSubscriptionPayload: ResolverTypeWrapper<LeafNodeSubscriptionPayload>,
  LeafNodePreviousValues: ResolverTypeWrapper<LeafNodePreviousValues>,
  NodeTypeSubscriptionWhereInput: NodeTypeSubscriptionWhereInput,
  NodeTypeSubscriptionPayload: ResolverTypeWrapper<NodeTypeSubscriptionPayload>,
  NodeTypePreviousValues: ResolverTypeWrapper<NodeTypePreviousValues>,
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
  CustomerSettings: CustomerSettings,
  FontSettings: FontSettings,
  CustomerWhereInput: CustomerWhereInput,
  CustomerSettingsWhereInput: CustomerSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: CustomerConnection,
  CustomerEdge: CustomerEdge,
  AggregateCustomer: AggregateCustomer,
  CustomerSettingsWhereUniqueInput: CustomerSettingsWhereUniqueInput,
  CustomerSettingsOrderByInput: CustomerSettingsOrderByInput,
  CustomerSettingsConnection: CustomerSettingsConnection,
  CustomerSettingsEdge: CustomerSettingsEdge,
  AggregateCustomerSettings: AggregateCustomerSettings,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: FontSettingsConnection,
  FontSettingsEdge: FontSettingsEdge,
  AggregateFontSettings: AggregateFontSettings,
  LeafNodeWhereUniqueInput: LeafNodeWhereUniqueInput,
  LeafNode: LeafNode,
  NodeType: NodeType,
  LeafNodeWhereInput: LeafNodeWhereInput,
  NodeTypeWhereInput: NodeTypeWhereInput,
  LeafNodeOrderByInput: LeafNodeOrderByInput,
  LeafNodeConnection: LeafNodeConnection,
  LeafNodeEdge: LeafNodeEdge,
  AggregateLeafNode: AggregateLeafNode,
  NodeTypeWhereUniqueInput: NodeTypeWhereUniqueInput,
  NodeTypeOrderByInput: NodeTypeOrderByInput,
  NodeTypeConnection: NodeTypeConnection,
  NodeTypeEdge: NodeTypeEdge,
  AggregateNodeType: AggregateNodeType,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionCondition: QuestionCondition,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionConditionConnection: QuestionConditionConnection,
  QuestionConditionEdge: QuestionConditionEdge,
  AggregateQuestionCondition: AggregateQuestionCondition,
  QuestionNodeWhereUniqueInput: QuestionNodeWhereUniqueInput,
  QuestionNode: QuestionNode,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: QuestionOption,
  QuestionNodeWhereInput: QuestionNodeWhereInput,
  QuestionNodeOrderByInput: QuestionNodeOrderByInput,
  QuestionNodeConnection: QuestionNodeConnection,
  QuestionNodeEdge: QuestionNodeEdge,
  AggregateQuestionNode: AggregateQuestionNode,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: QuestionOptionConnection,
  QuestionOptionEdge: QuestionOptionEdge,
  AggregateQuestionOption: AggregateQuestionOption,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  Questionnaire: Questionnaire,
  DateTime: Scalars['DateTime'],
  QuestionnaireWhereInput: QuestionnaireWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  QuestionnaireConnection: QuestionnaireConnection,
  QuestionnaireEdge: QuestionnaireEdge,
  AggregateQuestionnaire: AggregateQuestionnaire,
  Node: Node,
  Mutation: {},
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: BatchPayload,
  Long: Scalars['Long'],
  CustomerCreateInput: CustomerCreateInput,
  CustomerSettingsCreateOneWithoutCustomerInput: CustomerSettingsCreateOneWithoutCustomerInput,
  CustomerSettingsCreateWithoutCustomerInput: CustomerSettingsCreateWithoutCustomerInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  CustomerSettingsUpdateOneWithoutCustomerInput: CustomerSettingsUpdateOneWithoutCustomerInput,
  CustomerSettingsUpdateWithoutCustomerDataInput: CustomerSettingsUpdateWithoutCustomerDataInput,
  ColourSettingsUpdateOneRequiredInput: ColourSettingsUpdateOneRequiredInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneRequiredInput: FontSettingsUpdateOneRequiredInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  CustomerSettingsUpsertWithoutCustomerInput: CustomerSettingsUpsertWithoutCustomerInput,
  CustomerUpdateManyMutationInput: CustomerUpdateManyMutationInput,
  CustomerSettingsCreateInput: CustomerSettingsCreateInput,
  CustomerCreateOneWithoutSettingsInput: CustomerCreateOneWithoutSettingsInput,
  CustomerCreateWithoutSettingsInput: CustomerCreateWithoutSettingsInput,
  CustomerSettingsUpdateInput: CustomerSettingsUpdateInput,
  CustomerUpdateOneRequiredWithoutSettingsInput: CustomerUpdateOneRequiredWithoutSettingsInput,
  CustomerUpdateWithoutSettingsDataInput: CustomerUpdateWithoutSettingsDataInput,
  CustomerUpsertWithoutSettingsInput: CustomerUpsertWithoutSettingsInput,
  CustomerSettingsUpdateManyMutationInput: CustomerSettingsUpdateManyMutationInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  LeafNodeCreateInput: LeafNodeCreateInput,
  NodeTypeCreateOneInput: NodeTypeCreateOneInput,
  NodeTypeCreateInput: NodeTypeCreateInput,
  LeafNodeUpdateInput: LeafNodeUpdateInput,
  NodeTypeUpdateOneInput: NodeTypeUpdateOneInput,
  NodeTypeUpdateDataInput: NodeTypeUpdateDataInput,
  NodeTypeUpsertNestedInput: NodeTypeUpsertNestedInput,
  LeafNodeUpdateManyMutationInput: LeafNodeUpdateManyMutationInput,
  NodeTypeUpdateInput: NodeTypeUpdateInput,
  NodeTypeUpdateManyMutationInput: NodeTypeUpdateManyMutationInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionNodeCreateInput: QuestionNodeCreateInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  QuestionNodeCreateManyInput: QuestionNodeCreateManyInput,
  QuestionNodeUpdateInput: QuestionNodeUpdateInput,
  NodeTypeUpdateOneRequiredInput: NodeTypeUpdateOneRequiredInput,
  QuestionConditionUpdateManyInput: QuestionConditionUpdateManyInput,
  QuestionConditionUpdateWithWhereUniqueNestedInput: QuestionConditionUpdateWithWhereUniqueNestedInput,
  QuestionConditionUpdateDataInput: QuestionConditionUpdateDataInput,
  QuestionConditionUpsertWithWhereUniqueNestedInput: QuestionConditionUpsertWithWhereUniqueNestedInput,
  QuestionConditionScalarWhereInput: QuestionConditionScalarWhereInput,
  QuestionConditionUpdateManyWithWhereNestedInput: QuestionConditionUpdateManyWithWhereNestedInput,
  QuestionConditionUpdateManyDataInput: QuestionConditionUpdateManyDataInput,
  QuestionOptionUpdateManyInput: QuestionOptionUpdateManyInput,
  QuestionOptionUpdateWithWhereUniqueNestedInput: QuestionOptionUpdateWithWhereUniqueNestedInput,
  QuestionOptionUpdateDataInput: QuestionOptionUpdateDataInput,
  QuestionOptionUpsertWithWhereUniqueNestedInput: QuestionOptionUpsertWithWhereUniqueNestedInput,
  QuestionOptionScalarWhereInput: QuestionOptionScalarWhereInput,
  QuestionOptionUpdateManyWithWhereNestedInput: QuestionOptionUpdateManyWithWhereNestedInput,
  QuestionOptionUpdateManyDataInput: QuestionOptionUpdateManyDataInput,
  QuestionNodeUpdateManyInput: QuestionNodeUpdateManyInput,
  QuestionNodeUpdateWithWhereUniqueNestedInput: QuestionNodeUpdateWithWhereUniqueNestedInput,
  QuestionNodeUpdateDataInput: QuestionNodeUpdateDataInput,
  QuestionNodeUpsertWithWhereUniqueNestedInput: QuestionNodeUpsertWithWhereUniqueNestedInput,
  QuestionNodeScalarWhereInput: QuestionNodeScalarWhereInput,
  QuestionNodeUpdateManyWithWhereNestedInput: QuestionNodeUpdateManyWithWhereNestedInput,
  QuestionNodeUpdateManyDataInput: QuestionNodeUpdateManyDataInput,
  QuestionNodeUpdateManyMutationInput: QuestionNodeUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  CustomerCreateOneInput: CustomerCreateOneInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  CustomerUpdateOneRequiredInput: CustomerUpdateOneRequiredInput,
  CustomerUpdateDataInput: CustomerUpdateDataInput,
  CustomerUpsertNestedInput: CustomerUpsertNestedInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
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
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: FontSettingsSubscriptionPayload,
  FontSettingsPreviousValues: FontSettingsPreviousValues,
  LeafNodeSubscriptionWhereInput: LeafNodeSubscriptionWhereInput,
  LeafNodeSubscriptionPayload: LeafNodeSubscriptionPayload,
  LeafNodePreviousValues: LeafNodePreviousValues,
  NodeTypeSubscriptionWhereInput: NodeTypeSubscriptionWhereInput,
  NodeTypeSubscriptionPayload: NodeTypeSubscriptionPayload,
  NodeTypePreviousValues: NodeTypePreviousValues,
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

export type AggregateFontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateFontSettings'] = ResolversParentTypes['AggregateFontSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateLeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateLeafNode'] = ResolversParentTypes['AggregateLeafNode']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateNodeTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateNodeType'] = ResolversParentTypes['AggregateNodeType']> = ResolversObject<{
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  secondary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  tertiary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  warning?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  error?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lightest?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  light?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  normal?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dark?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  darkest?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  muted?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type ColourSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsConnection'] = ResolversParentTypes['ColourSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['ColourSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateColourSettings'], ParentType, ContextType>,
}>;

export type ColourSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsEdge'] = ResolversParentTypes['ColourSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type ColourSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsPreviousValues'] = ResolversParentTypes['ColourSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  primary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  secondary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  tertiary?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  success?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  warning?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  error?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lightest?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  light?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  normal?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  dark?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  darkest?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  muted?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type ColourSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ColourSettingsSubscriptionPayload'] = ResolversParentTypes['ColourSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['ColourSettingsPreviousValues']>, ParentType, ContextType>,
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  settings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
}>;

export type CustomerConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerConnection'] = ResolversParentTypes['CustomerConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateCustomer'], ParentType, ContextType>,
}>;

export type CustomerEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerEdge'] = ResolversParentTypes['CustomerEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type CustomerPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerPreviousValues'] = ResolversParentTypes['CustomerPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type CustomerSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettings'] = ResolversParentTypes['CustomerSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  colourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType>,
  fontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType>,
}>;

export type CustomerSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsConnection'] = ResolversParentTypes['CustomerSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['CustomerSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateCustomerSettings'], ParentType, ContextType>,
}>;

export type CustomerSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsEdge'] = ResolversParentTypes['CustomerSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type CustomerSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsPreviousValues'] = ResolversParentTypes['CustomerSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type CustomerSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSettingsSubscriptionPayload'] = ResolversParentTypes['CustomerSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerSettingsPreviousValues']>, ParentType, ContextType>,
}>;

export type CustomerSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSubscriptionPayload'] = ResolversParentTypes['CustomerSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerPreviousValues']>, ParentType, ContextType>,
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type FontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettings'] = ResolversParentTypes['FontSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type FontSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsConnection'] = ResolversParentTypes['FontSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['FontSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateFontSettings'], ParentType, ContextType>,
}>;

export type FontSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsEdge'] = ResolversParentTypes['FontSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type FontSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsPreviousValues'] = ResolversParentTypes['FontSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  settingTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fontTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type FontSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['FontSettingsSubscriptionPayload'] = ResolversParentTypes['FontSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['FontSettingsPreviousValues']>, ParentType, ContextType>,
}>;

export type LeafNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNode'] = ResolversParentTypes['LeafNode']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  type?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type LeafNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeConnection'] = ResolversParentTypes['LeafNodeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['LeafNodeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateLeafNode'], ParentType, ContextType>,
}>;

export type LeafNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeEdge'] = ResolversParentTypes['LeafNodeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type LeafNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodePreviousValues'] = ResolversParentTypes['LeafNodePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  nodeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type LeafNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LeafNodeSubscriptionPayload'] = ResolversParentTypes['LeafNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['LeafNodePreviousValues']>, ParentType, ContextType>,
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
  deleteManyColourSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyColourSettingsesArgs>,
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'data'>>,
  updateCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'data' | 'where'>>,
  updateManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomersArgs, 'data'>>,
  upsertCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpsertCustomerArgs, 'where' | 'create' | 'update'>>,
  deleteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'where'>>,
  deleteManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyCustomersArgs>,
  createCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationCreateCustomerSettingsArgs, 'data'>>,
  updateCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationUpdateCustomerSettingsArgs, 'data' | 'where'>>,
  updateManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyCustomerSettingsesArgs, 'data'>>,
  upsertCustomerSettings?: Resolver<ResolversTypes['CustomerSettings'], ParentType, ContextType, RequireFields<MutationUpsertCustomerSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteCustomerSettings?: Resolver<Maybe<ResolversTypes['CustomerSettings']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerSettingsArgs, 'where'>>,
  deleteManyCustomerSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyCustomerSettingsesArgs>,
  createFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationCreateFontSettingsArgs, 'data'>>,
  updateFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationUpdateFontSettingsArgs, 'data' | 'where'>>,
  updateManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyFontSettingsesArgs, 'data'>>,
  upsertFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationUpsertFontSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationDeleteFontSettingsArgs, 'where'>>,
  deleteManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyFontSettingsesArgs>,
  createLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationCreateLeafNodeArgs, 'data'>>,
  updateLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationUpdateLeafNodeArgs, 'data' | 'where'>>,
  updateManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyLeafNodesArgs, 'data'>>,
  upsertLeafNode?: Resolver<ResolversTypes['LeafNode'], ParentType, ContextType, RequireFields<MutationUpsertLeafNodeArgs, 'where' | 'create' | 'update'>>,
  deleteLeafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<MutationDeleteLeafNodeArgs, 'where'>>,
  deleteManyLeafNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyLeafNodesArgs>,
  createNodeType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType, RequireFields<MutationCreateNodeTypeArgs, 'data'>>,
  updateNodeType?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType, RequireFields<MutationUpdateNodeTypeArgs, 'data' | 'where'>>,
  updateManyNodeTypes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyNodeTypesArgs, 'data'>>,
  upsertNodeType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType, RequireFields<MutationUpsertNodeTypeArgs, 'where' | 'create' | 'update'>>,
  deleteNodeType?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType, RequireFields<MutationDeleteNodeTypeArgs, 'where'>>,
  deleteManyNodeTypes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyNodeTypesArgs>,
  createQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationCreateQuestionConditionArgs, 'data'>>,
  updateQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionConditionArgs, 'data' | 'where'>>,
  updateManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionConditionsArgs, 'data'>>,
  upsertQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationUpsertQuestionConditionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionConditionArgs, 'where'>>,
  deleteManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionConditionsArgs>,
  createQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationCreateQuestionNodeArgs, 'data'>>,
  updateQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionNodeArgs, 'data' | 'where'>>,
  updateManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionNodesArgs, 'data'>>,
  upsertQuestionNode?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType, RequireFields<MutationUpsertQuestionNodeArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionNodeArgs, 'where'>>,
  deleteManyQuestionNodes?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionNodesArgs>,
  createQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationCreateQuestionOptionArgs, 'data'>>,
  updateQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionOptionArgs, 'data' | 'where'>>,
  updateManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionOptionsArgs, 'data'>>,
  upsertQuestionOption?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType, RequireFields<MutationUpsertQuestionOptionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionOptionArgs, 'where'>>,
  deleteManyQuestionOptions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionOptionsArgs>,
  createQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationCreateQuestionnaireArgs, 'data'>>,
  updateQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionnaireArgs, 'data' | 'where'>>,
  updateManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionnairesArgs, 'data'>>,
  upsertQuestionnaire?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType, RequireFields<MutationUpsertQuestionnaireArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionnaireArgs, 'where'>>,
  deleteManyQuestionnaires?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionnairesArgs>,
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>,
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
}>;

export type NodeTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeType'] = ResolversParentTypes['NodeType']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type NodeTypeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeTypeConnection'] = ResolversParentTypes['NodeTypeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['NodeTypeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateNodeType'], ParentType, ContextType>,
}>;

export type NodeTypeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeTypeEdge'] = ResolversParentTypes['NodeTypeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type NodeTypePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeTypePreviousValues'] = ResolversParentTypes['NodeTypePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type NodeTypeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['NodeTypeSubscriptionPayload'] = ResolversParentTypes['NodeTypeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['NodeTypePreviousValues']>, ParentType, ContextType>,
}>;

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
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
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<QueryFontSettingsArgs, 'where'>>,
  fontSettingses?: Resolver<Array<Maybe<ResolversTypes['FontSettings']>>, ParentType, ContextType, QueryFontSettingsesArgs>,
  fontSettingsesConnection?: Resolver<ResolversTypes['FontSettingsConnection'], ParentType, ContextType, QueryFontSettingsesConnectionArgs>,
  leafNode?: Resolver<Maybe<ResolversTypes['LeafNode']>, ParentType, ContextType, RequireFields<QueryLeafNodeArgs, 'where'>>,
  leafNodes?: Resolver<Array<Maybe<ResolversTypes['LeafNode']>>, ParentType, ContextType, QueryLeafNodesArgs>,
  leafNodesConnection?: Resolver<ResolversTypes['LeafNodeConnection'], ParentType, ContextType, QueryLeafNodesConnectionArgs>,
  nodeType?: Resolver<Maybe<ResolversTypes['NodeType']>, ParentType, ContextType, RequireFields<QueryNodeTypeArgs, 'where'>>,
  nodeTypes?: Resolver<Array<Maybe<ResolversTypes['NodeType']>>, ParentType, ContextType, QueryNodeTypesArgs>,
  nodeTypesConnection?: Resolver<ResolversTypes['NodeTypeConnection'], ParentType, ContextType, QueryNodeTypesConnectionArgs>,
  questionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<QueryQuestionConditionArgs, 'where'>>,
  questionConditions?: Resolver<Array<Maybe<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, QueryQuestionConditionsArgs>,
  questionConditionsConnection?: Resolver<ResolversTypes['QuestionConditionConnection'], ParentType, ContextType, QueryQuestionConditionsConnectionArgs>,
  questionNode?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType, RequireFields<QueryQuestionNodeArgs, 'where'>>,
  questionNodes?: Resolver<Array<Maybe<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QueryQuestionNodesArgs>,
  questionNodesConnection?: Resolver<ResolversTypes['QuestionNodeConnection'], ParentType, ContextType, QueryQuestionNodesConnectionArgs>,
  questionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<QueryQuestionOptionArgs, 'where'>>,
  questionOptions?: Resolver<Array<Maybe<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QueryQuestionOptionsArgs>,
  questionOptionsConnection?: Resolver<ResolversTypes['QuestionOptionConnection'], ParentType, ContextType, QueryQuestionOptionsConnectionArgs>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<QueryQuestionnaireArgs, 'where'>>,
  questionnaires?: Resolver<Array<Maybe<ResolversTypes['Questionnaire']>>, ParentType, ContextType, QueryQuestionnairesArgs>,
  questionnairesConnection?: Resolver<ResolversTypes['QuestionnaireConnection'], ParentType, ContextType, QueryQuestionnairesConnectionArgs>,
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
}>;

export type QuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionCondition'] = ResolversParentTypes['QuestionCondition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QuestionConditionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionConnection'] = ResolversParentTypes['QuestionConditionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionConditionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionCondition'], ParentType, ContextType>,
}>;

export type QuestionConditionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionEdge'] = ResolversParentTypes['QuestionConditionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionConditionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionPreviousValues'] = ResolversParentTypes['QuestionConditionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  conditionType?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  renderMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  renderMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  matchValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QuestionConditionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConditionSubscriptionPayload'] = ResolversParentTypes['QuestionConditionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionConditionPreviousValues']>, ParentType, ContextType>,
}>;

export type QuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['Questionnaire'] = ResolversParentTypes['Questionnaire']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  questions?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QuestionnaireQuestionsArgs>,
}>;

export type QuestionnaireConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireConnection'] = ResolversParentTypes['QuestionnaireConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionnaireEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionnaire'], ParentType, ContextType>,
}>;

export type QuestionnaireEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireEdge'] = ResolversParentTypes['QuestionnaireEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Questionnaire'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionnairePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnairePreviousValues'] = ResolversParentTypes['QuestionnairePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
}>;

export type QuestionnaireSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSubscriptionPayload'] = ResolversParentTypes['QuestionnaireSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionnairePreviousValues']>, ParentType, ContextType>,
}>;

export type QuestionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNode'] = ResolversParentTypes['QuestionNode']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  questionType?: Resolver<ResolversTypes['NodeType'], ParentType, ContextType>,
  overrideLeafId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  conditions?: Resolver<Maybe<Array<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, QuestionNodeConditionsArgs>,
  options?: Resolver<Maybe<Array<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QuestionNodeOptionsArgs>,
  children?: Resolver<Maybe<Array<ResolversTypes['QuestionNode']>>, ParentType, ContextType, QuestionNodeChildrenArgs>,
}>;

export type QuestionNodeConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeConnection'] = ResolversParentTypes['QuestionNodeConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionNodeEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionNode'], ParentType, ContextType>,
}>;

export type QuestionNodeEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeEdge'] = ResolversParentTypes['QuestionNodeEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionNode'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionNodePreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodePreviousValues'] = ResolversParentTypes['QuestionNodePreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  branchVal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  overrideLeafId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
}>;

export type QuestionNodeSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionNodeSubscriptionPayload'] = ResolversParentTypes['QuestionNodeSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionNode']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionNodePreviousValues']>, ParentType, ContextType>,
}>;

export type QuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOption'] = ResolversParentTypes['QuestionOption']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QuestionOptionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionConnection'] = ResolversParentTypes['QuestionOptionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionOptionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionOption'], ParentType, ContextType>,
}>;

export type QuestionOptionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionEdge'] = ResolversParentTypes['QuestionOptionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionOption'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionOptionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionPreviousValues'] = ResolversParentTypes['QuestionOptionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QuestionOptionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionOptionSubscriptionPayload'] = ResolversParentTypes['QuestionOptionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionOptionPreviousValues']>, ParentType, ContextType>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  colourSettings?: SubscriptionResolver<Maybe<ResolversTypes['ColourSettingsSubscriptionPayload']>, "colourSettings", ParentType, ContextType, SubscriptionColourSettingsArgs>,
  customer?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSubscriptionPayload']>, "customer", ParentType, ContextType, SubscriptionCustomerArgs>,
  customerSettings?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSettingsSubscriptionPayload']>, "customerSettings", ParentType, ContextType, SubscriptionCustomerSettingsArgs>,
  fontSettings?: SubscriptionResolver<Maybe<ResolversTypes['FontSettingsSubscriptionPayload']>, "fontSettings", ParentType, ContextType, SubscriptionFontSettingsArgs>,
  leafNode?: SubscriptionResolver<Maybe<ResolversTypes['LeafNodeSubscriptionPayload']>, "leafNode", ParentType, ContextType, SubscriptionLeafNodeArgs>,
  nodeType?: SubscriptionResolver<Maybe<ResolversTypes['NodeTypeSubscriptionPayload']>, "nodeType", ParentType, ContextType, SubscriptionNodeTypeArgs>,
  questionCondition?: SubscriptionResolver<Maybe<ResolversTypes['QuestionConditionSubscriptionPayload']>, "questionCondition", ParentType, ContextType, SubscriptionQuestionConditionArgs>,
  questionNode?: SubscriptionResolver<Maybe<ResolversTypes['QuestionNodeSubscriptionPayload']>, "questionNode", ParentType, ContextType, SubscriptionQuestionNodeArgs>,
  questionOption?: SubscriptionResolver<Maybe<ResolversTypes['QuestionOptionSubscriptionPayload']>, "questionOption", ParentType, ContextType, SubscriptionQuestionOptionArgs>,
  questionnaire?: SubscriptionResolver<Maybe<ResolversTypes['QuestionnaireSubscriptionPayload']>, "questionnaire", ParentType, ContextType, SubscriptionQuestionnaireArgs>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AggregateColourSettings?: AggregateColourSettingsResolvers<ContextType>,
  AggregateCustomer?: AggregateCustomerResolvers<ContextType>,
  AggregateCustomerSettings?: AggregateCustomerSettingsResolvers<ContextType>,
  AggregateFontSettings?: AggregateFontSettingsResolvers<ContextType>,
  AggregateLeafNode?: AggregateLeafNodeResolvers<ContextType>,
  AggregateNodeType?: AggregateNodeTypeResolvers<ContextType>,
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
  NodeType?: NodeTypeResolvers<ContextType>,
  NodeTypeConnection?: NodeTypeConnectionResolvers<ContextType>,
  NodeTypeEdge?: NodeTypeEdgeResolvers<ContextType>,
  NodeTypePreviousValues?: NodeTypePreviousValuesResolvers<ContextType>,
  NodeTypeSubscriptionPayload?: NodeTypeSubscriptionPayloadResolvers<ContextType>,
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
