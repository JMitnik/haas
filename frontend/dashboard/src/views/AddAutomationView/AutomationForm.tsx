/* eslint-disable arrow-body-style */
import * as UI from '@haas/ui';
import * as yup from 'yup';
import {
  Bell,
  Clock, Copy, MessageSquare, MoreVertical, PlusCircle, RefreshCcw, Trash2, Type,
} from 'react-feather';
import { Button, ButtonGroup } from '@chakra-ui/core';
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
  UpdateAutomationMutation,
} from 'types/generated-types';
import { AutomationInput } from 'views/EditAutomationView/EditAutomationView';
import { ConditionNodePicker } from 'components/NodePicker/ConditionNodePicker';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import Dropdown from 'components/Dropdown';

import { ActionCell } from './ActionCell';
import { ActionEntry, CreateActionModalCard } from './CreateActionModalCard';
import { ChildBuilderEntry } from './ChildBuilderEntry';
import { ConditionCell } from './ConditionCell';
import { ConditionEntry, CreateConditionModalCard } from './CreateConditionModalCard';
import { OPERATORS } from './AutomationTypes';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.mixed<AutomationType>().oneOf(Object.values(AutomationType)),
  conditionBuilder: yup.object().shape({
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
  ).required(), // TODO: Change to required once front-end is ready
}).required();

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

const mapConditions = (formData: FormDataProps, workspaceId?: string) => formData.conditionBuilder?.conditions.map(
  (condition) => {
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

enum ModalType {
  CreateCondition = 'CREATE_CONDITION',
  CreateAction = 'CREATE_ACTION',
}

interface ModalState {
  isOpen: boolean;
  modal?: ModalType;
  arrayKey?: string;
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

  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: automation?.label,
      automationType: automation?.automationType || AutomationType.Trigger,
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

  console.log('Acitions field array: ', actionsFieldArray.fields);

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data; ', formData);
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
    };

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

  console.log('Watch logical: ', watchLogicalBuilder);

  return (
    <>
      <UI.FormContainer>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
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
                    defaultValue={AutomationType.Trigger}
                    render={({ field }) => (
                      <UI.RadioButtons onBlur={field.onBlur} onChange={field.onChange} value={field.value}>
                        <UI.RadioButton
                          icon={Bell}
                          value={AutomationType.Trigger}
                          mr={2}
                          text={(t('automation:trigger'))}
                          description={t('automation:trigger_helper')}
                        />
                        <UI.RadioButton
                          icon={Clock}
                          isDisabled
                          value="RECURRING"
                          mr={2}
                          text={(t('automation:recurring'))}
                          description={t('automation:recurring_helper')}
                        />
                        <UI.RadioButton
                          icon={MessageSquare}
                          isDisabled
                          value={AutomationType.Campaign}
                          mr={2}
                          text={(t('automation:campaigner'))}
                          description={t('automation:campaigner_helper')}
                        />
                      </UI.RadioButtons>
                    )}
                  />
                </UI.FormControl>

              </InputGrid>
            </Div>
          </FormSection>

          <Hr />

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
                                    value={field.value}
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
          </FormSection>

          <Hr />

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
              // paddingLeft={0}
              // paddingRight={0}
              >
                {(actionsFieldArray.fields.length) ? (
                  <>
                    <UI.Grid m={2} ml={2} gridTemplateColumns="1fr">

                      <UI.Helper>{t('automation:action')}</UI.Helper>
                    </UI.Grid>
                    {actionsFieldArray.fields.map((action: any, index) => (
                      <UI.Grid
                        key={action?.arrayKey}
                        // ml={2}
                        // mr={2}
                        p={2}
                        borderRadius="6px"
                        borderBottom="1px solid #edf2f7"
                        gridTemplateColumns="1fr"
                        backgroundColor={DEPTH_BACKGROUND_COLORS[0]}
                        position="relative"
                      >
                        <UI.Div alignItems="center" display="flex">
                          <Controller
                            key={action?.arrayKey}
                            name={`actions.${index}.action`}
                            control={form.control}
                            defaultValue={action?.action}
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
                                        onRemove={() => {
                                          actionsFieldArray.remove(index);
                                        }}
                                        action={value}
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
              isDisabled={!form.formState.isValid}
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

      <UI.Modal
        willCloseOnOutsideClick={false}
        isOpen={createModalIsOpen.isOpen && createModalIsOpen.modal === ModalType.CreateCondition}
        onClose={() => setCreateModalIsOpen({ isOpen: false })}
      >
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen({ isOpen: false })}
          onSuccess={(condition: ConditionEntry) => {
            append({ condition: condition as any });
            setActiveConditions((oldConditions) => [...oldConditions, condition]);
          }}
        />
      </UI.Modal>

      <UI.Modal
        willCloseOnOutsideClick={false}
        isOpen={createModalIsOpen.isOpen && createModalIsOpen.modal === ModalType.CreateAction}
        onClose={() => setCreateModalIsOpen({ isOpen: false })}
      >
        <CreateActionModalCard
          onClose={() => setCreateModalIsOpen({ isOpen: false, arrayKey: undefined })}
          onCreate={(action: ActionEntry) => {
            actionsFieldArray.append({ action });
          }}
          onUpdate={(action: ActionEntry) => {
            const updateIndex = actionsFieldArray.fields.findIndex(
              (field) => field.arrayKey === createModalIsOpen.arrayKey,
            );
            actionsFieldArray.update(updateIndex, { action });
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
      </UI.Modal>

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
        <Menu.Item
          style={{ padding: '6px 12px' }}
          disabled // </Menu.Base>={activeItem?.depth === 1}
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
        </Menu.Item>
      </Menu.Base>
    </>
  );
};

export default AutomationForm;
