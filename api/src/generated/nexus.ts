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
  SessionWhereUniqueInput: { // input type
    dialogueId?: string | null; // ID
    id?: string | null; // ID
  }
  TopicDataEntry: { // input type
    id?: string | null; // ID
    questions?: NexusGenInputs['QuestionInput'][] | null; // [QuestionInput!]
  }
  UploadUserSessionInput: { // input type
    dialogueId: string; // String!
    entries?: NexusGenInputs['UserSessionEntryInput'][] | null; // [UserSessionEntryInput!]
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
  InteractionType: { // root type
    createdAt: string; // String!
    index: number; // Int!
    paths: number; // Int!
    score: number; // Float!
    sessionId: string; // String!
  }
  Mutation: {};
  NodeEntry: prisma.NodeEntry;
  NodeEntryValue: prisma.NodeEntryValue;
  Query: {};
  QuestionNode: prisma.QuestionNode;
  QuestionOption: prisma.QuestionOption;
  Session: prisma.Session;
  UniqueDataResultEntry: { // root type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
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
  QuestionConditionInput: NexusGenInputs['QuestionConditionInput'];
  QuestionInput: NexusGenInputs['QuestionInput'];
  QuestionNodeWhereInput: NexusGenInputs['QuestionNodeWhereInput'];
  QuestionNodeWhereUniqueInput: NexusGenInputs['QuestionNodeWhereUniqueInput'];
  SessionWhereUniqueInput: NexusGenInputs['SessionWhereUniqueInput'];
  TopicDataEntry: NexusGenInputs['TopicDataEntry'];
  UploadUserSessionInput: NexusGenInputs['UploadUserSessionInput'];
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
  InteractionType: { // field return type
    createdAt: string; // String!
    index: number; // Int!
    paths: number; // Int!
    score: number; // Float!
    sessionId: string; // String!
  }
  Mutation: { // field return type
    createCustomer: NexusGenRootTypes['Customer']; // Customer!
    createDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    deleteCustomer: NexusGenRootTypes['Customer']; // Customer!
    deleteDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    editCustomer: NexusGenRootTypes['Customer']; // Customer!
    editDialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    singleUpload: NexusGenRootTypes['ImageType']; // ImageType!
    updateTopicBuilder: string; // String!
    uploadUserSession: NexusGenRootTypes['Session']; // Session!
  }
  NodeEntry: { // field return type
    creationDate: string; // String!
    depth: number; // Int!
    id: string; // ID!
    relatedEdgeId: string | null; // String
    relatedNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    relatedNodeId: string; // String!
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
  Query: { // field return type
    customer: NexusGenRootTypes['Customer']; // Customer!
    customers: NexusGenRootTypes['Customer'][]; // [Customer!]!
    dialogue: NexusGenRootTypes['Dialogue']; // Dialogue!
    dialogues: NexusGenRootTypes['Dialogue'][]; // [Dialogue!]!
    edge: NexusGenRootTypes['Edge']; // Edge!
    getQuestionnaireData: NexusGenRootTypes['DialogueDetailResult']; // DialogueDetailResult!
    getSessionAnswerFlow: NexusGenRootTypes['Session']; // Session!
    interactions: NexusGenRootTypes['InteractionType'][]; // [InteractionType!]!
    lineChartData: NexusGenRootTypes['lineChartDataType'][]; // [lineChartDataType!]!
    questionNode: NexusGenRootTypes['QuestionNode']; // QuestionNode!
    questionNodes: NexusGenRootTypes['QuestionNode'][]; // [QuestionNode!]!
    session: NexusGenRootTypes['Session']; // Session!
    sessions: NexusGenRootTypes['Session'][]; // [Session!]!
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
  Session: { // field return type
    createdAt: string; // String!
    dialogueId: string; // String!
    id: string; // ID!
    nodeEntries: NexusGenRootTypes['NodeEntry'][]; // [NodeEntry!]!
  }
  UniqueDataResultEntry: { // field return type
    createdAt: string; // String!
    sessionId: string; // String!
    value: number; // Int!
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
    deleteCustomer: { // args
      where?: NexusGenInputs['CustomerWhereUniqueInput'] | null; // CustomerWhereUniqueInput
    }
    deleteDialogue: { // args
      where?: NexusGenInputs['DialogueWhereUniqueInput'] | null; // DialogueWhereUniqueInput
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
    singleUpload: { // args
      file?: any | null; // Upload
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
    session: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
    sessions: { // args
      where?: NexusGenInputs['SessionWhereUniqueInput'] | null; // SessionWhereUniqueInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "ColourSettings" | "Customer" | "CustomerSettings" | "Dialogue" | "DialogueDetailResult" | "Edge" | "EdgeCondition" | "FontSettings" | "ImageType" | "InteractionType" | "Mutation" | "NodeEntry" | "NodeEntryValue" | "Query" | "QuestionNode" | "QuestionOption" | "Session" | "UniqueDataResultEntry" | "lineChartDataType" | "topPathType";

export type NexusGenInputNames = "CustomerCreateOptions" | "CustomerWhereUniqueInput" | "DialogueWhereUniqueInput" | "EdgeChildInput" | "EdgeNodeInput" | "InteractionFilterInput" | "LeafNodeInput" | "OptionInput" | "QuestionConditionInput" | "QuestionInput" | "QuestionNodeWhereInput" | "QuestionNodeWhereUniqueInput" | "SessionWhereUniqueInput" | "TopicDataEntry" | "UploadUserSessionInput" | "UserSessionEntryDataInput" | "UserSessionEntryInput";

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