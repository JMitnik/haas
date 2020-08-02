/* eslint-disable radix */
import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { MinusCircle, PlusCircle, X } from 'react-feather';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import {
  Button, Container, DeleteButtonContainer, Div, Flex, Grid, H2, H3,
  H4, Hr, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
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
});

const AddTriggerView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, setValue } = useForm<FormDataProps>({
    validationSchema: schema,
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
  const [activeConditions, setActiveConditions] = useState<Array<TriggerCondition>>([]);

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { customerSlug, dialogueSlug: activeDialogue.value } });
    }
  }, [customerSlug, activeDialogue, fetchQuestions]);

  const [addTrigger, { loading }] = useMutation(createTriggerMutation, {
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
    setValue('dialogue', qOption?.value);
    setActiveDialogue(qOption);
  };

  const handleTypeChange = (qOption: any) => {
    setValue('type', qOption?.value);
    setActiveType(qOption);
  };

  const handleMediumChange = (qOption: any) => {
    setValue('medium', qOption?.value);
    setActiveMedium(qOption);
  };

  const handleQuestionChange = (qOption: any) => {
    setValue('question', qOption?.value);
    setActiveQuestion(qOption);
  };

  const setRecipients = (qOption: { label: string, value: string }, index: number) => {
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
    setValue('condition', qOption.value);
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

  const ErrorStyle = {
    control: (base: any) => ({
      ...base,
      border: '1px solid red',
      // This line disable the blue border
      boxShadow: 'none',
    }),
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Trigger </H2>
        <Muted pb={4}>Create a new trigger</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General trigger information</H3>
              <Muted>
                General information about the trigger, such as name, type, medium, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <StyledLabel>Trigger name</StyledLabel>
                  <StyledInput hasError={!!errors.name} name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Dialogue</StyledLabel>
                  <Select
                    styles={errors.dialogue && !activeDialogue ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'dialogue',
                      required: true,
                    })}
                    options={dialogues}
                    value={activeDialogue}
                    onChange={(qOption: any) => {
                      handleDialogueChange(qOption);
                    }}
                  />
                  {errors.dialogue && !activeDialogue && <Muted color="warning">{errors.dialogue.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Type</StyledLabel>
                  <Select
                    styles={errors.type && !activeType ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'type',
                      required: true,
                    })}
                    options={TRIGGER_TYPES}
                    value={activeType}
                    onChange={(qOption: any) => {
                      handleTypeChange(qOption);
                    }}
                  />
                  {errors.type && !activeType && <Muted color="warning">{errors.type.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Medium</StyledLabel>
                  <Select
                    styles={errors.medium && !activeMedium ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'medium',
                      required: true,
                    })}
                    options={MEDIUM_TYPES}
                    value={activeMedium}
                    onChange={(qOption: any) => {
                      handleMediumChange(qOption);
                    }}
                  />
                  {errors.medium && !activeMedium && <Muted color="warning">{errors.medium.message}</Muted>}
                </Div>
                {activeType?.value === TriggerQuestionType.QUESTION && (
                  <Div useFlex flexDirection="column" gridColumn="1 / -1">
                    <StyledLabel>Question</StyledLabel>
                    <Select
                      styles={errors.question && !activeQuestion ? ErrorStyle : undefined}
                      ref={() => register({
                        name: 'question',
                        required: false,
                      })}
                      options={questions}
                      value={activeQuestion}
                      onChange={(qOption: any) => {
                        handleQuestionChange(qOption);
                      }}
                    />
                    {errors.question && !activeQuestion && <Muted color="warning">{errors.question.message}</Muted>}
                  </Div>
                )}
                <Div gridColumn="1 / -1">
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <H4>Conditions</H4>
                    <PlusCircle onClick={addCondition} />
                  </Flex>
                  <Hr />
                  <Div padding={10} marginTop={15}>
                    {activeConditions.map((condition, index) => (
                      <Flex
                        position="relative"
                        marginBottom={5}
                        paddingBottom={10}
                        paddingTop={30}
                        backgroundColor="#fdfbfe"
                        flexDirection="column"
                        key={index}
                        gridColumn="1 / -1"
                      >
                        <DeleteButtonContainer style={{ top: '5px' }} onClick={() => deleteCondition(index)}>
                          <X />
                        </DeleteButtonContainer>
                        <Select
                          styles={errors.condition && !activeConditions?.[0].type ? ErrorStyle : undefined}
                          ref={() => register({
                            name: 'condition',
                            required: false,
                          })}
                          options={setConditionTypeOptions(activeQuestion?.value, questionsData?.customer?.dialogue?.questions)}
                          value={condition.type}
                          onChange={(qOption: any) => setConditionsType(qOption, index)}
                        />
                        {errors.condition && !activeConditions?.[0].type && <Muted color="warning">{errors.condition.message}</Muted>}
                        {condition?.type?.value === TriggerConditionType.TEXT_MATCH && (
                        <Flex marginTop={5} flexDirection="column">
                          <StyledLabel>Match Text</StyledLabel>
                          <StyledInput
                            hasError={!!errors.matchText}
                            onChange={(event) => setMatchText(event.currentTarget.value, index)}
                            name="matchText"
                            ref={register({ required: true })}
                          />
                          {errors.matchText && <Muted color="warning">{errors.matchText.message}</Muted>}
                        </Flex>
                        )}

                        {condition?.type?.value === TriggerConditionType.LOW_THRESHOLD && (
                          <Flex marginTop={5} flexDirection="column">
                            <StyledLabel>Low Threshold (0 - 10)</StyledLabel>
                            <StyledInput
                              hasError={!!errors.lowThreshold}
                              type="number"
                              step="0.1"
                              onChange={(event) => setConditionMinValue(event.currentTarget.value, index)}
                              name="lowThreshold"
                              ref={register({ required: true, min: 0, max: 10 })}
                            />
                            {errors.lowThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                          </Flex>
                        )}

                        {condition?.type?.value === TriggerConditionType.HIGH_THRESHOLD && (
                        <Flex marginTop={5} flexDirection="column">
                          <StyledLabel>High Threshold (0 - 10)</StyledLabel>
                          <StyledInput
                            hasError={!!errors.highThreshold}
                            type="number"
                            step="0.1"
                            onChange={(event) => setConditionMaxValue(event.currentTarget.value, index)}
                            name="highThreshold"
                            ref={register({ required: true, min: 0, max: 10 })}
                          />
                          {errors.highThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                        </Flex>
                        )}

                        {(condition?.type?.value === TriggerConditionType.OUTER_RANGE
                        || condition?.type?.value === TriggerConditionType.INNER_RANGE) && (
                        <Flex marginTop={5} flexDirection="row" justifyContent="space-evenly">
                          <Flex width="49%" flexDirection="column">
                            <StyledLabel>Low Threshold (0 - 10)</StyledLabel>
                            <StyledInput
                              hasError={!!errors.lowThreshold}
                              type="number"
                              step="0.1"
                              onChange={(event) => setConditionMinValue(event.currentTarget.value, index)}
                              name="lowThreshold"
                              ref={register({ required: true, min: 0, max: 10 })}
                            />
                            {errors.lowThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                          </Flex>
                          <Flex width="49%" flexDirection="column">
                            <StyledLabel>High Threshold (0 - 10)</StyledLabel>
                            <StyledInput
                              hasError={!!errors.highThreshold}
                              type="number"
                              step="0.1"
                              onChange={(event) => setConditionMaxValue(event.currentTarget.value, index)}
                              name="highThreshold"
                              ref={register({ required: true, min: 0, max: 10 })}
                            />
                            {errors.highThreshold && <Muted color="warning">Value not between 0 and 10</Muted>}
                          </Flex>
                        </Flex>
                        )}
                      </Flex>
                    ))}
                  </Div>
                </Div>
                <Div gridColumn="1 / -1">
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <H4>Recipients</H4>
                    <PlusCircle onClick={addRecipient} />
                  </Flex>
                  <Hr />
                  <Div marginTop={15}>
                    {activeRecipients.map((recipient, index) => (
                      <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                        <Div flexGrow={9}>
                          <Select
                            key={index}
                            options={recipients}
                            value={recipient}
                            onChange={(qOption: any) => {
                              setRecipients(qOption, index);
                            }}
                          />
                        </Div>
                        <Flex justifyContent="center" alignContent="center" flexGrow={1}>
                          <MinusCircle onClick={() => deleteRecipient(index)} />
                        </Flex>
                      </Flex>
                    ))}
                  </Div>
                </Div>
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create trigger</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/triggers/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
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
