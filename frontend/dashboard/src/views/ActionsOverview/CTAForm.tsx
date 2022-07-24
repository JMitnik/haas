import * as UI from '@haas/ui';
import * as yup from 'yup';
import {
  ButtonGroup, FormErrorMessage, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Div, Flex, Form, FormContainer,
  FormControl, FormLabel, FormSection, Input, InputGrid, InputHelper, Span, Text,
} from '@haas/ui';
import { Link, Trash, Type } from 'react-feather';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';
import Select from 'react-select';

import { MappedCTANode } from 'views/DialogueBuilderView/DialogueBuilderInterfaces';
// import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCreateCtaMutation } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import boolToInt from 'utils/booleanToNumber';
import getCTANodesQuery from 'queries/getCTANodes';
import intToBool from 'utils/intToBool';
import updateCTAMutation from 'mutations/updateCTA';

import { FormDataProps, LinkInputProps } from './CTATypes';

import FormNodeForm from './FormNodeForm';
import LinksOverview from './LinksOverview';

interface ShareProps {
  id?: string;
  title: string;
  url: string;
  tooltip: string;
}

interface CTAFormProps {
  id: string;
  title: string;
  links: Array<LinkInputProps>;
  type: { label: string, value: string };
  share: ShareProps | null;
  form: any;
  onActiveCTAChange?: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange?: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteCTA: (onComplete: (() => void) | undefined) => void | Promise<any>;
  onSuccess?: (callToAction: any) => void;
  onCancel?: () => void;
  onCTAIdFetch?: React.Dispatch<React.SetStateAction<MappedCTANode | null>>;
}

const isShareType = (ctaType: any) => ctaType?.value === 'SHARE';
const isLinkType = (ctaType: any) => ctaType?.value === 'LINK';

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.object().shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('CTA type is required'),
  links: yup.array().when('ctaType', {
    is: (ctaType: { label: string, value: string }) => !isLinkType(ctaType),
    then: yup.array().of(yup.object().shape({
      url: yup.string().required(),
      title: yup.string().required(),
      type: yup.string().notRequired(),
    })),
    otherwise: yup.array().of(yup.object().shape({
      url: yup.string().required(),
      title: yup.string().notRequired(),
      type: yup.string().required(),
    })),
  }),
  share: yup.object().when('ctaType', {
    is: (ctaType: { label: string, value: string }) => isShareType(ctaType),
    then: yup.object().shape(
      {
        id: yup.string().notRequired(),
        tooltip: yup.string().when('ctaType', {
          is: (ctaType: { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
        url: yup.string().when('ctaType', {
          is: (ctaType: { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
        title: yup.string().when('ctaType', {
          is: (ctaType: { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
      },
    ),
    otherwise: yup.object().notRequired(),
  }),
  formNode: yup.object().shape({
    fields: yup.array().of(yup.object().shape({
      label: yup.string(),
      type: yup.string(),
    })),
  }),
});

const CTA_TYPES = [
  { label: 'Form', value: 'FORM', icon: RegisterIcon },
  { label: 'Opinion', value: 'TEXTBOX', icon: OpinionIcon },
  { label: 'Register', value: 'REGISTRATION', RegisterIcon },
  { label: 'Link', value: 'LINK', LinkIcon },
  { label: 'Share', value: 'SHARE', ShareIcon },
];

export function stopPropagate(callback: () => void) {
  return (e: { preventDefault: () => void, stopPropagation: () => void }) => {
    e.stopPropagation();
    e.preventDefault();
    callback();
  };
}

const CTAForm = ({
  id,
  title,
  type,
  links,
  share,
  onSuccess,
  onCancel,
  onActiveCTAChange,
  onNewCTAChange,
  onDeleteCTA,
  onCTAIdFetch,
  form: formNode,
}: CTAFormProps) => {
  const { activeCustomer } = useCustomer();
  const { customerSlug, dialogueSlug, questionId } = useParams<
  { customerSlug: string, dialogueSlug: string, questionId?: string }
  >();

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      ctaType: type,
      share: { id: share?.id, title: share?.title, tooltip: share?.tooltip, url: share?.url },
      links: links.map((link) => ({ ...link, url: link.url, type: link.type?.value })),
      formNode: {
        id: formNode?.id,
        helperText: formNode?.helperText || '',
        fields: formNode?.fields?.map((field: any) => ({
          id: field.id,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          isRequired: boolToInt(field.isRequired),
          position: field.position,
        })),
      },
    },
  });

  const { t } = useTranslation();

  const refetchingQueries = [
    {
      query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
        searchTerm: '',
      },
    },
    // {
    //   query: getTopicBuilderQuery,
    //   variables: {
    //     customerSlug,
    //     dialogueSlug,
    //   },
    // }
  ];

  const toast = useToast();

  const [addCTA, { loading: addLoading }] = useCreateCtaMutation({
    onCompleted: (data) => {
      toast({
        title: t('cta:add_complete_title'),
        description: t('cta:add_complete_description'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      const CTA: MappedCTANode = {
        value: data?.createCTA?.id || undefined,
        label: data?.createCTA?.title || undefined,
        type: data?.createCTA?.type || undefined,
      };
      if (onCTAIdFetch) onCTAIdFetch(CTA);
      onSuccess?.(data?.createCTA);
      onNewCTAChange?.(false);
      onActiveCTAChange?.(null);
    },
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: refetchingQueries,
  });

  const [updateCTA, { loading: updateLoading }] = useMutation(updateCTAMutation, {
    onCompleted: () => {
      toast({
        title: t('cta:edit_complete_title'),
        description: t('cta:edit_complete_description'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      setTimeout(() => {
        onActiveCTAChange?.(null);
      }, 200);
    },
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: refetchingQueries,
  });

  const watchType = form.watch('ctaType');

  const onSubmit = (formData: FormDataProps) => {
    if (id === '-1') {
      const mappedLinks = {
        linkTypes: formData.links,
      };

      addCTA({
        variables: {
          input: {
            customerSlug,
            dialogueSlug,
            questionId: questionId || null,
            title: formData.title,
            type: formData.ctaType.value || undefined,
            links: mappedLinks as any, // TODO: Fix typing
            share: formData.share,
            form: {
              ...formData.formNode,
              fields: formData.formNode?.fields?.map(
                (field) => ({ ...field, isRequired: intToBool(field.isRequired) }),
              ) as any, // TODO: Fix typing
            },
          },
        },
      });
    } else {
      const mappedLinks = {
        linkTypes: formData.links,
      };
      updateCTA({
        variables: {
          input: {
            id,
            customerId: activeCustomer?.id,
            title: formData.title,
            type: formData.ctaType.value || undefined,
            links: mappedLinks,
            share: formData.share,
            form: {
              ...formData.formNode,
              fields: formData.formNode?.fields?.map(
                (field) => ({ ...field, isRequired: intToBool(field.isRequired) }),
              ),
            },
          },
        },
      });
    }
  };

  const cancelCTA = () => {
    if (id === '-1') {
      onNewCTAChange?.(false);
    }
    onActiveCTAChange?.(null);

    onCancel?.();
  };

  return (
    <FormContainer expandedForm>
      <Form onSubmit={stopPropagate(form.handleSubmit(onSubmit))}>
        <Div>
          <FormSection id="general">
            <Div>
              <UI.FormSectionHeader>{t('about_call_to_action')}</UI.FormSectionHeader>
              <UI.FormSectionHelper>{t('cta:information_header')}</UI.FormSectionHelper>
            </Div>
            <Div>
              <InputGrid>
                <FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.errors.title}>
                  <FormLabel htmlFor="title">{t('title')}</FormLabel>
                  <InputHelper>{t('cta:title_helper')}</InputHelper>
                  <Controller
                    name="title"
                    control={form.control}
                    defaultValue={title}
                    render={({ value, onChange }) => (
                      <UI.MarkdownEditor
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="ctaType">{t('cta:type')}</FormLabel>
                  <InputHelper>{t('cta:share_type_helper')}</InputHelper>

                  <Controller
                    name="ctaType"
                    control={form.control}
                    options={CTA_TYPES}
                    as={Select}
                  />

                  <FormErrorMessage>{form.errors.ctaType?.value?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>
            </Div>
          </FormSection>

          {watchType?.value === 'SHARE' && (
            <>
              <UI.Hr />
              <FormSection>
                <UI.Div>
                  <UI.FormSectionHeader>{t('cta:about_share')}</UI.FormSectionHeader>
                  <UI.FormSectionHelper>{t('cta:about_share_helper')}</UI.FormSectionHelper>
                </UI.Div>
                <UI.InputGrid>
                  <FormControl isRequired>
                    <FormLabel htmlFor="share.title">{t('cta:text')}</FormLabel>
                    <InputHelper>{t('cta:shared_item_text_helper')}</InputHelper>
                    <Input
                      name="share.title"
                      placeholder="Get a discount..."
                      leftEl={<Type />}
                      defaultValue={share?.title}
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>
                      <>
                        {form.errors.share?.title}
                      </>
                    </FormErrorMessage>
                  </FormControl>

                  {/* TODO: Change default value and error */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="share.url">{t('url')}</FormLabel>
                    <InputHelper>{t('cta:url_share_helper')}</InputHelper>
                    <Input
                      name="share.url"
                      placeholder="https://share/url"
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      leftEl={<Link />}
                      defaultValue={share?.url}
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>
                      <>
                        {form.errors.share?.url}
                      </>
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel htmlFor="share.tooltip">{t('cta:button_text')}</FormLabel>
                    <InputHelper>{t('cta:button_text_helper')}</InputHelper>
                    <Input
                      name="share.tooltip"
                      placeholder="Share..."
                      leftEl={<Type />}
                      defaultValue={share?.tooltip}
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>
                      <>
                        {form.errors.share?.tooltip}
                      </>
                    </FormErrorMessage>
                  </FormControl>
                </UI.InputGrid>
              </FormSection>
            </>
          )}

          {watchType?.value === 'LINK' && (
            <>
              <UI.Hr />
              <LinksOverview form={form} />
            </>
          )}

          {watchType.value === 'FORM' && (
            <>
              <UI.Hr />
              <FormNodeForm form={form} />
            </>
          )}
        </Div>

        <Flex justifyContent="space-between">
          <ButtonGroup>
            <UI.Button
              isLoading={addLoading || updateLoading}
              isDisabled={!form.formState.isValid}
              type="submit"
            >
              {t('save')}
            </UI.Button>
            <UI.Button variant="ghost" onClick={() => cancelCTA()}>Cancel</UI.Button>
          </ButtonGroup>
          {id !== '-1' && (
            <Span onClick={(e) => e.stopPropagation()}>
              <Popover
                usePortal
              >
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <UI.Button
                        variant="outline"
                        variantColor="red"
                        leftIcon={() => <Trash />}
                      >
                        {t('delete')}
                      </UI.Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4}>
                      <PopoverArrow />
                      <PopoverHeader>{t('delete')}</PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Text>{t('delete_cta_popover')}</Text>
                      </PopoverBody>
                      <PopoverFooter>
                        <UI.Button
                          variant="outline"
                          variantColor="red"
                          onClick={() => onDeleteCTA && onDeleteCTA(onClose)}
                        >
                          {t('delete')}
                        </UI.Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </Span>
          )}

        </Flex>
      </Form>
    </FormContainer>
  );
};

export default CTAForm;
