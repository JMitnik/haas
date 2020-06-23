import { ApolloError } from 'apollo-boost';
import { Button, Container, Div, Flex, Grid, H2, H3, H4,
  Hr, Muted, StyledInput, StyledLabel, StyledTextInput } from '@haas/ui';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import getTagsQuery from 'queries/getTags';

import { createNewQuestionnaire } from '../mutations/createNewQuestionnaire';
import getQuestionnairesCustomerQuery from '../queries/getQuestionnairesCustomerQuery';

interface FormDataProps {
  title: string;
  description: string;
  publicTitle?: string;
  isSeed?: boolean;
}

const AddTopicView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId } = useParams();
  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>([]);
  const { data, loading: tagsLoading } = useQuery(getTagsQuery, { variables: { customerId } });
  const [addTopic, { loading }] = useMutation(createNewQuestionnaire, {
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

  const setTags = (qOption: { label: string, value: string }, index: number) => {
    setActiveTags((prevTags) => {
      prevTags[index] = qOption;
      return [...prevTags];
    });
  };

  const deleteTag = (index: number) => {
    setActiveTags((prevTags) => {
      prevTags.splice(index, 1);
      return [...prevTags];
    });
  };

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Make better typescript supported
    const tagIds = activeTags.map((tag) => tag?.value);
    const tagEntries = { entries: tagIds };
    addTopic({
      variables: {
        customerId,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        isSeed: formData.isSeed,
        tags: tagEntries,
      },
    });
  };

  const tags = data?.tags && data?.tags?.map((tag: any) => (
    { label: tag?.name, value: tag?.id }));
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
                <StyledInput
                  type="checkbox"
                  id="isSeed"
                  name="isSeed"
                  ref={register({ required: false })}
                />
                <label htmlFor="isSeed"> Generate template topic </label>
              </Div>
              <Div gridColumn="1 / -1">
                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                  <H4>Tags</H4>
                  <PlusCircle onClick={() => setActiveTags((prevTags) => [...prevTags, null])} />
                </Flex>
                <Hr />
                <Div marginTop={15}>
                  {activeTags?.map((tag, index) => (
                    <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                      <Div flexGrow={9}>
                        <Select
                          key={index}
                          options={tags}
                          value={tag}
                          onChange={(qOption: any) => {
                            setTags(qOption, index);
                          }}
                        />
                      </Div>
                      <Flex justifyContent="center" alignContent="center" flexGrow={1}>
                        <MinusCircle onClick={() => deleteTag(index)} />
                      </Flex>
                    </Flex>
                  ))}
                </Div>
              </Div>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {(loading || tagsLoading) && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create topic</Button>
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

export default AddTopicView;
