import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage, Stack, useToast } from '@chakra-ui/core';
import { Container, Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted, PageTitle, Textarea } from '@haas/ui';
import { Controller, useForm } from 'react-hook-form';
import { Minus, Plus, Type } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
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
  { label: 'From default template', value: 'SEED' },
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
  const toast = useToast();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { t } = useTranslation();

  const { customerSlug } = useParams();
  const [activeTags, setActiveTags] = useState<Array<null | {label: string, value: string}>>([]);
  const [activeContentOption] = useState<null | {label: string, value: string}>(null);
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
      toast({
        title: 'Dialogue created!',
        description: 'Dialogue has been created',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/`);
      }, 500);
    },
    refetchQueries: [
      {
        query: getDialoguesOfCustomer,
        variables: { customerSlug },
      },
    ],
    onError: (error: ApolloError) => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem in adding the dialogue. Please try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
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

    addDialogue({
      variables: {
        customerSlug,
        dialogueSlug: formData.slug,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        contentType: formData.contentOption.value,
        templateDialogueId: formData.dialogueOption,
        tags: tagEntries,
      },
    });
  };
  const handleDialogueTemplateChange = (qOption: any) => {
    form.setValue('dialogueOption', qOption?.value);

    setActiveDialogueTemplate(qOption);
  };

  const handleCustomerChange = (qOption: any) => {
    setActiveCustomerTemplate(qOption);
    setActiveDialogueTemplate(null);
  };

  const CUSTOMER_OPTIONS = customerData?.customers?.map(
    ({ name, id }: { name: string, id: string }) => ({ label: name, value: id }));

  const dialogueOptions = form.watch('customerOption')
    && customerData?.customers?.find(
      (customer: any) => customer.id === activeCustomerTemplate?.value)?.dialogues?.map(
        (dialogue: any) => ({ label: dialogue.title, value: dialogue.id }));

  const tags = data?.tags && data?.tags?.map((tag: any) => ({
    label: tag?.name,
    value: tag?.id,
  }));

  return (
    <Container>
      <PageTitle>{t('views:add_dialogue_view')}</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
        <FormContainer>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <ServerError serverError={serverError} />
            <FormSection id="general">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('dialogue:about')}</H3>
                <Muted color="gray.600">
                  {t('dialogue:about_helper')}
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!form.errors.title}>
                    <FormLabel htmlFor="title">{t('title')}</FormLabel>
                    <InputHelper>{t('dialogue:title_helper')}</InputHelper>
                    <Input
                      placeholder={t('dialogue:title_placeholder')}
                      leftEl={<Type />}
                      name="title"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.publicTitle}>
                    <FormLabel htmlFor="publicTitle">
                      {t('dialogue:public_title')}
                    </FormLabel>
                    <InputHelper>
                      {t('dialogue:public_title_helper')}
                    </InputHelper>
                    <Input
                      placeholder={t('dialogue:public_title_placeholder')}
                      leftEl={<Type />}
                      name="publicTitle"
                      ref={form.register({ required: false })}
                    />
                    <FormErrorMessage>{form.errors.publicTitle?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!form.errors.description}>
                    <FormLabel htmlFor="title">{t('description')}</FormLabel>
                    <InputHelper>
                      {t('dialogue:description_helper')}
                    </InputHelper>
                    <Textarea
                      placeholder="Describe your dialogue"
                      name="description"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.description?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!form.errors.slug}>
                    <FormLabel htmlFor="slug">{t('slug')}</FormLabel>
                    <InputHelper>{t('dialogue:slug_helper')}</InputHelper>
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
                <H3 color="default.text" fontWeight={500} pb={2}>{t('template')}</H3>
                <Muted color="gray.600">
                  {t('dialogue:template_helper')}
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired>
                    <FormLabel htmlFor="title">
                      {t('dialogue:use_template')}
                    </FormLabel>
                    <InputHelper>
                      {t('dialogue:use_template_helper')}
                    </InputHelper>
                    <Controller
                      name="contentOption"
                      control={form.control}
                      as={Select}
                      options={DIALOGUE_CONTENT_TYPES}
                      defaultValue={activeContentOption}
                    />
                  </FormControl>

                  {(form.watch('contentOption')?.value === 'TEMPLATE' && CUSTOMER_OPTIONS) && (
                    <FormControl>
                      <FormLabel>Project for templates</FormLabel>
                      <InputHelper>Pick project to take template from</InputHelper>
                      <Controller
                        name="customerOption"
                        control={form.control}
                        defaultValue={activeCustomerTemplate}
                        render={({ onChange, onBlur, value }) => (
                          <Select
                            options={CUSTOMER_OPTIONS}
                            onChange={(data: any) => {
                              handleCustomerChange(data);
                              onChange(data.value);
                            }}
                          />
                        )}
                      />
                      <FormErrorMessage>{form.errors.customerOption?.message}</FormErrorMessage>
                    </FormControl>
                  )}

                  {(form.watch('customerOption') && dialogueOptions) && (
                    <FormControl>
                      <FormLabel>Template from project</FormLabel>
                      <InputHelper>Pick template from project</InputHelper>
                      <Controller
                        name="dialogueOption"
                        control={form.control}
                        defaultValue={activeDialogueTemplate}
                        render={({ onChange, onBlur, value }) => (
                          <Select
                            options={dialogueOptions}
                            onChange={(data: any) => {
                              handleDialogueTemplateChange(data);
                              onChange(data.value);
                            }}
                          />
                        )}
                      />
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
                  {t('dialogue:tag_helper')}
                </Muted>
              </Div>
              <Div>
                <InputGrid gridTemplateColumns="1fr">
                  <Div>
                    <Button
                      leftIcon={Plus}
                      onClick={() => setActiveTags((prevTags) => [...prevTags, null])}
                    >
                      {t('add_tag')}
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
                            {t('remove')}
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
                {t('create')}
              </Button>
              <Button variant="outline" onClick={() => history.push('/')}>
                {t('cancel')}
              </Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </Container>
  );
};

export default AddDialogueView;
