/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import * as UI from '@haas/ui';
import * as yup from 'yup';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Clock, Copy, MessageSquare, MoreVertical, PlusCircle, RefreshCcw, Trash2, Type,
} from 'react-feather';
import { Button, ButtonGroup } from '@chakra-ui/core';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  Div, Form, FormControl, FormLabel,
  FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted,
} from '@haas/ui';
import { FetchResult, MutationFunctionOptions } from '@apollo/client';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import Select from 'react-select';

import * as Menu from 'components/Common/Menu';
import * as Modal from 'components/Common/Modal';
import * as RadioGroup from 'components/Common/RadioGroup';
import * as RadixSelect from 'components/Common/Select';
import {
  AutomationActionType,
  AutomationConditionBuilderType,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  AutomationEventType, AutomationType,
  ConditionPropertyAggregateType,
  CreateAutomationInput,
  CreateAutomationMutation,
  CreateAutomationOperandInput,
  Exact,
  Maybe,
  OperandType,
  QuestionAspectType,
  QuestionNodeTypeEnum,
  RecurringPeriodType,
  UpdateAutomationMutation,
  useGetWorkspaceDialoguesQuery,
} from 'types/generated-types';
import { AutomationInput } from 'views/EditAutomationView/EditAutomationViewTypes';
import { ConditionNodePicker } from 'components/NodePicker/ConditionNodePicker';
import { DateFormat, useDate } from 'hooks/useDate';
import { DialogueNodePicker } from 'components/NodePicker/DialogueNodePicker';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { NodeCell } from 'components/NodeCell';
import { Switch, SwitchContainer, SwitchThumb } from 'components/Common/Switch';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import Dropdown from 'components/Dropdown';

import { ActionCell } from './ActionCell';
import { ActionEntry, CreateActionModalCard } from './CreateActionModalCard';
import { ChildBuilderEntry } from './ChildBuilderEntry';
import { ConditionCell } from './ConditionCell';
import { ConditionEntry } from './CreateConditionModalCardTypes';
import { CreateConditionModalCard } from './CreateConditionModalCard';
import { CronScheduleHeader, ModalState, ModalType, OPERATORS } from './AutomationTypes';
import { CustomRecurringType } from './AutomationForm.types';
import { DayPicker } from './DayPicker';
import { TimePicker, TimePickerContent } from './TimePicker';
import useCronSchedule from './useCronSchedule';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.mixed<AutomationType>().oneOf(Object.values(AutomationType)),
  conditionBuilder: yup.object().shape({
    logical: yup.object().shape({
      label: yup.string().notRequired(),
      value: yup.string().notRequired(),
    }),
    conditions: yup.array().of(
      yup.object().required().shape(
        {
          operator: yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required(),
          }).nullable(),
          compareTo: yup.number().notRequired(),
          depth: yup.number().notRequired(),
          condition: yup.object().shape({
            scopeType: yup.mixed<AutomationConditionScopeType>().oneOf(Object.values(AutomationConditionScopeType)),
            activeDialogue: yup.object().shape({
              id: yup.string().required(),
              label: yup.string().required(),
              value: yup.string().required(),
              type: yup.string().required(),
            }).nullable(true),
            activeQuestion: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
              type: yup.string().required(),
            }).required(),
            aspect: yup.string().required(),
            aggregate: yup.mixed<ConditionPropertyAggregateType>().oneOf(Object.values(ConditionPropertyAggregateType)),
            latest: yup.number().required(),
            questionOption: yup.string().notRequired().nullable(false),
          }).required(),
        },
      ),
    ).notRequired(),
    childBuilder: yup.object().shape({
      logical: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
      conditions: yup.array().of(
        yup.object().required().shape(
          {
            operator: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
            }).nullable(),
            compareTo: yup.number().notRequired(),
            depth: yup.number().required(),
            condition: yup.object().shape({
              scopeType: yup.string().required(),
            }).required(),
          },
        ),
      ).notRequired(),
    }).nullable().notRequired(),
  }).notRequired().when('automationType', {
    is: (autoType) => autoType === AutomationType.Trigger,
    then: yup.object().shape({
      logical: yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
      conditions: yup.array().of(
        yup.object().required().shape(
          {
            operator: yup.object().shape({
              label: yup.string().required(),
              value: yup.string().required(),
            }).nullable(),
            compareTo: yup.number().notRequired(),
            depth: yup.number().notRequired(),
            condition: yup.object().shape({
              scopeType: yup.mixed<AutomationConditionScopeType>().oneOf(Object.values(AutomationConditionScopeType)),
              activeDialogue: yup.object().shape({
                id: yup.string().required(),
                label: yup.string().required(),
                value: yup.string().required(),
                type: yup.string().required(),
              }).nullable(true),
              activeQuestion: yup.object().shape({
                label: yup.string().required(),
                value: yup.string().required(),
                type: yup.string().required(),
              }).required(),
              aspect: yup.string().required(),
              aggregate: yup.mixed<ConditionPropertyAggregateType>().oneOf(Object.values(ConditionPropertyAggregateType)),
              latest: yup.number().required(),
              questionOption: yup.string().notRequired().nullable(false),
            }).required(),
          },
        ),
      ).required(),
      childBuilder: yup.object().shape({
        logical: yup.object().shape({
          label: yup.string().required(),
          value: yup.string().required(),
        }),
        conditions: yup.array().of(
          yup.object().required().shape(
            {
              operator: yup.object().shape({
                label: yup.string().required(),
                value: yup.string().required(),
              }).nullable(),
              compareTo: yup.number().notRequired(),
              depth: yup.number().required(),
              condition: yup.object().shape({
                scopeType: yup.string().required(),
              }).required(),
            },
          ),
        ).notRequired(),
      }).nullable().notRequired(),
    }).required(),
  }),
  schedule: yup.object().shape({
    activeDialogue: yup.object().shape({
      type: yup.string(),
      label: yup.string(),
      id: yup.string(),
    }).nullable(true),
    type: yup.mixed<RecurringPeriodType>().oneOf(Object.values(RecurringPeriodType)),
    minutes: yup.string(),
    hours: yup.string(),
    dayOfMonth: yup.string(),
    month: yup.string(),
    dayOfWeek: yup.string(),
    frequency: yup.string(),
    time: yup.string(),
    dayRange: yup.array().of(
      yup.object().shape({
        label: yup.string(),
        index: yup.number(),
      }),
    ),
  }).when('automationType', {
    is: (autoType) => autoType === AutomationType.Scheduled,
    then: yup.object().shape({
      type: yup.mixed<RecurringPeriodType>().oneOf(Object.values(RecurringPeriodType)).required(),
      frequency: yup.string().required(),
      time: yup.string().required(),
      dayRange: yup.array().when('frequency', {
        is: (frequencyType) => {
          console.log('Frequency type: ', frequencyType);
          return frequencyType === CustomRecurringType.DAILY;
        },
        then: yup.array().required().of(
          yup.object().required().shape({
            label: yup.string().required(),
            index: yup.number().required(),
          }),
        ),
      }).of(
        yup.object().shape({
          label: yup.string(),
          index: yup.number(),
        }),
      ),
      activeDialogue: yup.object().shape({
        type: yup.string().required(),
        label: yup.string().required(),
        id: yup.string().required(),
      }).required(),
    }).required(),
  }),
  actions: yup.array().of(
    yup.object().shape({
      action: yup.object().shape({
        type: yup.mixed<AutomationActionType>().oneOf(Object.values(AutomationActionType)),
        targets: yup.array().of(
          yup.object().shape({
            target: yup.object().shape({
              label: yup.string(),
              type: yup.string(),
              value: yup.string(),
            }),
          }),
        ),
      }).nullable(),
    }),
  ).required(),
}).required();

const SCHEDULE_TYPE_OPTIONS = [
  {
    label: 'End of the day',
    description: 'Run this every day at 18:00',
    value: RecurringPeriodType.EndOfDay,
  },
  {
    label: 'End of the week',
    description: 'Run this at the end of the week (Friday) at 18:00',
    value: RecurringPeriodType.EndOfWeek,
  },
  {
    label: 'Start of the day',
    description: 'Run this every day at 09:00',
    value: RecurringPeriodType.StartOfDay,
  },
  {
    label: 'Start of the week',
    description: 'Run this at the start of the week (Monday) at 09:00',
    value: RecurringPeriodType.StartOfWeek,
  },
  {
    label: 'Custom',
    description: 'Run this based on a custom schedule',
    value: RecurringPeriodType.Custom,
  },
];

const getDayOfWeek = (type: RecurringPeriodType, data: FormDataProps) => {
  console.log('Recurring type: ', type);
  if (type !== RecurringPeriodType.Custom) {
    console.log('Day of week without custom');
    return data.schedule?.dayOfWeek as string;
  }

  return data?.schedule?.frequency === CustomRecurringType.DAILY
    ? data?.schedule?.dayRange?.map((day) => day?.label).join('-')
    : data.schedule?.frequency.split(' ')[2];
};

const getDayOfMonth = (type: CustomRecurringType) => {
  switch (type) {
    case CustomRecurringType.DAILY:
      return '*';
    default:
      return type.split(' ')[0];
  }
};

const getMonth = (type: CustomRecurringType) => {
  switch (type) {
    case CustomRecurringType.YEARLY:
      return type.split(' ')[1];
    default:
      return '*';
  }
};

const getCronByScheduleType = (scheduleType: RecurringPeriodType) => {
  switch (scheduleType) {
    case RecurringPeriodType.EndOfDay:
      return {
        time: '0 18',
        dayRange: [{ label: 'MON', index: 1 }, { label: 'FRI', index: 4 }],
        frequency: CustomRecurringType.DAILY,
        minutes: '0',
        hours: '18',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON-FRI',
      };
    case RecurringPeriodType.EndOfWeek:
      return {
        time: '0 0',
        dayRange: [],
        frequency: CustomRecurringType.WEEKLY,
        minutes: '0',
        hours: '18',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'FRI',
      };
    case RecurringPeriodType.StartOfDay:
      return {
        time: '0 9',
        dayRange: [{ label: 'MON', index: 1 }, { label: 'FRI', index: 4 }],
        frequency: CustomRecurringType.DAILY,
        minutes: '0',
        hours: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON-FRI',
      };
    case RecurringPeriodType.StartOfWeek:
      return {
        time: '0 0',
        dayRange: [],
        frequency: CustomRecurringType.WEEKLY,
        minutes: '0',
        hours: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: 'MON',
      };
    default:
      return null;
  }
};

type FormDataProps = yup.InferType<typeof schema>;

export const ChoiceDropdown = ({ onChange, onClose, value }: any) => {
  const { t } = useTranslation();

  return (
    <UI.List maxWidth={400}>
      <UI.ListHeader>{t('choice')}</UI.ListHeader>
      <UI.CloseButton onClose={onClose} />
      <UI.ListItem hasNoSelect width="100%">
        <UI.FormControl width="100%" isRequired>
          <UI.FormLabel htmlFor="value">{t('choice')}</UI.FormLabel>
          <UI.Textarea width="100%" name="value" defaultValue={value} onChange={onChange} />
        </UI.FormControl>
      </UI.ListItem>
    </UI.List>
  );
};

const DEPTH_BACKGROUND_COLORS = [
  '#fbfcff',
  '#f5f8fa',
];

const mapConditions = (formData: FormDataProps, workspaceId?: string) => {
  const { conditions } = formData.conditionBuilder as any;
  return conditions.map(
    (condition: any) => {
      const operands: CreateAutomationOperandInput[] = [
        {
          operandType: OperandType.Int,
          numberValue: condition.compareTo,
        },
      ];

      if (condition.condition.activeQuestion.type === QuestionNodeTypeEnum.Choice
        || condition.condition.activeQuestion.type === QuestionNodeTypeEnum.VideoEmbedded) {
        operands.push({
          operandType: OperandType.String,
          textValue: condition?.condition?.questionOption,
        });
      }

      return ({
        scope: {
          type: condition?.condition?.scopeType as AutomationConditionScopeType,
          questionScope: {
            aspect: condition?.condition?.aspect as QuestionAspectType,
            aggregate: {
              type: condition?.condition?.aggregate as ConditionPropertyAggregateType,
              latest: condition?.condition?.latest,
            },
          },
        },
        operator: condition?.operator?.value as AutomationConditionOperatorType,
        questionId: condition?.condition?.activeQuestion?.value,
        dialogueId: condition.condition?.activeDialogue?.id,
        workspaceId,
        operands,
      });
    },
  );
};

interface AutomationFormProps {
  isInEdit?: boolean;
  onCreateAutomation?: (options?: MutationFunctionOptions<CreateAutomationMutation, Exact<{
    input?: Maybe<CreateAutomationInput> | undefined;
  }>> | undefined) => Promise<FetchResult<CreateAutomationMutation, Record<string, any>, Record<string, any>>>;
  isLoading?: boolean;
  onUpdateAutomation?: (options?: MutationFunctionOptions<UpdateAutomationMutation, Exact<{
    input?: Maybe<CreateAutomationInput> | undefined;
  }>> | undefined) => Promise<FetchResult<UpdateAutomationMutation, Record<string, any>, Record<string, any>>>;
  automation?: AutomationInput;
  mappedConditions?: ConditionEntry[];
}

const AutomationForm = ({
  onCreateAutomation,
  onUpdateAutomation,
  isLoading,
  automation,
  mappedConditions,
  isInEdit = false,
}: AutomationFormProps) => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState<ModalState>({ isOpen: false });
  const { openMenu, closeMenu, menuProps, activeItem } = useMenu<any>();
  const [isUTC, setIsUTC] = useState(true);
  const { format, toUTC, toZonedTime, formatUTC } = useDate();

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
        frequency: automation?.schedule?.frequency || CustomRecurringType.WEEKLY,
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

  const { data: dialoguesData, loading } = useGetWorkspaceDialoguesQuery({
    variables: {
      customerSlug: activeCustomer?.slug as string,
    },
  });

  const dialogueItems = dialoguesData?.customer?.dialogues?.map(
    (dialogue) => ({ id: dialogue.id, value: dialogue.slug, label: dialogue.title, type: 'DIALOGUE' }),
  ) || [];

  const [activeConditions, setActiveConditions] = useState<ConditionEntry[]>(
    mappedConditions || [],
  );

  const { append, remove, fields: conditionFields, update } = useFieldArray({
    name: 'conditionBuilder.conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const childBuilderFieldArray = useFieldArray({
    name: 'conditionBuilder.childBuilder.conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const actionsFieldArray = useFieldArray({
    name: 'actions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const watchLogicalBuilder = useWatch({
    name: 'conditionBuilder.logical',
    control: form.control,
  });

  const watchAutomationType = useWatch({
    name: 'automationType',
    control: form.control,
  });

  const watchSchedule = useWatch({
    name: 'schedule',
    control: form.control,
  });

  console.log('Watch schedule: ', watchSchedule);

  console.log('Errors: ', form.formState.errors);

  const cronners = useCronSchedule(`${watchSchedule?.time || ''} ${watchSchedule?.frequency || ''} ${watchSchedule?.frequency === '* *' ? watchSchedule?.dayRange?.map((day) => day.label).join('-') : ''}`);

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Create a field for event type
    // TODO: Create a picker for questionId/dialogueId for event
    // TODO: Add childbuilder

    const activeActions = formData.actions.map((action) => {
      const actionEntry: ActionEntry = (action as any)?.action;
      return {
        type: actionEntry.type,
        payload: { targets: actionEntry.targets },
      };
    });

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
      conditionBuilder: {
        id: automation?.conditionBuilder?.id,
        type: formData?.conditionBuilder?.logical?.value as AutomationConditionBuilderType,
        conditions: mapConditions(formData, activeCustomer?.id),
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
        dialogueId: formData.schedule?.activeDialogue?.id,
      } : undefined,
    };

    console.log('Input: ', input);

    if (!isInEdit && onCreateAutomation) {
      onCreateAutomation({
        variables: {
          input,
        },
      });
    }

    if (isInEdit && onUpdateAutomation) {
      onUpdateAutomation({
        variables: {
          input: {
            id: automation?.id,
            ...input,
          },
        },
      });
    }
  };

  return (
    <>
      <UI.FormContainer>
        <Form onSubmit={form.handleSubmit((formData) => onSubmit(formData as FormDataProps))}>
          <FormSection id="general">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:about')}</H3>
              <Muted color="gray.600">
                {t('automation:about_helper')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl isRequired isInvalid={!!form.formState.errors.title}>
                  <FormLabel htmlFor="title">{t('title')}</FormLabel>
                  <InputHelper>{t('automation:title_helper')}</InputHelper>
                  <Input
                    placeholder={t('automation:title_placeholder')}
                    leftEl={<Type />}
                    {...form.register('title', { required: 'Error title' })}
                  />
                  <UI.ErrorMessage>{t(form.formState.errors.title?.message || '')}</UI.ErrorMessage>
                </FormControl>

                <UI.FormControl>
                  <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                  <InputHelper>{t('automation:type_helper')}</InputHelper>
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
                  <UI.FormControl isRequired isInvalid={!!form.formState.errors.schedule?.activeDialogue}>
                    <UI.FormLabel htmlFor="activeDialogue">
                      {t('dialogue')}
                    </UI.FormLabel>
                    <UI.InputHelper>
                      {t('automation:dialogue_helper_DIALOGUE')}
                    </UI.InputHelper>
                    <UI.Div>
                      <UI.Flex>
                        {/* TODO: Make a theme out of it */}
                        <UI.Div
                          width="100%"
                          backgroundColor="#fbfcff"
                          border="1px solid #edf2f7"
                          borderRadius="10px"
                          padding={4}
                        >
                          <>
                            <UI.Grid gridTemplateColumns="2fr 1fr">
                              <UI.Helper>{t('dialogue')}</UI.Helper>
                            </UI.Grid>

                            <UI.Grid
                              pt={2}
                              pb={2}
                              pl={0}
                              pr={0}
                              borderBottom="1px solid #edf2f7"
                              gridTemplateColumns="1fr"
                            >
                              <UI.Div alignItems="center" display="flex">
                                <Controller
                                  name="schedule.activeDialogue"
                                  control={form.control}
                                  render={({ field: { value, onChange } }) => (
                                    <Dropdown
                                      isRelative
                                      renderOverlay={({ onClose: onDialoguePickerClose }) => (
                                        <DialogueNodePicker
                                          // Handle items (in this case dialogues)
                                          items={dialogueItems}
                                          onClose={onDialoguePickerClose}
                                          onChange={onChange}
                                        />
                                      )}
                                    >
                                      {({ onOpen }) => (
                                        <UI.Div
                                          width="100%"
                                          justifyContent="center"
                                          display="flex"
                                          alignItems="center"
                                        >
                                          {(value as any)?.label ? (
                                            <NodeCell onRemove={() => onChange(null)} onClick={onOpen} node={value} />
                                          ) : (
                                            <UI.Button
                                              size="sm"
                                              variant="outline"
                                              onClick={onOpen}
                                              variantColor="altGray"
                                            >
                                              <UI.Icon mr={1}>
                                                <PlusCircle />
                                              </UI.Icon>
                                              {t('add_dialogue')}
                                            </UI.Button>
                                          )}
                                        </UI.Div>
                                      )}
                                    </Dropdown>
                                  )}
                                />
                              </UI.Div>
                            </UI.Grid>
                          </>
                        </UI.Div>
                      </UI.Flex>
                    </UI.Div>
                  </UI.FormControl>

                )}

              </InputGrid>
            </Div>
          </FormSection>

          <Hr />
          {watchAutomationType === AutomationType.Trigger && (
            <FormSection id="conditions">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:conditions')}</H3>
                <Muted color="gray.600">
                  {t('automation:conditions_helper')}
                </Muted>
              </Div>
              <UI.Flex>
                <UI.Div
                  width="100%"
                  backgroundColor="#fbfcff"
                  border="1px solid #edf2f7"
                  borderRadius="10px"
                  padding={4}
                  paddingLeft={0}
                  paddingRight={0}
                >
                  {(conditionFields.length) ? (
                    <>
                      <UI.Grid m={2} gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto">

                        <UI.Helper>{t('automation:logic')}</UI.Helper>
                        <UI.Helper>{t('automation:condition')}</UI.Helper>
                        <UI.Helper>{t('automation:operator')}</UI.Helper>
                        <UI.Helper>{t('automation:compare_to')}</UI.Helper>
                      </UI.Grid>
                      {conditionFields.map((condition, index) => (
                        <UI.Grid
                          key={condition?.arrayKey}
                          ml={2}
                          mr={2}
                          p={2}
                          borderRadius="6px"
                          borderBottom="1px solid #edf2f7"
                          gridTemplateColumns="1.2fr 4fr 1.2fr 2fr auto"
                          backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                          position="relative"
                        >
                          <input defaultValue={0} type="hidden" {...form.register(`conditionBuilder.conditions.${index}.depth`)} />
                          <UI.Div>
                            {index === 1 && (
                              <Controller
                                name="conditionBuilder.logical"
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <Select
                                      options={[{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }]}
                                      value={field.value as { label: string, value: string }}
                                      onChange={field.onChange}
                                    />
                                  );
                                }}
                              />
                            )}
                            {index > 1 && (
                              <Select
                                isDisabled
                                value={watchLogicalBuilder}
                              />
                            )}
                          </UI.Div>
                          {(condition as any)?.isGrouped && (
                            <UI.Div gridColumn="2 / 7">
                              <ChildBuilderEntry
                                activeConditions={activeConditions}
                                onAddCondition={setActiveConditions}
                                form={form}
                                openMenu={openMenu}
                                append={childBuilderFieldArray.append}
                                remove={childBuilderFieldArray.remove}
                                conditionFields={childBuilderFieldArray.fields}
                              />
                            </UI.Div>

                          )}
                          {!(condition as any)?.isGrouped && (
                            <>
                              <UI.Div alignItems="center" display="flex">
                                <Controller
                                  name={`conditionBuilder.conditions.${index}.condition`}
                                  control={form.control}
                                  defaultValue={(condition as any)?.condition}
                                  render={({ field: { value, onChange } }) => (
                                    <Dropdown
                                      defaultCloseOnClickOutside={false}
                                      renderOverlay={({ onClose, setCloseClickOnOutside }) => (
                                        <ConditionNodePicker
                                          onAddCondition={setActiveConditions}
                                          items={activeConditions}
                                          onClose={onClose}
                                          onChange={(data) => onChange(data)}
                                          onModalOpen={() => setCloseClickOnOutside(false)}
                                          onModalClose={() => setCloseClickOnOutside(true)}
                                        />
                                      )}
                                    >
                                      {({ onOpen }) => (
                                        <UI.Div
                                          width="100%"
                                          justifyContent="center"
                                          display="flex"
                                          alignItems="center"
                                        >
                                          {value ? (
                                            <ConditionCell
                                              onRemove={() => {
                                                onChange(null);
                                              }}
                                              onClick={onOpen}
                                              condition={value}
                                            />
                                          ) : (
                                            <UI.Button
                                              size="sm"
                                              variant="outline"
                                              onClick={onOpen}
                                              variantColor="altGray"
                                            >
                                              <UI.Icon mr={1}>
                                                <PlusCircle />
                                              </UI.Icon>
                                              {t('automation:add_condition')}
                                            </UI.Button>
                                          )}
                                        </UI.Div>
                                      )}
                                    </Dropdown>
                                  )}
                                />
                              </UI.Div>
                              <UI.Div>
                                <Controller
                                  name={`conditionBuilder.conditions.${index}.operator`}
                                  defaultValue={undefined}
                                  control={form.control}
                                  render={({ field: { value, onChange } }) => (
                                    <Select options={OPERATORS} onChange={onChange} value={value} />
                                  )}
                                />
                              </UI.Div>
                              <FormControl isRequired>
                                <Input
                                  {...form.register(`conditionBuilder.conditions.${index}.compareTo`, { required: true })}
                                />
                              </FormControl>
                              <UI.Icon
                                color="#808b9a"
                                style={{ cursor: 'pointer' }}
                                mr={1}
                                onClick={(e) => openMenu(e, condition)}
                              >
                                <MoreVertical />
                              </UI.Icon>
                            </>
                          )}

                        </UI.Grid>
                      ))}
                      <UI.Div ml={4} mt={4}>
                        <UI.Button
                          variantColor="gray"
                          onClick={
                            () => append({
                              depth: 0,
                              compareTo: undefined,
                              operator: null,
                              condition: undefined,
                            })
                          }
                        >
                          <UI.Icon mr={1}>
                            <PlusCircle />
                          </UI.Icon>
                          {t('add_condition')}
                        </UI.Button>
                      </UI.Div>
                    </>
                  ) : (
                    <UI.IllustrationCard svg={<EmptyIll />} text={t('trigger:condition_placeholder')}>
                      <Button
                        leftIcon={PlusCircle}
                        onClick={() => setCreateModalIsOpen({ isOpen: true, modal: ModalType.CreateCondition })}
                        size="sm"
                        variant="outline"
                        variantColor="teal"
                      >
                        {t('trigger:add_condition')}
                      </Button>
                    </UI.IllustrationCard>
                  )}
                </UI.Div>
              </UI.Flex>
              <Hr />
            </FormSection>
          )}
          {watchAutomationType === AutomationType.Scheduled && (
            <UI.FormSection id="scheduled">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:schedule')}</H3>
                <Muted color="gray.600">
                  {t('automation:schedule_helper')}
                </Muted>
              </Div>
              <InputGrid>
                <UI.FormControl>
                  <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                  <InputHelper>{t('automation:type_helper')}</InputHelper>
                  <Controller
                    name="schedule.type"
                    control={form.control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <RadioGroup.Root
                        defaultValue={value}
                        onBlur={onBlur}
                        variant="spaced"
                        onValueChange={(e: any) => {
                          const data = getCronByScheduleType(e);
                          if (data) {
                            form.setValue('schedule', {
                              ...data,
                              activeDialogue: watchSchedule?.activeDialogue as any,
                              type: watchSchedule?.type as RecurringPeriodType,
                            });
                          }
                          return onChange(e);
                        }}
                      >
                        {SCHEDULE_TYPE_OPTIONS.map((option) => (
                          <RadioGroup.Item
                            isActive={value === option.value}
                            value={option.value}
                            key={option.value}
                            contentVariant="twoLine"
                            variant="boxed"
                          >
                            <RadioGroup.Label>
                              {option.label}
                            </RadioGroup.Label>
                            <RadioGroup.Subtitle>
                              {option.description}
                            </RadioGroup.Subtitle>
                          </RadioGroup.Item>
                        ))}
                      </RadioGroup.Root>
                    )}
                  />
                </UI.FormControl>
                {watchSchedule?.type === RecurringPeriodType.Custom && (
                  <UI.Grid
                    gridTemplateColumns="1fr 1fr"
                    p={2}
                    borderRadius="6px"
                    border="1px solid #edf2f7"
                    backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                  >
                    <UI.FormControl>
                      <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                      <InputHelper>{t('automation:type_helper')}</InputHelper>
                      <Controller
                        name="schedule.frequency"
                        control={form.control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <UI.Div>
                            <RadixSelect.Root
                              value={value}
                              onValueChange={onChange}
                              defaultValue={value}
                            >
                              <RadixSelect.SelectTrigger aria-label="Food">
                                <RadixSelect.SelectValue />
                                <RadixSelect.SelectIcon>
                                  <ChevronDownIcon />
                                </RadixSelect.SelectIcon>
                              </RadixSelect.SelectTrigger>
                              <RadixSelect.SelectContent>
                                <RadixSelect.SelectScrollUpButton>
                                  <ChevronUpIcon />
                                </RadixSelect.SelectScrollUpButton>
                                <RadixSelect.SelectViewport>
                                  <RadixSelect.SelectGroup>

                                    <RadixSelect.SelectItem value={CustomRecurringType.YEARLY}>
                                      <RadixSelect.SelectItemText>Every Year</RadixSelect.SelectItemText>
                                      <RadixSelect.SelectItemIndicator>
                                        <CheckIcon />
                                      </RadixSelect.SelectItemIndicator>
                                    </RadixSelect.SelectItem>

                                    <RadixSelect.SelectItem value={CustomRecurringType.MONTHLY}>
                                      <RadixSelect.SelectItemText>Every Month</RadixSelect.SelectItemText>
                                      <RadixSelect.SelectItemIndicator>
                                        <CheckIcon />
                                      </RadixSelect.SelectItemIndicator>
                                    </RadixSelect.SelectItem>

                                    <RadixSelect.SelectItem value={CustomRecurringType.WEEKLY}>
                                      <RadixSelect.SelectItemText>Every Week</RadixSelect.SelectItemText>
                                      <RadixSelect.SelectItemIndicator>
                                        <CheckIcon />
                                      </RadixSelect.SelectItemIndicator>
                                    </RadixSelect.SelectItem>

                                    <RadixSelect.SelectItem value={CustomRecurringType.DAILY}>
                                      <RadixSelect.SelectItemText>Every Day</RadixSelect.SelectItemText>
                                      <RadixSelect.SelectItemIndicator>
                                        <CheckIcon />
                                      </RadixSelect.SelectItemIndicator>
                                    </RadixSelect.SelectItem>

                                  </RadixSelect.SelectGroup>
                                </RadixSelect.SelectViewport>
                                <RadixSelect.SelectScrollDownButton>
                                  <ChevronDownIcon />
                                </RadixSelect.SelectScrollDownButton>
                              </RadixSelect.SelectContent>
                            </RadixSelect.Root>
                          </UI.Div>
                        )}
                      />
                    </UI.FormControl>
                    <UI.FormControl>
                      <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                      <InputHelper>{t('automation:type_helper')}</InputHelper>
                      <Controller
                        name="schedule.time"
                        control={form.control}
                        // defaultValue={automation?.schedule?.type as RecurringPeriodType}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TimePickerContent value={value} onChange={onChange} />
                        )}
                      />
                    </UI.FormControl>

                    {RecurringPeriodType.Custom && watchSchedule.frequency === CustomRecurringType.DAILY && (
                      <UI.FormControl>
                        <UI.FormLabel htmlFor="automationType">{t('automation:type')}</UI.FormLabel>
                        <InputHelper>{t('automation:type_helper')}</InputHelper>
                        <Controller
                          name="schedule.dayRange"
                          control={form.control}
                          render={({ field: { value, onChange } }) => (
                            <DayPicker value={value} onChange={onChange} />
                          )}
                        />
                      </UI.FormControl>
                    )}

                  </UI.Grid>

                )}
                <UI.Div
                  p={2}
                  borderRadius="6px"
                  border="1px solid #edf2f7"
                  backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                >
                  <UI.Flex justifyContent="space-between">
                    <CronScheduleHeader pb={2}>Next 5 dates this automation will be ran:</CronScheduleHeader>
                    <UI.Flex>
                      <UI.Span mr={2}>Show UTC?</UI.Span>
                      <Switch
                        isChecked={isUTC}
                        onChange={() => setIsUTC((prev) => !prev)}
                      >
                        <SwitchThumb />
                      </Switch>
                    </UI.Flex>

                  </UI.Flex>

                  {cronners?.map((entry, index) => (
                    <UI.Flex alignItems="center" pb={1}>
                      <UI.Div padding="1em" mr={1} position="relative">
                        <UI.Icon color="main.500">
                          <Clock />
                          <UI.Div position="absolute" bottom="0" right={5}>
                            {index + 1}
                          </UI.Div>
                        </UI.Icon>
                      </UI.Div>
                      <UI.Span>
                        {isUTC
                          ? formatUTC(entry, DateFormat.HumanMonthDateTime)
                          : format(entry, DateFormat.HumanMonthDateTimeUTC)}

                      </UI.Span>
                    </UI.Flex>
                  ))
                    || <UI.Span>CRON format not correct</UI.Span>}
                </UI.Div>

              </InputGrid>
            </UI.FormSection>
          )}
          <FormSection id="actions">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>{t('automation:actions')}</H3>
              <Muted color="gray.600">
                {t('automation:actions_helper')}
              </Muted>
            </Div>
            <UI.Flex>
              <UI.Div
                width="100%"
                backgroundColor="#fbfcff"
                border="1px solid #edf2f7"
                borderRadius="10px"
                padding={2}
              >
                {(actionsFieldArray.fields.length) ? (
                  <>
                    <UI.Grid m={2} ml={2} gridTemplateColumns="1fr">

                      <UI.Helper>{t('automation:action')}</UI.Helper>
                    </UI.Grid>
                    {actionsFieldArray.fields.map((action: any, index) => (
                      <UI.Grid
                        key={action?.arrayKey}
                        p={2}
                        borderRadius="6px"
                        borderBottom="1px solid #edf2f7"
                        gridTemplateColumns="1fr"
                        backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                        position="relative"
                      >
                        <UI.Div key={action?.arrayKey} alignItems="center" display="flex">
                          <Controller
                            key={action?.arrayKey}
                            name={`actions.${index}.action`}
                            control={form.control}
                            defaultValue={action?.action}
                            shouldUnregister
                            render={({ field: { value } }) => (
                              <Dropdown
                                defaultCloseOnClickOutside={false}
                              >
                                {({ onOpen }) => (
                                  <UI.Div
                                    key={action?.arrayKey}
                                    width="100%"
                                    justifyContent="center"
                                    display="flex"
                                    alignItems="center"
                                  >
                                    {value ? (
                                      <ActionCell
                                        key={action?.arrayKey}
                                        onRemove={actionsFieldArray.fields.length > 1 ? () => {
                                          actionsFieldArray.remove(index);
                                        } : undefined}
                                        action={value as any}
                                        onClick={
                                          () => setCreateModalIsOpen({
                                            isOpen: true,
                                            modal: ModalType.CreateAction,
                                            arrayKey: action?.arrayKey,
                                          })
                                        }
                                      />
                                    ) : (
                                      <UI.Button
                                        size="sm"
                                        variant="outline"
                                        onClick={onOpen}
                                        variantColor="altGray"
                                      >
                                        <UI.Icon mr={1}>
                                          <PlusCircle />
                                        </UI.Icon>
                                        {t('automation:add_condition')}
                                      </UI.Button>
                                    )}
                                  </UI.Div>
                                )}
                              </Dropdown>
                            )}
                          />
                        </UI.Div>
                      </UI.Grid>
                    ))}
                    <UI.Div ml={2} mt={4}>
                      <UI.Button
                        variantColor="gray"
                        onClick={
                          () => setCreateModalIsOpen({ isOpen: true, modal: ModalType.CreateAction })
                        }
                      >
                        <UI.Icon mr={1}>
                          <PlusCircle />
                        </UI.Icon>
                        {t('add_action')}
                      </UI.Button>
                    </UI.Div>
                  </>
                ) : (
                  <UI.IllustrationCard svg={<EmptyIll />} text={t('automation:action_placeholder')}>
                    <Button
                      leftIcon={PlusCircle}
                      onClick={() => setCreateModalIsOpen({ isOpen: true, modal: ModalType.CreateAction })}
                      size="sm"
                      variant="outline"
                      variantColor="teal"
                    >
                      {t('automation:add_action')}
                    </Button>
                  </UI.IllustrationCard>
                )}
              </UI.Div>
            </UI.Flex>
          </FormSection>

          <ButtonGroup>
            <Button
              // isDisabled={!form.formState.isValid}
              isLoading={isLoading}
              variantColor="teal"
              type="submit"
            >
              {isInEdit ? t('update') : t('create')}
            </Button>
            <Button variant="outline" onClick={() => history.goBack()}>
              {t('cancel')}
            </Button>
          </ButtonGroup>
        </Form>
      </UI.FormContainer>

      <Modal.Root
        open={createModalIsOpen.isOpen && createModalIsOpen.modal === ModalType.CreateCondition}
        onClose={() => setCreateModalIsOpen({ isOpen: false })}
      >
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen({ isOpen: false })}
          onSuccess={(condition: ConditionEntry) => {
            append({ condition: condition as any });
            setActiveConditions((oldConditions) => [...oldConditions, condition]);
          }}
        />
      </Modal.Root>

      <Modal.Root
        open={createModalIsOpen.isOpen && createModalIsOpen.modal === ModalType.CreateAction}
        onClose={() => setCreateModalIsOpen({ isOpen: false })}
      >
        <CreateActionModalCard
          onClose={() => setCreateModalIsOpen({ isOpen: false, arrayKey: undefined })}
          onCreate={(action: ActionEntry) => {
            actionsFieldArray.append({ action });
            form.trigger();
          }}
          onUpdate={(action: ActionEntry) => {
            const updateIndex = actionsFieldArray.fields.findIndex(
              (field) => field.arrayKey === createModalIsOpen.arrayKey,
            );
            actionsFieldArray.update(updateIndex, { action });
            form.trigger();
          }}
          action={() => {
            const actionEntry = createModalIsOpen?.arrayKey
              ? actionsFieldArray.fields.find((action) => action.arrayKey === createModalIsOpen.arrayKey)
              : undefined as any;

            if (!actionEntry) return undefined;

            const action = { type: actionEntry?.action?.type, targets: actionEntry?.action?.targets };
            return action;
          }}
        />
      </Modal.Root>

      <Menu.Base
        {...menuProps}
        onClose={closeMenu}
      >
        <Menu.Header>
          {t('actions')}
        </Menu.Header>

        <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled={false}
          onClick={() => {
            if (activeItem.isGrouped) {
              const conditionIndex = childBuilderFieldArray.fields.findIndex(
                (field) => field.arrayKey === activeItem.arrayKey,
              );
              if (childBuilderFieldArray.fields.length === 1) {
                const groupCondition = conditionFields.findIndex(
                  (condition) => ((condition as any)?.isGrouped) === true,
                );
                if (groupCondition !== -1) {
                  remove(groupCondition);
                }
              }
              childBuilderFieldArray.remove(conditionIndex);
            } else {
              const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);
              remove(conditionIndex);
            }
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <Trash2 color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:remove')}
          </UI.Flex>
        </Menu.Item>
        <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled={false}
          onClick={() => {
            const { arrayKey, ...activeConditionBuilder } = activeItem;
            if (activeItem.isGrouped) {
              childBuilderFieldArray.append(activeConditionBuilder);
            } else {
              append(activeConditionBuilder);
            }
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <Copy color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:duplicate')}
          </UI.Flex>
        </Menu.Item>
        {/* <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled
          onClick={() => {
            const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);

            const { arrayKey, ...activeConditionBuilder } = activeItem;
            const groupedCondition = { ...activeItem, isGrouped: true };
            childBuilderFieldArray.append(activeConditionBuilder);
            update(conditionIndex, groupedCondition);
          }}
        >
          <UI.Flex color="#4A5568">
            <UI.Icon mr={1} width={5}>
              <RefreshCcw color="#4A5568" width="18px" height="auto" />
            </UI.Icon>
            {t('automation:turn_into_group')}
          </UI.Flex>
        </Menu.Item> */}
      </Menu.Base>
    </>
  );
};

export default AutomationForm;
