import { ApolloError } from 'apollo-boost';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import {
  Button, Container, Div, Flex, Grid, H2, H3, H4,
  Hr, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
import createAddMutation from 'mutations/createUser';
import getDialoguesQuery from 'queries/getQuestionnairesCustomerQuery';
import getQuestionsQuery from 'queries/getQuestionnaireQuery';

interface FormDataProps {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: { label: string, value: string };
}

const TRIGGER_TYPES = [
  { label: 'Question', value: 'question' },
  { label: 'Scheduled', value: 'scheduled' },
];

const MEDIUM_TYPES = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Both', value: 'both' },
];

const AddTriggerView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId } = useParams();
  const { data: dialogueData } = useQuery(getDialoguesQuery, { variables: { id: customerId } });
  const [fetchQuestions, { loading: questionsLoading, data: questionsData }] = useLazyQuery(getQuestionsQuery, { fetchPolicy: 'cache-and-network' });

  const [activeType, setActiveType] = useState<null | { label: string, value: string }>(null);
  const [activeMedium, setActiveMedium] = useState<null | { label: string, value: string }>(null);
  const [activeDialogue, setActiveDialogue] = useState<null | { label: string, value: string }>(null);
  const [activeQuestion, setActiveQuestion] = useState<null | { label: string, value: string }>(null);
  const [activeRecipients, setActiveRecipients] = useState<Array<null | { label: string, value: string }>>([]);

  useEffect(() => {
    if (activeDialogue) {
      fetchQuestions({ variables: { topicId: activeDialogue.value } });
    }
  }, [activeDialogue, fetchQuestions]);

  const [addUser, { loading }] = useMutation(createAddMutation, {
    onCompleted: () => {
      history.push(`/dashboard/c/${customerId}/users/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      roleId: activeType?.value || null,
      name: formData.name || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
    };

    addUser({
      variables: {
        id: customerId,
        input: optionInput,
      },
    });
  };

  const setRecipients = (qOption: { label: string, value: string }, index: number) => {
    const { value } = qOption;
    setActiveRecipients((prevRecipients) => prevRecipients);
  };

  const addNewRecipient = () => {
    setActiveRecipients((prevRecipients) => [...prevRecipients, null]);
  };

  const deleteRecipient = (index: number) => {
    setActiveRecipients((prevRecipients) => {
      prevRecipients.splice(index, 1);
      return [...prevRecipients];
    });
  };

  console.log('Active recipients: ', activeRecipients);

  const dialogues = dialogueData?.dialogues && dialogueData?.dialogues.map((dialogue: any) => ({ label: dialogue?.title, value: dialogue?.id }));
  const questions = questionsData?.dialogue?.questions && questionsData?.dialogue?.questions.map((question: any) => ({ label: question?.title, value: question?.id }));
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
                {activeType?.value === 'question' && (
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
                    <H4>Recipients</H4>
                    <PlusCircle onClick={addNewRecipient} />
                    {/* conditions header here */}
                  </Flex>
                  <Hr />
                  <Div marginTop={15}>
                    {activeRecipients.map((recipient, index) => (
                      <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                        <Div flexGrow={9}>
                          <Select
                            key={index}
                            options={questions}
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
                { /* recipients overview here */}
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create trigger</Button>
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

export default AddTriggerView;
