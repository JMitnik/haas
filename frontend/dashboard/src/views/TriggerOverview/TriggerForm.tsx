/* eslint-disable radix */
import * as UI from '@haas/ui';
import { Controller, UseFormMethods, useFieldArray, useWatch } from 'react-hook-form';
import {
  CornerRightDown, CornerRightUp, Mail, Maximize2,
  Minimize2, MousePointer, PlusCircle, Smartphone, Target, Thermometer, Type, UserPlus, Watch,
} from 'react-feather';
import { ReactComponent as EmptyIll } from 'assets/images/empty.svg';
import { ReactComponent as PaperIll } from 'assets/images/paper.svg';
import { ReactComponent as SMSIll } from 'assets/images/sms.svg';
import { Slider } from 'antd';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import 'antd/dist/antd.css'; // Slider,
import { Button, ButtonGroup, FormErrorMessage, RadioGroup, Tag } from '@chakra-ui/react';
import {
  Div, Form, FormControl, FormLabel,
  FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted, RadioButton, Span,
} from '@haas/ui';
import { SelectType } from 'types/generic';
import { useTranslation } from 'react-i18next';
import ServerError from 'components/ServerError';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';

import { getCustomerTriggerData as CustomerTriggerData } from './__generated__/getCustomerTriggerData';

const SingleScore = ({ form, fieldIndex, conditionKey, defaultValue, icon }: any) => {
  const score = useWatch({
    control: form.control,
    name: `conditions[${fieldIndex}].${conditionKey}`,
    defaultValue,
  });

  return (
    <>
      {score && (
        <Span>
          <Tag colorScheme="cyan">
            <Span>
              {score}
            </Span>
          </Tag>
        </Span>
      )}
    </>
  );
};

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
  conditions: Array<{
    id: string,
    questionId: SelectType,
    conditionType: string,
    range: Array<number>,
    highThreshold: number,
    lowThreshold: number,
    matchText: string
  }>;
  condition: string;
  matchText: string;
  lowThreshold: number;
  highThreshold: number;
  recipients: Array<{
    label: string;
    value: string;
  }>;
}

const conditionTypeSelect = [
  { label: 'Low threshold', value: 'LOW_THRESHOLD' },
  { label: 'High threshold', value: 'HIGH_THRESHOLD' },
  { label: 'Inner range', value: 'INNER_RANGE' },
  { label: 'Outer range', value: 'OUTER_RANGE' },
];

enum TriggerConditionType {
  LOW_THRESHOLD = 'LOW_THRESHOLD',
  HIGH_THRESHOLD = 'HIGH_THRESHOLD',
  INNER_RANGE = 'INNER_RANGE',
  OUTER_RANGE = 'OUTER_RANGE',
  TEXT_MATCH = 'TEXT_MATCH',
}

enum TriggerQuestionType {
  QUESTION = 'QUESTION',
  SCHEDULED = 'SCHEDULED',
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

  .ant-slider:hover {
    .ant-slider-rail {
      background-color: #91d5ff;
    }

    .ant-slider-track {
      background-color: #e1e1e1;
    }
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

const FormConditionFragment = ({
  form,
  condition: fieldCondition,
  fieldIndex,
  onDelete,
  questions,
  questionsSelect,
  activeDialogue,
}: any) => {
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
    form.setValue(`conditions[${fieldIndex}].lowThreshold`, 4);
    form.setValue(`conditions[${fieldIndex}].highThreshold`, 6);
    form.setValue(`conditions[${fieldIndex}].range`, [4, 6]);
  };

  const nodeType = useMemo(() => (
    getNodeType(watchConditionQuestion?.value, questions?.customer?.dialogue?.questions)
  ), [watchConditionQuestion, questions]);

  return (
    <UI.Card
      noHover
      borderTop="3px solid"
      borderColor="primary"
      outline
      mt={2}
      gridColumn="1 / -1"
      padding={4}
    >
      <UI.Flex justifyContent="space-between" alignItems="center">
        <UI.Text color="gray.600" fontSize="1.5rem" fontWeight={700} mr="4px" mb={2}>
          {t('condition')}
          #
          {' '}
          {fieldIndex + 1}
        </UI.Text>

        <UI.Div>
          <Button
            variant="outline"
            size="sm"
            colorScheme="red"
            onClick={() => onDelete(fieldIndex)}
          >
            {t('delete')}
          </Button>
        </UI.Div>
      </UI.Flex>
      <UI.Hr />
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
            render={({ onBlur, onChange, value }) => (
              <>
                {nodeType === 'SLIDER' ? (
                  <RadioGroup
                    display="flex"
                    onBlur={onBlur}
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                    }}
                  >
                    <RadioButton
                      mr={2}
                      icon={CornerRightDown}
                      value="LOW_THRESHOLD"
                      text="Low threshold"
                      description="Alert under threshold"
                    />
                    <RadioButton
                      mr={2}
                      icon={CornerRightUp}
                      value="HIGH_THRESHOLD"
                      text="High threshold"
                      description="Alert over threshold"
                    />
                    <RadioButton
                      mr={2}
                      icon={Minimize2}
                      value="INNER_RANGE"
                      text="Inner range"
                      description="Alert within range"
                    />
                    <RadioButton
                      mb={2}
                      icon={Maximize2}
                      value="OUTER_RANGE"
                      text="Outer range"
                      description="Alert out of range"
                    />
                  </RadioGroup>
                ) : (
                  <RadioGroup
                    display="flex"
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      onBlur();
                    }}
                  >
                    <RadioButton
                      mr={2}
                      icon={Target}
                      value="TEXT_MATCH"
                      text="Match text"
                      description="Match specific text"
                    />
                  </RadioGroup>
                )}
              </>
            )}
          />

          <FormErrorMessage>{form.errors.conditions?.[fieldIndex]?.conditionType?.message}</FormErrorMessage>
        </FormControl>
      )}

      {watchConditionType === TriggerConditionType.TEXT_MATCH && (
        <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.matchText}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].matchText`}>{t('trigger:match_text')}</FormLabel>
          <InputHelper>
            {t('trigger:match_text_helper')}
          </InputHelper>
          <Input
            defaultValue={fieldCondition.matchText}
            placeholder="Satisfied"
            leftEl={<Type />}
            name={`conditions[${fieldIndex}].matchText`}
            ref={form.register({ required: true })}
          />
        </FormControl>
      )}

      {watchConditionType === TriggerConditionType.LOW_THRESHOLD && (
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
          <SingleScore
            form={form}
            fieldIndex={fieldIndex}
            conditionKey="lowThreshold"
            icon={CornerRightDown}
            defaultValue={fieldCondition?.lowThreshold}
          />

        </FormControl>
      )}

      {watchConditionType === TriggerConditionType.HIGH_THRESHOLD && (
        <FormControl isInvalid={!!form.errors.conditions?.[fieldIndex]?.highThreshold}>
          <FormLabel htmlFor={`conditions[${fieldIndex}].highThreshold`}>{t('trigger:high_threshold')}</FormLabel>
          <InputHelper>
            {t('trigger:high_threshold_helper')}
          </InputHelper>
          <Controller
            name={`conditions[${fieldIndex}].highThreshold`}
            control={form.control}
            defaultValue={10 - fieldCondition?.highThreshold}
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

          <SingleScore
            form={form}
            fieldIndex={fieldIndex}
            conditionKey="highThreshold"
            icon={CornerRightUp}
            defaultValue={fieldCondition?.highThreshold}
          />

        </FormControl>
      )}

      {watchConditionType === TriggerConditionType.OUTER_RANGE && (
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

          </FormControl>
        </>
      )}

      {watchConditionType === TriggerConditionType.INNER_RANGE && (
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

        </FormControl>
      )}
      <FormControl />
    </UI.Card>
  );
};

const TriggerForm = ({ form, onFormSubmit, isLoading, serverErrors, isInEdit = false }: TriggerFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const questionSelectRef = useRef<any>();
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
  const [activeRecipients, setActiveRecipients] = useState<Array<null | SelectType>>(() => databaseRecipients || []);

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
                    ref={questionSelectRef}
                    options={dialogues}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <FormErrorMessage>{form.errors.dialogue?.label?.message}</FormErrorMessage>
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
                    <RadioGroup
                      defaultValue={value}
                      isInline
                      onChange={(data) => {
                        onChange(data);
                      }}
                      display="flex"
                    >
                      <RadioButton
                        icon={Thermometer}
                        value="QUESTION"
                        text={t('question')}
                        description={t('trigger:trigger_question_alarm')}
                      />
                      <RadioButton
                        isDisabled
                        icon={Watch}
                        value="SCHEDULED"
                        text={t('scheduled')}
                        description={t('trigger:trigger_schedulled_alarm')}
                      />
                    </RadioGroup>
                  </>
                )}
              />

              <FormErrorMessage>{form.errors.dialogue?.label?.message}</FormErrorMessage>
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

            {!activeDialogue ? (
              <UI.IllustrationCard svg={<PaperIll />} text={t('trigger:select_dialogue_placeholder')}>
                <Button
                  leftIcon={MousePointer}
                  onClick={() => questionSelectRef.current.focus()}
                  size="sm"
                  variant="outline"
                  colorScheme="teal"
                >
                  {t('trigger:select_a_dialogue')}
                </Button>
              </UI.IllustrationCard>
            ) : (
              <>
                {fields.length === 0 ? (
                  <UI.IllustrationCard svg={<EmptyIll />} text={t('trigger:condition_placeholder')}>
                    <Button
                      leftIcon={PlusCircle}
                      onClick={addCondition}
                      isDisabled={!activeDialogue}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                    >
                      {t('trigger:add_condition')}
                    </Button>
                  </UI.IllustrationCard>
                ) : (
                  <UI.Div>
                    <Button
                      leftIcon={PlusCircle}
                      onClick={addCondition}
                      isDisabled={!activeDialogue}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                    >
                      {t('trigger:add_condition')}
                    </Button>
                  </UI.Div>
                )}
              </>
            )}

          </InputGrid>

        </Div>
      </FormSection>

      <Hr />

      <FormSection id="recipients">
        <Div>
          <H3 color="default.text" fontWeight={500} pb={2}>{t('trigger:recipients')}</H3>
          <Muted color="gray.600">{t('trigger:recipients_helper')}</Muted>
        </Div>
        <UI.InputGrid>
          {activeRecipients.map((recipient, index) => (
            <UI.Card
              noHover
              outline
              borderTop="3px solid"
              borderColor="tertiary"
              key={index}
              mt={2}
              padding={4}
            >
              <UI.Flex justifyContent="space-between" alignItems="center">
                <UI.Text color="gray.600" fontSize="1.5rem" fontWeight={700} mr="4px" mb={2}>
                  {t('recipient')}
                  #
                  {' '}
                  {index + 1}
                </UI.Text>

                <Button
                  onClick={() => deleteRecipient(index)}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                >
                  {t('delete')}
                </Button>
              </UI.Flex>

              <UI.Hr />
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

                  <FormErrorMessage>{form.errors.medium?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>
            </UI.Card>
          ))}

          {activeRecipients.length === 0 ? (
            <UI.IllustrationCard svg={<SMSIll />} text={t('trigger:sms_placeholder')}>
              <Button
                onClick={addRecipient}
                size="sm"
                variant="outline"
                colorScheme="teal"
                leftIcon={UserPlus}
              >
                {t('add_recipient')}
              </Button>
            </UI.IllustrationCard>
          ) : (
            <Div>
              <Button
                onClick={addRecipient}
                size="sm"
                variant="outline"
                colorScheme="teal"
                leftIcon={UserPlus}
              >
                {t('add_recipient')}
              </Button>
            </Div>
          )}
        </UI.InputGrid>
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
                render={({ onChange, value }) => (
                  <RadioGroup
                    defaultValue={value}
                    isInline
                    onChange={onChange}
                    display="flex"
                  >
                    <RadioButton icon={Mail} value="EMAIL" text={t('email')} description={t('trigger:alert_email')} />
                    <RadioButton icon={Smartphone} value="PHONE" text={t('sms')} description={t('trigger:alert_sms')} />
                    <RadioButton value="BOTH" text={t('both')} description={t('trigger:alert_both')} />
                  </RadioGroup>
                )}
              />

              <FormErrorMessage>{form.errors.medium?.message}</FormErrorMessage>
            </FormControl>
          </InputGrid>
        </Div>
      </FormSection>

      <ButtonGroup>
        <Button
          isLoading={isLoading}
          isDisabled={!form.formState.isValid}
          colorScheme="teal"
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
