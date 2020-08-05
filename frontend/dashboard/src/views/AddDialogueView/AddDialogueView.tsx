import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Button, Container, Div, ErrorStyle, Flex, Grid, H2, H3, H4,
  Hr, Label, Muted, StyledInput, StyledTextInput } from '@haas/ui';
import { MinusCircle, PlusCircle } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { createDialogue } from 'mutations/createDialogue';
import { yupResolver } from '@hookform/resolvers';
import formatServerError from 'utils/formatServerError';
import getCustomerQuery from 'queries/getCustomersQuery';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';

interface FormDataProps {
  title: string;
  publicTitle?: string;
  description: string;
  slug: string;
  contentOption: string;
  customerOption: string;
  dialogueOption: string;
  tags: Array<string>;
}

const DIALOGUE_CONTENT_TYPES = [
  { label: 'From scratch', value: 'SCRATCH' },
  { label: 'From seed', value: 'SEED' },
  { label: 'From other dialogue', value: 'TEMPLATE' },
];

const schema = yup.object().shape({
  title: yup.string().required(),
  publicTitle: yup.string().notRequired(),
  description: yup.string().required(),
  slug: yup.string().required(),
  contentOption: yup.string().required(),
  customerOption: yup.string().when(['contentOption'], {
    is: (contentOption : string) => contentOption === 'TEMPLATE',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  dialogueOption: yup.string().when(['customerOption'], {
    is: (customerOption : string) => customerOption,
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  tags: yup.array().of(yup.string().min(1).required()).notRequired(),
});

const AddDialogueView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, setValue, getValues } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });
  const { customerSlug } = useParams();
  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>([]);
  const [activeContentOption, setActiveContentOption] = useState<null | {label: string, value: string}>(null);
  const [activeCustomerTemplate, setActiveCustomerTemplate] = useState<null | {label: string, value: string}>(null);
  const [activeDialogueTemplate, setActiveDialogueTemplate] = useState<null | {label: string, value: string}>(null);
  const [fetchCustomers, { data: customerData }] = useLazyQuery(getCustomerQuery, {
    fetchPolicy: 'cache-and-network',
    onError: (error: any) => {
      console.log(error);
    },
  });

  const { data, loading: tagsLoading } = useQuery(getTagsQuery, { variables: { customerSlug } });

  const [addDialogue, { loading, error: serverError }] = useMutation(createDialogue, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/`);
    },
    refetchQueries: [
      {
        query: getDialoguesOfCustomer,
        variables: { customerSlug },
      },
    ],
    onError: (error: ApolloError) => {
      // TODO: Use toast here + Sentry or so?
      console.log(`Error Name: ${error.name} \n`);
    },
  });

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

  const onSubmit = (formData: FormDataProps) => {
    // TODO: Make better typescript supported
    const tagIds = activeTags.map((tag) => tag?.value);
    const tagEntries = { entries: tagIds };
    const contentType = activeContentOption?.value;
    const templateDialogueId = activeDialogueTemplate?.value;

    addDialogue({
      variables: {
        customerSlug,
        dialogueSlug: formData.slug,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        contentType,
        templateDialogueId,
        tags: tagEntries,
      },
    });
  };
  const handleDialogueTemplateChange = (qOption: any) => {
    setValue('dialogueOption', qOption?.value);
    setActiveDialogueTemplate(qOption);
  };

  const handleContentOptionChange = (qOption: any) => {
    setValue('contentOption', qOption?.value);
    setActiveContentOption(qOption);
    setActiveCustomerTemplate(null);
    setActiveDialogueTemplate(null);
    if (qOption.value === 'TEMPLATE') {
      fetchCustomers();
    }
  };

  const handleCustomerChange = (qOption: any) => {
    setValue('customerOption', qOption?.value);
    setActiveCustomerTemplate(qOption);
    setActiveDialogueTemplate(null);
  };

  const CUSTOMER_OPTIONS = customerData?.customers?.map(
    ({ name, id }: { name: string, id: string }) => ({ label: name, value: id }));

  const dialogueOptions = activeCustomerTemplate
    && customerData?.customers?.find(
      (customer: any) => customer.id === activeCustomerTemplate?.value)?.dialogues?.map(
        (dialogue: any) => ({ label: dialogue.title, value: dialogue.id }));

  const tags = data?.tags && data?.tags?.map((tag: any) => ({
    label: tag?.name,
    value: tag?.id,
  }));

  return (
    <Container>

      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}>Add dialogue</H2>
        <Muted pb={4}>Create a new dialogue</Muted>
      </Div>

      <Hr />

      {serverError && formatServerError(serverError.message)}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General dialogue information</H3>
              <Muted>
                General information about your dialogue, such as title, descriptions, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <Label>Title</Label>
                  <StyledInput isInvalid={!!errors.title} name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <Label>Public Title</Label>
                  <StyledInput name="publicTitle" ref={register({ required: false })} />
                  {errors.publicTitle && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Url Slug</Label>
                  <StyledInput isInvalid={!!errors.slug} name="slug" ref={register({ required: true })} />
                  {errors.slug && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Content option</Label>
                  <Select
                    styles={errors.contentOption && !activeContentOption ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'contentOption',
                      required: true,
                    })}
                    options={DIALOGUE_CONTENT_TYPES}
                    value={activeContentOption}
                    onChange={(qOption: any) => {
                      handleContentOptionChange(qOption);
                    }}
                  />
                  {errors.contentOption && !activeContentOption && <Muted color="warning">{errors.contentOption.message}</Muted>}
                </Div>
                {(activeContentOption?.value === 'TEMPLATE' && CUSTOMER_OPTIONS)
                  && (
                  <Div useFlex flexDirection="column">
                    <Label>Customer</Label>
                    <Select
                      styles={errors.customerOption && !activeCustomerTemplate ? ErrorStyle : undefined}
                      ref={() => register({
                        name: 'customerOption',
                        required: false,
                      })}
                      options={CUSTOMER_OPTIONS}
                      value={activeCustomerTemplate}
                      onChange={(qOption: any) => {
                        handleCustomerChange(qOption);
                      }}
                    />
                    {errors.customerOption && !activeCustomerTemplate && <Muted color="warning">{errors.customerOption.message}</Muted>}
                  </Div>
                  )}
                {(activeContentOption?.value === 'TEMPLATE' && dialogueOptions)
                  && (
                  <Div useFlex flexDirection="column">
                    <Label>Template dialogue</Label>
                    <Select
                      styles={errors.dialogueOption && !activeDialogueTemplate ? ErrorStyle : undefined}
                      ref={() => register({
                        name: 'dialogueOption',
                        required: false,
                      })}
                      options={dialogueOptions}
                      value={activeDialogueTemplate}
                      onChange={(qOption: any) => {
                        handleDialogueTemplateChange(qOption);
                      }}
                    />
                    {errors.dialogueOption && !activeDialogueTemplate && <Muted color="warning">{errors.dialogueOption.message}</Muted>}
                  </Div>
                  )}
                <Div gridColumn="1 / -1" py={4}>
                  <Flex flexDirection="column">
                    <Label>Description</Label>
                    <StyledTextInput isInvalid={!!errors.description} name="description" ref={register({ required: true })} />
                    {errors.description && <Muted color="warning">Something went wrong!</Muted>}
                  </Flex>
                </Div>
              </Grid>

              <Div gridColumn="1 / -1">
                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                  <H4>Tags</H4>
                  {/* TODO: Make this an actual button (better semantics), rather than asisgning it to an svg */}
                  <PlusCircle data-cy="AddTagButton" onClick={() => setActiveTags((prevTags) => [...prevTags, null])} />
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
                          options={tags}
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
          {(loading || tagsLoading) && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create dialogue</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/`)}>Cancel</Button>
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

export default AddDialogueView;
