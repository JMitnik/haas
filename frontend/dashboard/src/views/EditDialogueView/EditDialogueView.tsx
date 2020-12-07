import * as yup from 'yup';
import { Activity, Minus, Plus, Type } from 'react-feather';
import { ApolloError, gql } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage, RadioButtonGroup, Stack } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { Div, Flex, Form, FormContainer, FormControl, FormLabel, FormSection,
  H3, Hr, Input, InputGrid, InputHelper, Muted, PageTitle, RadioButton, Textarea } from '@haas/ui';
import { motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useState } from 'react';
import Select from 'react-select';

import ServerError from 'components/ServerError';
import booleanToNumber from 'utils/booleanToNumber';
import editDialogueMutation from 'mutations/editDialogue';
import getQuestionnairesCustomerQuery from 'queries/getDialoguesOfCustomer';
import getTagsQuery from 'queries/getTags';
import intToBool from 'utils/intToBool';

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
        isWithoutGenData
        wasGeneratedWithGenData
        
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
  tags: Array<{label: string, value: string}>;
  isWithoutGenData: number;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  slug: yup.string().required('Slug is required'),
  publicTitle: yup.string().notRequired(),
  description: yup.string().required(),
  tags: yup.array().of(yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required(),
  })).notRequired(),
  isWithoutGenData: yup.boolean(),
});

const EditDialogueView = () => {
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();
  const editDialogueData = useQuery(getEditDialogueQuery, {
    variables: {
      customerSlug,
      dialogueSlug,
    },
    fetchPolicy: 'network-only',
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
    defaultValues: {
      title: dialogue.title,
      description: dialogue.description,
      isWithoutGenData: booleanToNumber(dialogue.isWithoutGenData || false),
      publicTitle: dialogue.publicTitle,
      slug: dialogue.slug,
    },
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

  const onSubmit = (formData: FormDataProps) => {
    const tagIds = formData.tags?.map((tag) => tag?.value) || [];
    const tagEntries = { entries: tagIds };

    // TODO: Ensure we can edit the dialogue slug (uneditable atm)
    editDialogue({
      variables: {
        customerSlug,
        dialogueSlug,
        title: formData.title,
        publicTitle: formData.publicTitle,
        description: formData.description,
        tags: tagEntries,
        isWithoutGenData: intToBool(formData.isWithoutGenData),
      },
    });
  };

  const deleteTag = (index: number) => {
    setActiveTags((prevTags) => {
      prevTags.splice(index, 1);
      return [...prevTags];
    });
  };

  const { t } = useTranslation();

  return (
    <Div>
      <PageTitle>
        {t('views:edit_dialogue_view')}
      </PageTitle>
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
                    <FormLabel htmlFor="publicTitle">{t('dialogue:public_title')}</FormLabel>
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
                      placeholder={t('dialogue:description_placeholder')}
                      name="description"
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
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

            <FormSection id="tags">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('tags')}</H3>
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
                          <Controller
                            name={`tags[${index}]`}
                            control={form.control}
                            as={Select}
                            options={tagOptions}
                            defaultValue={tag}
                          />
                          <FormErrorMessage>{form.errors.tags?.[index]?.value?.message}</FormErrorMessage>
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

            {dialogue.wasGeneratedWithGenData && (
              <FormSection id="data">
                <Div>
                  <H3 color="default.text" fontWeight={500} pb={2}>{t('data')}</H3>
                  <Muted color="gray.600">
                    {t('dialogue:data_helper')}
                  </Muted>
                </Div>
                <Div>
                  <InputGrid gridTemplateColumns="1fr">
                    <FormControl>
                      <FormLabel>{t('dialogue:hide_fake_data')}</FormLabel>
                      <InputHelper>{t('dialogue:hide_fake_data_helper')}</InputHelper>
                      <Controller
                        name="isWithoutGenData"
                        control={form.control}
                        render={({ onChange, onBlur, value }) => (
                          <RadioButtonGroup onBlur={onBlur} value={value} onChange={onChange} display="flex">
                            <RadioButton
                              icon={Minus}
                              value={1}
                              mr={2}
                              text={(t('dialogue:hide_fake_data'))}
                              description={t('dialogue:do_hide_fake_data_helper')}
                            />
                            <RadioButton
                              icon={Activity}
                              value={0}
                              text={(t('dialogue:no_hide_fake_data'))}
                              description={t('dialogue:no_hide_fake_data_helper')}
                            />
                          </RadioButtonGroup>
                        )}
                      />
                    </FormControl>
                  </InputGrid>
                </Div>
              </FormSection>
            )}

            <ButtonGroup>
              <Button
                isLoading={isLoading}
                isDisabled={!form.formState.isValid}
                variantColor="teal"
                type="submit"
              >
                {t('save')}
              </Button>
              <Button variant="outline" onClick={() => history.goBack()}>{t('cancel')}</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </Div>
  );
};

export default EditDialogueView;
