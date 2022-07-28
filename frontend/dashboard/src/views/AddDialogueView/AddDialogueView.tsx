import * as UI from '@haas/ui';
import * as yup from 'yup';
import { ButtonGroup, FormErrorMessage, Stack, useToast } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Div, ErrorStyle, Flex, Form, FormContainer, FormControl, FormLabel,
  FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted, Textarea,
} from '@haas/ui';
import { Minus, Plus, Type } from 'react-feather';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { getCustomers as CustomerData } from 'queries/__generated__/getCustomers';
import { MATCH_URL_EXTENSION_FORMAT } from 'utils/validationHelpers';
import { createDialogue } from 'mutations/createDialogue';
import { motion } from 'framer-motion';
import { useUser } from 'providers/UserProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import ServerError from 'components/ServerError';
import getCustomersOfUser from 'queries/getCustomersOfUser';
import getDialoguesOfCustomer from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';

const DIALOGUE_CONTENT_TYPES = [
  { label: 'From scratch', value: 'SCRATCH' },
  { label: 'From default template', value: 'SEED' },
  { label: 'From other dialogue', value: 'TEMPLATE' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'ENGLISH' },
  { label: 'Dutch', value: 'DUTCH' },
  { label: 'German', value: 'GERMAN' },
];

const schema = yup.object({
  title: yup.string().required('Title is required'),
  publicTitle: yup.string().notRequired(),
  description: yup.string().required('Description is required'),
  slug: yup
    .string()
    .matches(MATCH_URL_EXTENSION_FORMAT, { message: 'validation:url_extension_format_not_supported' })
    .required('validation:field_required'),
  languageOption: yup.object().nullable(true).shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('Content option is required'),
  contentOption: yup.object().nullable(true).shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('Content option is required'),
  customerOption: yup.object().required().nullable(true).shape({
    label: yup.string().ensure(),
    value: yup.string(),
  })
    .when(['contentOption'], {
      is: (contentOption: { label: string, value: string } | undefined) => contentOption?.value === 'TEMPLATE',
      then: () => yup.object().required(),
      otherwise: () => yup.object().notRequired(),
    }),
  dialogueOption: yup.object().shape({
    label: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).nullable(true)
    .when(['customerOption'], {
      is: (
        customerOption: { label: string, value: string } | undefined,
      ) => typeof customerOption?.value !== 'undefined',
      then: yup.object().required().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      }),
      otherwise: yup.object().notRequired().shape({
        label: yup.string().notRequired(),
        value: yup.string().notRequired(),
      }).nullable(true),
    }),
  tags: yup.array().of(yup.string().min(1).required()).notRequired(),
  isWithoutGenData: yup.number(),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

const AddDialogueView = () => {
  const { user } = useUser();
  const { customerSlug } = useParams<{ customerSlug: string }>();

  const history = useHistory();
  const toast = useToast();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      dialogueOption: null,
    },
  });

  const { t } = useTranslation();

  const [activeTags, setActiveTags] = useState<Array<null | { label: string, value: string }>>([]);
  const { data: customerData } = useQuery<CustomerData>(getCustomersOfUser, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: user?.id,
    },
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
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'There was a problem in adding the dialogue. Please try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const setTags = (qOption: { label: string, value: string }, index: number) => {
    form.setValue(`tags.${index}`, qOption?.value);
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
    const tagIds = activeTags.map((tag) => tag?.value);
    const tagEntries = { entries: tagIds };

    addDialogue({
      variables: {
        input: {
          customerSlug,
          language: formData.languageOption.value,
          dialogueSlug: formData.slug,
          title: formData.title,
          publicTitle: formData.publicTitle,
          description: formData.description,
          contentType: formData.contentOption.value,
          templateDialogueId: formData.dialogueOption?.value,
          tags: tagEntries,
        },
      },
    });
  };

  const contentOption = form.watch('contentOption');
  const customerOption = form.watch('customerOption');
  const { setValue } = form;

  useEffect(() => {
    setValue('dialogueOption', null, { shouldValidate: true });
  }, [customerOption, setValue]);

  const customerOptions = customerData?.user?.customers?.map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));

  const selectedCustomer = customerData?.user?.customers?.find((customer) => {
    if (customer.id === customerOption?.value) return true;

    return false;
  });

  const dialogues = selectedCustomer?.dialogues?.map((dialogue) => ({
    label: dialogue.title,
    value: dialogue.id,
  })) || [];

  const tags = data?.tags && data?.tags?.map((tag: any) => ({
    label: tag?.name,
    value: tag?.id,
  }));

  return (
    <>
      <UI.ViewHead>
        <UI.DeprecatedViewTitle>{t('views:add_dialogue_view')}</UI.DeprecatedViewTitle>
      </UI.ViewHead>

      <UI.ViewBody>
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
                    <FormControl isRequired isInvalid={!!form.formState.errors.title}>
                      <FormLabel htmlFor="title">{t('title')}</FormLabel>
                      <InputHelper>{t('dialogue:title_helper')}</InputHelper>
                      <Input
                        placeholder={t('dialogue:title_placeholder')}
                        leftEl={<Type />}
                        {...form.register('title', { required: true })}
                      />
                      <UI.ErrorMessage>{t(form.formState.errors.title?.message || '')}</UI.ErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!form.formState.errors.publicTitle}>
                      <FormLabel htmlFor="publicTitle">
                        {t('dialogue:public_title')}
                      </FormLabel>
                      <InputHelper>
                        {t('dialogue:public_title_helper')}
                      </InputHelper>
                      <Input
                        placeholder={t('dialogue:public_title_placeholder')}
                        leftEl={<Type />}
                        {...form.register('publicTitle', { required: false })}
                      />
                      <FormErrorMessage>{form.formState.errors.publicTitle?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel htmlFor="languageOption">
                        {t('language')}
                      </FormLabel>
                      <InputHelper>
                        {t('dialogue:language_helper')}
                      </InputHelper>
                      <Controller
                        name="languageOption"
                        control={form.control}
                        defaultValue={{ label: 'English', value: 'ENGLISH' }}
                        render={({ field }) => (
                          <Select
                            options={LANGUAGE_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>

                    <FormControl isRequired isInvalid={!!form.formState.errors.description}>
                      <FormLabel htmlFor="title">{t('description')}</FormLabel>
                      <InputHelper>
                        {t('dialogue:description_helper')}
                      </InputHelper>
                      <Textarea
                        placeholder="Describe your dialogue"
                        {...form.register('description', { required: true })}
                      />
                      <UI.ErrorMessage>{t(form.formState.errors.description?.message || '')}</UI.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!form.formState.errors.slug}>
                      <FormLabel htmlFor="slug">{t('slug')}</FormLabel>
                      <InputHelper>{t('dialogue:slug_helper')}</InputHelper>
                      <Input
                        placeholder="peaches-or-apples"
                        leftAddOn={`https://client.haas.live/${customerSlug}/`}
                        {...form.register('slug', { required: true })}
                      />
                      <UI.ErrorMessage>{t(form.formState.errors.slug?.message || '')}</UI.ErrorMessage>
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
                        defaultValue={{ label: 'From default template', value: 'SEED' }}
                        render={({ field }) => (
                          <Select
                            options={DIALOGUE_CONTENT_TYPES}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </FormControl>

                    {(contentOption?.value === 'TEMPLATE' && customerOptions) && (
                      <FormControl>
                        <FormLabel>Project for templates</FormLabel>
                        <InputHelper>Pick project to take template from</InputHelper>
                        <Controller
                          name="customerOption"
                          control={form.control}
                          defaultValue={null}
                          render={({ field }) => (
                            <Select
                              options={customerOptions}
                              value={field.value as any}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </FormControl>
                    )}

                    {(customerOption && dialogues && (
                      <FormControl>
                        <FormLabel>Template from project</FormLabel>
                        <InputHelper>Pick template from project</InputHelper>
                        <Controller
                          name="dialogueOption"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              options={dialogues}
                              onChange={field.onChange}
                              value={field.value as any}
                            />
                          )}
                        />
                      </FormControl>
                    ))}
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
                      <UI.Button
                        leftIcon={() => <Plus />}
                        onClick={() => setActiveTags((prevTags) => [...prevTags, null])}
                      >
                        {t('add_tag')}
                      </UI.Button>
                    </Div>

                    <Stack>
                      {activeTags?.map((tag, index) => (
                        <Flex marginBottom="4px" alignItems="center" key={index} gridColumn="1 / -1">
                          <Div
                            data-cy="SelectOptions"
                            flexGrow={9}
                          >
                            <Select
                              styles={form.formState.errors.tags?.[index]
                                && !activeTags?.[index] ? ErrorStyle : undefined}
                              id={`tags[${index}]`}
                              key={index}
                              {...form.register(`tags.${index}`, {
                                required: false,
                                minLength: 1,
                              })}
                              options={tags}
                              value={tag}
                              onChange={(qOption: any) => {
                                setTags(qOption, index);
                              }}
                            />
                            <FormErrorMessage>{form.formState.errors.tags?.[index]?.message}</FormErrorMessage>
                          </Div>
                          <Flex justifyContent="center" alignContent="center" flexGrow={1}>
                            <UI.Button
                              size="xs"
                              variantColor="red"
                              variant="outline"
                              leftIcon={() => <Minus />}
                              onClick={() => deleteTag(index)}
                            >
                              {t('remove')}
                            </UI.Button>
                          </Flex>
                        </Flex>
                      ))}
                    </Stack>
                  </InputGrid>

                </Div>
              </FormSection>

              <ButtonGroup display="flex">
                <UI.Button
                  isDisabled={!form.formState.isValid}
                  isLoading={isLoading}
                  variantColor="teal"
                  type="submit"
                >
                  {t('create')}
                </UI.Button>
                <UI.Button variant="outline" onClick={() => history.goBack()}>
                  {t('cancel')}
                </UI.Button>
              </ButtonGroup>
            </Form>
          </FormContainer>
        </motion.div>
      </UI.ViewBody>
    </>
  );
};

export default AddDialogueView;
