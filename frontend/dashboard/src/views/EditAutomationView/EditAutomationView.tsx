/* eslint-disable arrow-body-style */
import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import cuid from 'cuid';

import {
  AutomationConditionBuilderType,
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
  useGetAutomationQuery,
  useUpdateAutomationMutation,
} from 'types/generated-types';
import { CustomRecurringType } from 'views/AddAutomationView/AutomationForm.types';
import { useNavigator } from 'hooks/useNavigator';

import { AutomationInput, ConditionInput, ConditionQueryResult } from './EditAutomationViewTypes';
import {
  ConditionEntry,
} from '../AddAutomationView/CreateConditionModalCardTypes';
import AutomationForm from '../AddAutomationView/AutomationForm';

const mapConditionOperator = (type: AutomationConditionOperatorType) => {
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

const mapScope = (condition: ConditionQueryResult): {
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

const mapConditionsToFormInput = (
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
): ConditionInput[] => {
  return conditions?.map((condition) => {
    const compareTo = condition.operands.find((operand) => operand.type === OperandType.Int);
    const questionOption = condition.operands.find((operand) => operand.type === OperandType.String);
    const scope = mapScope(condition);
    return {
      compareTo: compareTo?.numberValue as number,
      operator: mapConditionOperator(condition.operator),
      condition: {
        activeDialogue: {
          label: activeDialogue?.title,
          type: 'DIALOGUE',
          value: activeDialogue?.slug,
          id: activeDialogue?.id,
        },
        activeQuestion: {
          label: event?.question?.title,
          type: event?.question?.type,
          value: event?.question?.id,
        },
        scopeType: condition.scope,
        latest: scope?.latest,
        aggregate: scope?.aggregate,
        aspect: scope?.aspect,
        questionOption: questionOption?.textValue || undefined,
        // TODO: Add dateRange
        dateRange: null,
      },
    };
  }) || [];
};

const mapAutomation = (input: GetAutomationQuery['automation']): AutomationInput => {
  return {
    id: input?.id as string,
    label: input?.label as string,
    automationType: input?.type,
    actions: input?.type === AutomationType.Trigger
      ? input?.automationTrigger?.actions?.map((action) => ({
        action: {
          type: action.type,
          targets: action.payload?.targets || [],
        },
      })) || []
      : input?.automationScheduled?.actions?.map((action) => ({
        action: {
          type: action?.type,
          targets: action.channels?.[0]?.payload?.targets || [],
        },
      })) || [],
    schedule: {
      id: input?.automationScheduled?.id,
      dayOfMonth: input?.automationScheduled?.dayOfMonth,
      dayOfWeek: input?.automationScheduled?.dayOfWeek,
      hours: input?.automationScheduled?.hours,
      minutes: input?.automationScheduled?.minutes,
      month: input?.automationScheduled?.month,
      type: input?.automationScheduled?.type,
      dayRange: input?.automationScheduled?.dayRange || [],
      frequency: input?.automationScheduled?.frequency || CustomRecurringType.YEARLY,
      time: input?.automationScheduled?.time || '0 8',
      activeDialogue: input?.automationScheduled?.activeDialogue?.id ? {
        label: input?.automationScheduled?.activeDialogue?.title,
        type: 'DIALOGUE',
        value: input?.automationScheduled?.activeDialogue?.slug,
        id: input?.automationScheduled?.activeDialogue?.id,
      } : null,
    },
    conditionBuilder: {
      id: input?.automationTrigger?.conditionBuilder?.id,
      logical: {
        label: input?.automationTrigger?.conditionBuilder?.type as AutomationConditionBuilderType,
        value: input?.automationTrigger?.conditionBuilder?.type as AutomationConditionBuilderType,
      },
      conditions: mapConditionsToFormInput(
        input?.automationTrigger?.event,
        input?.automationTrigger?.conditionBuilder?.conditions,
        input?.automationTrigger?.activeDialogue,
      ),
      childBuilder: {
        logical: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type ? {
          label: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type,
          value: input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.type,
        } : {
          label: 'AND',
          value: 'AND',
        },
        conditions: mapConditionsToFormInput(
          input?.automationTrigger?.event,
          input?.automationTrigger?.conditionBuilder?.childConditionBuilder?.conditions,
          input?.automationTrigger?.activeDialogue,
        ),
      },
    },
  };
};

const findUniqueConditionEntries = (entries: ConditionEntry[]) => {
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

const EditAutomationView = () => {
  const { goToAutomationOverview } = useNavigator();
  const { t } = useTranslation();
  const { automationId }: { automationId: string } = useParams();
  const { data: automationData, loading: automationDataLoading } = useGetAutomationQuery({
    variables: {
      input: {
        id: automationId,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateAutomation, { loading }] = useUpdateAutomationMutation({
    onCompleted: (data) => {
      console.log('return data create automation mutation: ', data?.updateAutomation?.label);
      goToAutomationOverview();
    },
    onError: (e) => {
      console.log('Something went wrong: ', e.message);
    },
  });

  if (automationDataLoading) {
    return null;
  }

  const automation: GetAutomationQuery['automation'] = automationData?.automation;
  const mappedAutomation: AutomationInput = mapAutomation(automation);

  // TODO: Add child builder
  const conditionEntries: ConditionEntry[] = findUniqueConditionEntries(
    mappedAutomation.conditionBuilder.conditions.map(
      (condition) => ({ ...condition.condition, label: cuid() }),
    ) as ConditionEntry[],
  );

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:edit_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
          <AutomationForm
            mappedConditions={conditionEntries}
            automation={mappedAutomation}
            onUpdateAutomation={updateAutomation}
            isLoading={loading}
            isInEdit
          />
        </motion.div>
      </UI.ViewBody>
    </>
  );
};

export default EditAutomationView;
