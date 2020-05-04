import React from 'react';

import { ApolloError } from 'apollo-boost';
import styled, { css } from 'styled-components/macro';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledInput, StyledTextInput, StyledLabel, Hr } from '@haas/ui';
import getQuestionnairesCustomerQuery from '../queries/getQuestionnairesCustomerQuery';

import getEditDialogueQuery from '../queries/getEditDialogue';
import editDialogueMutation from '../mutations/editDialogue';

interface FormDataProps {
  title: string;
  description: string;
  publicTitle?: string;
}

const EditTopicView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId, topicId } = useParams();

  const editDialogueData = useQuery(getEditDialogueQuery, {
    variables: {
      id: topicId,
    },
  })

  const [editDialogue, { loading }] = useMutation(editDialogueMutation, {
    onCompleted: () => {
      history.push(`/dashboard/c/${customerId}/`);
    },
    refetchQueries: [{ query: getQuestionnairesCustomerQuery,
      variables: {
        id: customerId,
      } }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  

  if (editDialogueData.loading) return null;

  const onSubmit = (formData: FormDataProps) => {
    editDialogue({
      variables: {
        dialogueId: topicId,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Dialogue </H2>
        <Muted pb={4}>Edit a dialogue</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General dialogue information</H3>
              <Muted>
                General information about your dialogue such as title, description, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <StyledLabel>Title</StyledLabel>
                  <StyledInput defaultValue={editDialogueData.data?.dialogue?.title} name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Public Title</StyledLabel>
                  <StyledInput defaultValue={editDialogueData.data?.dialogue?.publicTitle} name="publicTitle" ref={register({ required: true })} />
                  {errors.publicTitle && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
              </Grid>
              <Div py={4}>
                <Flex flexDirection="column">
                  <StyledLabel>Description</StyledLabel>
                  <StyledTextInput defaultValue={editDialogueData.data?.dialogue?.description} name="description" ref={register({ required: true })} />
                  {errors.description && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
              </Div>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Save dialogue</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/c/${customerId}/`)}>Cancel</Button>
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

export default EditTopicView;
