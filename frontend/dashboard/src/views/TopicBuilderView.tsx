import React from 'react';

import { gql, ApolloError } from 'apollo-boost';
import styled, { css } from 'styled-components/macro';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { Container, Flex, Grid, H2, H3, Muted, Button, Div } from '@haas/ui';
// import { getCustomerQuery } from '../queries/getCustomerQuery';
import { getQuestionnairesCustomerQuery } from '../queries/getQuestionnairesCustomerQuery'
import { createNewQuestionnaire } from '../mutations/createNewQuestionnaire';

export const AddTopicMutation = gql`
  mutation AddTopic($data: TopicCreateInput!) {
    createTopic(data: $data) {
      title
    }
  }
`;

interface FormDataProps {
  title: String;
  description: String;
  publicTitle?: String;
  isSeed?: Boolean;
}

const TopicBuilderView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId } = useParams();

  const [addTopic, { loading }] = useMutation(createNewQuestionnaire, {
    onCompleted: () => {
      console.log('Added a topic!');
      history.push(`/c/${customerId}/`);
    },
    refetchQueries: [{ query: getQuestionnairesCustomerQuery,
      variables: {
        id: customerId,
      } }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Make better typescript supported
    addTopic({
      variables: {
        customerId,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        isSeed: formData.isSeed,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Topic Builder </H2>
        <Muted pb={4}>Create a new topic</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General topic information</H3>
              <Muted>
                General information about your project, such as title, descriptions, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <StyledLabel>Title</StyledLabel>
                  <StyledInput name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Public Title</StyledLabel>
                  <StyledInput name="publicTitle" ref={register({ required: true })} />
                  {errors.publicTitle && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
              </Grid>
              <Div py={4}>
                <Flex flexDirection="column">
                  <StyledLabel>Description</StyledLabel>
                  <StyledTextInput name="description" ref={register({ required: true })} />
                  {errors.description && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
              </Div>
              <Div py={4}>
                <StyledInput type="checkbox" id="isSeed" name="isSeed" ref={register({ required: false })} />
                <label htmlFor="isSeed"> Generate template topic </label>
              </Div>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create topic</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/c/${customerId}/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

const StyledLabel = styled(Div).attrs({ as: 'label' })`
  ${({ theme }) => css`
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 2px;
    display: inline-block;
    color: ${theme.colors.default.dark}
    text-transform: uppercase;
  `}
`;

const StyledInput = styled.input`
  ${({ theme }) => css`
    border-radius: ${theme.borderRadiuses.sm};
    background: ${theme.colors.white};
    border: none;
    border-bottom: ${theme.colors.default.normal} 1px solid;
    box-shadow: none;
    background: white;
    border-radius: 3px;

    /* Make somehow a color */
    border: 1px solid #dbdde0;
    box-shadow: none;

    /* Set to variable */
    padding: 15px;
  `}
`;

const StyledTextInput = styled(StyledInput).attrs({ as: 'textarea' })`
  resize: none;
  min-height: 150px;
`;

const Hr = styled.hr`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.default.light};
  `}
`;

const FormGroupContainer = styled.div`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter * 3}px;
  `}
`;

const Form = styled.form``;

export default TopicBuilderView;
