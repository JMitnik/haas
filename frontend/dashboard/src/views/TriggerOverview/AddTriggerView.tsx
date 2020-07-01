/* eslint-disable radix */
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

const AddTriggerView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId, customerSlug } = useParams();
  const { data: dialogueData } = useQuery(getDialoguesQuery, { variables: { customerSlug } });
  const { data: recipientsData } = useQuery(getRecipientsQuery, { variables: { customerSlug } });
  const [fetchQuestions, { data: questionsData }] = useLazyQuery(getQuestionsQuery,
    { fetchPolicy: 'cache-and-network' });

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
                  <StyledInput name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Dialogue</StyledLabel>
                  <Select
                    options={dialogues}
                    value={activeDialogue}
                    onChange={(qOption: any) => {
                      setActiveDialogue(qOption);
                    }}
                  />
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Type</StyledLabel>
                  <Select
                    options={TRIGGER_TYPES}
                    value={activeType}
                    onChange={(qOption: any) => {
                      setActiveType(qOption);
                    }}
                  />
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Medium</StyledLabel>
                  <Select
                    options={MEDIUM_TYPES}
                    value={activeMedium}
                    onChange={(qOption: any) => {
                      setActiveMedium(qOption);
                    }}
                  />
                </Div>
                {activeType?.value === TriggerQuestionType.QUESTION && (
                  <Div useFlex flexDirection="column" gridColumn="1 / -1">
                    <StyledLabel>Question</StyledLabel>
                    <Select
                      options={questions}
                      value={activeQuestion}
                      onChange={(qOption: any) => {
                        setActiveQuestion(qOption);
                      }}
                    />
                  </Div>
                )}
                { /* conditions overview here */}
                <Div gridColumn="1 / -1">
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <H4>Conditions</H4>
                    <PlusCircle onClick={addCondition} />
                    {/* conditions header here */}
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
                          options={setConditionTypeOptions(activeQuestion?.value, questionsData?.customer?.dialogue?.questions)}
                          value={condition.type}
                          onChange={(qOption: any) => setConditionsType(qOption, index)}
                        />
                        {condition?.type?.value === TriggerConditionType.TEXT_MATCH && (
                        <Flex marginTop={5} flexDirection="column">
                          <StyledLabel>Match Text</StyledLabel>
                          <StyledInput
                            onChange={(event) => setMatchText(event.currentTarget.value, index)}
                            name="matchText"
                            ref={register({ required: true })}
                          />
                          {errors.matchText && <Muted color="warning">Something went wrong!</Muted>}
                        </Flex>
                        )}

                        {condition?.type?.value === TriggerConditionType.LOW_THRESHOLD && (
                          <Flex marginTop={5} flexDirection="column">
                            <StyledLabel>Low Threshold (0 - 10)</StyledLabel>
                            <StyledInput
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
