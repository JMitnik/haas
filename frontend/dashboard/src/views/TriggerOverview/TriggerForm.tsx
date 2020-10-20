/* eslint-disable radix */
import { Controller } from 'react-hook-form';
import { CornerRightDown, CornerRightUp, Key, Mail, Maximize2,
  Minimize2, PlusCircle, Smartphone, Thermometer, Type, UserPlus, Watch } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup,
  Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/core';
import {
  ButtonRadio, Div, Flex, Form,
  FormControl, FormLabel, FormSection, H3, H4, Hr, Input, InputGrid, InputHelper, Muted, Text,
} from '@haas/ui';
import { useTranslation } from 'react-i18next';
import ServerError from 'components/ServerError';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';
import gql from 'graphql-tag';

import { getCustomerTriggerData as CustomerTriggerData } from './__generated__/getCustomerTriggerData';
import { debounce } from 'lodash';

interface SelectType {
  label: string;
  value: string;
}

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
          isDisabled
          value="INNER_RANGE"
          text="High threshold"
          description="Alert within range (coming soon)"
        />
        <ButtonRadio
          mb={2}
          icon={Maximize2}
          isDisabled
          value="OUTER_RANGE"
          text="High threshold"
          description="Alert out of range (coming soon)"
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
  form: any;
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

const TriggerForm = ({ form, onFormSubmit, isLoading, serverErrors, isInEdit = false }: TriggerFormProps) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const [activeConditions, setActiveConditions] = useState<Array<any>>([]); // {questionId: null, conditionType: null, matchText: null, lowThreshold: null, highThreshold: null, }

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

  const questions = questionsData?.customer?.dialogue?.questions.map((question: any) => ({
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

  const addCondition = () => setActiveConditions((prevConditions) => [...prevConditions, {
    questionId: null, conditionType: null, matchText: null, lowThreshold: null, highThreshold: null,
  }]);

  const handleDeleteCondition = (index: number) => setActiveConditions((prevConditions) => {
    prevConditions.splice(index, 1);
    return [...prevConditions];
  });

  const handleConditionQuestionChange = (questionId: string, index: number) => setActiveConditions((prevConditions) => {
    prevConditions[index].questionId = questionId;

    return [...prevConditions];
  });

  const handleConditionTypeChange = (conditionType: string, index: number) => setActiveConditions((prevConditions) => {
    prevConditions[index].conditionType = conditionType;
    return [...prevConditions];
  });

  const handleConditionMatchTextChange = useCallback(debounce((matchText: string, index: number) => setActiveConditions((prevConditions) => {
    prevConditions[index].matchText = matchText;
    return [...prevConditions];
  }), 250), []);

  // console.log('form values: ', form.getValues());
  // const useConditions = form.watch('conditions');
  console.log('use conditions: ', activeConditions);

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

            <FormControl isRequired isInvalid={!!form.errors.dialogue?.value?.message}>
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
              <FormErrorMessage>{form.errors.dialogue?.label?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!form.errors.type?.message}>
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
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
              <H4>Conditions</H4>
              <Button leftIcon={PlusCircle} onClick={addCondition} isDisabled={!activeDialogue} size="sm">{t('trigger:add_condition')}</Button>
            </Flex>
            <Hr />
            {activeConditions?.map((condition, index) => (
              <Div
                marginTop={15}
                gridColumn="1 / -1"
                bg="gray.100"
                padding={4}
              >
                {form.watch('type') === TriggerQuestionType.QUESTION && activeDialogue && (
                <FormControl isRequired isInvalid={!!form.errors.question}>
                  <FormLabel htmlFor={`conditions[${index}].question`}>{t('trigger:question')}</FormLabel>
                  <InputHelper>
                    {t('trigger:question_helper')}
                  </InputHelper>
                  <Controller
                    name={`conditions[${index}].question`}
                    defaultValue={condition.questionId}
                    control={form.control}
                    render={({ onChange }) => (
                      <Select
                        options={questions}
                        onChange={(e: any) => {
                          handleConditionQuestionChange(e.value, index);
                          onChange(e.value);
                        }}
                      />
                    )}
                  />

                  <FormErrorMessage>{form.errors.question?.value?.message}</FormErrorMessage>
                </FormControl>
                )}
                {condition?.questionId ? (
                  <FormControl isRequired isInvalid={!!form.errors.condition}>
                    <FormLabel htmlFor="condition">{t('trigger:condition')}</FormLabel>
                    <InputHelper>
                      {t('trigger:condition_helper')}
                    </InputHelper>
                    <Controller
                      name="condition"
                      defaultValue={null}
                      control={form.control}
                      render={({ onChange, onBlur, value }) => (
                        <ConditionFormFragment
                          activeNodeType={getNodeType(
                            condition?.questionId, questionsData?.customer?.dialogue?.questions,
                          )}
                          value={value}
                          onChange={(e: any) => {
                            handleConditionTypeChange(e, index);
                            onChange(e);
                          }}
                          onBlur={onBlur}
                        />
                      )}
                    />

                    <FormErrorMessage>{form.errors.condition?.message}</FormErrorMessage>
                  </FormControl>
                ) : (
                  <Text>{t('trigger:select_dialogue_reminder')}</Text>
                )}

                {condition?.conditionType === TriggerConditionType.TEXT_MATCH && (
                <FormControl isInvalid={!!form.errors.matchText}>
                  <FormLabel htmlFor={`conditions[${index}].matchText`}>{t('trigger:match_text')}</FormLabel>
                  <InputHelper>
                    {t('trigger:match_text_helper')}
                  </InputHelper>
                  <Input
                    placeholder="Satisfied"
                    leftEl={<Type />}
                    name={`conditions[${index}].matchText`}
                    onChange={(e: any) => handleConditionMatchTextChange(e.target.value, index)}
                    ref={form.register({ required: true })}
                  />

                </FormControl>
                )}

                {condition?.conditionType === TriggerConditionType.LOW_THRESHOLD && (
                <FormControl isInvalid={!!form.errors.lowThreshold}>
                  <FormLabel htmlFor="lowThreshold">{t('trigger:low_threshold')}</FormLabel>
                  <InputHelper>
                    {t('trigger:low_threshold_helper')}
                  </InputHelper>
                  <Controller
                    name="lowThreshold"
                    control={form.control}
                    defaultValue={0}
                    render={({ onChange, onBlur, value }) => (
                      <Slider
                        color="cyan"
                        onChange={onChange}
                        onBlur={onBlur}
                        defaultValue={value}
                        max={10}
                        min={0.1}
                        step={0.5}
                      >
                        <SliderTrack />
                        <SliderFilledTrack />
                        <SliderThumb />
                      </Slider>
                    )}
                  />
                  <Text>
                    {form.watch('lowThreshold')}
                  </Text>

                </FormControl>
                )}

                {condition?.conditionType === TriggerConditionType.HIGH_THRESHOLD && (
                <FormControl isInvalid={!!form.errors.highThreshold}>
                  <FormLabel htmlFor="highThreshold">{t('trigger:high_threshold')}</FormLabel>
                  <InputHelper>
                    {t('trigger:high_threshold_helper')}
                  </InputHelper>
                  <Controller
                    name="highThreshold"
                    control={form.control}
                    defaultValue={70}
                    render={({ onChange, onBlur, value }) => (
                      <Slider
                        color="red"
                        defaultValue={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        max={10}
                        min={0.1}
                        step={0.5}
                      >
                        <SliderTrack />
                        <SliderFilledTrack />
                        <SliderThumb />
                      </Slider>
                    )}
                  />
                  <Text>
                    {form.watch('highThreshold')}
                  </Text>

                </FormControl>
                )}
                <Button
                  mt={4}
                  variant="outline"
                  size="sm"
                  variantColor="red"
                  onClick={() => handleDeleteCondition(index)}
                >
                  {t('cta:delete_link')}
                </Button>
                <FormControl />
              </Div>

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
                <FormControl isInvalid={!!form.errors.medium?.message}>
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
            <FormControl isRequired isInvalid={!!form.errors.medium?.message}>
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

              <FormErrorMessage>{form.errors.medium?.message}</FormErrorMessage>
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
          {isInEdit ? 'Edit' : 'Create'}
        </Button>
        <Button variant="outline" onClick={() => history.goBack()}>Cancel</Button>
      </ButtonGroup>
    </Form>
  );
};

export default TriggerForm;
