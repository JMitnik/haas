import * as UI from '@haas/ui';
import * as yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Button, ButtonGroup, FormErrorMessage, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast,
} from '@chakra-ui/core';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Link, PlusCircle, Trash, Type } from 'react-feather';
import { cloneDeep } from 'lodash';
import { useMutation } from '@apollo/client';

import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import cuid from 'cuid';

import {
  Div, Flex, Form, FormContainer,
  FormControl, FormLabel, FormSection, Grid, H4, Hr, Input, InputGrid, InputHelper, Span, Text,
} from '@haas/ui';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import { useCustomer } from 'providers/CustomerProvider';
import { useUploadUpsellImageMutation } from 'types/generated-types';
import FileDropInput from 'components/FileDropInput';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import boolToInt from 'utils/booleanToNumber';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import intToBool from 'utils/intToBool';
import updateCTAMutation from 'mutations/updateCTA';

import { FormDataProps } from './CTATypes';
import FormNodeForm from './FormNodeForm';

interface LinkInputProps {
  id?: string | null;
  title: string;
  type?: { label: string, value: string } | null;
  url: string;
  iconUrl?: string;
  // tooltip?: string;
  backgroundColor?: string;
  header?: string;
  subHeader?: string;
  uploadImage?: string;
  imageUrl?: string;
  buttonText?: string;
}

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
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteCTA: (onComplete: (() => void) | undefined) => void | Promise<any>;
}

const isShareType = (ctaType: any) => ctaType?.value === 'SHARE';

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.object().shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('CTA type is required'),
  links: yup.array().when('ctaType', {
    is: (ctaType: { label: string, value: string }) => isShareType(ctaType),
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

const LINK_TYPES = [
  { label: 'SOCIAL', value: 'SOCIAL' },
  { label: 'API', value: 'API' },
  { label: 'FACEBOOK', value: 'FACEBOOK' },
  { label: 'INSTAGRAM', value: 'INSTAGRAM' },
  { label: 'LINKEDIN', value: 'LINKEDIN' },
  { label: 'TWITTER', value: 'TWITTER' },
  { label: 'WHATSAPP', value: 'WHATSAPP' },
];

const ImageUploadLogoInput = ({ onChange, value }: any) => {
  const toast = useToast();

  const [uploadFile, { loading }] = useUploadUpsellImageMutation({
    onCompleted: (result) => {
      toast({
        title: 'Uploaded!',
        description: 'File has been uploaded.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
      console.log('upload url: ', result?.uploadUpsellImage?.url);
      onChange(result?.uploadUpsellImage?.url);
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to upload file. Try again',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const onDrop = (files: File[]) => {
    if (!files.length) return;

    const [file] = files;
    uploadFile({ variables: { file } });
  };

  return (
    <>
      <FileDropInput value={value} onDrop={onDrop} isLoading={loading} />
    </>
  );
};

const CTAForm = ({
  id,
  title,
  type,
  links,
  share,
  onActiveCTAChange,
  onNewCTAChange,
  onDeleteCTA,
  form: formNode,
}: CTAFormProps) => {
  const { activeCustomer } = useCustomer();
  const { customerSlug, dialogueSlug } = useParams<{ customerSlug: string, dialogueSlug: string }>();

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

  const clonedLinks = cloneDeep(links);
  const [activeLinks, setActiveLinks] = useState<Array<LinkInputProps>>(clonedLinks);

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  // useEffect(() => {
  //   if (clonedLinks) {
  //     const mappedLinks = clonedLinks.map((link) => ({ ...link, type: link?.type?.value || '' }));
  //     form.setValue('links', mappedLinks);
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const handleMultiChange = useCallback((selectedOption: any) => {
    setActiveType(selectedOption);
  }, [setActiveType]);

  useEffect(() => {
    handleMultiChange(activeType);
  }, [activeType, handleMultiChange]);

  const addCondition = () => {
    setActiveLinks((prevLinks) => [...prevLinks, { id: cuid(), url: '', title: '' }]);
  };

  const { fields: linkFields, append, remove } = useFieldArray({
    control: form.control,
    name: 'links',
    keyName: 'fieldIndex',
  });

  const appendNewField = (): LinkInputProps => ({
    title: '',
    url: '',
    backgroundColor: '',
    buttonText: '',
    header: '',
    iconUrl: '',
    imageUrl: '',
    subHeader: '',
    type: '',
  });

  const refetchingQueries = [
    {
      query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
        searchTerm: '',
      },
    },
    {
      query: getTopicBuilderQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      },
    }];

  const toast = useToast();

  const [addCTA, { loading: addLoading }] = useMutation(createCTAMutation, {
    onCompleted: () => {
      toast({
        title: t('cta:add_complete_title'),
        description: t('cta:add_complete_description'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      onNewCTAChange(false);
      onActiveCTAChange(null);
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
        onActiveCTAChange(null);
      }, 200);
    },
    onError: (serverError: any) => {
      console.log(serverError);
    },
    refetchQueries: refetchingQueries,
  });

  const watchType = form.watch('ctaType');

  const onSubmit = (formData: FormDataProps) => {
    console.log(formData);

    if (id === '-1') {
      const mappedLinks = {
        linkTypes: activeLinks.map((link, index) => {
          const { id, ...linkData } = link;
          console.log('form data link: ', formData.links[index]);
          const { buttonText, subHeader, header, imageUrl } = formData.links[index];
          return {
            ...linkData, type: linkData.type?.value, buttonText, subHeader, header, imageUrl,
          };
        }),
      };
      console.log('CREATING');
      addCTA({
        variables: {
          input: {
            customerSlug,
            dialogueSlug,
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
    } else {
      console.log('form links: ', formData.links);
      console.log('link fields: ', linkFields);
      const mappedLinks = {
        linkTypes: formData.links.map((link) => {
          const { fieldIndex, ...linkReady } = link;
          console.log('tooltip: ', linkReady?.title);
          return ({ ...linkReady });
        }),
        // linkTypes: activeLinks.map((link, index) => {
        //   console.log('form data link: ', formData.links[index]);
        //   const { buttonText, subHeader, header, imageUrl } = formData.links[index];
        //   return {
        //     ...link, type: link.type?.value, buttonText, subHeader, header, imageUrl,
        //   };
        // }),
      };
      console.log('mapped links: ', mappedLinks);
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
      onNewCTAChange(false);
    }
    onActiveCTAChange(null);
  };

  // const handleURLChange = useCallback(debounce((newUrl: string, index: number) => {
  //   setActiveLinks((prevLinks) => {
  //     if (!prevLinks?.length) {
  //       prevLinks[0] = { title: '', url: newUrl };
  //       return [...prevLinks];
  //     }
  //     prevLinks[index].url = newUrl;
  //     return [...prevLinks];
  //   });
  // }, 250), []);

  // const handleTooltipChange = useCallback(debounce((newTooltip: string, index: number) => {
  //   setActiveLinks((prevLinks) => {
  //     if (!prevLinks?.length) {
  //       prevLinks[0] = { title: newTooltip, url: '' };
  //       return [...prevLinks];
  //     }
  //     prevLinks[index].title = newTooltip;
  //     return [...prevLinks];
  //   });
  // }, 250), []);

  // const handleIconChange = useCallback(debounce((newIcon: string, index: number) => {
  //   setActiveLinks((prevLinks) => {
  //     prevLinks[index].iconUrl = newIcon;
  //     return [...prevLinks];
  //   });
  // }, 250), []);

  // const handleBackgroundColorChange = useCallback(debounce((newColor: string, index: number) => {
  //   setActiveLinks((prevLinks) => {
  //     prevLinks[index].backgroundColor = newColor;
  //     return [...prevLinks];
  //   });
  // }, 250), []);

  // const handleLinkTypeChange = (qOption: any, index: number) => {
  //   form.setValue(`links[${index}].type`, qOption?.value);
  //   setActiveLinks((prevLinks) => {
  //     prevLinks[index].type = qOption;
  //     return [...prevLinks];
  //   });
  // };

  // const handleDeleteLink = (index: number) => {
  //   setActiveLinks((prevLinks) => {
  //     prevLinks.splice(index, 1);
  //     return [...prevLinks];
  //   });
  // };

  return (
    <FormContainer expandedForm>
      <UI.Hr />
      <Form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <FormErrorMessage>{form.errors.share?.title}</FormErrorMessage>
                  </FormControl>

                  {/* TODO: Change default value and error */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="share.url">{t('url')}</FormLabel>
                    <InputHelper>{t('cta:url_share_helper')}</InputHelper>
                    <Input
                      name="share.url"
                      placeholder="https://share/url"
                      leftEl={<Link />}
                      defaultValue={share?.url}
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.share?.url}</FormErrorMessage>
                  </FormControl>

                  {/* TODO: Change default value and error */}
                  <FormControl isRequired>
                    <FormLabel htmlFor="share.tooltip">{t('cta:button_text')}</FormLabel>
                    <InputHelper>{t('cta:button_text_helper')}</InputHelper>
                    <Input
                      name="share.tooltip"
                      placeholder="Share..."
                      leftEl={<Type />}
                      defaultValue={share?.tooltip}
                      // onChange={(e: any) => handleTooltipChange(e.currentTarget.value, 0)}
                      ref={form.register({ required: true })}
                    />
                    <FormErrorMessage>{form.errors.share?.tooltip}</FormErrorMessage>
                  </FormControl>
                </UI.InputGrid>
              </FormSection>
            </>
          )}

          {watchType?.value === 'LINK' && (
            <>
              <UI.Hr />
              <FormSection id="links">
                <Div>
                  <UI.FormSectionHeader>Links</UI.FormSectionHeader>
                  <UI.FormSectionHelper>{t('cta:link_header')}</UI.FormSectionHelper>
                </Div>
                <Div>
                  <InputGrid>
                    <Div gridColumn="1 / -1">
                      <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
                        <H4>Links</H4>
                        <Button
                          leftIcon={PlusCircle}
                          onClick={() => append(appendNewField())}
                          size="sm"
                        >
                          {t('cta:add_link')}

                        </Button>
                      </Flex>
                      <Hr />

                      <AnimatePresence>
                        {linkFields.map((link, index) => (
                          <motion.div key={(`${link.id}` || link.url)} initial={{ opacity: 1 }} exit={{ opacity: 0, x: 100 }}>
                            <Div
                              position="relative"
                              key={link.fieldIndex}
                              marginTop={15}
                              gridColumn="1 / -1"
                              bg="gray.100"
                              padding={4}
                            >
                              <Grid
                                gridGap="12px"
                                gridTemplateColumns={['1fr 1fr']}
                              >
                                <FormControl isRequired isInvalid={!!form.errors?.links?.[index]?.url}>
                                  <FormLabel htmlFor={`links[${index}].url`}>{t('cta:url')}</FormLabel>
                                  <InputHelper>{t('cta:link_url_helper')}</InputHelper>
                                  <Input
                                    name={`links[${index}].url`}
                                    defaultValue={link.url}
                                    placeholder="https://link.to/"
                                    leftEl={<Type />}
                                    // onChange={(e: any) => handleURLChange(e.currentTarget.value, index)}
                                    ref={form.register({ required: true })}
                                  />
                                  <FormErrorMessage>{!!form.errors?.links?.[index]?.url?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={!!form.errors.links?.[index]?.type}>
                                  <FormLabel htmlFor={`links[${index}].type`}>{t('cta:type')}</FormLabel>
                                  <InputHelper>{t('cta:link_type_helper')}</InputHelper>
                                  <Controller
                                    id={`link-${link.id}-${index}`}
                                    name={`links[${index}].type`}
                                    control={form.control}
                                    defaultValue={link.type}
                                    render={({ onChange, value }) => {
                                      console.log('VALUE: ', value);
                                      const data = { label: value, value: value?.value };
                                      return (
                                        <Select
                                          options={LINK_TYPES}
                                          value={data}
                                          onChange={(opt: any) => {
                                            // handleLinkTypeChange(opt, index);
                                            console.log('OPT: ', opt);
                                            onChange(opt.value);
                                          }}
                                        />
                                      );
                                    }}
                                  />
                                  <FormErrorMessage>{!!form.errors.links?.[index]?.type?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].title`}>{t('cta:link_tooltip')}</FormLabel>
                                  <InputHelper>{t('cta:link_tooltip_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.title}
                                    name={`links[${index}].title`}
                                    defaultValue={link.title}
                                    // onChange={(e: any) => handleTooltipChange(e.currentTarget.value, index)}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>{!!form.errors.links?.[index]?.title?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].iconUrl`}>{t('cta:link_icon')}</FormLabel>
                                  <InputHelper>{t('cta:link_icon_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.iconUrl}
                                    name={`links[${index}].iconUrl`}
                                    defaultValue={link.iconUrl}
                                    // onChange={(e: any) => handleIconChange(e.currentTarget.value, index)}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>{!!form.errors.links?.[index]?.iconUrl?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].backgroundColor`}>{t('cta:background_color')}</FormLabel>
                                  <InputHelper>{t('cta:background_color_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.backgroundColor}
                                    name={`links[${index}].backgroundColor`}
                                    defaultValue={link.backgroundColor}
                                    // onChange={(e: any) => handleBackgroundColorChange(e.currentTarget.value, index)}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>
                                    {!!form.errors.links?.[index]?.backgroundColor?.message}
                                  </FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].header`}>{t('cta:upsell_header')}</FormLabel>
                                  <InputHelper>{t('cta:upsell_header_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.header}
                                    name={`links[${index}].header`}
                                    defaultValue={link.header}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>
                                    {!!form.errors.links?.[index]?.header?.message}
                                  </FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].subHeader`}>{t('cta:upsell_subheader')}</FormLabel>
                                  <InputHelper>{t('cta:upsell_subheader_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.subHeader}
                                    name={`links[${index}].subHeader`}
                                    defaultValue={link.subHeader}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>
                                    {!!form.errors.links?.[index]?.subHeader?.message}
                                  </FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                  <FormLabel htmlFor={`links[${index}].buttonText`}>{t('cta:redirect_button_text')}</FormLabel>
                                  <InputHelper>{t('cta:redirect_button_text_helper')}</InputHelper>
                                  <Input
                                    isInvalid={!!form.errors.links?.[index]?.buttonText}
                                    name={`links[${index}].buttonText`}
                                    defaultValue={link.buttonText}
                                    ref={form.register({ required: false })}
                                  />
                                  <FormErrorMessage>
                                    {!!form.errors.links?.[index]?.buttonText?.message}
                                  </FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                  <FormLabel htmlFor="cloudinary">{t('logo_upload')}</FormLabel>
                                  <InputHelper>{t('logo_upload_helper')}</InputHelper>

                                  <Controller
                                    control={form.control}
                                    name={`links[${index}].imageUrl`}
                                    defaultValue={link.imageUrl}
                                    render={({ onChange, value }) => (
                                      <ImageUploadLogoInput
                                        value={value}
                                        onChange={onChange}
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                              <Button
                                mt={4}
                                variant="outline"
                                size="sm"
                                variantColor="red"
                                onClick={() => {
                                  // handleDeleteLink(index)
                                  remove(index);
                                }}
                              >
                                {t('cta:delete_link')}
                              </Button>
                            </Div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </Div>
                  </InputGrid>
                </Div>
              </FormSection>
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
            <Button
              isLoading={addLoading || updateLoading}
              isDisabled={!form.formState.isValid}
              variantColor="teal"
              type="submit"
            >
              {t('save')}
            </Button>
            <Button variant="ghost" onClick={() => cancelCTA()}>Cancel</Button>
          </ButtonGroup>
          <Span onClick={(e) => e.stopPropagation()}>
            <Popover
              usePortal
            >
              {({ onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      variantColor="red"
                      leftIcon={Trash}
                    >
                      {t('delete')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent zIndex={4}>
                    <PopoverArrow />
                    <PopoverHeader>{t('delete')}</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Text>{t('delete_cta_popover')}</Text>
                    </PopoverBody>
                    <PopoverFooter>
                      <Button
                        variant="outline"
                        variantColor="red"
                        onClick={() => onDeleteCTA && onDeleteCTA(onClose)}
                      >
                        {t('delete')}
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </Span>
        </Flex>
      </Form>
    </FormContainer>
  );
};

export default CTAForm;
