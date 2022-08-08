import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import React from 'react';

import {
  CreateAutomationInput,
  useCreateAutomationMutation,
} from 'types/generated-types';
import { useNavigator } from 'hooks/useNavigator';
import { useToast } from 'hooks/useToast';

import { AutomationForm } from './AutomationForm';

const AddAutomationView = () => {
  const { goToAutomationOverview } = useNavigator();
  const { t } = useTranslation();

  const toast = useToast();

  const [createAutomation, { loading }] = useCreateAutomationMutation({
    onCompleted: () => {
      toast.success({
        title: t('toast.general_success'),
        description: t('toast.general_successgeneral_success_helper'),
      });
      goToAutomationOverview();
    },
    onError: () => {
      toast.templates.error();
    },
  });

  const handleCreate = (input: CreateAutomationInput) => {
    createAutomation({ variables: { input } });
  };

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:add_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <UI.FadeIn>
          <AutomationForm onCreate={handleCreate} isLoading={loading} />
        </UI.FadeIn>
      </UI.ViewBody>
    </>
  );
};

export default AddAutomationView;
