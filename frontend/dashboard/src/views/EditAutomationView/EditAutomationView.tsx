/* eslint-disable arrow-body-style */
import * as UI from '@haas/ui';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import React from 'react';

import {
  AutomationActionType,
  AutomationConditionBuilderType,
  AutomationConditionModel,
  AutomationConditionOperandModel,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  AutomationEventModel,
  AutomationType,
  ConditionPropertyAggregate,
  ConditionPropertyAggregateType,
  Dialogue,
  DialogueConditionScopeModel,
  GetAutomationQuery,
  Maybe,
  OperandType,
  QuestionConditionScopeModel,
  QuestionNode,
  QuestionNodeTypeEnum,
  useGetAutomationQuery,
  useUpdateAutomationMutation,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';

import { ConditionEntry } from 'views/AddAutomationView/CreateConditionModalCard';
import { useParams } from 'react-router';
import AutomationForm from '../AddAutomationView/AutomationForm';

type TwoDateArray = [Date, Date];

interface ConditionInput {
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

interface ActionInput {
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

type ConditionQueryResult = ({
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
    actions: input?.automationTrigger?.actions?.map((action) => ({
      action: {
        type: action.type,
        targets: action.payload?.targets || [],
      },
    })) || [],
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
      (condition) => condition.condition,
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
