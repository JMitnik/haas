import * as yup from 'yup';
import { ApolloError, gql } from 'apollo-boost';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled, { css } from 'styled-components/macro';

import { Button, Div, ErrorStyle, Flex,
  Grid, H2, H3, H4, Hr, Label, Muted,
  StyledInput, StyledTextInput } from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import editDialogueMutation from 'mutations/editDialogue';
import getQuestionnairesCustomerQuery from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';

interface FormDataProps {
  title: string;
  description: string;
  publicTitle?: string;
  tags: Array<string>;
}

interface EditDialogueFormProps {
  dialogue: any;
  currentTags: Array<{label: string, value: string}>;
  tagOptions: Array<{label: string, value: string}>;
}

const getEditDialogueQuery = gql`
  query getEditDialogue($customerSlug: String!, $dialogueSlug: String!) {
    customer(slug: $customerSlug) {
      id
      dialogue(where: { slug: $dialogueSlug }) {
        id
        title
        slug
        publicTitle
        description
        
        tags {
          id
          name
          type
        }
      }
    }
  }
`;

interface FormDataProps {
  title: string;
  publicTitle?: string;
  description: string;
  slug: string;
  tags: Array<string>;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  publicTitle: yup.string().notRequired(),
  description: yup.string().required(),
  tags: yup.array().of(yup.string().min(1).required()).notRequired(),
});

const EditDialogueView = () => {
  const { customerSlug, dialogueSlug } = useParams();
  const editDialogueData = useQuery(getEditDialogueQuery, {
    variables: {
      customerSlug,
      dialogueSlug,
    },
  });

  const { data: tagsData, loading: tagsLoading } = useQuery(getTagsQuery, { variables: { customerSlug } });

  if (editDialogueData.loading || tagsLoading) return null;

  const tagOptions: Array<{label: string, value: string}> = tagsData?.tags && tagsData?.tags?.map((tag: any) => (
    { label: tag?.name, value: tag?.id }));

  const currentTags = editDialogueData.data?.customer?.dialogue?.tags
  && editDialogueData.data?.customer?.dialogue?.tags?.map((tag: any) => (
    { label: tag?.name, value: tag?.id }));

  return (
    <EditDialogueForm
      dialogue={editDialogueData.data?.customer?.dialogue}
      currentTags={currentTags}
      tagOptions={tagOptions}
    />
  );
};

const EditDialogueForm = ({ dialogue, currentTags, tagOptions } : EditDialogueFormProps) => {
  const history = useHistory();
  const { register, handleSubmit, errors, setValue, getValues } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });
  const { customerSlug, dialogueSlug } = useParams();

  const [editDialogue, { loading }] = useMutation(editDialogueMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/d`);
    },
    refetchQueries: [{ query: getQuestionnairesCustomerQuery,
      variables: {
        customerSlug,
      } }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>(currentTags);

  useEffect(() => {
    const mappedTags = currentTags.map(({ value }) => value);
    setValue('tags', mappedTags);
  }, [setValue]);

  const onSubmit = (formData: FormDataProps) => {
    const tagIds = activeTags.map((tag) => tag?.value);
    const tagEntries = { entries: tagIds };

    editDialogue({
      variables: {
        customerSlug,
        dialogueSlug,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        tags: tagEntries,
      },
    });
  };

  const setTags = (qOption: { label: string, value: string }, index: number) => {
    setValue(`tags[${index}]`, qOption?.value);
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
    <>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Dialogue </H2>
        <Muted pb={4}>Edit a dialogue</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '3fr 4fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General dialogue information</H3>
              <Muted>
                General information about your dialogue such as title, description, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <Label>Title</Label>
                  <StyledInput isInvalid={!!errors.title} defaultValue={dialogue?.title} name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">{errors.title.message}</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <Label>Public Title</Label>
                  <StyledInput
                    isInvalid={!!errors.publicTitle}
                    defaultValue={dialogue?.publicTitle}
                    name="publicTitle"
                    ref={register({ required: false })}
                  />
                  {errors.publicTitle && <Muted color="warning">{errors.publicTitle.message}</Muted>}
                </Div>
              </Grid>
              <Div py={4}>
                <Flex flexDirection="column">
                  <Label>Description</Label>
                  <StyledTextInput
                    isInvalid={!!errors.description}
                    defaultValue={dialogue?.description}
                    name="description"
                    ref={register({ required: true })}
                  />
                  {errors.description && <Muted color="warning">{errors.description.message}</Muted>}
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
                      <Div
                        data-cy="SelectOptions"
                        flexGrow={9}
                      >
                        <Select
                          styles={errors.tags?.[index] && !activeTags?.[index] ? ErrorStyle : undefined}
                          id={`tags[${index}]`}
                          key={index}
                          ref={() => register({
                            name: `tags[${index}]`,
                            required: true,
                            minLength: 1,
                          })}
                          options={tagOptions}
                          value={tag}
                          onChange={(qOption: any) => {
                            setTags(qOption, index);
                          }}
                        />
                        {errors.tags?.[index] && !activeTags?.[index] && <Muted color="warning">{errors.tags?.[index]?.message}</Muted>}
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
            <Button brand="default" type="button" onClick={() => history.goBack()}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </>
  );
};

const FormGroupContainer = styled.div`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter * 3}px;
  `}
`;

const Form = styled.form``;

export default EditDialogueView;
