import {
  AutomationActionType,
  AutomationConditionModel,
  AutomationConditionOperandModel,
  AutomationConditionScopeType,
  AutomationType,
  ConditionPropertyAggregate,
  ConditionPropertyAggregateType,
  DialogueConditionScopeModel,
  Maybe,
  QuestionConditionScopeModel,
  QuestionNodeTypeEnum,
  RecurringPeriodType,
} from 'types/generated-types';

import { TwoDateArray } from 'views/AddAutomationView/CreateConditionModalCardTypes';

export interface ConditionInput {
  operator: { label: string, value: string } | null;
  compareTo: number;
  condition: {
    activeDialogue: {
      id?: string;
      label?: string;
      type?: string;
      value?: string;
    };
    activeQuestion: {
      label?: string;
      type?: QuestionNodeTypeEnum;
      value?: string;
    };
    aggregate?: ConditionPropertyAggregateType;
    aspect?: string;
    dateRange: TwoDateArray | null;
    latest?: number;
    questionOption?: string;
    scopeType?: AutomationConditionScopeType;
  };
}

export interface ActionInput {
  type: AutomationActionType;
  targets: {
    label: string;
    type: string;
    value: string;
  }[]
}

export interface AutomationInput {
  id: string;
  label: string;
  automationType?: AutomationType;
  schedule?: {
    id?: string;
    type?: RecurringPeriodType;
    minutes?: string,
    hours?: string,
    dayOfMonth?: string,
    month?: string,
    dayOfWeek?: string,
    activeDialogue: {
      id?: string;
      label?: string;
      type?: string;
      value?: string;
    };
  }
  conditionBuilder: {
    id?: string;
    logical: { label: string, value: string };
    conditions: ConditionInput[];
    childBuilder?: {
      logical: { label: string, value: string };
      conditions: ConditionInput[];
    }
  },
  actions: {
    action: ActionInput;
  }[];
}

export type ConditionQueryResult = ({
  __typename?: 'AutomationConditionModel' | undefined;
} & Pick<AutomationConditionModel, 'id' | 'scope' | 'operator'> & {
  operands: ({
    __typename?: 'AutomationConditionOperandModel' | undefined;
  } & Pick<AutomationConditionOperandModel, 'id' | 'type' | 'numberValue' | 'textValue'>)[];
  dialogueScope?: Maybe<{
    __typename?: 'DialogueConditionScopeModel' | undefined;
  } & Pick<DialogueConditionScopeModel, 'id' | 'aspect'> & {
    aggregate?: Maybe<{
      __typename?: 'ConditionPropertyAggregate' | undefined;
    } & Pick<ConditionPropertyAggregate, 'id' | 'type' | 'latest'>> | undefined;
  }> | undefined;
  questionScope?: Maybe<{
    __typename?: 'QuestionConditionScopeModel' | undefined;
  } & Pick<QuestionConditionScopeModel, 'id' | 'aspect'> & {
    aggregate?: Maybe<{
      __typename?: 'ConditionPropertyAggregate' | undefined;
    } & Pick<ConditionPropertyAggregate, 'id' | 'type' | 'latest'>> | undefined;
  }> | undefined;
});
