/* eslint-disable radix */
import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { MinusCircle, Plus, Type } from 'react-feather';
import { debounce } from 'lodash';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { Button, FormErrorMessage } from '@chakra-ui/core';
import {
  Container, Div, ErrorStyle, Flex, FormContainer, FormControl, FormLabel,
  FormSection, H2, H3, Hr, Input, InputGrid, InputHelper, Muted,
} from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import ServerError from 'components/ServerError';
import createTriggerMutation from 'mutations/createTrigger';
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
  { label: 'Phone', value: 'PHONE' },
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
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

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
  const [activeConditions, setActiveConditions] = useState<Array<TriggerCondition>>([{ type: null }]);

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { customerSlug, dialogueSlug: activeDialogue.value } });
    }
  }, [customerSlug, activeDialogue, fetchQuestions]);

  const [addTrigger, { loading: isLoading, error: serverErrors }] = useMutation(createTriggerMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/triggers/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
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

  console.log('values: ', form.getValues());

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}>Add Trigger</H2>
      </Div>
      <FormContainer>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <ServerError serverError={serverErrors} />
          <FormSection id="general">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>General trigger information</H3>
              <Muted>
                General information about the trigger, such as name, type, medium, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <InputGrid>
                <FormControl isRequired isInvalid={!!form.errors.name}>
                  <FormLabel htmlFor="name">Trigger name</FormLabel>
                  <InputHelper>What is the name of the trigger?</InputHelper>
                  <Input
                    placeholder="Peaches or apples?"
                    leftEl={<Type />}
                    name="name"
                    ref={form.register({ required: true })}
                  />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dialogue</FormLabel>
                  <InputHelper>Pick a dialogue the trigger should be for</InputHelper>
                  <Controller
                    control={form.control}
                    render={({ onChange }) => (
                      <Select
                        options={dialogues}
                        value={activeDialogue}
                        onChange={(data: any) => {
                          handleDialogueChange(data);
                          onChange(data.value);
                        }}
                      />
                    )}
                    name="dialogue"
                    options={dialogues}
                    defaultValue={activeDialogue}
                  />
                  {/* <Select
                    styles={form.errors.dialogue && !activeDialogue ? ErrorStyle : undefined}
                    ref={() => form.register({
                      name: 'dialogue',
                      required: true,
                    })}
                    options={dialogues}
                    value={activeDialogue}
                    onChange={(qOption: any) => {
                      handleDialogueChange(qOption);
                    }}
                  /> */}
                  <FormErrorMessage>{form.errors.dialogue}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <InputHelper>Pick the type of trigger</InputHelper>
                  <Controller
                    control={form.control}
                    render={({ onChange }) => (
                      <Select
                        options={TRIGGER_TYPES}
                        value={activeType}
                        onChange={(data: any) => {
                          handleTypeChange(data);
                          onChange(data.value);
                        }}
                      />
                    )}
                    name="type"
                    defaultValue={activeType}
                  />
                  <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Medium</FormLabel>
                  <InputHelper>Pick the medium the trigger should be sent to</InputHelper>
                  <Controller
                    control={form.control}
                    render={({ onChange }) => (
                      <Select
                        options={MEDIUM_TYPES}
                        value={activeMedium}
                        onChange={(data: any) => {
                          handleMediumChange(data);
                          onChange(data.value);
                        }}
                      />
                    )}
                    name="medium"
                    defaultValue={activeMedium}
                  />
                  <FormErrorMessage>{form.errors.medium}</FormErrorMessage>
                </FormControl>
                {activeType?.value === TriggerQuestionType.QUESTION && (
                  <FormControl isRequired gridColumn="1 / -1">
                    <FormLabel>Question</FormLabel>
                    <InputHelper>Pick the question the trigger should be attached to</InputHelper>
                    <Controller
                      control={form.control}
                      render={({ onChange }) => (
                        <Select
                          options={questions}
                          value={activeQuestion}
                          onChange={(data: any) => {
                            handleQuestionChange(data);
                            onChange(data.value);
                          }}
                        />
                      )}
                      name="question"
                      defaultValue={activeQuestion}
                    />
                    <FormErrorMessage>{form.errors.question}</FormErrorMessage>
                  </FormControl>
                )}
              </InputGrid>
            </Div>
          </FormSection>
          <Hr />
          <FormSection id="conditions">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Condition</H3>
              <Muted>
                Pick the condition the trigger should be triggered
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl gridColumn="1/-1" isRequired>
                  <FormLabel>Type</FormLabel>
                  <InputHelper>Pick the condition type of the trigger</InputHelper>
                  <Controller
                    control={form.control}
                    render={({ onChange }) => (
                      <Select
                        options={setConditionTypeOptions(activeQuestion?.value, questionsData?.customer?.dialogue?.questions)}
                        value={activeConditions?.[0].type}
                        onChange={(data: any) => {
                          setConditionsType(data, 0);
                          onChange(data.value);
                        }}
                      />
                    )}
                    name="condition"
                    defaultValue={activeConditions?.[0].type}
                  />
                  <FormErrorMessage>{form.errors.condition}</FormErrorMessage>
                </FormControl>

                {activeConditions?.[0]?.type?.value === TriggerConditionType.TEXT_MATCH && (
                <FormControl isRequired>
                  <FormLabel>Match Text</FormLabel>
                  <InputHelper>Pick the text needed to be matched</InputHelper>
                  <Input
                    placeholder="Quality..."
                    leftEl={<Type />}
                    name="matchText"
                    onChange={(event: any) => setMatchText(event.currentTarget.value, 0)}
                    ref={form.register({ required: false })}
                  />
                  {form.errors.matchText && <Muted color="warning">{form.errors.matchText.message}</Muted>}
                </FormControl>
                      )}

                {activeConditions?.[0]?.type?.value === TriggerConditionType.LOW_THRESHOLD && (
                <FormControl isRequired>
                  <FormLabel>Low Threshold (0 - 10)</FormLabel>
                  <InputHelper>Pick the low threshold of the trigger</InputHelper>
                  <Input
                    placeholder="9.3"
                    type="number"
                    step="0.1"
                    leftEl={<Type />}
                    name="lowThreshold"
                    onChange={(event: any) => setConditionMinValue(event.currentTarget.value, 0)}
                    ref={form.register({ required: true, min: 0, max: 10 })}
                  />
                  {form.errors.lowThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                </FormControl>
                      )}

                {activeConditions?.[0]?.type?.value === TriggerConditionType.HIGH_THRESHOLD && (
                <FormControl isRequired>
                  <FormLabel>High Threshold (0 - 10)</FormLabel>
                  <InputHelper>Pick the high threshold of the trigger</InputHelper>
                  <Input
                    placeholder="9.3"
                    type="number"
                    step="0.1"
                    leftEl={<Type />}
                    onChange={(event: any) => setConditionMaxValue(event.currentTarget.value, 0)}
                    name="highThreshold"
                    ref={form.register({ required: true, min: 0, max: 10 })}
                  />
                  {form.errors.highThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                </FormControl>
                      )}

                {(activeConditions?.[0]?.type?.value === TriggerConditionType.OUTER_RANGE
                      || activeConditions?.[0]?.type?.value === TriggerConditionType.INNER_RANGE) && (
                        <FormControl isRequired>
                          <FormLabel>Low Threshold (0 - 10)</FormLabel>
                          <InputHelper>Pick the low threshold of the trigger</InputHelper>
                          <Input
                            placeholder="9.3"
                            type="number"
                            step="0.1"
                            leftEl={<Type />}
                            name="lowThreshold"
                            onChange={(event: any) => setConditionMinValue(event.currentTarget.value, 0)}
                            ref={form.register({ required: true, min: 0, max: 10 })}
                          />
                          {form.errors.lowThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                        </FormControl>

                )}

                {(activeConditions?.[0]?.type?.value === TriggerConditionType.OUTER_RANGE
                      || activeConditions?.[0]?.type?.value === TriggerConditionType.INNER_RANGE) && (
                        <FormControl isRequired>
                          <FormLabel>High Threshold (0 - 10)</FormLabel>
                          <InputHelper>Pick the high threshold of the trigger</InputHelper>
                          <Input
                            placeholder="9.3"
                            type="number"
                            step="0.1"
                            leftEl={<Type />}
                            onChange={(event: any) => setConditionMaxValue(event.currentTarget.value, 0)}
                            name="highThreshold"
                            ref={form.register({ required: true, min: 0, max: 10 })}
                          />
                          {form.errors.highThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                        </FormControl>
                )}

              </InputGrid>
            </Div>
          </FormSection>
          <Hr />
          <FormSection>
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Recipients</H3>
              <Muted>
                Pick the recipients the trigger should be sent to
              </Muted>
            </Div>
            <Div>
              <InputGrid gridTemplateColumns="1fr">
                <Div>
                  <Button
                    leftIcon={Plus}
                    onClick={addRecipient}
                  >
                    Add recipient
                  </Button>
                </Div>
                <Div marginTop={15}>
                  {activeRecipients.map((recipient, index) => (
                    <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                      <Div flexGrow={9}>
                        <Controller
                          control={form.control}
                          render={({ onChange }) => (
                            <Select
                              options={recipients}
                              value={recipient}
                              onChange={(data: any) => {
                                setRecipients(data, index);
                                onChange(data.value);
                              }}
                            />
                          )}
                          name={`recipients[${index}]`}
                          defaultValue={recipient}
                        />
                        <FormErrorMessage>{form.errors.recipients?.[index]}</FormErrorMessage>
                      </Div>
                      <Flex justifyContent="center" alignContent="center" flexGrow={1}>
                        <MinusCircle onClick={() => deleteRecipient(index)} />
                      </Flex>
                    </Flex>
                  ))}
                </Div>
              </InputGrid>

            </Div>

          </FormSection>

          <Div>
            {isLoading && (<Muted>Loading...</Muted>)}

            <Flex>
              <Button
                isLoading={isLoading}
                isDisabled={!form.formState.isValid}
                variantColor="teal"
                type="submit"
              >
                Create trigger

              </Button>
              <Button variant="outline" onClick={() => history.push(`/dashboard/b/${customerSlug}/triggers/`)}>Cancel</Button>
            </Flex>
          </Div>
        </Form>
      </FormContainer>

    </Container>
  );
};

const FormGroupContainer = styled.div`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter * 3}px;
  `}
`;

const Form = styled.form``;

export default AddTriggerView;
