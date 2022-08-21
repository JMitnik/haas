import * as UI from '@haas/ui';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import cuid from 'cuid';

import {
  CreateAutomationInput,
  GetAutomationQuery,
  useGetAutomationQuery,
  useUpdateAutomationMutation,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import { useToast } from 'hooks/useToast';

import { AutomationForm } from '../AddAutomationView/AutomationForm';
import { AutomationInput } from './EditAutomationViewTypes';
import {
  ConditionEntry,
} from '../AddAutomationView/CreateConditionModalCardTypes';
import { findUniqueConditionEntries, mapAutomation } from './EditAutomationView.helpers';

const EditAutomationView = () => {
  const { goToAutomationOverview } = useNavigator();
  const { t } = useTranslation();
  const toast = useToast();
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
    onCompleted: () => {
      toast.success({
        title: t('toast.general_success'),
        description: t('toast.general_success_helper'),
      });

      goToAutomationOverview();
    },
    onError: () => {
      toast.templates.error();
    },
  });

  const handleUpdate = (input: CreateAutomationInput) => {
    updateAutomation({ variables: { input } });
  };

  if (automationDataLoading) {
    return null;
  }

  const automation: GetAutomationQuery['automation'] = automationData?.automation;
  const mappedAutomation: AutomationInput = mapAutomation(automation);

  // TODO: Add child builder
  const conditionEntries: ConditionEntry[] = findUniqueConditionEntries(
    mappedAutomation.conditionBuilder?.conditions.map(
      (condition) => ({ ...condition.condition, label: cuid() }),
    ) as ConditionEntry[],
  );

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:edit_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.FadeIn>
          <AutomationForm
            mappedConditions={conditionEntries}
            automation={mappedAutomation}
            onUpdate={handleUpdate}
            isLoading={loading}
            isInEdit
          />
        </UI.FadeIn>
      </UI.ViewBody>
    </>
  );
};

export default EditAutomationView;
