import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage, Stack } from '@chakra-ui/core';
import { Container, Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, H2, H3, Hr, Input, InputGrid, InputHelper, Muted, Textarea } from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { Minus, Plus, Type } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';

import { createDialogue } from 'mutations/createDialogue';
import { motion } from 'framer-motion';
import { yupResolver } from '@hookform/resolvers';
import ServerError from 'components/ServerError';
import getCustomerQuery from 'queries/getCustomersQuery';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';

interface FormDataProps {
  title: string;
  publicTitle?: string;
  description: string;
  slug: string;
  contentOption: {label: string, value: string};
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
  title: yup.string().required('Title is required'),
  publicTitle: yup.string().notRequired(),
  description: yup.string().required('Description is required'),
  slug: yup.string().required('Slug is required'),
  contentOption: yup.object().shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('Content option is required'),
  customerOption: yup.string().when(['contentOption'], {
    is: (contentOption : { label: string, value: string}) => contentOption?.value === 'TEMPLATE',
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
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { customerSlug } = useParams();
  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>([]);
  const [activeContentOption, setActiveContentOption] = useState<null | {label: string, value: string}>(null);
  const [activeCustomerTemplate, setActiveCustomerTemplate] = useState<null | {label: string, value: string}>(null);
  const [activeDialogueTemplate, setActiveDialogueTemplate] = useState<null | {label: string, value: string}>(null);
  const { data: customerData } = useQuery(getCustomerQuery, {
    fetchPolicy: 'cache-and-network',
    onError: (error: any) => {
      console.log(error);
    },
  });

  const { data } = useQuery(getTagsQuery, { variables: { customerSlug } });

  const [addDialogue, { error: serverError, loading: isLoading }] = useMutation(createDialogue, {
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
    form.setValue('dialogueOption', qOption?.value);

    setActiveDialogueTemplate(qOption);
  };

  // const handleContentOptionChange = (qOption: any) => {
  //   form.setValue('contentOption', qOption?.value);

  //   setActiveContentOption(qOption);
  //   setActiveCustomerTemplate(null);
  //   setActiveDialogueTemplate(null);

  //   if (qOption.value === 'TEMPLATE') {
  //     fetchCustomers();
  //   }
  // };

  const handleCustomerChange = (qOption: any) => {
    form.setValue('customerOption', qOption?.value);

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

  const watchContentOption = form.watch('contentOption');

  console.log('Errors:', form.errors);
  console.log(form.getValues());
  console.log('content option: ', watchContentOption);

  return (
    <Container>

      <Div>
        <H2 color="gray.700" mb={4} py={2}>Add dialogue</H2>
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
                      name="title"
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
                      name="slug"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.slug?.message}</FormErrorMessage>
                  </FormControl>

                </InputGrid>
              </Div>
            </FormSection>

            <Hr />

            <FormSection id="template">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>Template</H3>
                <Muted color="gray.600">
                  Do you wish to start the dialogue from a clean slate,
                  or base this on another dialogue (or HAAS template)?
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired>
                    <FormLabel htmlFor="title">Use a template</FormLabel>
                    <InputHelper>
                      Set what type of template you would like to use.
                    </InputHelper>
                    <Controller
                      name="contentOption"
                      control={form.control}
                      as={Select}
                      options={DIALOGUE_CONTENT_TYPES}
                      defaultValue={activeContentOption}
                    />
                    <FormErrorMessage>{form.errors?.contentOption?.value?.message}</FormErrorMessage>
                  </FormControl>

                  {(watchContentOption?.value === 'TEMPLATE' && CUSTOMER_OPTIONS) && (
                    <FormControl>
                      <FormLabel>Project for templates</FormLabel>
                      <InputHelper>Pick project to take template from</InputHelper>
                      <Select
                        styles={form.errors.customerOption && !activeCustomerTemplate ? ErrorStyle : undefined}
                        ref={() => form.register({
                          name: 'customerOption',
                          required: false,
                        })}
                        options={CUSTOMER_OPTIONS}
                        value={activeCustomerTemplate}
                        onChange={(qOption: any) => {
                          handleCustomerChange(qOption);
                        }}
                      />
                      <FormErrorMessage>{form.errors.customerOption?.message}</FormErrorMessage>
                    </FormControl>
                  )}

                  {(activeContentOption?.value === 'TEMPLATE' && dialogueOptions) && (
                    <FormControl>
                      <FormLabel>Template from project</FormLabel>
                      <InputHelper>Pick template from project</InputHelper>
                      <Select
                        styles={form.errors.dialogueOption && !activeDialogueTemplate ? ErrorStyle : undefined}
                        ref={() => form.register({
                          name: 'dialogueOption',
                          required: false,
                        })}
                        options={dialogueOptions}
                        value={activeDialogueTemplate}
                        onChange={(qOption: any) => {
                          handleDialogueTemplateChange(qOption);
                        }}
                      />
                      <FormErrorMessage>{form.errors.customerOption?.message}</FormErrorMessage>
                    </FormControl>
                  )}
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
                            options={tags}
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

export default AddDialogueView;
