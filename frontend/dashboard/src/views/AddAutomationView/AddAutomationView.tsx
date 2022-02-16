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
import { motion } from 'framer-motion';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import Select from 'react-select';

import * as Menu from 'components/Common/Menu';
import {
  AutomationActionType,
  AutomationConditionBuilderType,
  AutomationConditionOperandModel,
  AutomationConditionOperatorType,
  AutomationConditionScopeType,
  AutomationEventType, AutomationType,
  ConditionPropertyAggregateType,
  CreateAutomationInput,
  CreateAutomationOperandInput,
  OperandType,
  QuestionAspectType,
  QuestionNodeTypeEnum,
  useCreateAutomationMutation,
} from 'types/generated-types';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { NodePicker } from 'components/NodePicker';
import { useCustomer } from 'providers/CustomerProvider';
import { useMenu } from 'components/Common/Menu/useMenu';
import Dropdown from 'components/Dropdown';

import { useNavigator } from 'hooks/useNavigator';
import { ConditionCell } from './ConditionCell';
import { CreateConditionModalCard } from './CreateConditionModalCard';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.mixed<AutomationType>().oneOf(Object.values(AutomationType)),
  conditionBuilder: yup.object().shape({
    logical: yup.object().shape({
      label: yup.string().required(),
      value: yup.string().required(),
    }).nullable(),
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
            activeDialogue: yup.object().shape({
              id: yup.string().required(),
              label: yup.string().notRequired().nullable(),
              value: yup.string().notRequired().nullable(),
              type: yup.string().notRequired().nullable(),
            }).required(),
            activeQuestion: yup.object().shape({
              label: yup.string().notRequired().nullable(),
              value: yup.string().notRequired().nullable(),
              type: yup.string().notRequired().nullable(),
            }).required(),
            aspect: yup.string().required(),
            aggregate: yup.mixed<ConditionPropertyAggregateType>().oneOf(Object.values(ConditionPropertyAggregateType)),
            latest: yup.number().required(),
            questionOption: yup.string().notRequired(),
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
      ).required(),
    }).nullable(),
  }),
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

const OPERATORS = [
  {
    label: '<',
    value: 'SMALLER_THAN',
  },
  {
    label: '<=',
    value: 'SMALLER_OR_EQUAL_THAN',
  },
  {
    label: '>',
    value: 'GREATER_THAN',
  },
  {
    label: '>=',
    value: 'GREATER_OR_EQUAL_THAN',
  },
  {
    value: 'IS_EQUAL',
    label: '==',
  },
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

const AddAutomationView = () => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const { goToAutomationOverview } = useNavigator();
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      automationType: AutomationType.Trigger,
      conditionBuilder: {
        logical: { label: 'AND', value: 'AND' },
        childBuilder: null,
        conditions: [],
      },
    },
  });
  const { openMenu, closeMenu, menuProps, activeItem } = useMenu<any>();
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();

  const [createAutomation, { loading }] = useCreateAutomationMutation({
    onCompleted: (data) => {
      console.log('return data create automation mutation: ', data?.createAutomation?.label);
      goToAutomationOverview();
      // TODO: Go back to automations overview
    },
    onError: (e) => {
      console.log('Something went wrong: ', e.message);
    },
  });

  const { append, remove, fields: conditionFields, update } = useFieldArray({
    name: 'conditionBuilder.conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data; ', formData);
    // TODO: Create a field for event type
    // TODO: Create a picker for questionId/dialogueId for event
    // TODO: Add childbuilder

    const input: CreateAutomationInput = {
      automationType: formData.automationType,
      label: formData.title,
      workspaceId: activeCustomer?.id,
      event: {
        eventType: AutomationEventType.NewInteractionQuestion, // TODO: Make this dynamic
        questionId: formData.conditionBuilder?.conditions?.[0]?.condition.activeQuestion?.value,
      },
      conditionBuilder: {
        type: formData?.conditionBuilder?.logical?.value as AutomationConditionBuilderType,
        conditions: mapConditions(formData, activeCustomer?.id),
      },
      actions: [
        {
          type: AutomationActionType.GenerateReport,
        },
      ],
    };

    console.log('Input data: ', input);

    // createAutomation({
    //   variables: {
    //     input,
    //   },
    // });
  };

  const watchedConditionBuilder = useWatch({
    name: 'conditionBuilder',
    control: form.control,
  });
  console.log('watch', watchedConditionBuilder);
  console.log('Condition dields: ', conditionFields);

  return (
    <>
      <UI.ViewHead>
        <UI.ViewTitle>{t('views:add_automation_view')}</UI.ViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
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
                    {conditionFields.length ? (
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
                              {index !== 0 && (
                                <Controller
                                  name="conditionBuilder.logical"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Select
                                      options={[{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }]}
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              )}

                            </UI.Div>

                            <UI.Div alignItems="center" display="flex">
                              <Controller
                                name={`conditionBuilder.conditions.${index}.condition`}
                                control={form.control}
                                defaultValue={(condition as any)?.condition}
                                render={({ field: { value, onChange } }) => (
                                  <Dropdown
                                    defaultCloseOnClickOutside={false}
                                    renderOverlay={({ onClose, setCloseClickOnOutside }) => (
                                      <NodePicker
                                        items={[]}
                                        onClose={onClose}
                                        onChange={(data) => onChange(data)}
                                        onModalOpen={() => setCloseClickOnOutside(false)}
                                        onModalClose={() => setCloseClickOnOutside(true)}
                                        questionId={index}
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
                                            onRemove={() => remove(index)}
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
                          </UI.Grid>
                        ))}
                        <UI.Div mt={4}>
                          <UI.Button
                            variantColor="gray"
                            onClick={
                              () => append({ logical: { label: 'AND', value: 'AND' }, depth: 0 })
                            }
                          >
                            <UI.Icon mr={1}>
                              <PlusCircle />
                            </UI.Icon>
                            {t('add_choice')}
                          </UI.Button>
                        </UI.Div>
                      </>
                    ) : (
                      <UI.IllustrationCard svg={<EmptyIll />} text={t('trigger:condition_placeholder')}>
                        <Button
                          leftIcon={PlusCircle}
                          onClick={() => setCreateModalIsOpen(true)}
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

              <ButtonGroup>
                <Button
                  isDisabled={!form.formState.isValid}
                  isLoading={loading}
                  variantColor="teal"
                  type="submit"
                >
                  {t('create')}
                </Button>
                <Button variant="outline" onClick={() => history.push('/')}>
                  {t('cancel')}
                </Button>
              </ButtonGroup>
            </Form>
          </UI.FormContainer>
        </motion.div>
      </UI.ViewBody>

      <UI.Modal willCloseOnOutsideClick={false} isOpen={createModalIsOpen} onClose={() => setCreateModalIsOpen(false)}>
        <CreateConditionModalCard
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(condition: any) => {
            append({
              condition,
            });
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
            const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);
            remove(conditionIndex);
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
            console.log('Duplicate active item: ', activeItem.arrayKey);
            const { arrayKey, ...activeConditionBuilder } = activeItem;
            console.log('ACTIVEEEE: ', activeConditionBuilder);
            append(activeConditionBuilder);
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
          disabled={activeItem?.depth === 1}
          onClick={() => {
            const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);
            const newDepth = parseInt(activeItem.depth, 10) + 1;
            update(conditionIndex, { depth: newDepth });
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

export default AddAutomationView;
