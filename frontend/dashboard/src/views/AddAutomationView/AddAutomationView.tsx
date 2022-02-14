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
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { NodePicker } from 'components/NodePicker';
import { useMenu } from 'components/Common/Menu/useMenu';
import Dropdown from 'components/Dropdown';

import { ConditionCell } from './ConditionCell';
import { CreateConditionModalCard } from './CreateConditionModalCard';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  automationType: yup.string().required(),
  conditions: yup.array().of(
    yup.object().required().shape(
      {
        logical: yup.object().shape({
          label: yup.string().required(),
          value: yup.string().required(),
        }),
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
  ietsAnders: yup.array().of(
    yup.object().required().shape(
      {
        logical: yup.string().notRequired(),
        operator: yup.string().notRequired(),
        compareTo: yup.number().notRequired(),
      },
    ),
  ).required(),
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

// SMALLER_THAN
//   SMALLER_OR_EQUAL_THAN
//   GREATER_THAN
//   GREATER_OR_EQUAL_THAN
//   INNER_RANGE
//   OUTER_RANGE
//   IS_EQUAL
//   IS_NOT_EQUAL
//   IS_TRUE
//   IS_FALSE
//   EVERY_N_TH_TIME

const DEPTH_BACKGROUND_COLORS = [
  '#fbfcff',
  '#eceef0',
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

const AddAutomationView = () => {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      automationType: 'TRIGGER',
      conditions: [],
      ietsAnders: [],
    },
  });
  const { openMenu, closeMenu, menuProps, activeItem } = useMenu<any>();
  const { t } = useTranslation();

  const { append, remove, fields: conditionFields, update } = useFieldArray({
    name: 'conditions',
    control: form.control,
    keyName: 'arrayKey',
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('Form data; ', formData);
  };

  const watchedConditions = useWatch({
    name: 'conditions',
    control: form.control,
  });
  console.log('watch', watchedConditions);

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
                        defaultValue="TRIGGER"
                        render={({ field }) => (
                          <UI.RadioButtons onBlur={field.onBlur} onChange={field.onChange} value={field.value}>
                            <UI.RadioButton
                              icon={Bell}
                              value="TRIGGER"
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
                              value="CAMPAIGNER"
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
                  >
                    {conditionFields.length ? (
                      <>
                        <UI.Grid gridTemplateColumns="1.2fr 4fr 1.2fr 2fr">

                          <UI.Helper>{t('automation:logic')}</UI.Helper>
                          <UI.Helper>{t('automation:condition')}</UI.Helper>
                          <UI.Helper>{t('automation:operator')}</UI.Helper>
                          <UI.Helper>{t('automation:compare_to')}</UI.Helper>
                        </UI.Grid>
                        {conditionFields.map((condition, index) => (
                          <UI.Grid
                            key={condition?.arrayKey}
                            p={2}
                            pl={0}
                            borderBottom="1px solid #edf2f7"
                            gridTemplateColumns="1.2fr 4fr 1.2fr 2fr"
                            backgroundColor={DEPTH_BACKGROUND_COLORS[condition.depth]}
                            position="relative"
                          >
                            <input defaultValue={0} type="hidden" {...form.register(`conditions.${index}.depth`)} />
                            <UI.Icon
                              color="#808b9a"
                              style={{ cursor: 'pointer', position: 'absolute', right: -25, top: 20 }}
                              mr={1}
                              onClick={(e) => openMenu(e, condition)}
                            >
                              <MoreVertical />
                            </UI.Icon>
                            <UI.Div>
                              <Controller
                                defaultValue={{ label: 'AND', value: 'AND' }}
                                name={`conditions.${index}.logical`}
                                control={form.control}
                                render={({ field }) => (
                                  <Select
                                    options={[{ label: 'AND', value: 'AND' }, { label: 'OR', value: 'OR' }]}
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </UI.Div>

                            <UI.Div alignItems="center" display="flex">
                              <Controller
                                name={`conditions.${index}.condition`}
                                control={form.control}
                                defaultValue={condition.condition}
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
                                name={`conditions.${index}.operator`}
                                defaultValue={null}
                                control={form.control}
                                render={({ field: { value, onChange } }) => (
                                  <Select options={OPERATORS} onChange={onChange} value={value} />
                                )}
                              />
                            </UI.Div>
                            <FormControl isRequired>
                              <Input
                                {...form.register(`conditions.${index}.compareTo`, { required: true })}
                              />
                            </FormControl>
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
                  // isLoading={isLoading}
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
              logical: { label: 'AND', value: 'AND' },
              depth: 0,
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
            console.log('Turn into group: ', activeItem.arrayKey);
            const conditionIndex = conditionFields.findIndex((field) => field.arrayKey === activeItem.arrayKey);
            console.log('condition index: ', conditionIndex);
            const newDepth = parseInt(activeItem.depth, 10) + 1;
            console.log('new depth: ', newDepth);
            // const { arrayKey, ...activeCondition } = activeItem;
            // const updatedCondition = { activeCondition, depth: newDepth };
            update(conditionIndex, { depth: newDepth });
            // form.setValue(`conditions.${conditionIndex}.depth`, newDepth);
            // form.trigger();
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
