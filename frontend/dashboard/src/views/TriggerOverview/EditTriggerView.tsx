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

import editTriggerMutation from 'mutations/editTrigger';
import editUserMutation from 'mutations/editUser';
import getDialoguesQuery from 'queries/getQuestionnairesCustomerQuery';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';
import getRecipientsQuery from 'queries/getUsers';
import getTriggerQuery from 'queries/getTrigger';

interface FormDataProps {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: { label: string, value: string };
  conditions: Array<TriggerCondition>
}

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

interface TriggerRecipient {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

interface TriggerCondition {
  type: string,
  minValue?: number,
  maxValue?: number,
  textValue?: string
}

interface PostMapTriggerCondition {
  id?: string | null,
  type: { label: string, value: string } | null,
  minValue?: number,
  maxValue?: number,
  textValue?: string
}

interface RelatedNode {
  id: string;
  title: string;
  questionDialogueId: string;
}

interface Trigger {
  id: string;
  name: string;
  type: string;
  medium: string;
  relatedNode?: RelatedNode;
  recipients: Array<TriggerRecipient>;
  conditions: Array<TriggerCondition>;
}

interface EditTriggerProps {
  trigger: Trigger;
  dialogues: {
    label: string;
    value: string;
  }[];
  dialogue: {
    label: string;
    value: string;
  } | undefined;
  type: { label: string, value: string };
  question: { label: string, value: string } | undefined;
  conditions: Array<PostMapTriggerCondition>;
  medium: { label: string, value: string };
  recipients: Array<{ label: string, value: string }>;
}

const TRIGGER_CONDITION_TYPES = [
  { label: 'Low Threshold', value: TriggerConditionType.LOW_THRESHOLD },
  { label: 'High Threshold', value: TriggerConditionType.HIGH_THRESHOLD },
  { label: 'Text Match', value: TriggerConditionType.TEXT_MATCH },
  { label: 'Outer Range', value: TriggerConditionType.OUTER_RANGE },
  { label: 'Inner Range', value: TriggerConditionType.INNER_RANGE },
];

const TRIGGER_TYPES = [
  { label: 'Question', value: 'QUESTION' },
  { label: 'Scheduled', value: 'SCHEDULED' },
];

const MEDIUM_TYPES = [
  { label: 'Email', value: 'EMAIL' },
  { label: 'Phone', value: 'PHONE' },
  { label: 'Both', value: 'BOTH' },
];

const EditTriggerView = () => {
  const { customerId, triggerId } = useParams<{ customerId: string, triggerId: string }>();

  const { data: triggerData, error, loading } = useQuery(getTriggerQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: triggerId,
    },
  });

  const { data: dialogueData, loading: dialoguesLoading } = useQuery(getDialoguesQuery, { variables: { id: customerId } });

  if (loading || dialoguesLoading) return null;
  if (error) return <><p>{error.message}</p></>;

  const trigger: Trigger = triggerData?.trigger;

  const capitalizedType = `${trigger?.type.charAt(0)}${trigger?.type.slice(1).toLowerCase()}`;
  const activeType = { label: capitalizedType, value: trigger?.type };

  const conditions: Array<PostMapTriggerCondition> = trigger?.conditions.map((condition) => ({ ...condition, type: { label: condition.type, value: condition.type } })); // TODO: Make type ready for select
  const activeRecipients = trigger?.recipients?.map((recipient) => ({
    label: `${recipient?.lastName}, ${recipient?.firstName} - E: ${recipient?.email} - P: ${recipient?.phone}`,
    value: recipient?.id,
  }));

  const capitalizedMedium = `${trigger?.medium.charAt(0)}${trigger?.medium.slice(1).toLowerCase()}`;
  const activeMedium = { label: capitalizedMedium, value: trigger?.medium };

  const activeQuestion = { label: trigger.relatedNode?.title || '', value: trigger.relatedNode?.id || '' };

  const dialogues: Array<{ label: string, value: string }> = dialogueData?.dialogues && dialogueData?.dialogues.map((dialogue: any) => (
    { label: dialogue?.title, value: dialogue?.id }));
  const currentDialogue = dialogues?.find((dialogue) => trigger?.relatedNode?.questionDialogueId && dialogue.value === trigger?.relatedNode?.questionDialogueId);

  return (
    <EditTriggerForm
      trigger={trigger}
      dialogues={dialogues}
      dialogue={currentDialogue}
      type={activeType}
      medium={activeMedium}
      question={activeQuestion}
      conditions={conditions}
      recipients={activeRecipients}
    />
  );
};

const EditTriggerForm = ({ trigger, type, medium, conditions, recipients, question, dialogues, dialogue }: EditTriggerProps) => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId } = useParams();
  const { data: dialogueData } = useQuery(getDialoguesQuery, { variables: { id: customerId } });

  const { data: recipientsData } = useQuery(getRecipientsQuery, { variables: { customerId } });
  const [fetchQuestions, { loading: questionsLoading, data: questionsData }] = useLazyQuery(
    getQuestionsQuery, { fetchPolicy: 'cache-and-network' },
  );

  const [activeType, setActiveType] = useState<null | { label: string, value: string }>(type);
  const [activeMedium, setActiveMedium] = useState<null | { label: string, value: string }>(medium);

  // const dialogues: Array<{ label: string, value: string }> = dialogueData?.dialogues && dialogueData?.dialogues.map((dialogue: any) => (
  //   { label: dialogue?.title, value: dialogue?.id }));
  // const currentDialogue = dialogues?.find((dialogue) => trigger?.relatedNode?.questionDialogueId && dialogue.value === trigger?.relatedNode?.questionDialogueId);
  const [activeDialogue, setActiveDialogue] = useState<null | undefined | { label: string, value: string }>(dialogue);
  const [activeQuestion, setActiveQuestion] = useState<null | undefined | { label: string, value: string }>(question);
  const [activeRecipients, setActiveRecipients] = useState<Array<null | { label: string, value: string }>>(recipients);
  const [activeConditions, setActiveConditions] = useState<Array<PostMapTriggerCondition>>(conditions);

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { topicId: activeDialogue.value } });
    }
  }, [activeDialogue, fetchQuestions]);

  const [editTrigger, { loading }] = useMutation(editTriggerMutation, {
    onCompleted: () => {
      history.push(`/dashboard/c/${customerId}/triggers/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const dialogueId = activeDialogue?.value;
    // TODO: Add activeQuestion to mutation
    const questionId = activeQuestion?.value;
    const userIds = activeRecipients.map((recipient) => recipient?.value);
    const recipients = { ids: userIds };
    const conditions = activeConditions.map((condition) => ({
      id: condition.id, minValue: condition.minValue, maxValue: condition.maxValue, textValue: condition.textValue, type: condition.type?.value,
    }));
    const triggerInput = { name: formData.name, type: activeType?.value, medium: activeMedium?.value, conditions };

    editTrigger({
      variables: {
        triggerId: trigger?.id,
        questionId,
        trigger: triggerInput,
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
    const numberValue = parseInt(value) || 0;
    setActiveConditions((prevConditions) => {
      prevConditions[index].minValue = numberValue;
      return [...prevConditions];
    });
  }, 200), []);

  const setConditionMaxValue = useCallback(debounce((value: string, index: number) => {
    const numberValue = parseInt(value) || 0;
    setActiveConditions((prevConditions) => {
      prevConditions[index].maxValue = numberValue;
      return [...prevConditions];
    });
  }, 200), []);

  const addCondition = () => {
    setActiveConditions((prevConditions) => [...prevConditions, { type: null }]);
  };

  const deleteCondition = (index: number) => {
    setActiveConditions((prevConditions) => {
      prevConditions.splice(index, 1);
      return [...prevConditions];
    });
  };

  const questions = questionsData?.dialogue?.questions && questionsData?.dialogue?.questions.map((question: any) => (
    { label: question?.title, value: question?.id }));

  const recipientOptions = recipientsData?.users.map((recipient: any) => ({
    label: `${recipient?.lastName}, ${recipient?.firstName} - E: ${recipient?.email} - P: ${recipient?.phone}`,
    value: recipient?.id,
  }));

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}>Trigger</H2>
        <Muted pb={4}>Edit an existing trigger</Muted>
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
                  <StyledInput defaultValue={trigger?.name} name="name" ref={register({ required: true })} />
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
                      <Flex position="relative" marginBottom={5} paddingBottom={10} paddingTop={30} backgroundColor="#fdfbfe" flexDirection="column" key={index} gridColumn="1 / -1">
                        <DeleteButtonContainer style={{ top: '5px' }} onClick={() => deleteCondition(index)}>
                          <X />
                        </DeleteButtonContainer>
                        <Select
                          options={TRIGGER_CONDITION_TYPES}
                          value={condition.type}
                          onChange={(qOption: any) => setConditionsType(qOption, index)}
                        />
                        {condition?.type?.value === TriggerConditionType.TEXT_MATCH && (
                          <Flex marginTop={5} flexDirection="column">
                            <StyledLabel>Match Text</StyledLabel>
                            <StyledInput defaultValue={condition?.textValue} onChange={(event) => setMatchText(event.currentTarget.value, index)} name="minValue" ref={register({ required: true })} />
                            {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                          </Flex>
                        )}

                        {condition?.type?.value === TriggerConditionType.LOW_THRESHOLD && (
                          <Flex marginTop={5} flexDirection="column">
                            <StyledLabel>Low Threshold</StyledLabel>
                            <StyledInput
                              onChange={(event) => setConditionMinValue(event.currentTarget.value, index)}
                              defaultValue={condition?.minValue}
                              name="name"
                              ref={register({ required: true })}
                            />
                            {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                          </Flex>
                        )}

                        {condition?.type?.value === TriggerConditionType.HIGH_THRESHOLD && (
                          <Flex marginTop={5} flexDirection="column">
                            <StyledLabel>High Threshold</StyledLabel>
                            <StyledInput
                              onChange={(event) => setConditionMaxValue(event.currentTarget.value, index)}
                              defaultValue={condition?.maxValue}
                              name="name"
                              ref={register({ required: true })}
                            />
                            {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                          </Flex>
                        )}

                        {(condition?.type?.value === TriggerConditionType.OUTER_RANGE
                          || condition?.type?.value === TriggerConditionType.INNER_RANGE) && (
                            <Flex marginTop={5} flexDirection="row" justifyContent="space-evenly">
                              <Flex width="49%" flexDirection="column">
                                <StyledLabel>Low Threshold</StyledLabel>
                                <StyledInput
                                  onChange={(event) => setConditionMinValue(event.currentTarget.value, index)}
                                  defaultValue={condition?.minValue}
                                  name="name"
                                  ref={register({ required: true })}
                                />
                                {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                              </Flex>
                              <Flex width="49%" flexDirection="column">
                                <StyledLabel>High Threshold</StyledLabel>
                                <StyledInput
                                  onChange={(event) => setConditionMaxValue(event.currentTarget.value, index)}
                                  defaultValue={condition?.textValue}
                                  name="name"
                                  ref={register({ required: true })}
                                />
                                {errors.name && <Muted color="warning">Something went wrong!</Muted>}
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
                    {/* conditions header here */}
                  </Flex>
                  <Hr />
                  <Div marginTop={15}>
                    {activeRecipients.map((recipient, index) => (
                      <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                        <Div flexGrow={9}>
                          <Select
                            key={index}
                            options={recipientOptions}
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
            <Button brand="primary" mr={2} type="submit">Save trigger</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/c/${customerId}/triggers/`)}>Cancel</Button>
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

export default EditTriggerView;
