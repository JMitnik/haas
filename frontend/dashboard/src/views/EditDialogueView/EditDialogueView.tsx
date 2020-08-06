import * as yup from 'yup';
import { ApolloError, gql } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage, Stack } from '@chakra-ui/core';
import { Minus, MinusCircle, Plus, PlusCircle, Type } from 'react-feather';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import ServerError from 'components/ServerError';
import styled, { css } from 'styled-components/macro';

import { Container, Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, H2, H3, Hr, Input, InputGrid, InputHelper, Muted, Textarea } from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import editDialogueMutation from 'mutations/editDialogue';
import getQuestionnairesCustomerQuery from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';

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
  slug: yup.string().required('Slug is required'),
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
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { customerSlug, dialogueSlug } = useParams();

  const [editDialogue, { error: serverError, loading: isLoading }] = useMutation(editDialogueMutation, {
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
    form.setValue('tags', mappedTags);
  }, []);

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
    form.setValue(`tags[${index}]`, qOption?.value);
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
        <H2 color="gray.700" mb={4} py={2}>Edit dialogue</H2>
      </Div>
      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

        <FormContainer>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <ServerError serverError={serverError} />
            <FormSection id="general">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About dialogue</H3>
                <Muted color="gray.600">
                  Tell us a bit about the dialogue
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!form.errors.title}>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <InputHelper>What is the name of the dialogue?</InputHelper>
                    <Input
                      placeholder="Peaches or apples?"
                      leftEl={<Type />}
                      defaultValue={dialogue?.title}
                      name="name"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.publicTitle}>
                    <FormLabel htmlFor="publicTitle">Public title</FormLabel>
                    <InputHelper>
                      (Optional): If set, will be used instead of the actual title to the user instead.
                    </InputHelper>
                    <Input
                      placeholder="Peaches > Apples?"
                      leftEl={<Type />}
                      defaultValue={dialogue?.publicTitle}
                      name="publicTitle"
                      ref={form.register({ required: false })}
                    />
                    <FormErrorMessage>{form.errors.publicTitle?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!form.errors.description}>
                    <FormLabel htmlFor="title">Description</FormLabel>
                    <InputHelper>
                      How would you describe the dialogue?
                    </InputHelper>
                    <Textarea
                      placeholder="Describe your dialogue"
                      defaultValue={dialogue?.description}
                      name="description"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!form.errors.slug}>
                    <FormLabel htmlFor="slug">Slug</FormLabel>
                    <InputHelper>Under which url segment will visitors find the business?</InputHelper>
                    <Input
                      placeholder="peaches-or-apples"
                      leftAddOn={`https://client.haas.live/${customerSlug}`}
                      defaultValue={dialogue?.slug}
                      name="slug"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.slug?.message}</FormErrorMessage>
                  </FormControl>

                </InputGrid>
              </Div>
            </FormSection>

            <Hr />

            <FormSection id="tags">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>Tags</H3>
                <Muted color="gray.600">
                  Would you like to assign tags to associate your dialogue with?
                </Muted>
              </Div>
              <Div>
                <InputGrid gridTemplateColumns="1fr">
                  <Div>
                    <Button
                      leftIcon={Plus}
                      onClick={() => setActiveTags((prevTags) => [...prevTags, null])}
                    >
                      Add tag
                    </Button>
                  </Div>

                  <Stack>
                    {activeTags?.map((tag, index) => (
                      <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                        <Div
                          data-cy="SelectOptions"
                          flexGrow={9}
                        >
                          <Select
                            styles={form.errors.tags?.[index] && !activeTags?.[index] ? ErrorStyle : undefined}
                            id={`tags[${index}]`}
                            key={index}
                            ref={() => form.register({
                              name: `tags[${index}]`,
                              required: false,
                              minLength: 1,
                            })}
                            options={tagOptions}
                            value={tag}
                            onChange={(qOption: any) => {
                              setTags(qOption, index);
                            }}
                          />
                          <FormErrorMessage>{form.errors.tags?.[index]?.message}</FormErrorMessage>
                        </Div>
                        <Flex justifyContent="center" alignContent="center" flexGrow={1}>
                          <Button
                            size="xs"
                            variantColor="red"
                            variant="outline"
                            leftIcon={Minus}
                            onClick={() => deleteTag(index)}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </Flex>
                    ))}
                  </Stack>
                </InputGrid>

              </Div>
            </FormSection>

            <ButtonGroup>
              <Button
                isLoading={isLoading}
                isDisabled={!form.formState.isValid}
                variantColor="teal"
                type="submit"
              >
                Create
              </Button>
              <Button variant="outline" onClick={() => history.push('/')}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default EditDialogueView;
