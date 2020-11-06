/* eslint-disable radix */
import { Controller, UseFormMethods, useFieldArray, useWatch } from 'react-hook-form';
import { CornerRightDown, CornerRightUp, Key, Mail, Maximize2,
  Minimize2, PlusCircle, Smartphone, Thermometer, Type, UserPlus, Watch } from 'react-feather';
import { Slider } from 'antd';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components/macro';

import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup } from '@chakra-ui/core'; // Slider,
import {
  ButtonRadio, Div, Flex, Form,
  FormControl, FormLabel, FormSection, H3, H4, Hr, Input, InputGrid, InputHelper, Muted, Text,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import ServerError from 'components/ServerError';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';
import gql from 'graphql-tag';

import 'antd/dist/antd.css';
import { getCustomerTriggerData as CustomerTriggerData } from './__generated__/getCustomerTriggerData';

interface FormDataProps {
  name: string;
  dialogue: {
    label: string;
    value: string;
  };
  type: string;
  medium: string;
  question: {
    label: string;
    value: string;
  };
  conditions: Array<{ id: string, questionId: { label: string, value: string }, conditionType: { label: string, value: string }, range: Array<number>, highThreshold: number, lowThreshold: number, matchText: string }>;
  condition: string;
  matchText: string;
  lowThreshold: number;
  highThreshold: number;
  recipients: Array<{
    label: string;
    value: string;
  }>;
}
interface SelectType {
  label: string;
  value: string;
}

const conditionTypeSelect = [
  { label: 'Low threshold', value: 'LOW_THRESHOLD' },
  { label: 'High threshold', value: 'HIGH_THRESHOLD' },
  { label: 'Inner range', value: 'INNER_RANGE' },
  { label: 'Outer range', value: 'OUTER_RANGE' },
];

const TextSelect = [
  { label: 'Match text', value: 'TEXT_MATCH' },
];

enum TriggerConditionType {
  LOW_THRESHOLD='LOW_THRESHOLD',
  HIGH_THRESHOLD='HIGH_THRESHOLD',
  INNER_RANGE='INNER_RANGE',
  OUTER_RANGE='OUTER_RANGE',
  TEXT_MATCH='TEXT_MATCH',
}

enum TriggerQuestionType {
  QUESTION='QUESTION',
  SCHEDULED='SCHEDULED',
}

const OuterSliderContainer = styled(Div)`
  div.ant-slider-rail {
      position: absolute;
      width: 100%;
      height: 4px;
      background-color: #91d5ff;
      border-radius: 2px;
      -webkit-transition: background-color 0.3s;
      transition: background-color 0.3s;
  }

  div > div.ant-slider-track {
    position: absolute;
    height: 4px;
    background-color: #f5f5f5;
    border-radius: 2px;
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
  }
`;

const getCustomerTriggerData = gql`
  query getCustomerTriggerData($customerSlug: String!, $filter: DialogueFilterInputType) {
    customer(slug: $customerSlug) {
      id
      dialogues(filter: $filter) {
        id
        title
        slug
        publicTitle
        creationDate
        updatedAt
        customerId
        averageScore
        customer {
          slug
        }
        tags {
          id
          type
          name
        }
      }

      users {
        id
        firstName
        lastName
        email
        phone
        role {
          id
          name
        }
      }
    }
  }
`;

const ConditionFormFragment = (
  { activeNodeType, onChange, onBlur, value }: { activeNodeType: string, onChange: any, onBlur: any, value: any },
) => {
  if (activeNodeType === 'SLIDER') {
    return (
      <RadioButtonGroup
        defaultValue={value}
        isInline
        onChange={onChange}
        onBlur={onBlur}
        display="flex"
        flexWrap="wrap"
      >
        <ButtonRadio
          mb={2}
          icon={CornerRightUp}
          value="LOW_THRESHOLD"
          text="Low threshold"
          description="Alert under threshold"
        />
        <ButtonRadio
          mb={2}
          icon={CornerRightDown}
          value="HIGH_THRESHOLD"
          text="High threshold"
          description="Alert over threshold"
        />
        <ButtonRadio
          mb={2}
          icon={Minimize2}
          value="INNER_RANGE"
          text="Inner range"
          description="Alert within range"
        />
        <ButtonRadio
          mb={2}
          icon={Maximize2}
          value="OUTER_RANGE"
          text="Outer range"
          description="Alert out of range"
        />
      </RadioButtonGroup>
    );
  }

  return (
    <RadioButtonGroup
      defaultValue={value}
      isInline
      onBlur={onBlur}
      onChange={onChange}
      display="flex"
      flexWrap="wrap"
    >
      <ButtonRadio icon={Key} value="TEXT_MATCH" text="Match text" description="When text matches" />
    </RadioButtonGroup>
  );
};

interface TriggerFormProps {
  form: UseFormMethods<FormDataProps>;
  onFormSubmit: any;
  serverErrors: any;
  isLoading: any;
  isInEdit?: boolean;
}

const getNodeType = (question: string, questions: Array<any>) => {
  if (!question || questions?.length === 0) {
    return [];
  }

  const activeQuestionNode = questions?.find((q) => q.id === question);

  if (!activeQuestionNode) return null;

  return activeQuestionNode.type;
};

const FormConditionFragment = ({ form, condition: fieldCondition, fieldIndex, onDelete, questions, questionsSelect, activeDialogue }: any) => {
  const { t } = useTranslation();

  const watchConditionType = useWatch({
    control: form.control,
    name: `conditions[${fieldIndex}].conditionType`,
    defaultValue: fieldCondition.conditionType,
  });

  const watchConditionQuestion = useWatch({
    control: form.control,
    name: `conditions[${fieldIndex}].questionId`,
    defaultValue: fieldCondition.questionId,
  });

  const handleQuestionReset = () => {
    form.setValue(`conditions[${fieldIndex}].conditionType`, null);
    form.setValue(`conditions[${fieldIndex}].matchText`, '');
    form.setValue(`conditions[${fieldIndex}].minThreshold`, 3);
    form.setValue(`conditions[${fieldIndex}].maxThreshold`, 6);
    form.setValue(`conditions[${fieldIndex}].range`, [3, 6]);
  };

  return (
    <Div
      marginTop={15}
      gridColumn="1 / -1"
      bg="gray.100"
      padding={4}
    >
      <input type="hidden" ref={form.register()} name={`conditions[${fieldIndex}].id`} />
      {form.watch('type') === TriggerQuestionType.QUESTION && activeDialogue && (
        <FormControl mb={4}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].questionId`}>{t('trigger:question')}</FormLabel>
          <InputHelper>
            {t('trigger:question_helper')}
          </InputHelper>
          <Controller
            name={`conditions[${fieldIndex}].questionId`}
            defaultValue={fieldCondition?.questionId}
            control={form.control}
            options={questionsSelect}
            render={({ onChange, value }) => (
              <Select
                options={questionsSelect}
                value={value}
                onChange={(opt: any) => {
                  onChange(opt);
                  handleQuestionReset();
                }}
              />
            )}
          />
          <FormErrorMessage>{form.errors.conditions?.[fieldIndex]?.questionId?.value}</FormErrorMessage>
        </FormControl>
      )}

      {watchConditionQuestion && (
        <FormControl mb={4} isRequired isInvalid={!!form.errors.conditions?.[fieldIndex]?.conditionType}>
          <FormLabel htmlFor="condition">{t('trigger:condition')}</FormLabel>
          <InputHelper>
            {t('trigger:condition_helper')}
          </InputHelper>
          <Controller
            name={`conditions[${fieldIndex}].conditionType`}
            defaultValue={fieldCondition?.conditionType}
            control={form.control}
            options={conditionTypeSelect}
            render={({ onChange, value }) => (
              <Select
                value={value}
                options={getNodeType(watchConditionQuestion.value,
                          questions?.customer?.dialogue?.questions) === 'SLIDER' ? conditionTypeSelect : TextSelect}
                onChange={(opt: any) => {
                  onChange(opt);
                }}
              />
              // <ConditionFormFragment
              //   activeNodeType={
              //       getNodeType(watchConditionQuestion.value,
              //         questions?.customer?.dialogue?.questions)
              //     }
              //   value={value?.value}
              //   onChange={(e: any) => {
              //     onChange({ label: e, value: e });
              //   }}
              //   onBlur={onBlur}
              // />
            )}
          />

          <FormErrorMessage>{form.errors.conditions?.[fieldIndex]?.conditionType?.value?.message}</FormErrorMessage>
        </FormControl>
      )}

      {/* <Text>{t('trigger:select_dialogue_reminder')}</Text> */}

      {watchConditionType?.value === TriggerConditionType.TEXT_MATCH && (
        <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.matchText}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].matchText`}>{t('trigger:match_text')}</FormLabel>
          <InputHelper>
            {t('trigger:match_text_helper')}
          </InputHelper>
          <Input
            defaultValue={fieldCondition.matchText}
            // key={fieldCondition.id}
            placeholder="Satisfied"
            leftEl={<Type />}
            name={`conditions[${fieldIndex}].matchText`}
            ref={form.register({ required: true })}
          />
        </FormControl>
      )}

      {watchConditionType?.value === TriggerConditionType.LOW_THRESHOLD && (
      <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.lowThreshold}>
        <FormLabel htmlFor={`conditions[${fieldIndex}].lowThreshold`}>{t('trigger:low_threshold')}</FormLabel>
        <InputHelper>
          {t('trigger:low_threshold_helper')}
        </InputHelper>
        <Controller
          name={`conditions[${fieldIndex}].lowThreshold`}
          control={form.control}
          defaultValue={fieldCondition?.lowThreshold}
          render={({ onChange, value }) => (
            <Slider step={0.5} min={0} max={10} defaultValue={value} onAfterChange={onChange} />
          )}
        />
        <Text>
          {/* {watchCondition?.lowThreshold} */}
        </Text>

      </FormControl>
      )}

      {watchConditionType?.value === TriggerConditionType.HIGH_THRESHOLD && (
        <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.highThreshold}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].highThreshold`}>{t('trigger:high_threshold')}</FormLabel>
          <InputHelper>
            {t('trigger:high_threshold_helper')}
          </InputHelper>
          <Controller
            name={`conditions[${fieldIndex}].highThreshold`}
            control={form.control}
            defaultValue={10 - fieldCondition?.highThreshold || null}
            render={({ onChange, value }) => (
              <Slider
                step={0.5}
                min={0}
                max={10}
                tipFormatter={(value) => (value ? `${10 - value}` : 10)}
                defaultValue={value}
                reverse
                onAfterChange={(e: number) => {
                  onChange(10 - e);
                }}
              />
            )}
          />

          <Text>
            {/* {watchCondition?.highThreshold || ''} */}
          </Text>

        </FormControl>
      )}

      {watchConditionType?.value === TriggerConditionType.OUTER_RANGE && (
        <>
          <FormControl>
            <FormLabel htmlFor={`conditions[${fieldIndex}].range`}>{t('trigger:outer_range')}</FormLabel>
            <InputHelper>
              {t('trigger:outer_range_helper')}
            </InputHelper>
            <Controller
              name={`conditions[${fieldIndex}].range`}
              control={form.control}
              defaultValue={fieldCondition?.range?.length === 2 ? fieldCondition.range : [3, 6]}
              render={({ value, onChange }) => (
                <OuterSliderContainer>
                  <Slider
                    range
                    step={0.5}
                    min={0}
                    max={10}
                    defaultValue={value}
                    onAfterChange={(value) => {
                      onChange(value);
                    }}
                  />
                </OuterSliderContainer>
              )}
            />
            <Text>
              {/* {`${watchCondition?.range?.[0]} - ${watchCondition?.range?.[1]}`} */}
            </Text>

          </FormControl>
        </>
      )}

      {watchConditionType?.value === TriggerConditionType.INNER_RANGE && (
        <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.range}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].range`}>{t('trigger:inner_range')}</FormLabel>
          <InputHelper>
            {t('trigger:inner_range_helper')}
          </InputHelper>
          <Controller
            name={`conditions[${fieldIndex}].range`}
            control={form.control}
            defaultValue={fieldCondition?.range?.length === 2 ? fieldCondition.range : [3, 6]}
            render={({ onChange, value }) => (
              <Slider
                range
                defaultValue={value}
                step={0.5}
                min={0}
                max={10}
                onAfterChange={(value) => {
                  onChange(value);
                }}
              />
            )}
          />
          <Text>
            {/* {`${watchCondition?.range?.[0]} - ${watchCondition?.range?.[1]}`} */}
          </Text>

        </FormControl>
      )}

      <Button
        mt={4}
        variant="outline"
        size="sm"
        variantColor="red"
        onClick={() => onDelete(fieldIndex)}
      >
        {t('delete_trigger')}
      </Button>
      <FormControl />
    </Div>
  );
};

const TriggerForm = ({ form, onFormSubmit, isLoading, serverErrors, isInEdit = false }: TriggerFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'conditions',
    keyName: 'indexKey',
  });

  // Fetching dialogue data
  const { data: triggerData } = useQuery<CustomerTriggerData>(getCustomerTriggerData, { variables: { customerSlug } });
  const dialogues = triggerData?.customer?.dialogues?.map((dialogue) => ({
    label: dialogue?.title,
    value: dialogue?.slug,
  })) || [];

  const recipients = triggerData?.customer?.users?.map((recipient) => ({
    label: `${recipient?.lastName}, ${recipient?.firstName} - E: ${recipient?.email} - P: ${recipient?.phone}`,
    value: recipient?.id,
  }));

  // Fetching questions data
  const [fetchQuestions, { data: questionsData }] = useLazyQuery(getQuestionsQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const questionsSelect = questionsData?.customer?.dialogue?.questions.map((question: any) => ({
    label: question?.title, value: question?.id,
  })) || [];

  const activeDialogue = form.watch('dialogue');
  const databaseRecipients = form.watch('recipients');

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { customerSlug, dialogueSlug: activeDialogue.value } });
    }
  }, [customerSlug, activeDialogue, fetchQuestions]);

  // Dealing with recipients
  const [activeRecipients, setActiveRecipients] = useState<Array<null | { label: string, value: string }>>(() => databaseRecipients || []);

  const addRecipient = () => setActiveRecipients((prevRecipients) => [...prevRecipients, null]);

  const deleteRecipient = (index: number) => {
    setActiveRecipients((prevRecipients) => {
      prevRecipients.splice(index, 1);
      return [...prevRecipients];
    });
  };

  const addCondition = () => append({
    questionId: null,
    conditionType: '',
    matchText: '',
    lowThreshold: 3,
    highThreshold: 6,
    range: [
      3, 5,
    ],
  });

  const handleDeleteCondition = (index: number) => {
    remove(index);
  };

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
      <ServerError serverError={serverErrors} />

      <FormSection id="general">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('trigger:about_trigger')}</H3>
          <Muted color="gray.600">
            {t('trigger:about_trigger_helper')}
          </Muted>
        </Div>
        <Div>
          <InputGrid>
            <FormControl isRequired isInvalid={!!form.errors.name}>
              <FormLabel htmlFor="name">{t('name')}</FormLabel>
              <InputHelper>{t('trigger:name_helper')}</InputHelper>
              <Input
                placeholder={t('trigger:my_first_trigger')}
                leftEl={<Type />}
                name="name"
                ref={form.register({ required: true })}
              />
              <FormErrorMessage>{form.errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!form.errors.dialogue?.value}>
              <FormLabel htmlFor="dialogue">{t('trigger:dialogue')}</FormLabel>
              <InputHelper>{t('trigger:dialogue_helper')}</InputHelper>
              <Controller
                name="dialogue"
                options={dialogues}
                defaultValue={null}
                control={form.control}
                render={({ onChange, value }) => (
                  <Select
                    options={dialogues}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <FormErrorMessage>{form.errors.dialogue?.label}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!form.errors.type}>
              <FormLabel htmlFor="type">{t('trigger:type')}</FormLabel>
              <InputHelper>{t('trigger:type_helper')}</InputHelper>

              <Controller
                control={form.control}
                name="type"
                defaultValue="QUESTION"
                render={({ onChange, value }) => (
                  <>
                    <RadioButtonGroup
                      defaultValue={value}
                      isInline
                      onChange={(data) => {
                        onChange(data);
                      }}
                      display="flex"
                    >
                      <ButtonRadio
                        icon={Thermometer}
                        value="QUESTION"
                        text={t('question')}
                        description={t('trigger:trigger_question_alarm')}
                      />
                      <ButtonRadio
                        isDisabled
                        icon={Watch}
                        value="SCHEDULED"
                        text={t('scheduled')}
                        description={t('trigger:trigger_schedulled_alarm')}
                      />
                    </RadioButtonGroup>
                  </>
                )}
              />

              <FormErrorMessage>{form.errors.dialogue?.label}</FormErrorMessage>
            </FormControl>
          </InputGrid>
        </Div>
      </FormSection>

      <Hr />

      <FormSection id="conditions">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('trigger:conditions')}</H3>
          <Muted color="gray.600">{t('trigger:conditions_helper')}</Muted>
        </Div>
        <Div>
          <InputGrid>
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
              <H4>Conditions</H4>
              <Button
                leftIcon={PlusCircle}
                onClick={addCondition}
                isDisabled={!activeDialogue}
                size="sm"
              >
                {t('trigger:add_condition')}
              </Button>
            </Flex>
            <Hr />
            {fields?.map((condition, index) => (
              <FormConditionFragment
                key={condition?.indexKey}
                condition={condition}
                activeDialogue={activeDialogue}
                questions={questionsData}
                questionsSelect={questionsSelect}
                onDelete={handleDeleteCondition}
                fieldIndex={index}
                form={form}
              />
            ))}
          </InputGrid>

        </Div>
      </FormSection>

      <Hr />

      <FormSection id="recipients">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('trigger:recipients')}</H3>
          <Muted color="gray.600">{t('trigger:recipients_helper')}</Muted>
        </Div>
        <Div>
          <Button onClick={addRecipient} variantColor="teal" leftIcon={UserPlus}>{t('add_user')}</Button>
          {activeRecipients.map((recipient, index) => (
            <Div
              padding={4}
              bg="gray.100"
              key={index}
              mt={2}
            >
              <InputGrid>
                <FormControl isInvalid={!!form.errors.medium}>
                  <FormLabel htmlFor="medium">{t('trigger:recipient')}</FormLabel>
                  <InputHelper>{t('trigger:recipient_helper')}</InputHelper>

                  <Controller
                    control={form.control}
                    name={`recipients[${index}]`}
                    defaultValue={recipient}
                    options={recipients}
                    as={<Select />}
                  />

                  <FormErrorMessage>{form.errors.medium}</FormErrorMessage>
                </FormControl>
              </InputGrid>
              <Button
                onClick={() => deleteRecipient(index)}
                variantColor="red"
                variant="outline"
                size="sm"
              >
                Delete
              </Button>
            </Div>

          ))}
        </Div>
      </FormSection>

      <Hr />

      <FormSection id="delivery">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('trigger:delivery')}</H3>
          <Muted color="gray.600">{t('trigger:delivery_helper')}</Muted>
        </Div>
        <Div>

          <InputGrid>
            <FormControl isRequired isInvalid={!!form.errors.medium}>
              <FormLabel htmlFor="medium">{t('trigger:medium')}</FormLabel>
              <InputHelper>{t('trigger:medium_helper')}</InputHelper>

              <Controller
                control={form.control}
                name="medium"
                defaultValue="EMAIL"
                render={({ onChange, value }) => (
                  <RadioButtonGroup
                    defaultValue={value}
                    isInline
                    onChange={onChange}
                    display="flex"
                  >
                    <ButtonRadio icon={Mail} value="EMAIL" text={t('email')} description={t('trigger:alert_email')} />
                    <ButtonRadio icon={Smartphone} value="PHONE" text={t('sms')} description={t('trigger:alert_sms')} />
                    <ButtonRadio value="BOTH" text={t('both')} description={t('trigger:alert_both')} />
                  </RadioButtonGroup>
                )}
              />

              <FormErrorMessage>{form.errors.medium}</FormErrorMessage>
            </FormControl>
          </InputGrid>
        </Div>
      </FormSection>

      <ButtonGroup>
        <Button
          isLoading={isLoading}
          isDisabled={!form.formState.isValid}
          variantColor="teal"
          type="submit"
        >
          {isInEdit ? 'Save' : 'Create'}
        </Button>
        <Button variant="outline" onClick={() => history.goBack()}>Cancel</Button>
      </ButtonGroup>
    </Form>
  );
};

export default TriggerForm;
