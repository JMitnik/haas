import {
  AutomationActionType,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  AutomationEventModel,
  AutomationType,
  ConditionPropertyAggregateType,
  Dialogue,
  GetAutomationQuery,
  Maybe,
  OperandType,
  QuestionNode,
  QuestionNodeTypeEnum,
} from 'types/generated-types';
import { ConditionEntry } from 'views/AddAutomationView/CreateConditionModalCardTypes';
import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';

import { AutomationInput, ConditionInput, ConditionQueryResult } from './EditAutomationViewTypes';

export const mapConditionOperator = (type: AutomationConditionOperatorType) => {
  switch (type) {
    case AutomationConditionOperatorType.SmallerThan:
      return { label: '<', value: AutomationConditionOperatorType.SmallerThan.toString() };

    case AutomationConditionOperatorType.SmallerOrEqualThan:
      return { label: '<=', value: AutomationConditionOperatorType.SmallerOrEqualThan.toString() };

    case AutomationConditionOperatorType.GreaterThan:
      return { label: '>', value: AutomationConditionOperatorType.GreaterThan.toString() };

    case AutomationConditionOperatorType.GreaterOrEqualThan:
      return { label: '>=', value: AutomationConditionOperatorType.GreaterOrEqualThan.toString() };

    case AutomationConditionOperatorType.IsEqual:
      return { label: '==', value: AutomationConditionOperatorType.IsEqual.toString() };

    default: {
      return null;
    }
  }
};

export const mapScope = (condition: ConditionQueryResult): {
  latest: number,
  aggregate: ConditionPropertyAggregateType,
  aspect: string,
} | null => {
  switch (condition.scope) {
    case AutomationConditionScopeType.Question:
      return {
        latest: condition.questionScope?.aggregate?.latest || 1,
        aggregate: condition.questionScope?.aggregate?.type as ConditionPropertyAggregateType,
        aspect: condition.questionScope?.aspect?.toString() as string,
      };

    case AutomationConditionScopeType.Dialogue:
      return {
        latest: condition.dialogueScope?.aggregate?.latest || 1,
        aggregate: condition.dialogueScope?.aggregate?.type as ConditionPropertyAggregateType,
        aspect: condition.dialogueScope?.aspect?.toString() as string,
      };

    // TODO: Add Workspace scope
    default:
      return null;
  }
};

export const mapConditionsToFormInput = (
  event: Maybe<{
    __typename?: 'AutomationEventModel' | undefined;
  } & Pick<AutomationEventModel, 'id' | 'type'> & {
    dialogue?: Maybe<{
      __typename?: 'Dialogue' | undefined;
    } & Pick<Dialogue, 'id' | 'title' | 'slug'>> | undefined;
    question?: Maybe<{
      __typename?: 'QuestionNode' | undefined;
    } & Pick<QuestionNode, 'id' | 'type' | 'title'>> | undefined;
  }> | undefined,
  conditions?: ConditionQueryResult[],
  activeDialogue?: Maybe<{
    __typename?: 'Dialogue' | undefined;
  } & Pick<Dialogue, 'id' | 'title' | 'slug'>> | undefined,
): ConditionInput[] => conditions?.map((condition) => {
  const compareTo = condition.operands.find((operand) => operand.type === OperandType.Int);
  const questionOption = condition.operands.find((operand) => operand.type === OperandType.String);
  const scope = mapScope(condition);
  return {
    compareTo: compareTo?.numberValue as number,
    operator: mapConditionOperator(condition.operator as AutomationConditionOperatorType),
    condition: {
      activeDialogue: {
        label: activeDialogue?.title,
        type: 'DIALOGUE',
        value: activeDialogue?.slug,
        id: activeDialogue?.id,
      },
      activeQuestion: {
        label: event?.question?.title,
        type: event?.question?.type as QuestionNodeTypeEnum,
        value: event?.question?.id,
      },
      scopeType: condition.scope as AutomationConditionScopeType,
      latest: scope?.latest,
      aggregate: scope?.aggregate,
      aspect: scope?.aspect,
      questionOption: questionOption?.textValue || undefined,
      // TODO: Add dateRange
      dateRange: null,
    },
  };
}) || [];

export const mapAutomation = (input: GetAutomationQuery['automation']): AutomationInput => ({
  id: input?.id as string,
  label: input?.label as string,
  automationType: input?.type as AutomationType,
  actions: input?.type === AutomationType.Trigger
    ? input?.automationTrigger?.actions?.map((action) => ({
      action: {
        id: action?.id as string,
        type: action?.type as AutomationActionType,
        targets: action?.payload?.targets || [],
      },
    })) || []
    : input?.automationScheduled?.actions?.map((action) => ({
      action: {
        id: action?.id as string,
        type: action?.type as AutomationActionType,
        targets: action?.channels?.[0]?.payload?.targets || [],
        channelId: action?.channels?.[0]?.id,
      },
    })) || [],
  schedule: {
    id: input?.automationScheduled?.id || undefined,
    dayOfMonth: input?.automationScheduled?.dayOfMonth || undefined,
    dayOfWeek: input?.automationScheduled?.dayOfWeek || undefined,
    hours: input?.automationScheduled?.hours || undefined,
    minutes: input?.automationScheduled?.minutes || undefined,
    month: input?.automationScheduled?.month || undefined,
    type: input?.automationScheduled?.type || undefined,
    dayRange: input?.automationScheduled?.dayRange as any || [],
    frequency: input?.automationScheduled?.frequency || CustomRecurringType.YEARLY,
    time: input?.automationScheduled?.time || '0 8',
    activeDialogue: input?.automationScheduled?.activeDialogue?.id ? {
      label: input?.automationScheduled?.activeDialogue?.title,
      type: 'DIALOGUE',
      value: input?.automationScheduled?.activeDialogue?.slug,
      id: input?.automationScheduled?.activeDialogue?.id,
    } : null,
  },
  // conditionBuilder: {
  //   id: input?.automationTrigger?.conditionBuilder?.id || undefined,
  //   logical: {
  //     label: input?.automationTrigger?.conditionBuilder?.type as AutomationConditionBuilderType,
  //     value: input?.automationTrigger?.conditionBuilder?.type as AutomationConditionBuilderType,
  //   },
  //   conditions: mapConditionsToFormInput(
  //     input?.automationTrigger?.event,
  //     input?.automationTrigger?.conditionBuilder?.conditions as any,
  //     input?.automationTrigger?.activeDialogue,
  //   ),
  //   childBuilder: {
  //     logical: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type ? {
  //       label: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type,
  //       value: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type,
  //     } : {
  //       label: 'AND',
  //       value: 'AND',
  //     },
  //     conditions: mapConditionsToFormInput(
  //       input?.automationTrigger?.event,
  //       input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.conditions as any,
  //       input?.automationTrigger?.activeDialogue,
  //     ),
  //   },
  // },
});

export const findUniqueConditionEntries = (entries: ConditionEntry[]) => {
  const unique: ConditionEntry[] = [];
  entries.forEach((condition) => {
    let isUnique = true;
    if (unique.length === 0) {
      unique.push(condition);
      return;
    }
    unique.forEach((uniqueEntry) => {
      if (condition.aggregate === uniqueEntry.aggregate
        && condition.aspect === uniqueEntry.aspect
        && condition.dateRange === uniqueEntry.dateRange
        && condition.latest === uniqueEntry.latest
        && condition.questionOption === uniqueEntry.questionOption
        && condition.scopeType === uniqueEntry.scopeType
      ) isUnique = false;
    });
    if (isUnique) unique.push(condition);
  });
  return unique;
};
