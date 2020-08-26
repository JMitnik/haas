/* eslint-disable radix */
import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { Minus, MinusCircle, Plus, PlusCircle, Type, X } from 'react-feather';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { Button, ButtonGroup, FormErrorMessage, Stack } from '@chakra-ui/core';
import {
  Container, DeleteButtonContainer, Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, Grid, H2, H3, H4, Hr, Input, InputGrid, InputHelper, Label, Muted, PageTitle, StyledInput, Textarea,
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

interface FormDataProps {
  name: string;
  dialogue: string;
  type: string;
  medium: string;
  question: string;
  condition: string;
  matchText: string;
  lowThreshold: number;
  highThreshold: number;
  recipients: Array<string>;
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

const TRIGGER_TYPES = [
  { label: 'Question', value: 'QUESTION' },
  { label: 'Scheduled', value: 'SCHEDULED' },
];

const MEDIUM_TYPES = [
  { label: 'Email', value: 'EMAIL' },
  { label: 'Sms', value: 'PHONE' },
  { label: 'Both', value: 'BOTH' },
];

const schema = yup.object().shape({
  name: yup.string().required(),
  dialogue: yup.string().required(),
  type: yup.string().required(),
  medium: yup.string().required(),
  question: yup.string().when(['type'], {
    is: (type: string) => type === TriggerQuestionType.QUESTION,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
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
  recipients: yup.array().min(1).of(yup.string().required()),
});

const AddTriggerView = () => {
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const { t } = useTranslation();

  const { customerSlug } = useParams();

  // TODO: Make it one query
  const { data: dialogueData } = useQuery(getDialoguesQuery, { variables: { customerSlug } });
  const { data: recipientsData } = useQuery(getRecipientsQuery, { variables: { customerSlug } });

  const [fetchQuestions, { data: questionsData }] = useLazyQuery(getQuestionsQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const [activeType, setActiveType] = useState<null | { label: string, value: string }>(null);
  const [activeMedium, setActiveMedium] = useState<null | { label: string, value: string }>(null);
  const [activeDialogue, setActiveDialogue] = useState<null | { label: string, value: string }>(null);
  const [activeQuestion, setActiveQuestion] = useState<null | { label: string, value: string }>(null);
  const [activeRecipients, setActiveRecipients] = useState<Array<null | { label: string, value: string }>>([]);
  const [activeConditions, setActiveConditions] = useState<Array<TriggerCondition>>([]);

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { customerSlug, dialogueSlug: activeDialogue.value } });
    }
  }, [customerSlug, activeDialogue, fetchQuestions]);

  const [addTrigger, { loading: isLoading, error: serverError }] = useMutation(createTriggerMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/triggers/`);
    },

  });

  const onSubmit = (formData: FormDataProps) => {
    const questionId = activeQuestion?.value;
    const userIds = activeRecipients.map((recipient) => recipient?.value);
    const recipients = { ids: userIds };
    const conditions = activeConditions.map((condition) => ({ ...condition, type: condition.type?.value }));
    const trigger = { name: formData.name, type: activeType?.value, medium: activeMedium?.value, conditions };

    addTrigger({
      variables: {
        customerSlug,
        questionId,
        trigger,
        recipients,
      },
    });
  };

  const handleDialogueChange = (qOption: any) => {
    form.setValue('dialogue', qOption?.value);
    setActiveDialogue(qOption);
  };

  const handleTypeChange = (qOption: any) => {
    form.setValue('type', qOption?.value);
    setActiveType(qOption);
  };

  const handleMediumChange = (qOption: any) => {
    form.setValue('medium', qOption?.value);
    setActiveMedium(qOption);
  };

  const handleQuestionChange = (qOption: any) => {
    form.setValue('question', qOption?.value);
    setActiveQuestion(qOption);
  };

  const setRecipients = (qOption: { label: string, value: string }, index: number) => {
    form.setValue(`recipients[${index}]`, qOption?.value);
    setActiveRecipients((prevRecipients) => {
      prevRecipients[index] = qOption;
      return [...prevRecipients];
    });
  };

  const addRecipient = () => {
    setActiveRecipients((prevRecipients) => [...prevRecipients, null]);
  };

  const deleteRecipient = (index: number) => {
    setActiveRecipients((prevRecipients) => {
      prevRecipients.splice(index, 1);
      return [...prevRecipients];
    });
  };

  const setConditionsType = (qOption: any, index: number) => {
    form.setValue('condition', qOption.value);
    setActiveConditions((prevConditions) => {
      prevConditions[index].type = qOption;
      return [...prevConditions];
    });
  };

  const setMatchText = useCallback(debounce((value: string, index: number) => {
    setActiveConditions((prevConditions) => {
      prevConditions[index].textValue = value;
      return [...prevConditions];
    });
  }, 250), []);

  const setConditionMinValue = useCallback(debounce((value: string, index: number) => {
    const numberValue = parseFloat(value) || 0;
    const dbNumberValue = numberValue * 10;
    setActiveConditions((prevConditions) => {
      prevConditions[index].minValue = dbNumberValue;
      return [...prevConditions];
    });
  }, 300), []);

  const setConditionMaxValue = useCallback(debounce((value: string, index: number) => {
    const numberValue = parseFloat(value) || 0;
    const dbNumberValue = numberValue * 10;
    setActiveConditions((prevConditions) => {
      prevConditions[index].maxValue = dbNumberValue;
      return [...prevConditions];
    });
  }, 300), []);

  const addCondition = () => {
    setActiveConditions((prevConditions) => [...prevConditions, { type: null }]);
  };

  const deleteCondition = (index: number) => {
    setActiveConditions((prevConditions) => {
      prevConditions.splice(index, 1);
      return [...prevConditions];
    });
  };

  const setConditionTypeOptions = (questionId: string | undefined, questions: Array<any>) => {
    if (!questionId || questions?.length === 0) {
      return [];
    }

    const activeQuestionNode = questions.find((question) => question.id === questionId);
    if (!activeQuestionNode) {
      return [];
    }
    if (activeQuestionNode.type === 'SLIDER') {
      return [
        { label: 'Low Threshold', value: TriggerConditionType.LOW_THRESHOLD },
        { label: 'High Threshold', value: TriggerConditionType.HIGH_THRESHOLD },
        { label: 'Outer Range', value: TriggerConditionType.OUTER_RANGE },
        { label: 'Inner Range', value: TriggerConditionType.INNER_RANGE },
      ];
    }
    return [
      { label: 'Text Match', value: TriggerConditionType.TEXT_MATCH },
    ];
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

                  <FormControl isInvalid={!!form.errors.dialogue?.message}>
                    <FormLabel htmlFor="dialogue">{t('trigger:dialogue')}</FormLabel>
                    <InputHelper>{t('trigger:dialogue_helper')}</InputHelper>
                    <Controller
                      name="dialogue"
                      control={form.control}
                      render={({ onChange }) => (
                        <Select
                          options={dialogues}
                          value={activeDialogue}
                          onChange={(data: any) => {
                            handleDialogueChange(data);
                            onChange(data);
                          }}
                        />
                      )}
                    />
                    <FormErrorMessage>{form.errors.dialogue?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.type?.message}>
                    <FormLabel htmlFor="type">{t('trigger:type')}</FormLabel>
                    <InputHelper>{t('trigger:type_helper')}</InputHelper>

                    <Controller
                      name="type"
                      control={form.control}
                      render={({ onChange }) => (
                        <Select
                          options={TRIGGER_TYPES}
                          value={activeType}
                          onChange={(data: any) => {
                            handleTypeChange(data);
                            onChange(data);
                          }}
                        />
                      )}
                    />

                    <FormErrorMessage>{form.errors.dialogue?.message}</FormErrorMessage>
                  </FormControl>

                  {activeType?.value === TriggerQuestionType.QUESTION && activeDialogue && (
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
                            value={activeQuestion}
                            onChange={(data: any) => {
                              handleQuestionChange(data);
                              onChange(data);
                            }}
                          />
                        )}
                      />

                      <FormErrorMessage>{form.errors.question?.message}</FormErrorMessage>
                    </FormControl>
                  )}
                </InputGrid>
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
                  <FormControl isInvalid={!!form.errors.medium?.message}>
                    <FormLabel htmlFor="medium">{t('trigger:medium')}</FormLabel>
                    <InputHelper>{t('trigger:medium_helper')}</InputHelper>

                    <Controller
                      name="medium"
                      control={form.control}
                      render={({ onChange }) => (
                        <Select
                          options={MEDIUM_TYPES}
                          value={activeMedium}
                          onChange={(data: any) => {
                            handleMediumChange(data);
                            onChange(data);
                          }}
                        />
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
