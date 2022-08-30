import {
  AutomationActionType, AutomationConditionBuilder, AutomationConditionOperand, AutomationConditionOperatorType,
  AutomationConditionScopeType, AutomationEvent, AutomationType, ConditionPropertyAggregate, Prisma,
  Customer, Dialogue, DialogueConditionScope, NodeType, QuestionAspect, QuestionConditionScope, QuestionNode,
  WorkspaceConditionScope, AutomationCondition as PrismaAutomationCondition, AutomationConditionBuilderType,
} from '@prisma/client';

import { NexusGenEnums } from '../../generated/nexus';

export interface SetupQuestionCompareDataInput {
  questionId: string;
  aspect: QuestionAspect;
  aggregate?: ConditionPropertyAggregate | null;
  operands: AutomationConditionOperand[];
  type: NodeType;
}

export interface SetupQuestionCompareDataOutput {
  totalEntries: number;
  compareValue?: number | null;
  operand?: number | null;
}

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

export interface CreateConditionOperandInput {
  dateTimeValue?: string | null; // String
  type: any; // MatchValueType
  numberValue?: number | null; // Int
  textValue?: string | null; // String
}

export interface UpdateConditionOperandInput extends CreateConditionOperandInput {
  id?: string;
}

export interface CreateAutomationConditionInput {
  dialogueId?: string | null; // String
  operands: CreateConditionOperandInput[]; // MatchValueInput
  operator: NexusGenEnums['AutomationConditionOperatorType']; // AutomationConditionOperatorType
  questionId?: string | null; // String
  scope: CreateAutomationConditionScopeInput; // ConditionScopeInput
  workspaceId?: string | null; // String
}

export interface UpdateAutomationConditionInput extends CreateAutomationConditionInput {
  id?: string;
  operands: UpdateConditionOperandInput[];
  scope: UpdateAutomationConditionScopeInput;
}

export interface CreateConditionBuilderInput {
  type: AutomationConditionBuilderType;
  conditions: CreateAutomationConditionInput[];
  childBuilder?: CreateConditionBuilderInput;
}

export interface UpdateConditionBuilderInput extends CreateConditionBuilderInput {
  id?: string;
  conditions: UpdateAutomationConditionInput[];
  childBuilder?: UpdateConditionBuilderInput;

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
  conditionBuilder?: CreateConditionBuilderInput;
  conditions?: CreateAutomationConditionInput[];

  schedule?: Prisma.AutomationScheduledCreateInput;

  actions: CreateAutomationActionInput[];
};

export interface CreateAutomationActionInput {
  type: NexusGenEnums['AutomationActionType'];
  apiKey?: string | null;
  endpoint?: string | null;
  channels: Prisma.AutomationActionChannelCreateInput[];
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
  conditions?: UpdateAutomationConditionInput[];
  conditionBuilder?: UpdateConditionBuilderInput;
}

export type MoreXOR = CreateQuestionScopeInput['aspect'] | CreateDialogueScopeInput['aspect'] | CreateWorkspaceScopeInput['aspect']

export interface CreateScopeDataInput {
  aspect: any; // TODO: Turn this into MoreXOR
  aggregate: ConditionPropertAggregateInput;
}

export interface UpdateScopeDataInput extends CreateScopeDataInput {
  id?: string;
}

export interface AutomationEventWithRels extends AutomationEvent {
  question: QuestionNode | null;
  dialogue: Dialogue | null;
}

export interface AutomationCondition {
  id: string;
  scope: AutomationConditionScopeType;
  operator: AutomationConditionOperatorType;
  operands: AutomationConditionOperand[];
  questionScope: (QuestionConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null;
  dialogueScope: (DialogueConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null;
  workspaceScope: (WorkspaceConditionScope
    & {
      aggregate: ConditionPropertyAggregate | null;
    }) | null;
  dialogue: Dialogue | null;
  question: QuestionNode | null;
}

export interface AutomationTrigger {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  event: AutomationEventWithRels;
  conditionBuilder: (AutomationConditionBuilder & { conditions: AutomationCondition[] });
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
  aspect: QuestionAspect;
  aggregate?: ConditionPropertyAggregate | null;
  operands: AutomationConditionOperand[];
  type: NodeType;
}

export interface SetupQuestionCompareDataOutput {
  totalEntries: number;
  compareValue?: number | null;
  operand?: number | null;
}

export interface BuilderEntry extends AutomationConditionBuilder {
  conditions: PrismaAutomationCondition[];
  childConditionBuilder?: BuilderEntry | null;
}

export interface PreValidatedConditions {
  AND?: (AutomationCondition | PreValidatedConditions)[];
  OR?: (AutomationCondition | PreValidatedConditions)[];
}

export interface CheckedConditions {
  AND?: (boolean | CheckedConditions)[];
  OR?: (boolean | CheckedConditions)[];
}

export const defaultAutomationFields = Prisma.validator<Prisma.AutomationArgs>()({
  include: {
    automationScheduled: {
      include: {
        actions: true,
      },
    },
  },
});

export type Automation = Prisma.AutomationGetPayload<typeof defaultAutomationFields>;
