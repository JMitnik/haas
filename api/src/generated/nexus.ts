/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as APIContext from "../types/APIContext"
import * as prisma from "@prisma/client"
import { core } from "@nexus/schema"
;
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<'inputTypes', TypeName, FieldName>>): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AddDialogueInput: { // input type
    contentType?: string | null; // String
    customerSlug?: string | null; // String
    description?: string | null; // String
    dialogueSlug?: string | null; // String
    publicTitle?: string | null; // String
    tags?: NexusGenInputs['TagsInputObjectType'] | null; // TagsInputObjectType
    templateDialogueId?: string | null; // String
    title?: string | null; // String
  }
  CTALinkInputObjectType: { // input type
    backgroundColor?: string | null; // String
    icon?: string | null; // String
    id?: string | null; // String
    title?: string | null; // String
    type?: NexusGenEnums['LinkTypeEnumType'] | null; // LinkTypeEnumType
    url?: string | null; // String
  }
  CTALinksInputType: { // input type
    linkTypes?: NexusGenInputs['CTALinkInputObjectType'][] | null; // [CTALinkInputObjectType!]
  }
  CustomerCreateOptions: { // input type
    isSeed?: boolean | null; // Boolean
    logo?: string | null; // String
    primaryColour: string; // String!
    slug: string; // String!
  }
  CustomerEditOptions: { // input type
    logo?: string | null; // String
    name: string; // String!
    primaryColour: string; // String!
    slug: string; // String!
  }
  CustomerWhereUniqueInput: { // input type
    id: string; // ID!
  }
  DialogueFilterInputType: { // input type
    searchTerm?: string | null; // String
  }
  DialogueWhereUniqueInput: { // input type
    id?: string | null; // ID
    slug?: string | null; // String
  }
  EdgeConditionInputType: { // input type
    conditionType?: string | null; // String
    id?: number | null; // Int
    matchValue?: string | null; // String
    renderMax?: number | null; // Int
    renderMin?: number | null; // Int
  }
  FilterInput: { // input type
    endDate?: string | null; // String
    limit?: number | null; // Int
    offset?: number | null; // Int
    orderBy?: NexusGenInputs['SortFilterInputObject'][] | null; // [SortFilterInputObject!]
    pageIndex?: number | null; // Int
    searchTerm?: string | null; // String
    startDate?: string | null; // String
  }
  OptionInputType: { // input type
    id?: number | null; // Int
    publicValue?: string | null; // String
    value?: string | null; // String
  }
  OptionsInputType: { // input type
    options?: NexusGenInputs['OptionInputType'][] | null; // [OptionInputType!]
  }
  PermissionIdsInput: { // input type
    ids?: string[] | null; // [String!]
  }
  PermissionInput: { // input type
    customerId?: string | null; // String
    description?: string | null; // String
    name?: string | null; // String
  }
  QuestionNodeWhereInputType: { // input type
    id?: string | null; // ID
    isRoot?: boolean | null; // Boolean
  }
  QuestionNodeWhereUniqueInput: { // input type
    id: string; // String!
  }
  RecipientsInputType: { // input type
    ids?: string[] | null; // [String!]
  }
  RegisterNodeEntryInput: { // input type
    value?: string | null; // String
  }
  RoleDataInput: { // input type
    description?: string | null; // String
    name?: string | null; // String
  }
  RoleInput: { // input type
    customerId?: string | null; // String
    description?: string | null; // String
    name?: string | null; // String
  }
  SessionInput: { // input type
    dialogueId: string; // String!
    entries?: NexusGenInputs['NodeEntryInput'][] | null; // [NodeEntryInput!]
  }
  SessionWhereUniqueInput: { // input type
    dialogueId?: string | null; // ID
    id?: string | null; // ID
  }
  SliderNodeEntryInput: { // input type
    value?: number | null; // Int
  }
  TagsInputObjectType: { // input type
    entries?: string[] | null; // [String!]
  }
  TriggerConditionInputType: { // input type
    id?: number | null; // Int
    maxValue?: number | null; // Int
    minValue?: number | null; // Int
    textValue?: string | null; // String
    type?: NexusGenEnums['TriggerConditionEnum'] | null; // TriggerConditionEnum
  }
  TriggerInputType: { // input type
    conditions?: NexusGenInputs['TriggerConditionInputType'][] | null; // [TriggerConditionInputType!]
    medium?: NexusGenEnums['TriggerMediumEnum'] | null; // TriggerMediumEnum
    name?: string | null; // String
    type?: NexusGenEnums['TriggerTypeEnum'] | null; // TriggerTypeEnum
  }
  UserInput: { // input type
    customerId?: string | null; // String
    email?: string | null; // String
    firstName?: string | null; // String
    lastName?: string | null; // String
    password?: string | null; // String
    phone?: string | null; // String
    roleId?: string | null; // String
  }
}

export interface NexusGenEnums {
  LinkTypeEnumType: 'API' | 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN' | 'SOCIAL' | 'TWITTER' | 'WHATSAPP'
  TagTypeEnum: 'AGENT' | 'DEFAULT' | 'LOCATION'
  TriggerConditionEnum: prisma.TriggerConditionEnum
  TriggerMediumEnum: 'BOTH' | 'EMAIL' | 'PHONE'
  TriggerTypeEnum: 'QUESTION' | 'SCHEDULED'
}

export interface NexusGenRootTypes {
  ColourSettings: prisma.ColourSettings;
  Customer: prisma.Customer;
  CustomerSettings: prisma.CustomerSettings;
  Dialogue: prisma.Dialogue;
  DialogueStatistics: { // root type
    history?: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    topNegativePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
  }
  Edge: prisma.Edge;
  EdgeCondition: { // root type
    conditionType: string; // String!
    edgeId?: string | null; // String
    id: number; // Int!
    matchValue?: string | null; // String
    renderMax?: number | null; // Int
    renderMin?: number | null; // Int
  }
  FontSettings: prisma.FontSettings;
  ImageType: { // root type
    encoding?: string | null; // String
    filename?: string | null; // String
    mimetype?: string | null; // String
    url?: string | null; // String
  }
  InteractionSessionType: { // root type
    createdAt: string; // String!
    id: string; // String!
    index: number; // Int!
    nodeEntries: NexusGenRootTypes['NodeEntry'][]; // [NodeEntry!]!
    paths: number; // Int!
    score?: number | null; // Float
  }
  InteractionType: { // root type
    endDate?: string | null; // String
    orderBy: NexusGenRootTypes['SortFilterObject'][]; // [SortFilterObject!]!
    pageIndex: number; // Int!
    pages: number; // Int!
    pageSize: number; // Int!
    sessions: NexusGenRootTypes['InteractionSessionType'][]; // [InteractionSessionType!]!
    startDate?: string | null; // String
  }
  LinkType: { // root type
    backgroundColor?: string | null; // String
    iconUrl?: string | null; // String
    id: string; // String!
    questionNodeId: string; // String!
    title?: string | null; // String
    type: string; // String!
    url: string; // String!
  }
  Mutation: {};
  NodeEntry: prisma.NodeEntry;
  NodeEntryValue: { // root type
    choiceNodeEntry?: string | null; // String
    linkNodeEntry?: string | null; // String
    registrationNodeEntry?: string | null; // String
    sliderNodeEntry?: number | null; // Int
    textboxNodeEntry?: string | null; // String
  }
  PaginationPageInfo: { // root type
    nrPages: number; // Int!
    pageIndex: number; // Int!
  }
  PermssionType: { // root type
    customer?: NexusGenRootTypes['Customer'] | null; // Customer
    description?: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  Query: {};
  QuestionNode: prisma.QuestionNode;
  QuestionOption: prisma.QuestionOption;
  RoleConnection: { // root type
    endDate?: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    startDate?: string | null; // String
  }
  RoleType: { // root type
    customerId?: string | null; // String
    id: string; // ID!
    name: string; // String!
    nrPermissions?: number | null; // Int
    roleId?: string | null; // String
  }
  Session: prisma.Session;
  SessionConnection: { // root type
    endDate?: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    startDate?: string | null; // String
  }
  Tag: prisma.Tag;
  TriggerConditionType: { // root type
    id: number; // Int!
    maxValue?: number | null; // Int
    minValue?: number | null; // Int
    textValue?: string | null; // String
    type: NexusGenEnums['TriggerConditionEnum']; // TriggerConditionEnum!
  }
  TriggerConnectionType: { // root type
    endDate?: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    startDate?: string | null; // String
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
  }
  TriggerType: { // root type
    id: string; // String!
    medium: NexusGenEnums['TriggerMediumEnum']; // TriggerMediumEnum!
    name: string; // String!
    relatedNodeId?: string | null; // String
    type: NexusGenEnums['TriggerTypeEnum']; // TriggerTypeEnum!
  }
  UserTable: { // root type
    pageIndex?: number | null; // Int
    totalPages?: number | null; // Int
    users: NexusGenRootTypes['UserType'][]; // [UserType!]!
  }
  UserType: { // root type
    email: string; // String!
    firstName?: string | null; // String
    id: string; // ID!
    lastName?: string | null; // String
    phone?: string | null; // String
    roleId?: string | null; // String
  }
  lineChartDataType: { // root type
    entryId?: string | null; // String
    x?: string | null; // String
    y?: number | null; // Int
  }
  topPathType: { // root type
    answer?: string | null; // String
    quantity?: number | null; // Int
  }
  ConnectionInterface: NexusGenRootTypes['SessionConnection'] | NexusGenRootTypes['RoleConnection'] | NexusGenRootTypes['TriggerConnectionType'];
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  Upload: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AddDialogueInput: NexusGenInputs['AddDialogueInput'];
  CTALinkInputObjectType: NexusGenInputs['CTALinkInputObjectType'];
  CTALinksInputType: NexusGenInputs['CTALinksInputType'];
  CustomerCreateOptions: NexusGenInputs['CustomerCreateOptions'];
  CustomerEditOptions: NexusGenInputs['CustomerEditOptions'];
  CustomerWhereUniqueInput: NexusGenInputs['CustomerWhereUniqueInput'];
  DialogueFilterInputType: NexusGenInputs['DialogueFilterInputType'];
  DialogueWhereUniqueInput: NexusGenInputs['DialogueWhereUniqueInput'];
  EdgeConditionInputType: NexusGenInputs['EdgeConditionInputType'];
  FilterInput: NexusGenInputs['FilterInput'];
  OptionInputType: NexusGenInputs['OptionInputType'];
  OptionsInputType: NexusGenInputs['OptionsInputType'];
  PermissionIdsInput: NexusGenInputs['PermissionIdsInput'];
  PermissionInput: NexusGenInputs['PermissionInput'];
  QuestionNodeWhereInputType: NexusGenInputs['QuestionNodeWhereInputType'];
  QuestionNodeWhereUniqueInput: NexusGenInputs['QuestionNodeWhereUniqueInput'];
  RecipientsInputType: NexusGenInputs['RecipientsInputType'];
  RegisterNodeEntryInput: NexusGenInputs['RegisterNodeEntryInput'];
  RoleDataInput: NexusGenInputs['RoleDataInput'];
  RoleInput: NexusGenInputs['RoleInput'];
  SessionInput: NexusGenInputs['SessionInput'];
  SessionWhereUniqueInput: NexusGenInputs['SessionWhereUniqueInput'];
  SliderNodeEntryInput: NexusGenInputs['SliderNodeEntryInput'];
  TagsInputObjectType: NexusGenInputs['TagsInputObjectType'];
  TriggerConditionInputType: NexusGenInputs['TriggerConditionInputType'];
  TriggerInputType: NexusGenInputs['TriggerInputType'];
  UserInput: NexusGenInputs['UserInput'];
  UserSessionEntryDataInput: NexusGenInputs['UserSessionEntryDataInput'];
  UserSessionEntryInput: NexusGenInputs['UserSessionEntryInput'];
  LinkTypeEnumType: NexusGenEnums['LinkTypeEnumType'];
  TagTypeEnum: NexusGenEnums['TagTypeEnum'];
  TriggerConditionEnum: NexusGenEnums['TriggerConditionEnum'];
  TriggerMediumEnum: NexusGenEnums['TriggerMediumEnum'];
  TriggerTypeEnum: NexusGenEnums['TriggerTypeEnum'];
}

export interface NexusGenFieldTypes {
  ColourSettings: { // field return type
    id: string; // ID!
    primary: string; // String!
    primaryAlt: string | null; // String
    secondary: string | null; // String
  }
  Customer: { // field return type
    dialogue: NexusGenRootTypes['Dialogue'] | null; // Dialogue
    dialogues: NexusGenRootTypes['Dialogue'][] | null; // [Dialogue!]
    id: string; // ID!
    name: string; // String!
    settings: NexusGenRootTypes['CustomerSettings'] | null; // CustomerSettings
    slug: string; // String!
  }
  CustomerSettings: { // field return type
    colourSettings: NexusGenRootTypes['ColourSettings'] | null; // ColourSettings
    fontSettings: NexusGenRootTypes['FontSettings'] | null; // FontSettings
    id: string; // ID!
    logoUrl: string | null; // String
  }
  Dialogue: { // field return type
    averageScore: number; // Float!
    countInteractions: number; // Int!
    creationDate: string | null; // String
    customer: NexusGenRootTypes['Customer'] | null; // Customer
    customerId: string; // String!
    description: string; // String!
    edges: NexusGenRootTypes['Edge'][]; // [Edge!]!
    id: string; // ID!
    leafs: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    publicTitle: string | null; // String
    questions: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    rootQuestion: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    sessionConnection: NexusGenRootTypes['SessionConnection'] | null; // SessionConnection
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    slug: string; // String!
    statistics: NexusGenRootTypes['DialogueStatistics'] | null; // DialogueStatistics
    tags: NexusGenRootTypes['Tag'][] | null; // [Tag!]
    title: string; // String!
    updatedAt: string | null; // String
  }
  DialogueStatistics: { // field return type
    history: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    topNegativePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
  }
  Edge: { // field return type
    childNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    childNodeId: string; // String!
    conditions: NexusGenRootTypes['EdgeCondition'][] | null; // [EdgeCondition!]
    createdAt: string; // String!
    id: string; // ID!
    parentNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    parentNodeId: string; // String!
    updatedAt: string; // String!
  }
  EdgeCondition: { // field return type
    conditionType: string; // String!
    edgeId: string | null; // String
    id: number; // Int!
    matchValue: string | null; // String
    renderMax: number | null; // Int
    renderMin: number | null; // Int
  }
  FontSettings: { // field return type
    id: string; // ID!
  }
  ImageType: { // field return type
    encoding: string | null; // String
    filename: string | null; // String
    mimetype: string | null; // String
    url: string | null; // String
  }
  InteractionSessionType: { // field return type
    createdAt: string; // String!
    id: string; // String!
    index: number; // Int!
    nodeEntries: NexusGenRootTypes['NodeEntry'][]; // [NodeEntry!]!
    paths: number; // Int!
    score: number | null; // Float
  }
  InteractionType: { // field return type
    endDate: string | null; // String
    orderBy: NexusGenRootTypes['SortFilterObject'][]; // [SortFilterObject!]!
    pageIndex: number; // Int!
    pages: number; // Int!
    pageSize: number; // Int!
    sessions: NexusGenRootTypes['InteractionSessionType'][]; // [InteractionSessionType!]!
    startDate: string | null; // String
  }
  LinkType: { // field return type
    backgroundColor: string | null; // String
    iconUrl: string | null; // String
    id: string; // String!
    questionNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    questionNodeId: string; // String!
    title: string | null; // String
    type: string; // String!
    url: string; // String!
  }
  Mutation: { // field return type
    assignTags: NexusGenRootTypes['Dialogue']; // Dialogue!
    copyDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    createCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    createCustomer: NexusGenRootTypes['Customer']; // Customer!
    createDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    createPermission: NexusGenRootTypes['PermssionType']; // PermssionType!
    createQuestion: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    createRole: NexusGenRootTypes['RoleType']; // RoleType!
    createSession: NexusGenRootTypes['Session']; // Session!
    createTag: NexusGenRootTypes['Tag']; // Tag!
    createTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    createUser: NexusGenRootTypes['UserType']; // UserType!
    deleteCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    deleteCustomer: NexusGenRootTypes['Customer']; // Customer!
    deleteDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    deleteQuestion: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    deleteTag: NexusGenRootTypes['TagType']; // TagType!
    deleteTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    deleteUser: NexusGenRootTypes['UserType']; // UserType!
    editCustomer: NexusGenRootTypes['Customer']; // Customer!
    editDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    editTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    editUser: NexusGenRootTypes['UserType']; // UserType!
    singleUpload: NexusGenRootTypes['ImageType']; // ImageType!
    updateCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    updateQuestion: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    updateRoles: NexusGenRootTypes['RoleType']; // RoleType!
    uploadUserSession: NexusGenRootTypes['Session']; // Session!
  }
  NodeEntry: { // field return type
    creationDate: string; // String!
    depth: number | null; // Int
    id: string | null; // ID
    relatedEdgeId: string | null; // String
    relatedNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    relatedNodeId: string | null; // String
    value: NexusGenRootTypes['NodeEntryValue'] | null; // NodeEntryValue
  }
  NodeEntryValue: { // field return type
    choiceNodeEntry: string | null; // String
    linkNodeEntry: string | null; // String
    registrationNodeEntry: string | null; // String
    sliderNodeEntry: number | null; // Int
    textboxNodeEntry: string | null; // String
  }
  PaginationPageInfo: { // field return type
    nrPages: number; // Int!
    pageIndex: number; // Int!
  }
  PermssionType: { // field return type
    customer: NexusGenRootTypes['Customer'] | null; // Customer
    description: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  Query: { // field return type
    customer: NexusGenRootTypes['Customer'] | null; // Customer
    customers: NexusGenRootTypes['Customer'][]; // [Customer!]!
    dialogue: NexusGenRootTypes['Dialogue'] | null; // Dialogue
    dialogues: NexusGenRootTypes['Dialogue'][]; // [Dialogue!]!
    edge: NexusGenRootTypes['Edge'] | null; // Edge
    lineChartData: NexusGenRootTypes['lineChartDataType'][]; // [lineChartDataType!]!
    questionNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    questionNodes: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    roleConnection: NexusGenRootTypes['RoleConnection']; // RoleConnection!
    roles: NexusGenRootTypes['RoleType'][] | null; // [RoleType!]
    session: NexusGenRootTypes['Session'] | null; // Session
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    trigger: NexusGenRootTypes['TriggerType'] | null; // TriggerType
    triggerConnection: NexusGenRootTypes['TriggerConnectionType'] | null; // TriggerConnectionType
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
    user: NexusGenRootTypes['UserType'] | null; // UserType
    users: NexusGenRootTypes['UserType'][]; // [UserType!]!
    userTable: NexusGenRootTypes['UserTable'] | null; // UserTable
  }
  QuestionNode: { // field return type
    children: NexusGenRootTypes['Edge'][]; // [Edge!]!
    creationDate: string | null; // String
    id: string; // ID!
    isLeaf: boolean; // Boolean!
    isRoot: boolean; // Boolean!
    links: NexusGenRootTypes['LinkType'][]; // [LinkType!]!
    options: NexusGenRootTypes['QuestionOption'][]; // [QuestionOption!]!
    overrideLeaf: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    overrideLeafId: string | null; // String
    questionDialogue: NexusGenRootTypes['Dialogue'] | null; // Dialogue
    questionDialogueId: string | null; // String
    title: string; // String!
    type: string; // String!
    updatedAt: string; // String!
  }
  QuestionOption: { // field return type
    id: number; // Int!
    publicValue: string | null; // String
    questionId: string | null; // String
    value: string; // String!
  }
  RoleConnection: { // field return type
    endDate: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    startDate: string | null; // String
  }
  RoleType: { // field return type
    customer: NexusGenRootTypes['Customer'] | null; // Customer
    customerId: string | null; // String
    id: string; // ID!
    name: string; // String!
    nrPermissions: number | null; // Int
    permissions: NexusGenRootTypes['PermssionType'][] | null; // [PermssionType!]
    roleId: string | null; // String
  }
  Session: { // field return type
    createdAt: string; // String!
    dialogueId: string; // String!
    id: string; // ID!
    nodeEntries: NexusGenRootTypes['NodeEntry'][]; // [NodeEntry!]!
    paths: number; // Int!
    score: number; // Float!
  }
  SessionConnection: { // field return type
    endDate: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    startDate: string | null; // String
  }
  Tag: { // field return type
    customerId: string; // String!
    id: string; // ID!
    name: string; // String!
    type: NexusGenEnums['TagTypeEnum']; // TagTypeEnum!
  }
  TriggerConditionType: { // field return type
    id: number; // Int!
    maxValue: number | null; // Int
    minValue: number | null; // Int
    textValue: string | null; // String
    type: NexusGenEnums['TriggerConditionEnum']; // TriggerConditionEnum!
  }
  TriggerConnectionType: { // field return type
    endDate: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    startDate: string | null; // String
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
  }
  TriggerType: { // field return type
    conditions: NexusGenRootTypes['TriggerConditionType'][]; // [TriggerConditionType!]!
    id: string; // String!
    medium: NexusGenEnums['TriggerMediumEnum']; // TriggerMediumEnum!
    name: string; // String!
    recipients: NexusGenRootTypes['UserType'][]; // [UserType!]!
    relatedNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    relatedNodeId: string | null; // String
    type: NexusGenEnums['TriggerTypeEnum']; // TriggerTypeEnum!
  }
  UserTable: { // field return type
    pageIndex: number | null; // Int
    totalPages: number | null; // Int
    users: NexusGenRootTypes['UserType'][]; // [UserType!]!
  }
  UserType: { // field return type
    email: string; // String!
    firstName: string | null; // String
    id: string; // ID!
    lastName: string | null; // String
    phone: string | null; // String
    role: NexusGenRootTypes['RoleType'] | null; // RoleType
    roleId: string | null; // String
  }
  lineChartDataType: { // field return type
    entryId: string | null; // String
    x: string | null; // String
    y: number | null; // Int
  }
  topPathType: { // field return type
    answer: string | null; // String
    quantity: number | null; // Int
  }
  ConnectionInterface: { // field return type
    endDate: string | null; // String
    limit: number; // Int!
    offset: number; // Int!
    pageInfo: NexusGenRootTypes['PaginationPageInfo']; // PaginationPageInfo!
    startDate: string | null; // String
  }
}

export interface NexusGenArgTypes {
  Customer: {
    dialogue: { // args
      where?: NexusGenInputs['DialogueWhereUniqueInput'] | null; // DialogueWhereUniqueInput
    }
    dialogues: { // args
      filter?: NexusGenInputs['DialogueFilterInputType'] | null; // DialogueFilterInputType
    }
  }
  Dialogue: {
    interactions: { // args
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
    }
    leafs: { // args
      searchTerm?: string | null; // String
    }
    questions: { // args
      where?: NexusGenInputs['QuestionNodeWhereInputType'] | null; // QuestionNodeWhereInputType
    }
    sessionConnection: { // args
      filter?: NexusGenInputs['PaginationWhereInput'] | null; // PaginationWhereInput
    }
    sessions: { // args
      take?: number | null; // Int
    }
  }
  Mutation: {
    assignTags: { // args
      dialogueId?: string | null; // String
      tags?: NexusGenInputs['TagsInputObjectType'] | null; // TagsInputObjectType
    }
    copyDialogue: { // args
      data?: NexusGenInputs['AddDialogueInput'] | null; // AddDialogueInput
    }
    createCTA: { // args
      customerSlug?: string | null; // String
      dialogueSlug?: string | null; // String
      links?: NexusGenInputs['CTALinksInputType'] | null; // CTALinksInputType
      title?: string | null; // String
      type?: string | null; // String
    }
    createCustomer: { // args
      name?: string | null; // String
      options?: NexusGenInputs['CustomerCreateOptions'] | null; // CustomerCreateOptions
    }
    createDialogue: { // args
      data?: NexusGenInputs['AddDialogueInput'] | null; // AddDialogueInput
    }
    createPermission: { // args
      data?: NexusGenInputs['PermissionInput'] | null; // PermissionInput
    }
    createQuestion: { // args
      customerSlug?: string | null; // String
      dialogueSlug?: string | null; // String
      edgeCondition?: NexusGenInputs['EdgeConditionInputType'] | null; // EdgeConditionInputType
      optionEntries?: NexusGenInputs['OptionsInputType'] | null; // OptionsInputType
      overrideLeafId?: string | null; // String
      parentQuestionId?: string | null; // String
      title?: string | null; // String
      type?: string | null; // String
    }
    createRole: { // args
      data?: NexusGenInputs['RoleInput'] | null; // RoleInput
    }
    createSession: { // args
      input?: NexusGenInputs['SessionInput'] | null; // SessionInput
    }
    createTag: { // args
      customerSlug?: string | null; // String
      name?: string | null; // String
      type?: NexusGenEnums['TagTypeEnum'] | null; // TagTypeEnum
    }
    createTrigger: { // args
      customerSlug?: string | null; // String
      questionId?: string | null; // String
      recipients?: NexusGenInputs['RecipientsInputType'] | null; // RecipientsInputType
      trigger?: NexusGenInputs['TriggerInputType'] | null; // TriggerInputType
    }
    createUser: { // args
      customerSlug?: string | null; // String
      input?: NexusGenInputs['UserInput'] | null; // UserInput
    }
    deleteCTA: { // args
      id?: string | null; // String
    }
    deleteCustomer: { // args
      where?: NexusGenInputs['CustomerWhereUniqueInput'] | null; // CustomerWhereUniqueInput
    }
    deleteDialogue: { // args
      where?: NexusGenInputs['DialogueWhereUniqueInput'] | null; // DialogueWhereUniqueInput
    }
    deleteQuestion: { // args
      customerSlug?: string | null; // String
      dialogueSlug?: string | null; // String
      id?: string | null; // String
    }
    deleteTag: { // args
      tagId?: string | null; // String
    }
    deleteTrigger: { // args
      id?: string | null; // String
    }
    deleteUser: { // args
      id?: string | null; // String
    }
    editCustomer: { // args
      id?: string | null; // String
      options?: NexusGenInputs['CustomerEditOptions'] | null; // CustomerEditOptions
    }
    editDialogue: { // args
      customerSlug?: string | null; // String
      description?: string | null; // String
      dialogueSlug?: string | null; // String
      publicTitle?: string | null; // String
      tags?: NexusGenInputs['TagsInputObjectType'] | null; // TagsInputObjectType
      title?: string | null; // String
    }
    editTrigger: { // args
      questionId?: string | null; // String
      recipients?: NexusGenInputs['RecipientsInputType'] | null; // RecipientsInputType
      trigger?: NexusGenInputs['TriggerInputType'] | null; // TriggerInputType
      triggerId?: string | null; // String
    }
    editUser: { // args
      id?: string | null; // String
      input?: NexusGenInputs['UserInput'] | null; // UserInput
    }
    singleUpload: { // args
      file?: any | null; // Upload
    }
    updateCTA: { // args
      id?: string | null; // String
      links?: NexusGenInputs['CTALinksInputType'] | null; // CTALinksInputType
      title?: string | null; // String
      type?: string | null; // String
    }
    updateQuestion: { // args
      edgeCondition?: NexusGenInputs['EdgeConditionInputType'] | null; // EdgeConditionInputType
      edgeId?: string | null; // String
      id?: string | null; // String
      optionEntries?: NexusGenInputs['OptionsInputType'] | null; // OptionsInputType
      overrideLeafId?: string | null; // String
      title?: string | null; // String
      type?: string | null; // String
    }
    updateRoles: { // args
      permissions?: NexusGenInputs['PermissionIdsInput'] | null; // PermissionIdsInput
      roleId?: string | null; // String
    }
    uploadUserSession: { // args
      uploadUserSessionInput?: NexusGenInputs['UploadUserSessionInput'] | null; // UploadUserSessionInput
    }
  }
  Query: {
    customer: { // args
      id?: string | null; // ID
      slug?: string | null; // String
    }
    dialogue: { // args
      where?: NexusGenInputs['DialogueWhereUniqueInput'] | null; // DialogueWhereUniqueInput
    }
    dialogues: { // args
      filter?: NexusGenInputs['DialogueFilterInputType'] | null; // DialogueFilterInputType
    }
    edge: { // args
      id?: string | null; // String
    }
    lineChartData: { // args
      dialogueId?: string | null; // String
      limit?: number | null; // Int
      numberOfDaysBack?: number | null; // Int
      offset?: number | null; // Int
    }
    questionNode: { // args
      where?: NexusGenInputs['QuestionNodeWhereUniqueInput'] | null; // QuestionNodeWhereUniqueInput
    }
    roleConnection: { // args
      customerId?: string | null; // String
      filter?: NexusGenInputs['PaginationWhereInput'] | null; // PaginationWhereInput
    }
    roles: { // args
      customerSlug?: string | null; // String
    }
    session: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
    sessions: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
    tags: { // args
      customerSlug?: string | null; // String
      dialogueId?: string | null; // String
    }
    trigger: { // args
      triggerId?: string | null; // String
    }
    triggerConnection: { // args
      customerSlug?: string | null; // String
      filter?: NexusGenInputs['PaginationWhereInput'] | null; // PaginationWhereInput
    }
    triggers: { // args
      customerSlug?: string | null; // String
      dialogueId?: string | null; // String
      filter?: NexusGenInputs['PaginationWhereInput'] | null; // PaginationWhereInput
      userId?: string | null; // String
    }
    user: { // args
      userId?: string | null; // String
    }
    users: { // args
      customerSlug?: string | null; // String
    }
    userTable: { // args
      customerSlug?: string | null; // String
      filter?: NexusGenInputs['PaginationWhereInput'] | null; // PaginationWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
  ConnectionInterface: 'SessionConnection' | 'RoleConnection' | 'TriggerConnectionType'
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = 'ColourSettings' | 'Customer' | 'CustomerSettings' | 'Dialogue' | 'DialogueStatistics' | 'Edge' | 'EdgeCondition' | 'FontSettings' | 'ImageType' | 'InteractionSessionType' | 'InteractionType' | 'LinkType' | 'Mutation' | 'NodeEntry' | 'NodeEntryValue' | 'PermssionType' | 'Query' | 'QuestionNode' | 'QuestionOption' | 'RoleTableType' | 'RoleType' | 'Session' | 'SortFilterObject' | 'TagType' | 'TriggerConditionType' | 'TriggerTableType' | 'TriggerType' | 'UniqueDataResultEntry' | 'UserTable' | 'UserType' | 'lineChartDataType' | 'topPathType';

export type NexusGenInputNames = 'AddDialogueInput' | 'CTALinkInputObjectType' | 'CTALinksInputType' | 'CustomerCreateOptions' | 'CustomerEditOptions' | 'CustomerWhereUniqueInput' | 'DialogueFilterInputType' | 'DialogueWhereUniqueInput' | 'EdgeConditionInputType' | 'FilterInput' | 'OptionInputType' | 'OptionsInputType' | 'PermissionIdsInput' | 'PermissionInput' | 'QuestionNodeWhereInputType' | 'QuestionNodeWhereUniqueInput' | 'RecipientsInputType' | 'RoleDataInput' | 'RoleInput' | 'SessionWhereUniqueInput' | 'SortFilterInputObject' | 'TagsInputObjectType' | 'TriggerConditionInputType' | 'TriggerInputType' | 'UploadUserSessionInput' | 'UserInput' | 'UserSessionEntryDataInput' | 'UserSessionEntryInput';

export type NexusGenEnumNames = 'LinkTypeEnumType' | 'TagTypeEnum' | 'TriggerConditionTypeEnum' | 'TriggerMediumEnum' | 'TriggerTypeEnum';

export type NexusGenInterfaceNames = 'ConnectionInterface';

export type NexusGenScalarNames = 'Boolean' | 'Float' | 'ID' | 'Int' | 'String' | 'Upload';

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: APIContext.APIContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}
