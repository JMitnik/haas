import * as UI from '@haas/ui';
import { Bell, Clock, Type } from 'react-feather';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';

import {
  AutomationEventType, AutomationType,
  CreateAutomationInput,
  RecurringPeriodType,
  useGetUsersAndRolesQuery,
  useGetWorkspaceDialoguesQuery,
} from 'types/generated-types';
import { AutomationInput } from 'views/EditAutomationView/EditAutomationViewTypes';
import { useCustomer } from 'providers/CustomerProvider';

import { ActionEntry } from './CreateActionModalCard';
import { ConditionEntry } from './CreateConditionModalCardTypes';
import { CustomScheduleFragment } from './CustomScheduleFragment';
import { FormDataProps, schema } from './AutomationForm.types';
import { FutureScheduledDatesFragment } from './FutureScheduledDatesFragment';
import { RecipientsFragment } from './RecipientsFragment';
import { ScheduledAutomationActionFragment } from './ScheduledAutomationActionFragment';
import { TriggerAutomationFragment } from './TriggerAutomationFragment';
import { getDayOfMonth, getDayOfWeek, getMonth, mapToUserPickerEntries } from './AutomationForm.helpers';
import useCronSchedule from './useCronSchedule';

interface AutomationFormProps {
  isInEdit?: boolean;
  onCreate?: (input: CreateAutomationInput) => void;
  onUpdate?: (input: CreateAutomationInput) => void;
  isLoading?: boolean;
  automation?: AutomationInput;
  mappedConditions?: ConditionEntry[];
}

export const AutomationForm = ({
  onCreate,
  onUpdate,
  isLoading,
  automation,
  mappedConditions,
  isInEdit = false,
}: AutomationFormProps) => {
  const history = useHistory();
  const form = useForm<FormDataProps>({
    // TODO: Random introduction of typescript error see https://github.com/react-hook-form/react-hook-form/issues/6523
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      title: automation?.label,
      automationType: automation?.automationType || AutomationType.Scheduled,
      schedule: {
        type: automation?.schedule?.type,
        month: automation?.schedule?.month,
        dayOfMonth: automation?.schedule?.dayOfMonth,
        dayOfWeek: automation?.schedule?.dayOfWeek,
        hours: automation?.schedule?.hours,
        minutes: automation?.schedule?.minutes,
        activeDialogue: automation?.schedule?.activeDialogue || null,
        frequency: automation?.schedule?.frequency || null,
        time: automation?.schedule?.time || '0 8',
        dayRange: automation?.schedule?.dayRange || [],
      },
      conditionBuilder:
      {
        logical: automation?.conditionBuilder?.logical || { label: 'AND', value: 'AND' },
        conditions: automation?.conditionBuilder?.conditions || [],
        childBuilder:
        {
          logical: automation?.conditionBuilder?.childBuilder?.logical || { label: 'AND', value: 'AND' },
          conditions: automation?.conditionBuilder?.childBuilder?.conditions || [],
        },
      },
      actions: automation?.actions || [],
    },
  });
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const { data: dialoguesData } = useGetWorkspaceDialoguesQuery({
    variables: {
      customerSlug: activeCustomer?.slug as string,
    },
  });

  const { data: userRoleData } = useGetUsersAndRolesQuery({
    variables: {
      customerSlug: activeCustomer?.slug as string,
    },
  });

  const userPickerEntries = mapToUserPickerEntries(userRoleData?.customer as any);
  console.log('Users: ', userPickerEntries);

  const dialogueItems = dialoguesData?.customer?.dialogues?.map((dialogue) => ({
    id: dialogue?.id,
    value: dialogue?.slug,
    label: dialogue?.title,
    type: 'DIALOGUE',
  })) || [];

  const watchAutomationType = useWatch({
    name: 'automationType',
    control: form.control,
  });

  const watchSchedule = useWatch({
    name: 'schedule',
    control: form.control,
  });

  /**
   * Define future dates based on a parsed cron expression.
   */
  const cronners = useCronSchedule(`${watchSchedule?.time || ''} ${watchSchedule?.frequency || ''} ${watchSchedule?.frequency === '* *' ? watchSchedule?.dayRange?.map((day) => day?.label).join('-') : ''}`);

  const handleSubmit = (formData: FormDataProps) => {
    // TODO: Create a field for event type
    // TODO: Create a picker for questionId/dialogueId for event
    // TODO: Add childbuilder

    const activeActions = formData.actions.map((action) => {
      const actionEntry: ActionEntry = (action as any)?.action;
      return {
        id: actionEntry.id,
        type: actionEntry.type,
        channels: [{ id: actionEntry.channelId }],
        payload: { targets: actionEntry.targets },
      };
    });

    // TODO: In helper method
    const splittedTime = formData.schedule?.time?.split(' ');
    const minutes = splittedTime?.[0];
    const hours = splittedTime?.[1];
    const dayOfWeek = getDayOfWeek(formData.schedule?.type as RecurringPeriodType, formData);
    const dayOfMonth = getDayOfMonth(formData.schedule?.frequency);
    const month = getMonth(formData.schedule?.frequency);

    const input: CreateAutomationInput = {
      automationType: formData.automationType,
      label: formData.title,
      workspaceId: activeCustomer?.id,
      event: {
        eventType: AutomationEventType.NewInteractionQuestion, // TODO: Make this dynamic
        questionId: formData.conditionBuilder?.conditions?.[0]?.condition.activeQuestion?.value,
      },
      actions: activeActions,
      schedule: formData.automationType === AutomationType.Scheduled ? {
        type: formData?.schedule?.type as RecurringPeriodType,
        month,
        dayOfMonth,
        dayOfWeek,
        hours,
        minutes,
        id: automation?.schedule?.id,
        dialogueId: formData.schedule?.activeDialogue?.id || null,
      } : undefined,
    };

    if (!isInEdit && onCreate) {
      onCreate(input);
    }

    if (isInEdit && onUpdate) {
      onUpdate({
        id: automation?.id,
        ...input,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <UI.FormContainer>
        <UI.Form onSubmit={form.handleSubmit((formData) => handleSubmit(formData as FormDataProps))}>
          <UI.FormSection id="general">
            <UI.Div>
              <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:about')}</UI.H3>
              <UI.Muted color="gray.600">
                {t('automation:about_helper')}
              </UI.Muted>
            </UI.Div>
            <UI.Div>
              <UI.InputGrid>
                <UI.FormControl isRequired isInvalid={!!form.formState.errors.title}>
                  <UI.FormLabel htmlFor="title">{t('title')}</UI.FormLabel>
                  <UI.InputHelper>{t('automation:title_helper')}</UI.InputHelper>
                  <UI.Input
                    id="title"
                    placeholder={t('automation:title_placeholder')}
                    leftEl={<Type />}
                    {...form.register('title', { required: 'Error title' })}
                  />
                  <UI.ErrorMessage>{t(form.formState.errors.title?.message || '')}</UI.ErrorMessage>
                </UI.FormControl>

                <UI.FormControl style={{ display: 'none' }}>
                  <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                  <UI.InputHelper>{t('automation:type_helper')}</UI.InputHelper>
                  <Controller
                    control={form.control}
                    name="automationType"
                    defaultValue={AutomationType.Scheduled}
                    render={({ field }) => (
                      <UI.RadioButtons onBlur={field.onBlur} onChange={field.onChange} value={field.value}>
                        <UI.RadioButton
                          isDisabled
                          icon={Bell}
                          value={AutomationType.Trigger}
                          mr={2}
                          text={(t('automation:trigger'))}
                          description={t('automation:trigger_helper')}
                        />
                        <UI.RadioButton
                          isDisabled={!!automation?.automationType}
                          icon={Clock}
                          value={AutomationType.Scheduled}
                          mr={2}
                          text={(t('automation:recurring'))}
                          description={t('automation:recurring_helper')}
                        />
                      </UI.RadioButtons>
                    )}
                  />
                </UI.FormControl>

                {watchAutomationType === AutomationType.Scheduled && (
                  <ScheduledAutomationActionFragment dialogueItems={dialogueItems as any} />
                )}
              </UI.InputGrid>
            </UI.Div>
          </UI.FormSection>

          <UI.Hr />

          {watchAutomationType === AutomationType.Trigger && (
            <TriggerAutomationFragment conditions={mappedConditions} />
          )}

          {watchAutomationType === AutomationType.Scheduled && (
            <UI.FormSection id="scheduled">
              <UI.Div>
                <UI.H3 color="default.text" fontWeight={500} pb={2}>{t('automation:schedule')}</UI.H3>
                <UI.Muted color="gray.600">
                  {t('automation:schedule_helper')}
                </UI.Muted>
              </UI.Div>
              <UI.InputGrid>
                {watchSchedule?.type === RecurringPeriodType.Custom && (
                  <CustomScheduleFragment />
                )}
                <FutureScheduledDatesFragment futureDates={cronners} />
              </UI.InputGrid>
            </UI.FormSection>
          )}

          <RecipientsFragment recipientEntries={userPickerEntries} />

          <UI.Flex>
            <UI.Button
              isDisabled={!form.formState.isValid}
              isLoading={isLoading}
              type="submit"
              mr={2}
            >
              {isInEdit ? t('update') : t('create')}
            </UI.Button>
            <UI.Button variant="outline" onClick={() => history.goBack()}>
              {t('cancel')}
            </UI.Button>
          </UI.Flex>
        </UI.Form>
      </UI.FormContainer>
    </FormProvider>
  );
};

export default AutomationForm;
