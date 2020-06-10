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
  CustomerCreateOptions: { // input type
    isSeed?: boolean | null; // Boolean
    logo?: string | null; // String
    name?: string | null; // String
    primaryColour?: string | null; // String
    slug: string; // String!
  }
  CustomerWhereUniqueInput: { // input type
    id: string; // ID!
  }
  DialogueWhereUniqueInput: { // input type
    id: string; // ID!
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
  InteractionFilterInput: { // input type
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
  QuestionNodeWhereInput: { // input type
    id?: string | null; // ID
    isRoot?: boolean | null; // Boolean
  }
  QuestionNodeWhereUniqueInput: { // input type
    id: string; // String!
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
  TopicDataEntry: { // input type
    id?: string | null; // ID
    questions?: NexusGenInputs['QuestionInput'][] | null; // [QuestionInput!]
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
}

export interface NexusGenRootTypes {
  ColourSettings: prisma.ColourSettings;
  Customer: prisma.Customer;
  CustomerSettings: prisma.CustomerSettings;
  Dialogue: prisma.Dialogue;
  DialogueDetailResult: { // root type
    average: string; // String!
    creationDate: string; // String!
    customerName: string; // String!
    description: string; // String!
    lineChartData?: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    timelineEntries: NexusGenRootTypes['UniqueDataResultEntry'][]; // [UniqueDataResultEntry!]!
    title: string; // String!
    topNegativePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath?: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    totalNodeEntries: number; // Int!
    updatedAt: string; // String!
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
    score: number; // Float!
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
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
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
  UniqueDataResultEntry: { // root type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
  }
  UserType: { // root type
    email: string; // String!
    firstName?: string | null; // String
    id: string; // ID!
    lastName?: string | null; // String
    phone?: string | null; // String
  }
  lineChartDataType: { // root type
    x: string; // String!
    y: number; // Int!
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
  CustomerCreateOptions: NexusGenInputs['CustomerCreateOptions'];
  CustomerWhereUniqueInput: NexusGenInputs['CustomerWhereUniqueInput'];
  DialogueWhereUniqueInput: NexusGenInputs['DialogueWhereUniqueInput'];
  EdgeChildInput: NexusGenInputs['EdgeChildInput'];
  EdgeNodeInput: NexusGenInputs['EdgeNodeInput'];
  InteractionFilterInput: NexusGenInputs['InteractionFilterInput'];
  LeafNodeInput: NexusGenInputs['LeafNodeInput'];
  OptionInput: NexusGenInputs['OptionInput'];
  PermissionIdsInput: NexusGenInputs['PermissionIdsInput'];
  PermissionInput: NexusGenInputs['PermissionInput'];
  QuestionConditionInput: NexusGenInputs['QuestionConditionInput'];
  QuestionInput: NexusGenInputs['QuestionInput'];
  QuestionNodeWhereInput: NexusGenInputs['QuestionNodeWhereInput'];
  QuestionNodeWhereUniqueInput: NexusGenInputs['QuestionNodeWhereUniqueInput'];
  RoleDataInput: NexusGenInputs['RoleDataInput'];
  RoleInput: NexusGenInputs['RoleInput'];
  SessionWhereUniqueInput: NexusGenInputs['SessionWhereUniqueInput'];
  SortFilterInputObject: NexusGenInputs['SortFilterInputObject'];
  TopicDataEntry: NexusGenInputs['TopicDataEntry'];
  UploadUserSessionInput: NexusGenInputs['UploadUserSessionInput'];
  UserInput: NexusGenInputs['UserInput'];
  UserSessionEntryDataInput: NexusGenInputs['UserSessionEntryDataInput'];
  UserSessionEntryInput: NexusGenInputs['UserSessionEntryInput'];
}

export interface NexusGenFieldTypes {
  ColourSettings: { // field return type
    id: string; // ID!
    primary: string; // String!
    primaryAlt: string | null; // String
    secondary: string | null; // String
  }
  Customer: { // field return type
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
    averageScore: string | null; // String
    creationDate: string | null; // String
    customer: NexusGenRootTypes['Customer']; // Customer!
    customerId: string; // String!
    description: string; // String!
    id: string; // ID!
    leafs: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    lineChartData: string | null; // String
    publicTitle: string | null; // String
    questions: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    title: string; // String!
    updatedAt: string | null; // String
  }
  DialogueDetailResult: { // field return type
    average: string; // String!
    creationDate: string; // String!
    customerName: string; // String!
    description: string; // String!
    lineChartData: NexusGenRootTypes['lineChartDataType'][] | null; // [lineChartDataType!]
    timelineEntries: NexusGenRootTypes['UniqueDataResultEntry'][]; // [UniqueDataResultEntry!]!
    title: string; // String!
    topNegativePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    topPositivePath: NexusGenRootTypes['topPathType'][] | null; // [topPathType!]
    totalNodeEntries: number; // Int!
    updatedAt: string; // String!
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
    score: number; // Float!
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
    createCustomer: NexusGenRootTypes['Customer']; // Customer!
    createDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    createPermission: NexusGenRootTypes['PermssionType']; // PermssionType!
    createRole: NexusGenRootTypes['RoleType']; // RoleType!
    createUser: NexusGenRootTypes['UserType']; // UserType!
    deleteCustomer: NexusGenRootTypes['Customer']; // Customer!
    deleteDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    deleteUser: NexusGenRootTypes['UserType']; // UserType!
    editCustomer: NexusGenRootTypes['Customer']; // Customer!
    editDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    editUser: NexusGenRootTypes['UserType']; // UserType!
    singleUpload: NexusGenRootTypes['ImageType']; // ImageType!
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
    getQuestionnaireData: NexusGenRootTypes['DialogueDetailResult']; // DialogueDetailResult!
    getSessionAnswerFlow: NexusGenRootTypes['Session']; // Session!
    interactions: NexusGenRootTypes['InteractionType']; // InteractionType!
    lineChartData: NexusGenRootTypes['lineChartDataType'][]; // [lineChartDataType!]!
    questionNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    questionNodes: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
    roleTable: NexusGenRootTypes['RoleTableType']; // RoleTableType!
    session: NexusGenRootTypes['Session']; // Session!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
    user: NexusGenRootTypes['UserType']; // UserType!
    users: NexusGenRootTypes['UserType'][]; // [UserType!]!
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
    permissions: NexusGenRootTypes['PermssionType'][]; // [PermssionType!]!
    roles: NexusGenRootTypes['RoleType'][]; // [RoleType!]!
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
  }
  SortFilterObject: { // field return type
    desc: boolean; // Boolean!
    id: string; // String!
  }
  UniqueDataResultEntry: { // field return type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
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
    x: string; // String!
    y: number; // Int!
  }
  topPathType: { // field return type
    answer: string; // String!
    quantity: number; // Int!
  }
}

export interface NexusGenArgTypes {
  Dialogue: {
    questions: { // args
      where?: NexusGenInputs['QuestionNodeWhereInput'] | null; // QuestionNodeWhereInput
    }
  }
  Mutation: {
    createCustomer: { // args
      name?: string | null; // String
      options?: NexusGenInputs['CustomerCreateOptions'] | null; // CustomerCreateOptions
    }
    createDialogue: { // args
      customerId?: string | null; // String
      description?: string | null; // String
      isSeed?: boolean | null; // Boolean
      publicTitle?: string | null; // String
      title?: string | null; // String
    }
    createPermission: { // args
      data?: NexusGenInputs['PermissionInput'] | null; // PermissionInput
    }
    createRole: { // args
      data?: NexusGenInputs['RoleInput'] | null; // RoleInput
    }
    createUser: { // args
      id?: string | null; // String
      input?: NexusGenInputs['UserInput'] | null; // UserInput
    }
    deleteCustomer: { // args
      where?: NexusGenInputs['CustomerWhereUniqueInput'] | null; // CustomerWhereUniqueInput
    }
    deleteDialogue: { // args
      where?: NexusGenInputs['DialogueWhereUniqueInput'] | null; // DialogueWhereUniqueInput
    }
    deleteUser: { // args
      id?: string | null; // String
    }
    editCustomer: { // args
      id?: string | null; // String
      options?: NexusGenInputs['CustomerCreateOptions'] | null; // CustomerCreateOptions
    }
    editDialogue: { // args
      description?: string | null; // String
      dialogueId?: string | null; // String
      publicTitle?: string | null; // String
      title?: string | null; // String
    }
    editUser: { // args
      id?: string | null; // String
      input?: NexusGenInputs['UserInput'] | null; // UserInput
    }
    singleUpload: { // args
      file?: any | null; // Upload
    }
    updateRoles: { // args
      permissions?: NexusGenInputs['PermissionIdsInput'] | null; // PermissionIdsInput
      roleId?: string | null; // String
    }
    updateTopicBuilder: { // args
      id?: string | null; // String
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
    }
    edge: { // args
      id?: string | null; // String
    }
    getQuestionnaireData: { // args
      dialogueId?: string | null; // String
      filter?: number | null; // Int
    }
    getSessionAnswerFlow: { // args
      sessionId?: string | null; // ID
    }
    interactions: { // args
      filter?: NexusGenInputs['InteractionFilterInput'] | null; // InteractionFilterInput
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
      customerId?: string | null; // String
    }
    roleTable: { // args
      customerId?: string | null; // String
    }
    session: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
    sessions: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
    user: { // args
      userId?: string | null; // String
    }
    users: { // args
      customerId?: string | null; // String
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "ColourSettings" | "Customer" | "CustomerSettings" | "Dialogue" | "DialogueDetailResult" | "Edge" | "EdgeCondition" | "FontSettings" | "ImageType" | "InteractionSessionType" | "InteractionType" | "Mutation" | "NodeEntry" | "NodeEntryValue" | "PermssionType" | "Query" | "QuestionNode" | "QuestionOption" | "RoleTableType" | "RoleType" | "Session" | "SortFilterObject" | "UniqueDataResultEntry" | "UserType" | "lineChartDataType" | "topPathType";

export type NexusGenInputNames = "CustomerCreateOptions" | "CustomerWhereUniqueInput" | "DialogueWhereUniqueInput" | "EdgeChildInput" | "EdgeNodeInput" | "InteractionFilterInput" | "LeafNodeInput" | "OptionInput" | "PermissionIdsInput" | "PermissionInput" | "QuestionConditionInput" | "QuestionInput" | "QuestionNodeWhereInput" | "QuestionNodeWhereUniqueInput" | "RoleDataInput" | "RoleInput" | "SessionWhereUniqueInput" | "SortFilterInputObject" | "TopicDataEntry" | "UploadUserSessionInput" | "UserInput" | "UserSessionEntryDataInput" | "UserSessionEntryInput";

export type NexusGenEnumNames = never;

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