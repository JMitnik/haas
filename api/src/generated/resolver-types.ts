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

export type AggregateColourSettings = {
   __typename?: 'AggregateColourSettings',
  count: Scalars['Int'],
};

export type AggregateCustomer = {
   __typename?: 'AggregateCustomer',
  count: Scalars['Int'],
};

export type AggregateFontSettings = {
   __typename?: 'AggregateFontSettings',
  count: Scalars['Int'],
};

export type AggregateQuestion = {
   __typename?: 'AggregateQuestion',
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

export type AggregateQuestionnaireSettings = {
   __typename?: 'AggregateQuestionnaireSettings',
  count: Scalars['Int'],
};

export type AggregateQuestionOption = {
   __typename?: 'AggregateQuestionOption',
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
  questionnaires?: Maybe<Array<Questionnaire>>,
};


export type CustomerQuestionnairesArgs = {
  where?: Maybe<QuestionnaireWhereInput>,
  orderBy?: Maybe<QuestionnaireOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};

export type CustomerConnection = {
   __typename?: 'CustomerConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<CustomerEdge>>,
  aggregate: AggregateCustomer,
};

export type CustomerCreateInput = {
  id?: Maybe<Scalars['ID']>,
  questionnaires?: Maybe<QuestionnaireCreateManyInput>,
};

export type CustomerEdge = {
   __typename?: 'CustomerEdge',
  node: Customer,
  cursor: Scalars['String'],
};

export enum CustomerOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type CustomerPreviousValues = {
   __typename?: 'CustomerPreviousValues',
  id: Scalars['ID'],
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

export type CustomerUpdateInput = {
  questionnaires?: Maybe<QuestionnaireUpdateManyInput>,
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
  questionnaires_every?: Maybe<QuestionnaireWhereInput>,
  questionnaires_some?: Maybe<QuestionnaireWhereInput>,
  questionnaires_none?: Maybe<QuestionnaireWhereInput>,
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
  upsertCustomer: Customer,
  deleteCustomer?: Maybe<Customer>,
  deleteManyCustomers: BatchPayload,
  createFontSettings: FontSettings,
  updateFontSettings?: Maybe<FontSettings>,
  updateManyFontSettingses: BatchPayload,
  upsertFontSettings: FontSettings,
  deleteFontSettings?: Maybe<FontSettings>,
  deleteManyFontSettingses: BatchPayload,
  createQuestion: Question,
  updateQuestion?: Maybe<Question>,
  updateManyQuestions: BatchPayload,
  upsertQuestion: Question,
  deleteQuestion?: Maybe<Question>,
  deleteManyQuestions: BatchPayload,
  createQuestionCondition: QuestionCondition,
  updateQuestionCondition?: Maybe<QuestionCondition>,
  updateManyQuestionConditions: BatchPayload,
  upsertQuestionCondition: QuestionCondition,
  deleteQuestionCondition?: Maybe<QuestionCondition>,
  deleteManyQuestionConditions: BatchPayload,
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
  createQuestionnaireSettings: QuestionnaireSettings,
  updateQuestionnaireSettings?: Maybe<QuestionnaireSettings>,
  updateManyQuestionnaireSettingses: BatchPayload,
  upsertQuestionnaireSettings: QuestionnaireSettings,
  deleteQuestionnaireSettings?: Maybe<QuestionnaireSettings>,
  deleteManyQuestionnaireSettingses: BatchPayload,
  createTopic: Topic,
  updateTopic?: Maybe<Topic>,
  updateManyTopics: BatchPayload,
  upsertTopic: Topic,
  deleteTopic?: Maybe<Topic>,
  deleteManyTopics: BatchPayload,
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


export type MutationCreateQuestionArgs = {
  data: QuestionCreateInput
};


export type MutationUpdateQuestionArgs = {
  data: QuestionUpdateInput,
  where: QuestionWhereUniqueInput
};


export type MutationUpdateManyQuestionsArgs = {
  data: QuestionUpdateManyMutationInput,
  where?: Maybe<QuestionWhereInput>
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


export type MutationCreateQuestionnaireSettingsArgs = {
  data: QuestionnaireSettingsCreateInput
};


export type MutationUpdateQuestionnaireSettingsArgs = {
  data: QuestionnaireSettingsUpdateInput,
  where: QuestionnaireSettingsWhereUniqueInput
};


export type MutationUpdateManyQuestionnaireSettingsesArgs = {
  data: QuestionnaireSettingsUpdateManyMutationInput,
  where?: Maybe<QuestionnaireSettingsWhereInput>
};


export type MutationUpsertQuestionnaireSettingsArgs = {
  where: QuestionnaireSettingsWhereUniqueInput,
  create: QuestionnaireSettingsCreateInput,
  update: QuestionnaireSettingsUpdateInput
};


export type MutationDeleteQuestionnaireSettingsArgs = {
  where: QuestionnaireSettingsWhereUniqueInput
};


export type MutationDeleteManyQuestionnaireSettingsesArgs = {
  where?: Maybe<QuestionnaireSettingsWhereInput>
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
  colourSettings?: Maybe<ColourSettings>,
  colourSettingses: Array<Maybe<ColourSettings>>,
  colourSettingsesConnection: ColourSettingsConnection,
  customer?: Maybe<Customer>,
  customers: Array<Maybe<Customer>>,
  customersConnection: CustomerConnection,
  fontSettings?: Maybe<FontSettings>,
  fontSettingses: Array<Maybe<FontSettings>>,
  fontSettingsesConnection: FontSettingsConnection,
  question?: Maybe<Question>,
  questions: Array<Maybe<Question>>,
  questionsConnection: QuestionConnection,
  questionCondition?: Maybe<QuestionCondition>,
  questionConditions: Array<Maybe<QuestionCondition>>,
  questionConditionsConnection: QuestionConditionConnection,
  questionOption?: Maybe<QuestionOption>,
  questionOptions: Array<Maybe<QuestionOption>>,
  questionOptionsConnection: QuestionOptionConnection,
  questionnaire?: Maybe<Questionnaire>,
  questionnaires: Array<Maybe<Questionnaire>>,
  questionnairesConnection: QuestionnaireConnection,
  questionnaireSettings?: Maybe<QuestionnaireSettings>,
  questionnaireSettingses: Array<Maybe<QuestionnaireSettings>>,
  questionnaireSettingsesConnection: QuestionnaireSettingsConnection,
  topic?: Maybe<Topic>,
  topics: Array<Maybe<Topic>>,
  topicsConnection: TopicConnection,
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


export type QueryQuestionnaireSettingsArgs = {
  where: QuestionnaireSettingsWhereUniqueInput
};


export type QueryQuestionnaireSettingsesArgs = {
  where?: Maybe<QuestionnaireSettingsWhereInput>,
  orderBy?: Maybe<QuestionnaireSettingsOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QueryQuestionnaireSettingsesConnectionArgs = {
  where?: Maybe<QuestionnaireSettingsWhereInput>,
  orderBy?: Maybe<QuestionnaireSettingsOrderByInput>,
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
  questionnaireId: Scalars['ID'],
  title: Scalars['String'],
  type: Scalars['String'],
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<Array<QuestionCondition>>,
  options?: Maybe<Array<QuestionOption>>,
  children?: Maybe<Array<Question>>,
};


export type QuestionConditionsArgs = {
  where?: Maybe<QuestionConditionWhereInput>,
  orderBy?: Maybe<QuestionConditionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
};


export type QuestionOptionsArgs = {
  where?: Maybe<QuestionOptionWhereInput>,
  orderBy?: Maybe<QuestionOptionOrderByInput>,
  skip?: Maybe<Scalars['Int']>,
  after?: Maybe<Scalars['String']>,
  before?: Maybe<Scalars['String']>,
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>
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

export type QuestionCondition = {
   __typename?: 'QuestionCondition',
  id: Scalars['ID'],
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
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateInput = {
  renderMin?: Maybe<Scalars['Int']>,
  renderMax?: Maybe<Scalars['Int']>,
  matchValue?: Maybe<Scalars['String']>,
};

export type QuestionConditionUpdateManyDataInput = {
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

export type QuestionConnection = {
   __typename?: 'QuestionConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionEdge>>,
  aggregate: AggregateQuestion,
};

export type QuestionCreateInput = {
  id?: Maybe<Scalars['ID']>,
  questionnaireId: Scalars['ID'],
  title: Scalars['String'],
  type: Scalars['String'],
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionCreateManyInput>,
  options?: Maybe<QuestionOptionCreateManyInput>,
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

export type Questionnaire = {
   __typename?: 'Questionnaire',
  id: Scalars['ID'],
  customerId: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  setting: QuestionnaireSettings,
  creationDate: Scalars['String'],
  questions?: Maybe<Array<Question>>,
};


export type QuestionnaireQuestionsArgs = {
  where?: Maybe<QuestionWhereInput>,
  orderBy?: Maybe<QuestionOrderByInput>,
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
  customerId: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  setting: QuestionnaireSettingsCreateOneInput,
  creationDate: Scalars['String'],
  questions?: Maybe<QuestionCreateManyInput>,
};

export type QuestionnaireCreateManyInput = {
  create?: Maybe<Array<QuestionnaireCreateInput>>,
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
};

export type QuestionnaireEdge = {
   __typename?: 'QuestionnaireEdge',
  node: Questionnaire,
  cursor: Scalars['String'],
};

export enum QuestionnaireOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CustomerIdAsc = 'customerId_ASC',
  CustomerIdDesc = 'customerId_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  PublicTitleAsc = 'publicTitle_ASC',
  PublicTitleDesc = 'publicTitle_DESC',
  CreationDateAsc = 'creationDate_ASC',
  CreationDateDesc = 'creationDate_DESC'
}

export type QuestionnairePreviousValues = {
   __typename?: 'QuestionnairePreviousValues',
  id: Scalars['ID'],
  customerId: Scalars['ID'],
  title: Scalars['String'],
  description: Scalars['String'],
  publicTitle?: Maybe<Scalars['String']>,
  creationDate: Scalars['String'],
};

export type QuestionnaireScalarWhereInput = {
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
  customerId?: Maybe<Scalars['ID']>,
  customerId_not?: Maybe<Scalars['ID']>,
  customerId_in?: Maybe<Array<Scalars['ID']>>,
  customerId_not_in?: Maybe<Array<Scalars['ID']>>,
  customerId_lt?: Maybe<Scalars['ID']>,
  customerId_lte?: Maybe<Scalars['ID']>,
  customerId_gt?: Maybe<Scalars['ID']>,
  customerId_gte?: Maybe<Scalars['ID']>,
  customerId_contains?: Maybe<Scalars['ID']>,
  customerId_not_contains?: Maybe<Scalars['ID']>,
  customerId_starts_with?: Maybe<Scalars['ID']>,
  customerId_not_starts_with?: Maybe<Scalars['ID']>,
  customerId_ends_with?: Maybe<Scalars['ID']>,
  customerId_not_ends_with?: Maybe<Scalars['ID']>,
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
  creationDate?: Maybe<Scalars['String']>,
  creationDate_not?: Maybe<Scalars['String']>,
  creationDate_in?: Maybe<Array<Scalars['String']>>,
  creationDate_not_in?: Maybe<Array<Scalars['String']>>,
  creationDate_lt?: Maybe<Scalars['String']>,
  creationDate_lte?: Maybe<Scalars['String']>,
  creationDate_gt?: Maybe<Scalars['String']>,
  creationDate_gte?: Maybe<Scalars['String']>,
  creationDate_contains?: Maybe<Scalars['String']>,
  creationDate_not_contains?: Maybe<Scalars['String']>,
  creationDate_starts_with?: Maybe<Scalars['String']>,
  creationDate_not_starts_with?: Maybe<Scalars['String']>,
  creationDate_ends_with?: Maybe<Scalars['String']>,
  creationDate_not_ends_with?: Maybe<Scalars['String']>,
  AND?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  OR?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireScalarWhereInput>>,
};

export type QuestionnaireSettings = {
   __typename?: 'QuestionnaireSettings',
  id: Scalars['ID'],
  customerId: Scalars['ID'],
  questionnaireId: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings: ColourSettings,
  fontSettings: FontSettings,
};

export type QuestionnaireSettingsConnection = {
   __typename?: 'QuestionnaireSettingsConnection',
  pageInfo: PageInfo,
  edges: Array<Maybe<QuestionnaireSettingsEdge>>,
  aggregate: AggregateQuestionnaireSettings,
};

export type QuestionnaireSettingsCreateInput = {
  id?: Maybe<Scalars['ID']>,
  customerId: Scalars['ID'],
  questionnaireId: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings: ColourSettingsCreateOneInput,
  fontSettings: FontSettingsCreateOneInput,
};

export type QuestionnaireSettingsCreateOneInput = {
  create?: Maybe<QuestionnaireSettingsCreateInput>,
  connect?: Maybe<QuestionnaireSettingsWhereUniqueInput>,
};

export type QuestionnaireSettingsEdge = {
   __typename?: 'QuestionnaireSettingsEdge',
  node: QuestionnaireSettings,
  cursor: Scalars['String'],
};

export enum QuestionnaireSettingsOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  CustomerIdAsc = 'customerId_ASC',
  CustomerIdDesc = 'customerId_DESC',
  QuestionnaireIdAsc = 'questionnaireId_ASC',
  QuestionnaireIdDesc = 'questionnaireId_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  LogoAsc = 'logo_ASC',
  LogoDesc = 'logo_DESC'
}

export type QuestionnaireSettingsPreviousValues = {
   __typename?: 'QuestionnaireSettingsPreviousValues',
  id: Scalars['ID'],
  customerId: Scalars['ID'],
  questionnaireId: Scalars['ID'],
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
};

export type QuestionnaireSettingsSubscriptionPayload = {
   __typename?: 'QuestionnaireSettingsSubscriptionPayload',
  mutation: MutationType,
  node?: Maybe<QuestionnaireSettings>,
  updatedFields?: Maybe<Array<Scalars['String']>>,
  previousValues?: Maybe<QuestionnaireSettingsPreviousValues>,
};

export type QuestionnaireSettingsSubscriptionWhereInput = {
  mutation_in?: Maybe<Array<MutationType>>,
  updatedFields_contains?: Maybe<Scalars['String']>,
  updatedFields_contains_every?: Maybe<Array<Scalars['String']>>,
  updatedFields_contains_some?: Maybe<Array<Scalars['String']>>,
  node?: Maybe<QuestionnaireSettingsWhereInput>,
  AND?: Maybe<Array<QuestionnaireSettingsSubscriptionWhereInput>>,
  OR?: Maybe<Array<QuestionnaireSettingsSubscriptionWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireSettingsSubscriptionWhereInput>>,
};

export type QuestionnaireSettingsUpdateDataInput = {
  customerId?: Maybe<Scalars['ID']>,
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings?: Maybe<ColourSettingsUpdateOneRequiredInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneRequiredInput>,
};

export type QuestionnaireSettingsUpdateInput = {
  customerId?: Maybe<Scalars['ID']>,
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  colourSettings?: Maybe<ColourSettingsUpdateOneRequiredInput>,
  fontSettings?: Maybe<FontSettingsUpdateOneRequiredInput>,
};

export type QuestionnaireSettingsUpdateManyMutationInput = {
  customerId?: Maybe<Scalars['ID']>,
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
};

export type QuestionnaireSettingsUpdateOneRequiredInput = {
  create?: Maybe<QuestionnaireSettingsCreateInput>,
  update?: Maybe<QuestionnaireSettingsUpdateDataInput>,
  upsert?: Maybe<QuestionnaireSettingsUpsertNestedInput>,
  connect?: Maybe<QuestionnaireSettingsWhereUniqueInput>,
};

export type QuestionnaireSettingsUpsertNestedInput = {
  update: QuestionnaireSettingsUpdateDataInput,
  create: QuestionnaireSettingsCreateInput,
};

export type QuestionnaireSettingsWhereInput = {
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
  customerId?: Maybe<Scalars['ID']>,
  customerId_not?: Maybe<Scalars['ID']>,
  customerId_in?: Maybe<Array<Scalars['ID']>>,
  customerId_not_in?: Maybe<Array<Scalars['ID']>>,
  customerId_lt?: Maybe<Scalars['ID']>,
  customerId_lte?: Maybe<Scalars['ID']>,
  customerId_gt?: Maybe<Scalars['ID']>,
  customerId_gte?: Maybe<Scalars['ID']>,
  customerId_contains?: Maybe<Scalars['ID']>,
  customerId_not_contains?: Maybe<Scalars['ID']>,
  customerId_starts_with?: Maybe<Scalars['ID']>,
  customerId_not_starts_with?: Maybe<Scalars['ID']>,
  customerId_ends_with?: Maybe<Scalars['ID']>,
  customerId_not_ends_with?: Maybe<Scalars['ID']>,
  questionnaireId?: Maybe<Scalars['ID']>,
  questionnaireId_not?: Maybe<Scalars['ID']>,
  questionnaireId_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_not_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_lt?: Maybe<Scalars['ID']>,
  questionnaireId_lte?: Maybe<Scalars['ID']>,
  questionnaireId_gt?: Maybe<Scalars['ID']>,
  questionnaireId_gte?: Maybe<Scalars['ID']>,
  questionnaireId_contains?: Maybe<Scalars['ID']>,
  questionnaireId_not_contains?: Maybe<Scalars['ID']>,
  questionnaireId_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_ends_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_ends_with?: Maybe<Scalars['ID']>,
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
  AND?: Maybe<Array<QuestionnaireSettingsWhereInput>>,
  OR?: Maybe<Array<QuestionnaireSettingsWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireSettingsWhereInput>>,
};

export type QuestionnaireSettingsWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>,
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

export type QuestionnaireUpdateDataInput = {
  customerId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  setting?: Maybe<QuestionnaireSettingsUpdateOneRequiredInput>,
  creationDate?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionnaireUpdateInput = {
  customerId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  setting?: Maybe<QuestionnaireSettingsUpdateOneRequiredInput>,
  creationDate?: Maybe<Scalars['String']>,
  questions?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionnaireUpdateManyDataInput = {
  customerId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  creationDate?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateManyInput = {
  create?: Maybe<Array<QuestionnaireCreateInput>>,
  update?: Maybe<Array<QuestionnaireUpdateWithWhereUniqueNestedInput>>,
  upsert?: Maybe<Array<QuestionnaireUpsertWithWhereUniqueNestedInput>>,
  delete?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  connect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  set?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  disconnect?: Maybe<Array<QuestionnaireWhereUniqueInput>>,
  deleteMany?: Maybe<Array<QuestionnaireScalarWhereInput>>,
  updateMany?: Maybe<Array<QuestionnaireUpdateManyWithWhereNestedInput>>,
};

export type QuestionnaireUpdateManyMutationInput = {
  customerId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  publicTitle?: Maybe<Scalars['String']>,
  creationDate?: Maybe<Scalars['String']>,
};

export type QuestionnaireUpdateManyWithWhereNestedInput = {
  where: QuestionnaireScalarWhereInput,
  data: QuestionnaireUpdateManyDataInput,
};

export type QuestionnaireUpdateWithWhereUniqueNestedInput = {
  where: QuestionnaireWhereUniqueInput,
  data: QuestionnaireUpdateDataInput,
};

export type QuestionnaireUpsertWithWhereUniqueNestedInput = {
  where: QuestionnaireWhereUniqueInput,
  update: QuestionnaireUpdateDataInput,
  create: QuestionnaireCreateInput,
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
  customerId?: Maybe<Scalars['ID']>,
  customerId_not?: Maybe<Scalars['ID']>,
  customerId_in?: Maybe<Array<Scalars['ID']>>,
  customerId_not_in?: Maybe<Array<Scalars['ID']>>,
  customerId_lt?: Maybe<Scalars['ID']>,
  customerId_lte?: Maybe<Scalars['ID']>,
  customerId_gt?: Maybe<Scalars['ID']>,
  customerId_gte?: Maybe<Scalars['ID']>,
  customerId_contains?: Maybe<Scalars['ID']>,
  customerId_not_contains?: Maybe<Scalars['ID']>,
  customerId_starts_with?: Maybe<Scalars['ID']>,
  customerId_not_starts_with?: Maybe<Scalars['ID']>,
  customerId_ends_with?: Maybe<Scalars['ID']>,
  customerId_not_ends_with?: Maybe<Scalars['ID']>,
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
  setting?: Maybe<QuestionnaireSettingsWhereInput>,
  creationDate?: Maybe<Scalars['String']>,
  creationDate_not?: Maybe<Scalars['String']>,
  creationDate_in?: Maybe<Array<Scalars['String']>>,
  creationDate_not_in?: Maybe<Array<Scalars['String']>>,
  creationDate_lt?: Maybe<Scalars['String']>,
  creationDate_lte?: Maybe<Scalars['String']>,
  creationDate_gt?: Maybe<Scalars['String']>,
  creationDate_gte?: Maybe<Scalars['String']>,
  creationDate_contains?: Maybe<Scalars['String']>,
  creationDate_not_contains?: Maybe<Scalars['String']>,
  creationDate_starts_with?: Maybe<Scalars['String']>,
  creationDate_not_starts_with?: Maybe<Scalars['String']>,
  creationDate_ends_with?: Maybe<Scalars['String']>,
  creationDate_not_ends_with?: Maybe<Scalars['String']>,
  questions_every?: Maybe<QuestionWhereInput>,
  questions_some?: Maybe<QuestionWhereInput>,
  questions_none?: Maybe<QuestionWhereInput>,
  AND?: Maybe<Array<QuestionnaireWhereInput>>,
  OR?: Maybe<Array<QuestionnaireWhereInput>>,
  NOT?: Maybe<Array<QuestionnaireWhereInput>>,
};

export type QuestionnaireWhereUniqueInput = {
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

export enum QuestionOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  QuestionnaireIdAsc = 'questionnaireId_ASC',
  QuestionnaireIdDesc = 'questionnaireId_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC',
  OverrideLeafIdAsc = 'overrideLeafId_ASC',
  OverrideLeafIdDesc = 'overrideLeafId_DESC'
}

export type QuestionPreviousValues = {
   __typename?: 'QuestionPreviousValues',
  id: Scalars['ID'],
  questionnaireId: Scalars['ID'],
  title: Scalars['String'],
  type: Scalars['String'],
  overrideLeafId?: Maybe<Scalars['Int']>,
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
  questionnaireId?: Maybe<Scalars['ID']>,
  questionnaireId_not?: Maybe<Scalars['ID']>,
  questionnaireId_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_not_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_lt?: Maybe<Scalars['ID']>,
  questionnaireId_lte?: Maybe<Scalars['ID']>,
  questionnaireId_gt?: Maybe<Scalars['ID']>,
  questionnaireId_gte?: Maybe<Scalars['ID']>,
  questionnaireId_contains?: Maybe<Scalars['ID']>,
  questionnaireId_not_contains?: Maybe<Scalars['ID']>,
  questionnaireId_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_ends_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_ends_with?: Maybe<Scalars['ID']>,
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
  overrideLeafId?: Maybe<Scalars['Int']>,
  overrideLeafId_not?: Maybe<Scalars['Int']>,
  overrideLeafId_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_not_in?: Maybe<Array<Scalars['Int']>>,
  overrideLeafId_lt?: Maybe<Scalars['Int']>,
  overrideLeafId_lte?: Maybe<Scalars['Int']>,
  overrideLeafId_gt?: Maybe<Scalars['Int']>,
  overrideLeafId_gte?: Maybe<Scalars['Int']>,
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
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  children?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionUpdateInput = {
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
  conditions?: Maybe<QuestionConditionUpdateManyInput>,
  options?: Maybe<QuestionOptionUpdateManyInput>,
  children?: Maybe<QuestionUpdateManyInput>,
};

export type QuestionUpdateManyDataInput = {
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
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
  updateMany?: Maybe<Array<QuestionUpdateManyWithWhereNestedInput>>,
};

export type QuestionUpdateManyMutationInput = {
  questionnaireId?: Maybe<Scalars['ID']>,
  title?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  overrideLeafId?: Maybe<Scalars['Int']>,
};

export type QuestionUpdateManyWithWhereNestedInput = {
  where: QuestionScalarWhereInput,
  data: QuestionUpdateManyDataInput,
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
  questionnaireId?: Maybe<Scalars['ID']>,
  questionnaireId_not?: Maybe<Scalars['ID']>,
  questionnaireId_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_not_in?: Maybe<Array<Scalars['ID']>>,
  questionnaireId_lt?: Maybe<Scalars['ID']>,
  questionnaireId_lte?: Maybe<Scalars['ID']>,
  questionnaireId_gt?: Maybe<Scalars['ID']>,
  questionnaireId_gte?: Maybe<Scalars['ID']>,
  questionnaireId_contains?: Maybe<Scalars['ID']>,
  questionnaireId_not_contains?: Maybe<Scalars['ID']>,
  questionnaireId_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_starts_with?: Maybe<Scalars['ID']>,
  questionnaireId_ends_with?: Maybe<Scalars['ID']>,
  questionnaireId_not_ends_with?: Maybe<Scalars['ID']>,
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
  colourSettings?: Maybe<ColourSettingsSubscriptionPayload>,
  customer?: Maybe<CustomerSubscriptionPayload>,
  fontSettings?: Maybe<FontSettingsSubscriptionPayload>,
  question?: Maybe<QuestionSubscriptionPayload>,
  questionCondition?: Maybe<QuestionConditionSubscriptionPayload>,
  questionOption?: Maybe<QuestionOptionSubscriptionPayload>,
  questionnaire?: Maybe<QuestionnaireSubscriptionPayload>,
  questionnaireSettings?: Maybe<QuestionnaireSettingsSubscriptionPayload>,
  topic?: Maybe<TopicSubscriptionPayload>,
};


export type SubscriptionColourSettingsArgs = {
  where?: Maybe<ColourSettingsSubscriptionWhereInput>
};


export type SubscriptionCustomerArgs = {
  where?: Maybe<CustomerSubscriptionWhereInput>
};


export type SubscriptionFontSettingsArgs = {
  where?: Maybe<FontSettingsSubscriptionWhereInput>
};


export type SubscriptionQuestionArgs = {
  where?: Maybe<QuestionSubscriptionWhereInput>
};


export type SubscriptionQuestionConditionArgs = {
  where?: Maybe<QuestionConditionSubscriptionWhereInput>
};


export type SubscriptionQuestionOptionArgs = {
  where?: Maybe<QuestionOptionSubscriptionWhereInput>
};


export type SubscriptionQuestionnaireArgs = {
  where?: Maybe<QuestionnaireSubscriptionWhereInput>
};


export type SubscriptionQuestionnaireSettingsArgs = {
  where?: Maybe<QuestionnaireSettingsSubscriptionWhereInput>
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
  QuestionnaireSettingsWhereInput: QuestionnaireSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  QuestionWhereInput: QuestionWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  Questionnaire: ResolverTypeWrapper<Questionnaire>,
  QuestionnaireSettings: ResolverTypeWrapper<QuestionnaireSettings>,
  FontSettings: ResolverTypeWrapper<FontSettings>,
  QuestionOrderByInput: QuestionOrderByInput,
  Question: ResolverTypeWrapper<Question>,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: ResolverTypeWrapper<QuestionCondition>,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: ResolverTypeWrapper<QuestionOption>,
  CustomerWhereInput: CustomerWhereInput,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: ResolverTypeWrapper<CustomerConnection>,
  CustomerEdge: ResolverTypeWrapper<CustomerEdge>,
  AggregateCustomer: ResolverTypeWrapper<AggregateCustomer>,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: ResolverTypeWrapper<FontSettingsConnection>,
  FontSettingsEdge: ResolverTypeWrapper<FontSettingsEdge>,
  AggregateFontSettings: ResolverTypeWrapper<AggregateFontSettings>,
  QuestionWhereUniqueInput: QuestionWhereUniqueInput,
  QuestionConnection: ResolverTypeWrapper<QuestionConnection>,
  QuestionEdge: ResolverTypeWrapper<QuestionEdge>,
  AggregateQuestion: ResolverTypeWrapper<AggregateQuestion>,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: ResolverTypeWrapper<QuestionConditionConnection>,
  QuestionConditionEdge: ResolverTypeWrapper<QuestionConditionEdge>,
  AggregateQuestionCondition: ResolverTypeWrapper<AggregateQuestionCondition>,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: ResolverTypeWrapper<QuestionOptionConnection>,
  QuestionOptionEdge: ResolverTypeWrapper<QuestionOptionEdge>,
  AggregateQuestionOption: ResolverTypeWrapper<AggregateQuestionOption>,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: ResolverTypeWrapper<QuestionnaireConnection>,
  QuestionnaireEdge: ResolverTypeWrapper<QuestionnaireEdge>,
  AggregateQuestionnaire: ResolverTypeWrapper<AggregateQuestionnaire>,
  QuestionnaireSettingsWhereUniqueInput: QuestionnaireSettingsWhereUniqueInput,
  QuestionnaireSettingsOrderByInput: QuestionnaireSettingsOrderByInput,
  QuestionnaireSettingsConnection: ResolverTypeWrapper<QuestionnaireSettingsConnection>,
  QuestionnaireSettingsEdge: ResolverTypeWrapper<QuestionnaireSettingsEdge>,
  AggregateQuestionnaireSettings: ResolverTypeWrapper<AggregateQuestionnaireSettings>,
  TopicWhereUniqueInput: TopicWhereUniqueInput,
  Topic: ResolverTypeWrapper<Topic>,
  TopicWhereInput: TopicWhereInput,
  TopicOrderByInput: TopicOrderByInput,
  TopicConnection: ResolverTypeWrapper<TopicConnection>,
  TopicEdge: ResolverTypeWrapper<TopicEdge>,
  AggregateTopic: ResolverTypeWrapper<AggregateTopic>,
  Node: ResolverTypeWrapper<Node>,
  Mutation: ResolverTypeWrapper<{}>,
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: ResolverTypeWrapper<BatchPayload>,
  Long: ResolverTypeWrapper<Scalars['Long']>,
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyInput: QuestionnaireCreateManyInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  QuestionnaireSettingsCreateOneInput: QuestionnaireSettingsCreateOneInput,
  QuestionnaireSettingsCreateInput: QuestionnaireSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  QuestionCreateManyInput: QuestionCreateManyInput,
  QuestionCreateInput: QuestionCreateInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyInput: QuestionnaireUpdateManyInput,
  QuestionnaireUpdateWithWhereUniqueNestedInput: QuestionnaireUpdateWithWhereUniqueNestedInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  QuestionnaireSettingsUpdateOneRequiredInput: QuestionnaireSettingsUpdateOneRequiredInput,
  QuestionnaireSettingsUpdateDataInput: QuestionnaireSettingsUpdateDataInput,
  ColourSettingsUpdateOneRequiredInput: ColourSettingsUpdateOneRequiredInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneRequiredInput: FontSettingsUpdateOneRequiredInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  QuestionnaireSettingsUpsertNestedInput: QuestionnaireSettingsUpsertNestedInput,
  QuestionUpdateManyInput: QuestionUpdateManyInput,
  QuestionUpdateWithWhereUniqueNestedInput: QuestionUpdateWithWhereUniqueNestedInput,
  QuestionUpdateDataInput: QuestionUpdateDataInput,
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
  QuestionUpsertWithWhereUniqueNestedInput: QuestionUpsertWithWhereUniqueNestedInput,
  QuestionScalarWhereInput: QuestionScalarWhereInput,
  QuestionUpdateManyWithWhereNestedInput: QuestionUpdateManyWithWhereNestedInput,
  QuestionUpdateManyDataInput: QuestionUpdateManyDataInput,
  QuestionnaireUpsertWithWhereUniqueNestedInput: QuestionnaireUpsertWithWhereUniqueNestedInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  QuestionUpdateInput: QuestionUpdateInput,
  QuestionUpdateManyMutationInput: QuestionUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  QuestionnaireSettingsUpdateInput: QuestionnaireSettingsUpdateInput,
  QuestionnaireSettingsUpdateManyMutationInput: QuestionnaireSettingsUpdateManyMutationInput,
  TopicCreateInput: TopicCreateInput,
  TopicUpdateInput: TopicUpdateInput,
  TopicUpdateManyMutationInput: TopicUpdateManyMutationInput,
  Subscription: ResolverTypeWrapper<{}>,
  ColourSettingsSubscriptionWhereInput: ColourSettingsSubscriptionWhereInput,
  MutationType: MutationType,
  ColourSettingsSubscriptionPayload: ResolverTypeWrapper<ColourSettingsSubscriptionPayload>,
  ColourSettingsPreviousValues: ResolverTypeWrapper<ColourSettingsPreviousValues>,
  CustomerSubscriptionWhereInput: CustomerSubscriptionWhereInput,
  CustomerSubscriptionPayload: ResolverTypeWrapper<CustomerSubscriptionPayload>,
  CustomerPreviousValues: ResolverTypeWrapper<CustomerPreviousValues>,
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: ResolverTypeWrapper<FontSettingsSubscriptionPayload>,
  FontSettingsPreviousValues: ResolverTypeWrapper<FontSettingsPreviousValues>,
  QuestionSubscriptionWhereInput: QuestionSubscriptionWhereInput,
  QuestionSubscriptionPayload: ResolverTypeWrapper<QuestionSubscriptionPayload>,
  QuestionPreviousValues: ResolverTypeWrapper<QuestionPreviousValues>,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: ResolverTypeWrapper<QuestionConditionSubscriptionPayload>,
  QuestionConditionPreviousValues: ResolverTypeWrapper<QuestionConditionPreviousValues>,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: ResolverTypeWrapper<QuestionOptionSubscriptionPayload>,
  QuestionOptionPreviousValues: ResolverTypeWrapper<QuestionOptionPreviousValues>,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: ResolverTypeWrapper<QuestionnaireSubscriptionPayload>,
  QuestionnairePreviousValues: ResolverTypeWrapper<QuestionnairePreviousValues>,
  QuestionnaireSettingsSubscriptionWhereInput: QuestionnaireSettingsSubscriptionWhereInput,
  QuestionnaireSettingsSubscriptionPayload: ResolverTypeWrapper<QuestionnaireSettingsSubscriptionPayload>,
  QuestionnaireSettingsPreviousValues: ResolverTypeWrapper<QuestionnaireSettingsPreviousValues>,
  TopicSubscriptionWhereInput: TopicSubscriptionWhereInput,
  TopicSubscriptionPayload: ResolverTypeWrapper<TopicSubscriptionPayload>,
  TopicPreviousValues: ResolverTypeWrapper<TopicPreviousValues>,
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
  QuestionnaireSettingsWhereInput: QuestionnaireSettingsWhereInput,
  FontSettingsWhereInput: FontSettingsWhereInput,
  QuestionWhereInput: QuestionWhereInput,
  QuestionConditionWhereInput: QuestionConditionWhereInput,
  QuestionOptionWhereInput: QuestionOptionWhereInput,
  QuestionnaireOrderByInput: QuestionnaireOrderByInput,
  Questionnaire: Questionnaire,
  QuestionnaireSettings: QuestionnaireSettings,
  FontSettings: FontSettings,
  QuestionOrderByInput: QuestionOrderByInput,
  Question: Question,
  QuestionConditionOrderByInput: QuestionConditionOrderByInput,
  QuestionCondition: QuestionCondition,
  QuestionOptionOrderByInput: QuestionOptionOrderByInput,
  QuestionOption: QuestionOption,
  CustomerWhereInput: CustomerWhereInput,
  CustomerOrderByInput: CustomerOrderByInput,
  CustomerConnection: CustomerConnection,
  CustomerEdge: CustomerEdge,
  AggregateCustomer: AggregateCustomer,
  FontSettingsWhereUniqueInput: FontSettingsWhereUniqueInput,
  FontSettingsOrderByInput: FontSettingsOrderByInput,
  FontSettingsConnection: FontSettingsConnection,
  FontSettingsEdge: FontSettingsEdge,
  AggregateFontSettings: AggregateFontSettings,
  QuestionWhereUniqueInput: QuestionWhereUniqueInput,
  QuestionConnection: QuestionConnection,
  QuestionEdge: QuestionEdge,
  AggregateQuestion: AggregateQuestion,
  QuestionConditionWhereUniqueInput: QuestionConditionWhereUniqueInput,
  QuestionConditionConnection: QuestionConditionConnection,
  QuestionConditionEdge: QuestionConditionEdge,
  AggregateQuestionCondition: AggregateQuestionCondition,
  QuestionOptionWhereUniqueInput: QuestionOptionWhereUniqueInput,
  QuestionOptionConnection: QuestionOptionConnection,
  QuestionOptionEdge: QuestionOptionEdge,
  AggregateQuestionOption: AggregateQuestionOption,
  QuestionnaireWhereUniqueInput: QuestionnaireWhereUniqueInput,
  QuestionnaireConnection: QuestionnaireConnection,
  QuestionnaireEdge: QuestionnaireEdge,
  AggregateQuestionnaire: AggregateQuestionnaire,
  QuestionnaireSettingsWhereUniqueInput: QuestionnaireSettingsWhereUniqueInput,
  QuestionnaireSettingsOrderByInput: QuestionnaireSettingsOrderByInput,
  QuestionnaireSettingsConnection: QuestionnaireSettingsConnection,
  QuestionnaireSettingsEdge: QuestionnaireSettingsEdge,
  AggregateQuestionnaireSettings: AggregateQuestionnaireSettings,
  TopicWhereUniqueInput: TopicWhereUniqueInput,
  Topic: Topic,
  TopicWhereInput: TopicWhereInput,
  TopicOrderByInput: TopicOrderByInput,
  TopicConnection: TopicConnection,
  TopicEdge: TopicEdge,
  AggregateTopic: AggregateTopic,
  Node: Node,
  Mutation: {},
  ColourSettingsCreateInput: ColourSettingsCreateInput,
  ColourSettingsUpdateInput: ColourSettingsUpdateInput,
  ColourSettingsUpdateManyMutationInput: ColourSettingsUpdateManyMutationInput,
  BatchPayload: BatchPayload,
  Long: Scalars['Long'],
  CustomerCreateInput: CustomerCreateInput,
  QuestionnaireCreateManyInput: QuestionnaireCreateManyInput,
  QuestionnaireCreateInput: QuestionnaireCreateInput,
  QuestionnaireSettingsCreateOneInput: QuestionnaireSettingsCreateOneInput,
  QuestionnaireSettingsCreateInput: QuestionnaireSettingsCreateInput,
  ColourSettingsCreateOneInput: ColourSettingsCreateOneInput,
  FontSettingsCreateOneInput: FontSettingsCreateOneInput,
  FontSettingsCreateInput: FontSettingsCreateInput,
  QuestionCreateManyInput: QuestionCreateManyInput,
  QuestionCreateInput: QuestionCreateInput,
  QuestionConditionCreateManyInput: QuestionConditionCreateManyInput,
  QuestionConditionCreateInput: QuestionConditionCreateInput,
  QuestionOptionCreateManyInput: QuestionOptionCreateManyInput,
  QuestionOptionCreateInput: QuestionOptionCreateInput,
  CustomerUpdateInput: CustomerUpdateInput,
  QuestionnaireUpdateManyInput: QuestionnaireUpdateManyInput,
  QuestionnaireUpdateWithWhereUniqueNestedInput: QuestionnaireUpdateWithWhereUniqueNestedInput,
  QuestionnaireUpdateDataInput: QuestionnaireUpdateDataInput,
  QuestionnaireSettingsUpdateOneRequiredInput: QuestionnaireSettingsUpdateOneRequiredInput,
  QuestionnaireSettingsUpdateDataInput: QuestionnaireSettingsUpdateDataInput,
  ColourSettingsUpdateOneRequiredInput: ColourSettingsUpdateOneRequiredInput,
  ColourSettingsUpdateDataInput: ColourSettingsUpdateDataInput,
  ColourSettingsUpsertNestedInput: ColourSettingsUpsertNestedInput,
  FontSettingsUpdateOneRequiredInput: FontSettingsUpdateOneRequiredInput,
  FontSettingsUpdateDataInput: FontSettingsUpdateDataInput,
  FontSettingsUpsertNestedInput: FontSettingsUpsertNestedInput,
  QuestionnaireSettingsUpsertNestedInput: QuestionnaireSettingsUpsertNestedInput,
  QuestionUpdateManyInput: QuestionUpdateManyInput,
  QuestionUpdateWithWhereUniqueNestedInput: QuestionUpdateWithWhereUniqueNestedInput,
  QuestionUpdateDataInput: QuestionUpdateDataInput,
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
  QuestionUpsertWithWhereUniqueNestedInput: QuestionUpsertWithWhereUniqueNestedInput,
  QuestionScalarWhereInput: QuestionScalarWhereInput,
  QuestionUpdateManyWithWhereNestedInput: QuestionUpdateManyWithWhereNestedInput,
  QuestionUpdateManyDataInput: QuestionUpdateManyDataInput,
  QuestionnaireUpsertWithWhereUniqueNestedInput: QuestionnaireUpsertWithWhereUniqueNestedInput,
  QuestionnaireScalarWhereInput: QuestionnaireScalarWhereInput,
  QuestionnaireUpdateManyWithWhereNestedInput: QuestionnaireUpdateManyWithWhereNestedInput,
  QuestionnaireUpdateManyDataInput: QuestionnaireUpdateManyDataInput,
  FontSettingsUpdateInput: FontSettingsUpdateInput,
  FontSettingsUpdateManyMutationInput: FontSettingsUpdateManyMutationInput,
  QuestionUpdateInput: QuestionUpdateInput,
  QuestionUpdateManyMutationInput: QuestionUpdateManyMutationInput,
  QuestionConditionUpdateInput: QuestionConditionUpdateInput,
  QuestionConditionUpdateManyMutationInput: QuestionConditionUpdateManyMutationInput,
  QuestionOptionUpdateInput: QuestionOptionUpdateInput,
  QuestionOptionUpdateManyMutationInput: QuestionOptionUpdateManyMutationInput,
  QuestionnaireUpdateInput: QuestionnaireUpdateInput,
  QuestionnaireUpdateManyMutationInput: QuestionnaireUpdateManyMutationInput,
  QuestionnaireSettingsUpdateInput: QuestionnaireSettingsUpdateInput,
  QuestionnaireSettingsUpdateManyMutationInput: QuestionnaireSettingsUpdateManyMutationInput,
  TopicCreateInput: TopicCreateInput,
  TopicUpdateInput: TopicUpdateInput,
  TopicUpdateManyMutationInput: TopicUpdateManyMutationInput,
  Subscription: {},
  ColourSettingsSubscriptionWhereInput: ColourSettingsSubscriptionWhereInput,
  MutationType: MutationType,
  ColourSettingsSubscriptionPayload: ColourSettingsSubscriptionPayload,
  ColourSettingsPreviousValues: ColourSettingsPreviousValues,
  CustomerSubscriptionWhereInput: CustomerSubscriptionWhereInput,
  CustomerSubscriptionPayload: CustomerSubscriptionPayload,
  CustomerPreviousValues: CustomerPreviousValues,
  FontSettingsSubscriptionWhereInput: FontSettingsSubscriptionWhereInput,
  FontSettingsSubscriptionPayload: FontSettingsSubscriptionPayload,
  FontSettingsPreviousValues: FontSettingsPreviousValues,
  QuestionSubscriptionWhereInput: QuestionSubscriptionWhereInput,
  QuestionSubscriptionPayload: QuestionSubscriptionPayload,
  QuestionPreviousValues: QuestionPreviousValues,
  QuestionConditionSubscriptionWhereInput: QuestionConditionSubscriptionWhereInput,
  QuestionConditionSubscriptionPayload: QuestionConditionSubscriptionPayload,
  QuestionConditionPreviousValues: QuestionConditionPreviousValues,
  QuestionOptionSubscriptionWhereInput: QuestionOptionSubscriptionWhereInput,
  QuestionOptionSubscriptionPayload: QuestionOptionSubscriptionPayload,
  QuestionOptionPreviousValues: QuestionOptionPreviousValues,
  QuestionnaireSubscriptionWhereInput: QuestionnaireSubscriptionWhereInput,
  QuestionnaireSubscriptionPayload: QuestionnaireSubscriptionPayload,
  QuestionnairePreviousValues: QuestionnairePreviousValues,
  QuestionnaireSettingsSubscriptionWhereInput: QuestionnaireSettingsSubscriptionWhereInput,
  QuestionnaireSettingsSubscriptionPayload: QuestionnaireSettingsSubscriptionPayload,
  QuestionnaireSettingsPreviousValues: QuestionnaireSettingsPreviousValues,
  TopicSubscriptionWhereInput: TopicSubscriptionWhereInput,
  TopicSubscriptionPayload: TopicSubscriptionPayload,
  TopicPreviousValues: TopicPreviousValues,
}>;

export type AggregateColourSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateColourSettings'] = ResolversParentTypes['AggregateColourSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateCustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateCustomer'] = ResolversParentTypes['AggregateCustomer']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateFontSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateFontSettings'] = ResolversParentTypes['AggregateFontSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestion'] = ResolversParentTypes['AggregateQuestion']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionCondition'] = ResolversParentTypes['AggregateQuestionCondition']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionnaire'] = ResolversParentTypes['AggregateQuestionnaire']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionnaireSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionnaireSettings'] = ResolversParentTypes['AggregateQuestionnaireSettings']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateQuestionOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateQuestionOption'] = ResolversParentTypes['AggregateQuestionOption']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
}>;

export type AggregateTopicResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateTopic'] = ResolversParentTypes['AggregateTopic']> = ResolversObject<{
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
  questionnaires?: Resolver<Maybe<Array<ResolversTypes['Questionnaire']>>, ParentType, ContextType, CustomerQuestionnairesArgs>,
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
}>;

export type CustomerSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerSubscriptionPayload'] = ResolversParentTypes['CustomerSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['CustomerPreviousValues']>, ParentType, ContextType>,
}>;

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
  upsertCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpsertCustomerArgs, 'where' | 'create' | 'update'>>,
  deleteCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'where'>>,
  deleteManyCustomers?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyCustomersArgs>,
  createFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationCreateFontSettingsArgs, 'data'>>,
  updateFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationUpdateFontSettingsArgs, 'data' | 'where'>>,
  updateManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyFontSettingsesArgs, 'data'>>,
  upsertFontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType, RequireFields<MutationUpsertFontSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteFontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<MutationDeleteFontSettingsArgs, 'where'>>,
  deleteManyFontSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyFontSettingsesArgs>,
  createQuestion?: Resolver<ResolversTypes['Question'], ParentType, ContextType, RequireFields<MutationCreateQuestionArgs, 'data'>>,
  updateQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionArgs, 'data' | 'where'>>,
  updateManyQuestions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionsArgs, 'data'>>,
  upsertQuestion?: Resolver<ResolversTypes['Question'], ParentType, ContextType, RequireFields<MutationUpsertQuestionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestion?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionArgs, 'where'>>,
  deleteManyQuestions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionsArgs>,
  createQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationCreateQuestionConditionArgs, 'data'>>,
  updateQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionConditionArgs, 'data' | 'where'>>,
  updateManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionConditionsArgs, 'data'>>,
  upsertQuestionCondition?: Resolver<ResolversTypes['QuestionCondition'], ParentType, ContextType, RequireFields<MutationUpsertQuestionConditionArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionConditionArgs, 'where'>>,
  deleteManyQuestionConditions?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionConditionsArgs>,
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
  createQuestionnaireSettings?: Resolver<ResolversTypes['QuestionnaireSettings'], ParentType, ContextType, RequireFields<MutationCreateQuestionnaireSettingsArgs, 'data'>>,
  updateQuestionnaireSettings?: Resolver<Maybe<ResolversTypes['QuestionnaireSettings']>, ParentType, ContextType, RequireFields<MutationUpdateQuestionnaireSettingsArgs, 'data' | 'where'>>,
  updateManyQuestionnaireSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, RequireFields<MutationUpdateManyQuestionnaireSettingsesArgs, 'data'>>,
  upsertQuestionnaireSettings?: Resolver<ResolversTypes['QuestionnaireSettings'], ParentType, ContextType, RequireFields<MutationUpsertQuestionnaireSettingsArgs, 'where' | 'create' | 'update'>>,
  deleteQuestionnaireSettings?: Resolver<Maybe<ResolversTypes['QuestionnaireSettings']>, ParentType, ContextType, RequireFields<MutationDeleteQuestionnaireSettingsArgs, 'where'>>,
  deleteManyQuestionnaireSettingses?: Resolver<ResolversTypes['BatchPayload'], ParentType, ContextType, MutationDeleteManyQuestionnaireSettingsesArgs>,
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
  colourSettings?: Resolver<Maybe<ResolversTypes['ColourSettings']>, ParentType, ContextType, RequireFields<QueryColourSettingsArgs, 'where'>>,
  colourSettingses?: Resolver<Array<Maybe<ResolversTypes['ColourSettings']>>, ParentType, ContextType, QueryColourSettingsesArgs>,
  colourSettingsesConnection?: Resolver<ResolversTypes['ColourSettingsConnection'], ParentType, ContextType, QueryColourSettingsesConnectionArgs>,
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'where'>>,
  customers?: Resolver<Array<Maybe<ResolversTypes['Customer']>>, ParentType, ContextType, QueryCustomersArgs>,
  customersConnection?: Resolver<ResolversTypes['CustomerConnection'], ParentType, ContextType, QueryCustomersConnectionArgs>,
  fontSettings?: Resolver<Maybe<ResolversTypes['FontSettings']>, ParentType, ContextType, RequireFields<QueryFontSettingsArgs, 'where'>>,
  fontSettingses?: Resolver<Array<Maybe<ResolversTypes['FontSettings']>>, ParentType, ContextType, QueryFontSettingsesArgs>,
  fontSettingsesConnection?: Resolver<ResolversTypes['FontSettingsConnection'], ParentType, ContextType, QueryFontSettingsesConnectionArgs>,
  question?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType, RequireFields<QueryQuestionArgs, 'where'>>,
  questions?: Resolver<Array<Maybe<ResolversTypes['Question']>>, ParentType, ContextType, QueryQuestionsArgs>,
  questionsConnection?: Resolver<ResolversTypes['QuestionConnection'], ParentType, ContextType, QueryQuestionsConnectionArgs>,
  questionCondition?: Resolver<Maybe<ResolversTypes['QuestionCondition']>, ParentType, ContextType, RequireFields<QueryQuestionConditionArgs, 'where'>>,
  questionConditions?: Resolver<Array<Maybe<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, QueryQuestionConditionsArgs>,
  questionConditionsConnection?: Resolver<ResolversTypes['QuestionConditionConnection'], ParentType, ContextType, QueryQuestionConditionsConnectionArgs>,
  questionOption?: Resolver<Maybe<ResolversTypes['QuestionOption']>, ParentType, ContextType, RequireFields<QueryQuestionOptionArgs, 'where'>>,
  questionOptions?: Resolver<Array<Maybe<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QueryQuestionOptionsArgs>,
  questionOptionsConnection?: Resolver<ResolversTypes['QuestionOptionConnection'], ParentType, ContextType, QueryQuestionOptionsConnectionArgs>,
  questionnaire?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType, RequireFields<QueryQuestionnaireArgs, 'where'>>,
  questionnaires?: Resolver<Array<Maybe<ResolversTypes['Questionnaire']>>, ParentType, ContextType, QueryQuestionnairesArgs>,
  questionnairesConnection?: Resolver<ResolversTypes['QuestionnaireConnection'], ParentType, ContextType, QueryQuestionnairesConnectionArgs>,
  questionnaireSettings?: Resolver<Maybe<ResolversTypes['QuestionnaireSettings']>, ParentType, ContextType, RequireFields<QueryQuestionnaireSettingsArgs, 'where'>>,
  questionnaireSettingses?: Resolver<Array<Maybe<ResolversTypes['QuestionnaireSettings']>>, ParentType, ContextType, QueryQuestionnaireSettingsesArgs>,
  questionnaireSettingsesConnection?: Resolver<ResolversTypes['QuestionnaireSettingsConnection'], ParentType, ContextType, QueryQuestionnaireSettingsesConnectionArgs>,
  topic?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType, RequireFields<QueryTopicArgs, 'where'>>,
  topics?: Resolver<Array<Maybe<ResolversTypes['Topic']>>, ParentType, ContextType, QueryTopicsArgs>,
  topicsConnection?: Resolver<ResolversTypes['TopicConnection'], ParentType, ContextType, QueryTopicsConnectionArgs>,
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>,
}>;

export type QuestionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Question'] = ResolversParentTypes['Question']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaireId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  overrideLeafId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  conditions?: Resolver<Maybe<Array<ResolversTypes['QuestionCondition']>>, ParentType, ContextType, QuestionConditionsArgs>,
  options?: Resolver<Maybe<Array<ResolversTypes['QuestionOption']>>, ParentType, ContextType, QuestionOptionsArgs>,
  children?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType, QuestionChildrenArgs>,
}>;

export type QuestionConditionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionCondition'] = ResolversParentTypes['QuestionCondition']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
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

export type QuestionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionConnection'] = ResolversParentTypes['QuestionConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestion'], ParentType, ContextType>,
}>;

export type QuestionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionEdge'] = ResolversParentTypes['QuestionEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['Question'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionnaireResolvers<ContextType = any, ParentType extends ResolversParentTypes['Questionnaire'] = ResolversParentTypes['Questionnaire']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  customerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  setting?: Resolver<ResolversTypes['QuestionnaireSettings'], ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  questions?: Resolver<Maybe<Array<ResolversTypes['Question']>>, ParentType, ContextType, QuestionnaireQuestionsArgs>,
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
  customerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  publicTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionnaireSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSettings'] = ResolversParentTypes['QuestionnaireSettings']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  customerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaireId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  colourSettings?: Resolver<ResolversTypes['ColourSettings'], ParentType, ContextType>,
  fontSettings?: Resolver<ResolversTypes['FontSettings'], ParentType, ContextType>,
}>;

export type QuestionnaireSettingsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSettingsConnection'] = ResolversParentTypes['QuestionnaireSettingsConnection']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>,
  edges?: Resolver<Array<Maybe<ResolversTypes['QuestionnaireSettingsEdge']>>, ParentType, ContextType>,
  aggregate?: Resolver<ResolversTypes['AggregateQuestionnaireSettings'], ParentType, ContextType>,
}>;

export type QuestionnaireSettingsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSettingsEdge'] = ResolversParentTypes['QuestionnaireSettingsEdge']> = ResolversObject<{
  node?: Resolver<ResolversTypes['QuestionnaireSettings'], ParentType, ContextType>,
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
}>;

export type QuestionnaireSettingsPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSettingsPreviousValues'] = ResolversParentTypes['QuestionnaireSettingsPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  customerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaireId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
}>;

export type QuestionnaireSettingsSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSettingsSubscriptionPayload'] = ResolversParentTypes['QuestionnaireSettingsSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['QuestionnaireSettings']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionnaireSettingsPreviousValues']>, ParentType, ContextType>,
}>;

export type QuestionnaireSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionnaireSubscriptionPayload'] = ResolversParentTypes['QuestionnaireSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Questionnaire']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionnairePreviousValues']>, ParentType, ContextType>,
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

export type QuestionPreviousValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionPreviousValues'] = ResolversParentTypes['QuestionPreviousValues']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  questionnaireId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  overrideLeafId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
}>;

export type QuestionSubscriptionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestionSubscriptionPayload'] = ResolversParentTypes['QuestionSubscriptionPayload']> = ResolversObject<{
  mutation?: Resolver<ResolversTypes['MutationType'], ParentType, ContextType>,
  node?: Resolver<Maybe<ResolversTypes['Question']>, ParentType, ContextType>,
  updatedFields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  previousValues?: Resolver<Maybe<ResolversTypes['QuestionPreviousValues']>, ParentType, ContextType>,
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  colourSettings?: SubscriptionResolver<Maybe<ResolversTypes['ColourSettingsSubscriptionPayload']>, "colourSettings", ParentType, ContextType, SubscriptionColourSettingsArgs>,
  customer?: SubscriptionResolver<Maybe<ResolversTypes['CustomerSubscriptionPayload']>, "customer", ParentType, ContextType, SubscriptionCustomerArgs>,
  fontSettings?: SubscriptionResolver<Maybe<ResolversTypes['FontSettingsSubscriptionPayload']>, "fontSettings", ParentType, ContextType, SubscriptionFontSettingsArgs>,
  question?: SubscriptionResolver<Maybe<ResolversTypes['QuestionSubscriptionPayload']>, "question", ParentType, ContextType, SubscriptionQuestionArgs>,
  questionCondition?: SubscriptionResolver<Maybe<ResolversTypes['QuestionConditionSubscriptionPayload']>, "questionCondition", ParentType, ContextType, SubscriptionQuestionConditionArgs>,
  questionOption?: SubscriptionResolver<Maybe<ResolversTypes['QuestionOptionSubscriptionPayload']>, "questionOption", ParentType, ContextType, SubscriptionQuestionOptionArgs>,
  questionnaire?: SubscriptionResolver<Maybe<ResolversTypes['QuestionnaireSubscriptionPayload']>, "questionnaire", ParentType, ContextType, SubscriptionQuestionnaireArgs>,
  questionnaireSettings?: SubscriptionResolver<Maybe<ResolversTypes['QuestionnaireSettingsSubscriptionPayload']>, "questionnaireSettings", ParentType, ContextType, SubscriptionQuestionnaireSettingsArgs>,
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
  AggregateColourSettings?: AggregateColourSettingsResolvers<ContextType>,
  AggregateCustomer?: AggregateCustomerResolvers<ContextType>,
  AggregateFontSettings?: AggregateFontSettingsResolvers<ContextType>,
  AggregateQuestion?: AggregateQuestionResolvers<ContextType>,
  AggregateQuestionCondition?: AggregateQuestionConditionResolvers<ContextType>,
  AggregateQuestionnaire?: AggregateQuestionnaireResolvers<ContextType>,
  AggregateQuestionnaireSettings?: AggregateQuestionnaireSettingsResolvers<ContextType>,
  AggregateQuestionOption?: AggregateQuestionOptionResolvers<ContextType>,
  AggregateTopic?: AggregateTopicResolvers<ContextType>,
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
  CustomerSubscriptionPayload?: CustomerSubscriptionPayloadResolvers<ContextType>,
  FontSettings?: FontSettingsResolvers<ContextType>,
  FontSettingsConnection?: FontSettingsConnectionResolvers<ContextType>,
  FontSettingsEdge?: FontSettingsEdgeResolvers<ContextType>,
  FontSettingsPreviousValues?: FontSettingsPreviousValuesResolvers<ContextType>,
  FontSettingsSubscriptionPayload?: FontSettingsSubscriptionPayloadResolvers<ContextType>,
  Long?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Node?: NodeResolvers,
  PageInfo?: PageInfoResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Question?: QuestionResolvers<ContextType>,
  QuestionCondition?: QuestionConditionResolvers<ContextType>,
  QuestionConditionConnection?: QuestionConditionConnectionResolvers<ContextType>,
  QuestionConditionEdge?: QuestionConditionEdgeResolvers<ContextType>,
  QuestionConditionPreviousValues?: QuestionConditionPreviousValuesResolvers<ContextType>,
  QuestionConditionSubscriptionPayload?: QuestionConditionSubscriptionPayloadResolvers<ContextType>,
  QuestionConnection?: QuestionConnectionResolvers<ContextType>,
  QuestionEdge?: QuestionEdgeResolvers<ContextType>,
  Questionnaire?: QuestionnaireResolvers<ContextType>,
  QuestionnaireConnection?: QuestionnaireConnectionResolvers<ContextType>,
  QuestionnaireEdge?: QuestionnaireEdgeResolvers<ContextType>,
  QuestionnairePreviousValues?: QuestionnairePreviousValuesResolvers<ContextType>,
  QuestionnaireSettings?: QuestionnaireSettingsResolvers<ContextType>,
  QuestionnaireSettingsConnection?: QuestionnaireSettingsConnectionResolvers<ContextType>,
  QuestionnaireSettingsEdge?: QuestionnaireSettingsEdgeResolvers<ContextType>,
  QuestionnaireSettingsPreviousValues?: QuestionnaireSettingsPreviousValuesResolvers<ContextType>,
  QuestionnaireSettingsSubscriptionPayload?: QuestionnaireSettingsSubscriptionPayloadResolvers<ContextType>,
  QuestionnaireSubscriptionPayload?: QuestionnaireSubscriptionPayloadResolvers<ContextType>,
  QuestionOption?: QuestionOptionResolvers<ContextType>,
  QuestionOptionConnection?: QuestionOptionConnectionResolvers<ContextType>,
  QuestionOptionEdge?: QuestionOptionEdgeResolvers<ContextType>,
  QuestionOptionPreviousValues?: QuestionOptionPreviousValuesResolvers<ContextType>,
  QuestionOptionSubscriptionPayload?: QuestionOptionSubscriptionPayloadResolvers<ContextType>,
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
