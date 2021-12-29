import {
  AutomationActionType, AutomationConditionMatchValue, AutomationConditionOperatorType,
  AutomationConditionScopeType, AutomationEvent, AutomationType, ConditionPropertyAggregate,
  Customer, Dialogue, DialogueConditionScope, NodeType, QuestionAspect, QuestionConditionScope, QuestionNode,
  WorkspaceConditionScope
} from '@prisma/client';

import { NexusGenEnums } from '../../generated/nexus';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export interface ConditionPropertAggregateInput {
  endDate?: Date | null; // String
  latest?: number | null; // Int
  startDate?: Date | null; // String
  type: NexusGenEnums['ConditionPropertyAggregateType']; // ConditionPropertyAggregateType
}

export interface UpdateConditionPropertyAggregateInput extends ConditionPropertAggregateInput {
  id?: string;
}

export interface CreateDialogueScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['DialogueAspectType']; // DialogueAspectType
}

export interface UpdateDialogueScopeInput extends CreateDialogueScopeInput {
  id?: string;
}

export interface CreateQuestionScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['QuestionAspectType']; // DialogueAspectType
}

export interface UpdateQuestionScopeInput extends CreateQuestionScopeInput {
  id?: string;
}

export interface CreateWorkspaceScopeInput {
  aggregate: ConditionPropertAggregateInput;
  aspect: NexusGenEnums['WorkspaceAspectType']; // DialogueAspectType
}

export interface UpdateWorkspaceScopeInput extends CreateWorkspaceScopeInput {
  id?: string;
}

export interface CreateAutomationConditionScopeInput {
  dialogueScope?: CreateDialogueScopeInput | null; // ConditionDialogueScopeInput
  questionScope?: CreateQuestionScopeInput | null; // ConditionQuestionScopeInput
  type: NexusGenEnums['AutomationConditionScopeType']; // AutomationConditionScopeType
  workspaceScope?: CreateWorkspaceScopeInput | null; // ConditionWorkspaceScopeInput
}

export interface UpdateAutomationConditionScopeInput extends CreateAutomationConditionScopeInput {
  id?: string;
  dialogueScope?: UpdateDialogueScopeInput | null; // ConditionDialogueScopeInput
  questionScope?: UpdateQuestionScopeInput | null; // ConditionQuestionScopeInput
  workspaceScope?: UpdateWorkspaceScopeInput | null; // ConditionWorkspaceScopeInput
}

export interface CreateConditionMatchValueInput {
  dateTimeValue?: string | null; // String
  type: NexusGenEnums['MatchValueType']; // MatchValueType
  numberValue?: number | null; // Int
  textValue?: string | null; // String
}

export interface UpdateConditionMatchValueInput extends CreateConditionMatchValueInput {
  id?: string;
}

export interface CreateAutomationConditionInput {
  dialogueId?: string | null; // String
  matchValues: CreateConditionMatchValueInput[]; // MatchValueInput
  operator: NexusGenEnums['AutomationConditionOperatorType']; // AutomationConditionOperatorType
  questionId?: string | null; // String
  scope: CreateAutomationConditionScopeInput; // ConditionScopeInput
  workspaceId?: string | null; // String
}

export interface UpdateAutomationConditionInput extends CreateAutomationConditionInput {
  id?: string;
  matchValues: UpdateConditionMatchValueInput[];
  scope: UpdateAutomationConditionScopeInput;
}

export interface CreateAutomationInput {
  label: string;
  workspaceId: string;
  automationType: AutomationType;
  description?: string | null;

  event: {
    dialogueId?: string | null; // String
    eventType: NexusGenEnums['AutomationEventType']; // AutomationEventType
    questionId?: string | null; // String
  };
  conditions: CreateAutomationConditionInput[];
  actions: CreateAutomationActionInput[];
};

export interface CreateAutomationActionInput {
  type: NexusGenEnums['AutomationActionType'];
  apiKey?: string | null;
  endpoint?: string | null;
  payload?: object | null;
}

export interface UpdateAutomationActionInput extends CreateAutomationActionInput {
  id?: string;
}

export interface UpdateAutomationInput extends CreateAutomationInput {
  id: string;
  automationTriggerId?: string;
  automationCampaignId?: string;
  actions: UpdateAutomationActionInput[];
  conditions: UpdateAutomationConditionInput[];
}

export type MoreXOR = CreateQuestionScopeInput['aspect'] | CreateDialogueScopeInput['aspect'] | CreateWorkspaceScopeInput['aspect']

export interface CreateScopeDataInput {
  aspect: any // TODO: Turn this into MoreXOR
  aggregate: ConditionPropertAggregateInput;
}

export interface UpdateScopeDataInput extends CreateScopeDataInput {
  id?: string;
}

export interface AutomationEventWithRels extends AutomationEvent {
  question: QuestionNode | null,
  dialogue: Dialogue | null
}

export interface AutomationCondition {
  id: string;
  scope: AutomationConditionScopeType;
  operator: AutomationConditionOperatorType;
  matchValues: AutomationConditionMatchValue[],
  questionScope: (QuestionConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null,
  dialogueScope: (DialogueConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null,
  workspaceScope: (WorkspaceConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null,
  dialogue: Dialogue | null;
  question: QuestionNode | null;
}

export interface AutomationTrigger {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  event: AutomationEventWithRels;
  conditions: AutomationCondition[];
  actions: {
    id: string;
    type: AutomationActionType;
  }[];
}

export interface FullAutomationWithRels {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  description?: string | null;
  type: AutomationType;
  workspace: Customer;
  automationTrigger: AutomationTrigger | null;
}


export interface SetupQuestionCompareDataInput {
  questionId: string;
  aspect: QuestionAspect,
  aggregate?: ConditionPropertyAggregate | null,
  matchValues: AutomationConditionMatchValue[],
  type: NodeType,
}

export interface SetupQuestionCompareDataOutput {
  totalEntries: number;
  compareValue?: number | null;
  matchValue?: number | null;
}
