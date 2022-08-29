import {
  AutomationConditionScopeType,
  ConditionPropertyAggregateType,
  QuestionNodeTypeEnum,
} from 'types/generated-types';

export interface NewCTAModalCardProps {
  onClose: () => void;
  onSuccess: (data: ConditionEntry) => void;
}

export type TwoDateArray = [Date, Date];

export interface ActiveQuestion {
  type?: QuestionNodeTypeEnum;
  value?: string;
  label?: string;
}

export interface ConditionEntry {
  scopeType: AutomationConditionScopeType;
  activeDialogue: {
    type: string;
    value: string;
    label: string | undefined;
    id: string;
  } | null;
  activeQuestion: ActiveQuestion | null;
  aspect?: string;
  dateRange: TwoDateArray | null;
  aggregate?: ConditionPropertyAggregateType;
  questionOption?: string;
  latest?: number;
  label?: string;
}
