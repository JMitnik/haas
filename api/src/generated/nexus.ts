/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as prisma from "@prisma/client"
import { core } from "@nexus/schema"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "Upload";
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
    customerSlug?: string | null; // String
    description?: string | null; // String
    dialogueSlug?: string | null; // String
    isSeed?: boolean | null; // Boolean
    publicTitle?: string | null; // String
    tags?: NexusGenInputs['TagsInputObjectType'] | null; // TagsInputObjectType
    title?: string | null; // String
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
  EdgeChildInput: { // input type
    childNode?: NexusGenInputs['EdgeNodeInput'] | null; // EdgeNodeInput
    conditions?: NexusGenInputs['QuestionConditionInput'][] | null; // [QuestionConditionInput!]
    id?: string | null; // ID
    parentNode?: NexusGenInputs['EdgeNodeInput'] | null; // EdgeNodeInput
  }
  EdgeNodeInput: { // input type
    id?: string | null; // ID
    title?: string | null; // String
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
  LeafNodeInput: { // input type
    id?: string | null; // ID
    title?: string | null; // String
    type?: string | null; // String
  }
  OptionInput: { // input type
    id?: number | null; // Int
    publicValue?: string | null; // String
    value?: string | null; // String
  }
  PermissionIdsInput: { // input type
    ids?: string[] | null; // [String!]
  }
  PermissionInput: { // input type
    customerId?: string | null; // String
    description?: string | null; // String
    name?: string | null; // String
  }
  QuestionConditionInput: { // input type
    conditionType?: string | null; // String
    id?: number | null; // Int
    matchValue?: string | null; // String
    renderMax?: number | null; // Int
    renderMin?: number | null; // Int
  }
  QuestionInput: { // input type
    children?: NexusGenInputs['EdgeChildInput'][] | null; // [EdgeChildInput!]
    id?: string | null; // ID
    isLeaf?: boolean | null; // Boolean
    isRoot?: boolean | null; // Boolean
    options?: NexusGenInputs['OptionInput'][] | null; // [OptionInput!]
    overrideLeaf?: NexusGenInputs['LeafNodeInput'] | null; // LeafNodeInput
    title?: string | null; // String
    type?: string | null; // String
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
  RoleDataInput: { // input type
    description?: string | null; // String
    name?: string | null; // String
  }
  RoleInput: { // input type
    customerId?: string | null; // String
    description?: string | null; // String
    name?: string | null; // String
  }
  SessionWhereUniqueInput: { // input type
    dialogueId?: string | null; // ID
    id?: string | null; // ID
  }
  SortFilterInputObject: { // input type
    desc?: boolean | null; // Boolean
    id?: string | null; // String
  }
  TagsInputObjectType: { // input type
    entries?: string[] | null; // [String!]
  }
  TopicDataEntry: { // input type
    id?: string | null; // ID
    questions?: NexusGenInputs['QuestionInput'][] | null; // [QuestionInput!]
  }
  TriggerConditionInputType: { // input type
    id?: number | null; // Int
    maxValue?: number | null; // Int
    minValue?: number | null; // Int
    textValue?: string | null; // String
    type?: NexusGenEnums['TriggerConditionTypeEnum'] | null; // TriggerConditionTypeEnum
  }
  TriggerInputType: { // input type
    conditions?: NexusGenInputs['TriggerConditionInputType'][] | null; // [TriggerConditionInputType!]
    medium?: NexusGenEnums['TriggerMediumEnum'] | null; // TriggerMediumEnum
    name?: string | null; // String
    type?: NexusGenEnums['TriggerTypeEnum'] | null; // TriggerTypeEnum
  }
  UploadUserSessionInput: { // input type
    dialogueId: string; // String!
    entries?: NexusGenInputs['UserSessionEntryInput'][] | null; // [UserSessionEntryInput!]
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
  UserSessionEntryDataInput: { // input type
    multiValues?: NexusGenInputs['UserSessionEntryDataInput'][] | null; // [UserSessionEntryDataInput!]
    numberValue?: number | null; // Int
    textValue?: string | null; // String
  }
  UserSessionEntryInput: { // input type
    data?: NexusGenInputs['UserSessionEntryDataInput'] | null; // UserSessionEntryDataInput
    depth?: number | null; // Int
    edgeId?: string | null; // String
    nodeId?: string | null; // String
  }
}

export interface NexusGenEnums {
  TagTypeEnum: "AGENT" | "DEFAULT" | "LOCATION"
  TriggerConditionTypeEnum: "HIGH_THRESHOLD" | "INNER_RANGE" | "LOW_THRESHOLD" | "OUTER_RANGE" | "TEXT_MATCH"
  TriggerMediumEnum: "BOTH" | "EMAIL" | "PHONE"
  TriggerTypeEnum: "QUESTION" | "SCHEDULED"
}

export interface NexusGenRootTypes {
  ColourSettings: prisma.ColourSettings;
  Customer: prisma.Customer;
  CustomerSettings: prisma.CustomerSettings;
  Dialogue: prisma.Dialogue;
  DialogueStatistics: { // root type
    lineChartData?: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    topNegativePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
  }
  Edge: prisma.Edge;
  EdgeCondition: { // root type
    conditionType: string; // String!
    edgeId: string; // String!
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
  Mutation: {};
  NodeEntry: prisma.NodeEntry;
  NodeEntryValue: prisma.NodeEntryValue;
  PermssionType: { // root type
    description?: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  Query: {};
  QuestionNode: prisma.QuestionNode;
  QuestionOption: prisma.QuestionOption;
  RoleTableType: { // root type
    pageIndex?: number | null; // Int
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    totalPages?: number | null; // Int
  }
  RoleType: { // root type
    amtPermissions?: number | null; // Int
    id: string; // ID!
    name: string; // String!
  }
  Session: prisma.Session;
  SortFilterObject: { // root type
    desc: boolean; // Boolean!
    id: string; // String!
  }
  TagType: prisma.TagType;
  TriggerConditionType: prisma.TriggerConditionType;
  TriggerTableType: { // root type
    endDate?: string | null; // String
    orderBy: NexusGenRootTypes['SortFilterObject'][]; // [SortFilterObject!]!
    pageIndex: number; // Int!
    pageSize: number; // Int!
    startDate?: string | null; // String
    totalPages: number; // Int!
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
  }
  TriggerType: prisma.TriggerType;
  UniqueDataResultEntry: { // root type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
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
  }
  lineChartDataType: { // root type
    x?: string | null; // String
    y?: number | null; // Int
  }
  topPathType: { // root type
    answer: string; // String!
    quantity: number; // Int!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  Upload: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AddDialogueInput: NexusGenInputs['AddDialogueInput'];
  CustomerCreateOptions: NexusGenInputs['CustomerCreateOptions'];
  CustomerEditOptions: NexusGenInputs['CustomerEditOptions'];
  CustomerWhereUniqueInput: NexusGenInputs['CustomerWhereUniqueInput'];
  DialogueFilterInputType: NexusGenInputs['DialogueFilterInputType'];
  DialogueWhereUniqueInput: NexusGenInputs['DialogueWhereUniqueInput'];
  EdgeChildInput: NexusGenInputs['EdgeChildInput'];
  EdgeNodeInput: NexusGenInputs['EdgeNodeInput'];
  FilterInput: NexusGenInputs['FilterInput'];
  LeafNodeInput: NexusGenInputs['LeafNodeInput'];
  OptionInput: NexusGenInputs['OptionInput'];
  PermissionIdsInput: NexusGenInputs['PermissionIdsInput'];
  PermissionInput: NexusGenInputs['PermissionInput'];
  QuestionConditionInput: NexusGenInputs['QuestionConditionInput'];
  QuestionInput: NexusGenInputs['QuestionInput'];
  QuestionNodeWhereInputType: NexusGenInputs['QuestionNodeWhereInputType'];
  QuestionNodeWhereUniqueInput: NexusGenInputs['QuestionNodeWhereUniqueInput'];
  RecipientsInputType: NexusGenInputs['RecipientsInputType'];
  RoleDataInput: NexusGenInputs['RoleDataInput'];
  RoleInput: NexusGenInputs['RoleInput'];
  SessionWhereUniqueInput: NexusGenInputs['SessionWhereUniqueInput'];
  SortFilterInputObject: NexusGenInputs['SortFilterInputObject'];
  TagsInputObjectType: NexusGenInputs['TagsInputObjectType'];
  TopicDataEntry: NexusGenInputs['TopicDataEntry'];
  TriggerConditionInputType: NexusGenInputs['TriggerConditionInputType'];
  TriggerInputType: NexusGenInputs['TriggerInputType'];
  UploadUserSessionInput: NexusGenInputs['UploadUserSessionInput'];
  UserInput: NexusGenInputs['UserInput'];
  UserSessionEntryDataInput: NexusGenInputs['UserSessionEntryDataInput'];
  UserSessionEntryInput: NexusGenInputs['UserSessionEntryInput'];
  TagTypeEnum: NexusGenEnums['TagTypeEnum'];
  TriggerConditionTypeEnum: NexusGenEnums['TriggerConditionTypeEnum'];
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
    dialogues: NexusGenRootTypes['Dialogue'][]; // [Dialogue!]!
    id: string; // ID!
    name: string; // String!
    settings: NexusGenRootTypes['CustomerSettings']; // CustomerSettings!
    slug: string; // String!
  }
  CustomerSettings: { // field return type
    colourSettings: NexusGenRootTypes['ColourSettings']; // ColourSettings!
    fontSettings: NexusGenRootTypes['FontSettings'] | null; // FontSettings
    id: string; // ID!
    logoUrl: string | null; // String
  }
  Dialogue: { // field return type
    averageScore: number | null; // Float
    countInteractions: number | null; // Int
    creationDate: string | null; // String
    customer: NexusGenRootTypes['Customer']; // Customer!
    customerId: string; // String!
    description: string; // String!
    edges: NexusGenRootTypes['Edge'][]; // [Edge!]!
    id: string; // ID!
    interactionFeedItems: NexusGenRootTypes['Session'][] | null; // [Session!]
    interactions: NexusGenRootTypes['InteractionType']; // InteractionType!
    leafs: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    publicTitle: string | null; // String
    questions: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    rootQuestion: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    slug: string; // String!
    statistics: NexusGenRootTypes['DialogueStatistics']; // DialogueStatistics!
    tags: NexusGenRootTypes['TagType'][] | null; // [TagType!]
    title: string; // String!
    updatedAt: string | null; // String
  }
  DialogueStatistics: { // field return type
    lineChartData: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    topNegativePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
  }
  Edge: { // field return type
    childNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    childNodeId: string; // String!
    conditions: NexusGenRootTypes['EdgeCondition'][]; // [EdgeCondition!]!
    createdAt: string; // String!
    dialogueId: string; // String!
    id: string; // ID!
    parentNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    parentNodeId: string; // String!
    updatedAt: string; // String!
  }
  EdgeCondition: { // field return type
    conditionType: string; // String!
    edgeId: string; // String!
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
  Mutation: { // field return type
    assignTags: NexusGenRootTypes['Dialogue']; // Dialogue!
    createCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    createCustomer: NexusGenRootTypes['Customer']; // Customer!
    createDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    createPermission: NexusGenRootTypes['PermssionType']; // PermssionType!
    createRole: NexusGenRootTypes['RoleType']; // RoleType!
    createTag: NexusGenRootTypes['TagType']; // TagType!
    createTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    createUser: NexusGenRootTypes['UserType']; // UserType!
    deleteCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    deleteCustomer: NexusGenRootTypes['Customer']; // Customer!
    deleteDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    deleteTag: NexusGenRootTypes['TagType']; // TagType!
    deleteTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    deleteUser: NexusGenRootTypes['UserType']; // UserType!
    editCustomer: NexusGenRootTypes['Customer']; // Customer!
    editDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    editTrigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    editUser: NexusGenRootTypes['UserType']; // UserType!
    singleUpload: NexusGenRootTypes['ImageType']; // ImageType!
    updateCTA: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    updateRoles: NexusGenRootTypes['RoleType']; // RoleType!
    updateTopicBuilder: string; // String!
    uploadUserSession: NexusGenRootTypes['Session']; // Session!
  }
  NodeEntry: { // field return type
    creationDate: string; // String!
    depth: number; // Int!
    id: string | null; // ID
    relatedEdgeId: string | null; // String
    relatedNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    relatedNodeId: string | null; // String
    sessionId: string; // String!
    values: NexusGenRootTypes['NodeEntryValue'][]; // [NodeEntryValue!]!
  }
  NodeEntryValue: { // field return type
    id: string; // ID!
    multiValues: NexusGenRootTypes['NodeEntryValue'][]; // [NodeEntryValue!]!
    nodeEntryId: string | null; // String
    numberValue: number | null; // Int
    parentNodeEntryValueId: number | null; // Int
    textValue: string | null; // String
  }
  PermssionType: { // field return type
    description: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  Query: { // field return type
    customer: NexusGenRootTypes['Customer']; // Customer!
    customers: NexusGenRootTypes['Customer'][]; // [Customer!]!
    dialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    dialogues: NexusGenRootTypes['Dialogue'][]; // [Dialogue!]!
    edge: NexusGenRootTypes['Edge']; // Edge!
    getSessionAnswerFlow: NexusGenRootTypes['Session']; // Session!
    interactions: NexusGenRootTypes['InteractionType']; // InteractionType!
    lineChartData: NexusGenRootTypes['lineChartDataType'][]; // [lineChartDataType!]!
    questionNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    questionNodes: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    roleTable: NexusGenRootTypes['RoleTableType']; // RoleTableType!
    session: NexusGenRootTypes['Session']; // Session!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    tags: NexusGenRootTypes['TagType'][]; // [TagType!]!
    trigger: NexusGenRootTypes['TriggerType']; // TriggerType!
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
    triggerTable: NexusGenRootTypes['TriggerTableType']; // TriggerTableType!
    user: NexusGenRootTypes['UserType']; // UserType!
    users: NexusGenRootTypes['UserType'][]; // [UserType!]!
    userTable: NexusGenRootTypes['UserTable']; // UserTable!
  }
  QuestionNode: { // field return type
    children: NexusGenRootTypes['Edge'][]; // [Edge!]!
    creationDate: string | null; // String
    id: string; // ID!
    isLeaf: boolean; // Boolean!
    isRoot: boolean; // Boolean!
    options: NexusGenRootTypes['QuestionOption'][]; // [QuestionOption!]!
    overrideLeaf: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    overrideLeafId: string | null; // String
    questionDialogue: NexusGenRootTypes['Dialogue'] | null; // Dialogue
    questionDialogueId: string; // String!
    title: string; // String!
    type: string; // String!
  }
  QuestionOption: { // field return type
    id: number; // Int!
    publicValue: string | null; // String
    questionId: string; // String!
    value: string; // String!
  }
  RoleTableType: { // field return type
    pageIndex: number | null; // Int
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    totalPages: number | null; // Int
  }
  RoleType: { // field return type
    amtPermissions: number | null; // Int
    customer: NexusGenRootTypes['Customer']; // Customer!
    id: string; // ID!
    name: string; // String!
    permissions: NexusGenRootTypes['PermssionType'][] | null; // [PermssionType!]
  }
  Session: { // field return type
    createdAt: string; // String!
    dialogueId: string; // String!
    id: string; // ID!
    nodeEntries: NexusGenRootTypes['NodeEntry'][]; // [NodeEntry!]!
    score: number | null; // Float
  }
  SortFilterObject: { // field return type
    desc: boolean; // Boolean!
    id: string; // String!
  }
  TagType: { // field return type
    customerId: string; // String!
    id: string; // String!
    name: string; // String!
    type: string; // String!
  }
  TriggerConditionType: { // field return type
    id: number; // Int!
    maxValue: number | null; // Int
    minValue: number | null; // Int
    textValue: string | null; // String
    triggerId: string; // String!
    type: NexusGenEnums['TriggerConditionTypeEnum']; // TriggerConditionTypeEnum!
  }
  TriggerTableType: { // field return type
    endDate: string | null; // String
    orderBy: NexusGenRootTypes['SortFilterObject'][]; // [SortFilterObject!]!
    pageIndex: number; // Int!
    pageSize: number; // Int!
    startDate: string | null; // String
    totalPages: number; // Int!
    triggers: NexusGenRootTypes['TriggerType'][]; // [TriggerType!]!
  }
  TriggerType: { // field return type
    conditions: NexusGenRootTypes['TriggerConditionType'][]; // [TriggerConditionType!]!
    id: string; // String!
    medium: NexusGenEnums['TriggerMediumEnum']; // TriggerMediumEnum!
    name: string; // String!
    recipients: NexusGenRootTypes['UserType'][]; // [UserType!]!
    relatedNode: NexusGenRootTypes['QuestionNode'] | null; // QuestionNode
    type: NexusGenEnums['TriggerTypeEnum']; // TriggerTypeEnum!
  }
  UniqueDataResultEntry: { // field return type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
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
    role: NexusGenRootTypes['RoleType']; // RoleType!
  }
  lineChartDataType: { // field return type
    x: string | null; // String
    y: number | null; // Int
  }
  topPathType: { // field return type
    answer: string; // String!
    quantity: number; // Int!
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
  }
  Mutation: {
    assignTags: { // args
      dialogueId?: string | null; // String
      tags?: NexusGenInputs['TagsInputObjectType'] | null; // TagsInputObjectType
    }
    createCTA: { // args
      customerSlug?: string | null; // String
      dialogueSlug?: string | null; // String
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
    createRole: { // args
      data?: NexusGenInputs['RoleInput'] | null; // RoleInput
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
      description?: string | null; // String
      dialogueId?: string | null; // String
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
      title?: string | null; // String
      type?: string | null; // String
    }
    updateRoles: { // args
      permissions?: NexusGenInputs['PermissionIdsInput'] | null; // PermissionIdsInput
      roleId?: string | null; // String
    }
    updateTopicBuilder: { // args
      customerSlug?: string | null; // String
      dialogueSlug?: string | null; // String
      topicData?: NexusGenInputs['TopicDataEntry'] | null; // TopicDataEntry
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
      customerId?: string | null; // ID
      filter?: NexusGenInputs['DialogueFilterInputType'] | null; // DialogueFilterInputType
    }
    edge: { // args
      id?: string | null; // String
    }
    getSessionAnswerFlow: { // args
      sessionId?: string | null; // ID
    }
    interactions: { // args
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
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
    roles: { // args
      customerSlug?: string | null; // String
    }
    roleTable: { // args
      customerId?: string | null; // String
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
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
    triggers: { // args
      customerSlug?: string | null; // String
      dialogueId?: string | null; // String
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
      userId?: string | null; // String
    }
    triggerTable: { // args
      customerSlug?: string | null; // String
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
    }
    user: { // args
      userId?: string | null; // String
    }
    users: { // args
      customerSlug?: string | null; // String
    }
    userTable: { // args
      customerSlug?: string | null; // String
      filter?: NexusGenInputs['FilterInput'] | null; // FilterInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "ColourSettings" | "Customer" | "CustomerSettings" | "Dialogue" | "DialogueStatistics" | "Edge" | "EdgeCondition" | "FontSettings" | "ImageType" | "InteractionSessionType" | "InteractionType" | "Mutation" | "NodeEntry" | "NodeEntryValue" | "PermssionType" | "Query" | "QuestionNode" | "QuestionOption" | "RoleTableType" | "RoleType" | "Session" | "SortFilterObject" | "TagType" | "TriggerConditionType" | "TriggerTableType" | "TriggerType" | "UniqueDataResultEntry" | "UserTable" | "UserType" | "lineChartDataType" | "topPathType";

export type NexusGenInputNames = "AddDialogueInput" | "CustomerCreateOptions" | "CustomerEditOptions" | "CustomerWhereUniqueInput" | "DialogueFilterInputType" | "DialogueWhereUniqueInput" | "EdgeChildInput" | "EdgeNodeInput" | "FilterInput" | "LeafNodeInput" | "OptionInput" | "PermissionIdsInput" | "PermissionInput" | "QuestionConditionInput" | "QuestionInput" | "QuestionNodeWhereInputType" | "QuestionNodeWhereUniqueInput" | "RecipientsInputType" | "RoleDataInput" | "RoleInput" | "SessionWhereUniqueInput" | "SortFilterInputObject" | "TagsInputObjectType" | "TopicDataEntry" | "TriggerConditionInputType" | "TriggerInputType" | "UploadUserSessionInput" | "UserInput" | "UserSessionEntryDataInput" | "UserSessionEntryInput";

export type NexusGenEnumNames = "TagTypeEnum" | "TriggerConditionTypeEnum" | "TriggerMediumEnum" | "TriggerTypeEnum";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String" | "Upload";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: {};
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