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

import editDialogueMutation from '../mutations/editDialogue';
import getEditDialogueQuery from '../queries/getEditDialogue';
import getQuestionnairesCustomerQuery from '../queries/getQuestionnairesCustomerQuery';

interface FormDataProps {
  title: string;
  description: string;
  publicTitle?: string;
}

interface EditTopicFormProps {
  dialogue: any;
  currentTags: Array<{label: string, value: string}>;
  tagOptions: Array<{label: string, value: string}>;
}

const EditTopicView = () => {
  const { customerId, topicId } = useParams();
  const editDialogueData = useQuery(getEditDialogueQuery, {
    variables: {
      id: topicId,
    },
  });

  const { data: tagsData, loading: tagsLoading } = useQuery(getTagsQuery, { variables: { customerId } });

  if (editDialogueData.loading || tagsLoading) return null;

  const tagOptions: Array<{label: string, value: string}> = tagsData?.tags && tagsData?.tags?.map((tag: any) => (
    { label: tag?.name, value: tag?.id }));

  const currentTags = editDialogueData.data?.dialogue?.tags
  && editDialogueData.data?.dialogue?.tags?.map((tag: any) => (
    { label: tag?.name, value: tag?.id }));

  return (
    <EditTopicForm
      dialogue={editDialogueData.data?.dialogue}
      currentTags={currentTags}
      tagOptions={tagOptions}
    />
  );
};

const EditTopicForm = ({ dialogue, currentTags, tagOptions } : EditTopicFormProps) => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId, topicId } = useParams();

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

  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>(currentTags);

  const onSubmit = (formData: FormDataProps) => {
    const tagIds = activeTags.map((tag) => tag?.value);
    const tagEntries = { entries: tagIds };
    editDialogue({
      variables: {
        dialogueId: topicId,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        tags: tagEntries,
      },
    });
  };

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
                  <StyledInput defaultValue={dialogue?.title} name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Public Title</StyledLabel>
                  <StyledInput defaultValue={dialogue?.publicTitle} name="publicTitle" ref={register({ required: true })} />
                  {errors.publicTitle && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
              </Grid>
              <Div py={4}>
                <Flex flexDirection="column">
                  <StyledLabel>Description</StyledLabel>
                  <StyledTextInput defaultValue={dialogue?.description} name="description" ref={register({ required: true })} />
                  {errors.description && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
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
                          options={tagOptions}
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
