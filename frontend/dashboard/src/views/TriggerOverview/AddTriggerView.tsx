/* eslint-disable radix */
import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { CornerRightDown, CornerRightUp, Key, Mail, Maximize2, Minimize2, Minus, MinusCircle, Plus, PlusCircle, Smartphone, Thermometer, Type, UserPlus, Watch, X } from 'react-feather';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, useToast } from '@chakra-ui/core';
import {
  ButtonRadio, Container, DeleteButtonContainer, Div, ErrorStyle, Flex, Form, FormContainer, FormControl,
  FormLabel, FormSection, Grid, H2, H3, H4, Hr, Input, InputGrid, InputHelper, Label, Muted, PageTitle, StyledInput, Text, Textarea,
} from '@haas/ui';
import { motion } from 'framer-motion';
import { register } from 'serviceWorker';
import { setTags } from '@sentry/react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import ServerError from 'components/ServerError';
import createTriggerMutation from 'mutations/createTrigger';
import errors from 'config/errors';
import getDialoguesQuery from 'queries/getDialoguesOfCustomer';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';
import getRecipientsQuery from 'queries/getUsers';

interface SelectType {
  label: string;
  value: string;
}

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
  condition: string;
  matchText: string;
  lowThreshold: number;
  highThreshold: number;
  recipients: Array<{
    label: string;
    value: string;
  }>;
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

interface TriggerCondition {
  type: { label: string, value: TriggerConditionType } | null,
  minValue?: number,
  maxValue?: number,
  textValue?: string
}

const ConditionFormFragment = (
  { activeNodeType, onChange, onBlur }: { activeNodeType: string, onChange: any, onBlur: any },
) => {
  if (activeNodeType === 'SLIDER') {
    return (
      <RadioButtonGroup
        defaultValue=""
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
      defaultValue=""
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

const schema = yup.object().shape({
  name: yup.string().required(),
  dialogue: yup.string().required(),
  type: yup.string().required(),
  medium: yup.string().required(),
  question: yup.object().shape({
    value: yup.string().when(['type'], {
      is: (type: string) => type === TriggerQuestionType.QUESTION,
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
  }),
  condition: yup.string().required(),
  lowThreshold: yup.string().notRequired().when(['condition'], {
    is: (condition: string) => condition === TriggerConditionType.LOW_THRESHOLD
    || condition === TriggerConditionType.INNER_RANGE
    || condition === TriggerConditionType.OUTER_RANGE,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  highThreshold: yup.string().when(['condition'], {
    is: (condition: string) => condition === TriggerConditionType.HIGH_THRESHOLD
    || condition === TriggerConditionType.INNER_RANGE
    || condition === TriggerConditionType.OUTER_RANGE,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  matchText: yup.string().when(['condition'], {
    is: (parentQuestionType: string) => parentQuestionType === TriggerConditionType.TEXT_MATCH,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  recipients: yup.array().min(1).of(yup.object().shape({
    value: yup.string().required(),
  })),
});

const AddTriggerView = () => {
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const toast = useToast();

  const { t } = useTranslation();

  const { customerSlug } = useParams();

  // TODO: Make it one query
  const { data: dialogueData } = useQuery(getDialoguesQuery, { variables: { customerSlug } });
  const { data: recipientsData } = useQuery(getRecipientsQuery, { variables: { customerSlug } });

  const [fetchQuestions, { data: questionsData }] = useLazyQuery(getQuestionsQuery, {
    fetchPolicy: 'cache-and-network',
  });

  // const [activeType, setActiveType] = useState<null | { label: string, value: string }>(null);
  // const [activeMedium, setActiveMedium] = useState<null | { label: string, value: string }>(null);
  // const [activeDialogue, setActiveDialogue] = useState<null | { label: string, value: string }>(null);
  // const [activeQuestion, setActiveQuestion] = useState<null | { label: string, value: string }>(null);
  const [activeRecipients, setActiveRecipients] = useState<Array<null | { label: string, value: string }>>([]);
  // const [activeConditions, setActiveConditions] = useState<Array<TriggerCondition>>([]);

  const activeDialogue2 = form.watch('dialogue');

  useEffect(() => {
    if (activeDialogue2) {
      fetchQuestions({ variables: { customerSlug, dialogueSlug: form.watch('dialogue').value } });
    }
  }, [customerSlug, activeDialogue2, fetchQuestions]);

  const [addTrigger, { loading: isLoading, error: serverError }] = useMutation(createTriggerMutation, {
    onCompleted: () => {
      toast({
        title: 'Created trigger!',
        description: 'Trigger has been created and assigned.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/triggers/`);
      }, 1000);
    },

  });

  const onSubmit = (formData: FormDataProps) => {
    console.log(formData);
    const questionId = formData.question.value;
    const recipients = { ids: formData.recipients?.map((recip) => recip.value).filter((val) => val) };

    const trigger = {
      name: formData.name,
      type: formData?.type,
      medium: formData?.medium,
      conditions: [{
        type: formData.condition,
        minValue: formData.lowThreshold * 10,
        maxValue: formData.highThreshold * 10,
        textValue: formData.matchText,
      }],
    };

    console.log(recipients);

    addTrigger({
      variables: {
        customerSlug,
        questionId,
        trigger,
        recipients,
      },
    });
  };

  // const handleDialogueChange = (qOption: any) => {
  //   form.setValue('dialogue', qOption?.value);
  //   setActiveDialogue(qOption);
  // };

  // const handleTypeChange = (qOption: any) => {
  //   form.setValue('type', qOption?.value);
  //   setActiveType(qOption);
  // };

  // const handleMediumChange = (qOption: any) => {
  //   form.setValue('medium', qOption?.value);
  //   setActiveMedium(qOption);
  // };

  // const handleQuestionChange = (qOption: any) => {
  //   form.setValue('question', qOption?.value);
  //   setActiveQuestion(qOption);
  // };

  // const setRecipients = (qOption: { label: string, value: string }, index: number) => {
  //   form.setValue(`recipients[${index}]`, qOption?.value);
  //   setActiveRecipients((prevRecipients) => {
  //     prevRecipients[index] = qOption;
  //     return [...prevRecipients];
  //   });
  // };

  const addRecipient = () => {
    setActiveRecipients((prevRecipients) => [...prevRecipients, null]);
  };

  const deleteRecipient = (index: number) => {
    setActiveRecipients((prevRecipients) => {
      prevRecipients.splice(index, 1);
      return [...prevRecipients];
    });
  };

  // const setConditionsType = (qOption: any, index: number) => {
  //   form.setValue('condition', qOption.value);
  //   setActiveConditions((prevConditions) => {
  //     prevConditions[index].type = qOption;
  //     return [...prevConditions];
  //   });
  // };

  // const setMatchText = useCallback(debounce((value: string, index: number) => {
  //   setActiveConditions((prevConditions) => {
  //     prevConditions[index].textValue = value;
  //     return [...prevConditions];
  //   });
  // }, 250), []);

  // const setConditionMinValue = useCallback(debounce((value: string, index: number) => {
  //   const numberValue = parseFloat(value) || 0;
  //   const dbNumberValue = numberValue * 10;
  //   setActiveConditions((prevConditions) => {
  //     prevConditions[index].minValue = dbNumberValue;
  //     return [...prevConditions];
  //   });
  // }, 300), []);

  // const setConditionMaxValue = useCallback(debounce((value: string, index: number) => {
  //   const numberValue = parseFloat(value) || 0;
  //   const dbNumberValue = numberValue * 10;
  //   setActiveConditions((prevConditions) => {
  //     prevConditions[index].maxValue = dbNumberValue;
  //     return [...prevConditions];
  //   });
  // }, 300), []);

  // const addCondition = () => {
  //   setActiveConditions((prevConditions) => [...prevConditions, { type: null }]);
  // };

  // const deleteCondition = (index: number) => {
  //   setActiveConditions((prevConditions) => {
  //     prevConditions.splice(index, 1);
  //     return [...prevConditions];
  //   });
  // };

  // const getConditionOptionsFromQuestion = (question: SelectType, questions: Array<any>) => {
  //   console.log(question?.value);
  //   console.log(questions);

  //   if (!question?.value || questions?.length === 0) {
  //     return [];
  //   }

  //   const activeQuestionNode = questions?.find((q) => q.id === question?.value);

  //   if (!activeQuestionNode) {
  //     return [];
  //   }
  //   if (activeQuestionNode.type === 'SLIDER') {
  //     return [
  //       { label: 'Low Threshold', value: TriggerConditionType.LOW_THRESHOLD },
  //       { label: 'High Threshold', value: TriggerConditionType.HIGH_THRESHOLD },
  //       { label: 'Outer Range', value: TriggerConditionType.OUTER_RANGE },
  //       { label: 'Inner Range', value: TriggerConditionType.INNER_RANGE },
  //     ];
  //   }
  //   return [
  //     { label: 'Text Match', value: TriggerConditionType.TEXT_MATCH },
  //   ];
  // };

  const getNodeType = (question: SelectType, questions: Array<any>) => {
    if (!question?.value || questions?.length === 0) {
      return [];
    }

    const activeQuestionNode = questions?.find((q) => q.id === question?.value);

    if (!activeQuestionNode) return null;

    return activeQuestionNode.type;
  };

  const dialogues = dialogueData?.customer?.dialogues && dialogueData?.customer?.dialogues.map((dialogue: any) => (
    { label: dialogue?.title, value: dialogue?.slug }));

  const recipients = recipientsData?.users && recipientsData?.users.map((recipient: any) => (
    {
      label: `${recipient?.lastName}, ${recipient?.firstName} - E: ${recipient?.email} - P: ${recipient?.phone}`,
      value: recipient?.id,
    }));

  const questions = questionsData?.customer?.dialogue?.questions && questionsData?.customer?.dialogue?.questions.map((question: any) => (
    { label: question?.title, value: question?.id }));

  return (
    <>
      <PageTitle>{t('views:create_trigger_view')}</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

        <FormContainer>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <ServerError serverError={serverError} />

            <FormSection id="general">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About the trigger</H3>
                <Muted color="gray.600">
                  Tell us about the trigger, and to which scope it applies (question/dialogue)
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!form.errors.name}>
                    <FormLabel htmlFor="name">{t('name')}</FormLabel>
                    <InputHelper>{t('trigger:name_helper')}</InputHelper>
                    <Input
                      placeholder="My first trigger"
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
                      defaultValue=""
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
                              text="Question"
                              description="Send alerts when a certain value has been reached"
                            />
                            <ButtonRadio
                              isDisabled
                              icon={Watch}
                              value="SCHEDULED"
                              text="Scheduled"
                              description="Send alerts at certain times (coming soon)"
                            />
                          </RadioButtonGroup>
                        </>
                      )}
                    />

                    <FormErrorMessage>{form.errors.dialogue?.label?.message}</FormErrorMessage>
                  </FormControl>

                  {form.watch('type') === TriggerQuestionType.QUESTION && form.watch('dialogue') && (
                    <FormControl isRequired isInvalid={!!form.errors.question}>
                      <FormLabel htmlFor="question">{t('trigger:question')}</FormLabel>
                      <InputHelper>
                        {t('trigger:question_helper')}
                      </InputHelper>
                      <Controller
                        name="question"
                        control={form.control}
                        render={({ onChange }) => (
                          <Select
                            options={questions}
                            onChange={(data: any) => {
                              onChange(data);
                            }}
                          />
                        )}
                      />

                      <FormErrorMessage>{form.errors.question?.value?.message}</FormErrorMessage>
                    </FormControl>
                  )}
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
                  {form.watch('question') ? (
                    <FormControl isRequired isInvalid={!!form.errors.condition}>
                      <FormLabel htmlFor="condition">{t('trigger:condition')}</FormLabel>
                      <InputHelper>
                        {t('trigger:condition_helper')}
                      </InputHelper>
                      <Controller
                        name="condition"
                        defaultValue=""
                        control={form.control}
                        render={({ onChange, onBlur }) => (
                          <ConditionFormFragment
                            activeNodeType={getNodeType(
                              form.watch('question'), questionsData?.customer?.dialogue?.questions,
                            )}
                            onChange={onChange}
                            onBlur={onBlur}
                          />
                        )}
                      />

                      <FormErrorMessage>{form.errors.condition?.message}</FormErrorMessage>
                    </FormControl>
                  ) : (
                    <Text>Please select a type and/or dialogue</Text>
                  )}

                  {form.watch('condition') && form.watch('condition') === TriggerConditionType.TEXT_MATCH && (
                    <FormControl isInvalid={!!form.errors.matchText}>
                      <FormLabel htmlFor="matchText">{t('trigger:match_text')}</FormLabel>
                      <InputHelper>
                        {t('trigger:match_text_helper')}
                      </InputHelper>
                      <Input
                        placeholder="Satisfied"
                        leftEl={<Type />}
                        name="matchText"
                        ref={form.register({ required: true })}
                      />

                    </FormControl>
                  )}

                  {form.watch('condition') && form.watch('condition') === TriggerConditionType.LOW_THRESHOLD && (
                    <FormControl isInvalid={!!form.errors.lowThreshold}>
                      <FormLabel htmlFor="lowThreshold">{t('trigger:low_threshold')}</FormLabel>
                      <InputHelper>
                        {t('trigger:low_threshold_helper')}
                      </InputHelper>
                      <Controller
                        name="lowThreshold"
                        control={form.control}
                        defaultValue={5}
                        render={({ onChange, onBlur }) => (
                          <Slider
                            color="cyan"
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={form.register({ required: true })}
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

                  {form.watch('condition') && form.watch('condition') === TriggerConditionType.HIGH_THRESHOLD && (
                    <FormControl isInvalid={!!form.errors.highThreshold}>
                      <FormLabel htmlFor="highThreshold">{t('trigger:high_threshold')}</FormLabel>
                      <InputHelper>
                        {t('trigger:high_threshold_helper')}
                      </InputHelper>
                      <Controller
                        name="highThreshold"
                        control={form.control}
                        defaultValue={70}
                        render={({ onChange, onBlur }) => (
                          <Slider
                            color="red"
                            defaultValue={5}
                            onChange={onChange}
                            onBlur={onBlur}
                            ref={form.register({ required: true })}
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
                  <FormControl />
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
                <Button onClick={addRecipient} variantColor="teal" leftIcon={UserPlus}>Add user</Button>
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
                          defaultValue="EMAIL"
                          options={recipients}
                          as={Select}
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
                          <ButtonRadio icon={Mail} value="EMAIL" text="Email" description="Send alerts to email" />
                          <ButtonRadio icon={Smartphone} value="PHONE" text="Sms" description="Send alerts via sms" />
                          <ButtonRadio value="BOTH" text="Both" description="Send via both mail and sms" />
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
                Create
              </Button>
              <Button variant="outline" onClick={() => history.push('/')}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>

    </>
  );
};

export default AddTriggerView;
