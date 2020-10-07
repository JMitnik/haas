import * as yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import { ApolloError, ExecutionResult } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useToast } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { Link, PlusCircle, Trash, Type } from 'react-feather';
import { cloneDeep, debounce } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import cuid from 'cuid';

import { Div, Flex, Form, FormContainer,
  FormControl, FormLabel, FormSection, Grid, H3, H4, Hr, Input, InputGrid, InputHelper, Muted, Span, Text } from '@haas/ui';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';

import { useCustomer } from 'providers/CustomerProvider';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import updateCTAMutation from 'mutations/updateCTA';

interface FormDataProps {
  title: string;
  ctaType: { label: string, value: string };
  links: Array<{id?: string | null;
    title: string;
    type?: string;
    url: string;
    tooltip?: string;
    iconUrl?: string;
    backgroundColor?: string;}>;
  share: { id?: string, tooltip: string, url: string, title: string };
}

interface LinkInputProps {
  id?: string | null;
  title: string;
  type?: { label: string, value: string };
  url: string;
  iconUrl?: string;
  tooltip?: string;
  backgroundColor?: string;
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
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteCTA: (onComplete: (() => void) | undefined) => void | Promise<ExecutionResult<any>>
}

const isShareType = (ctaType: any) => ctaType?.value === 'SHARE';

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.object().shape(
    { label: yup.string().required(), value: yup.string().required() },
  ).required('CTA type is required'),
  links: yup.array().when('ctaType', {
    is: (ctaType : { label: string, value: string }) => isShareType(ctaType),
    then: yup.array().of(yup.object().shape({
      url: yup.string().required(),
      tooltip: yup.string().required(),
      type: yup.string().notRequired(),
    })),
    otherwise: yup.array().of(yup.object().shape({
      url: yup.string().required(),
      tooltip: yup.string().notRequired(),
      type: yup.string().required(),
    })),
  }),
  share: yup.object().when('ctaType', {
    is: (ctaType : { label: string, value: string }) => isShareType(ctaType),
    then: yup.object().shape(
      {
        id: yup.string().notRequired(),
        tooltip: yup.string().when('ctaType', {
          is: (ctaType : { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
        url: yup.string().when('ctaType', {
          is: (ctaType : { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
        title: yup.string().when('ctaType', {
          is: (ctaType : { label: string, value: string }) => isShareType(ctaType),
          then: yup.string().required(),
          otherwise: yup.string().notRequired(),
        }),
      },
    ),
    otherwise: yup.object().notRequired(),
  }),
});

const CTA_TYPES = [
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
];

const CTAForm = ({ id, title, type, links, share, onActiveCTAChange, onNewCTAChange, onDeleteCTA }: CTAFormProps) => {
  const { activeCustomer } = useCustomer();
  const { customerSlug, dialogueSlug } = useParams();

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      ctaType: type,
      share: { id: share?.id, title: share?.title, tooltip: share?.tooltip, url: share?.url },
    },
  });

  const { t } = useTranslation();

  const clonedLinks = cloneDeep(links);
  const [activeLinks, setActiveLinks] = useState<Array<LinkInputProps>>(clonedLinks);

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  useEffect(() => {
    if (clonedLinks) {
      const mappedLinks = clonedLinks.map((link) => ({ ...link, type: link?.type?.value || '' }));
      form.setValue('links', mappedLinks);
    }
    // eslint-disable-next-line
  }, []);

  const handleMultiChange = useCallback((selectedOption: any) => {
    setActiveType(selectedOption);
  }, [setActiveType]);

  useEffect(() => {
    handleMultiChange(activeType);
  }, [activeType, handleMultiChange]);

  const addCondition = () => {
    setActiveLinks((prevLinks) => [...prevLinks, { id: cuid(), url: '', title: '' }]);
  };

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
    onError: (serverError: ApolloError) => {
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
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: refetchingQueries,
  });

  const watchType = form.watch('ctaType');

  const onSubmit = (formData: FormDataProps) => {
    if (id === '-1') {
      const mappedLinks = { linkTypes: activeLinks.map((link) => {
        const { id, ...linkData } = link;
        return { ...linkData, type: linkData.type?.value };
      }) };

      addCTA({
        variables: {
          input: {
            customerSlug,
            dialogueSlug,
            title: formData.title,
            type: formData.ctaType.value || undefined,
            links: mappedLinks,
            share: formData.share,
          },
        },
      });
    } else {
      const mappedLinks = { linkTypes: activeLinks.map((link) => ({ ...link, type: link.type?.value })) };
      updateCTA({
        variables: {
          input: {
            id,
            customerId: activeCustomer?.id,
            title: formData.title,
            type: formData.ctaType.value || undefined,
            links: mappedLinks,
            share: formData.share,
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

  const handleURLChange = useCallback(debounce((newUrl: string, index: number) => {
    setActiveLinks((prevLinks) => {
      if (!prevLinks?.length) {
        prevLinks[0] = { title: '', url: newUrl };
        return [...prevLinks];
      }
      prevLinks[index].url = newUrl;
      return [...prevLinks];
    });
  }, 250), []);

  const handleTooltipChange = useCallback(debounce((newTooltip: string, index: number) => {
    setActiveLinks((prevLinks) => {
      if (!prevLinks?.length) {
        prevLinks[0] = { title: newTooltip, url: '' };
        return [...prevLinks];
      }
      prevLinks[index].title = newTooltip;
      return [...prevLinks];
    });
  }, 250), []);

  const handleIconChange = useCallback(debounce((newIcon: string, index: number) => {
    setActiveLinks((prevLinks) => {
      prevLinks[index].iconUrl = newIcon;
      return [...prevLinks];
    });
  }, 250), []);

  const handleBackgroundColorChange = useCallback(debounce((newColor: string, index: number) => {
    setActiveLinks((prevLinks) => {
      prevLinks[index].backgroundColor = newColor;
      return [...prevLinks];
    });
  }, 250), []);

  const handleLinkTypeChange = (qOption: any, index: number) => {
    form.setValue(`links[${index}].type`, qOption?.value);
    setActiveLinks((prevLinks) => {
      prevLinks[index].type = qOption;
      return [...prevLinks];
    });
  };

  const handleDeleteLink = (index: number) => {
    setActiveLinks((prevLinks) => {
      prevLinks.splice(index, 1);
      return [...prevLinks];
    });
  };

  return (
    <FormContainer expandedForm>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Div py={4}>
          <FormSection id="general">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Call to action</H3>
              <Muted color="gray.600">
                {t('cta:information_header')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl gridColumn="1 / -1" isRequired isInvalid={!!form.errors.title}>
                  <FormLabel htmlFor="title">{t('title')}</FormLabel>
                  <InputHelper>{t('cta:title_helper')}</InputHelper>
                  <Input
                    name="title"
                    placeholder="Thank you for..."
                    leftEl={<Type />}
                    defaultValue={title}
                    ref={form.register({ required: true })}
                  />
                  <FormErrorMessage>{form.errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="ctaType">{t('cta:type')}</FormLabel>
                  <InputHelper>{t('cta:share_type_helper')}</InputHelper>
                  <Controller
                    name="ctaType"
                    control={form.control}
                    as={<Select />}
                    options={CTA_TYPES}
                    // defaultValue={activeType}
                  />
                  <FormErrorMessage>{form.errors.ctaType?.value?.message}</FormErrorMessage>
                </FormControl>

                {watchType?.value === 'SHARE' && (
                  <>
                    <FormControl isRequired>
                      <FormLabel htmlFor="share.title">{t('general:title')}</FormLabel>
                      <InputHelper>{t('cta:shared_item_title_helper')}</InputHelper>
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
                  </>

          )}

              </InputGrid>
            </Div>
          </FormSection>

          {watchType?.value === 'LINK' && (
          <FormSection id="links">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Links</H3>
              <Muted color="gray.600">
                {t('cta:link_header')}
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <Div gridColumn="1 / -1">
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
                    <H4>Links</H4>
                    <Button leftIcon={PlusCircle} onClick={addCondition} size="sm">{t('cta:add_link')}</Button>
                  </Flex>
                  <Hr />

                  <AnimatePresence>
                    {activeLinks.map((link, index) => (
                      <motion.div key={(`${link.id}` || link.url)} initial={{ opacity: 1 }} exit={{ opacity: 0, x: 100 }}>
                        <Div
                          position="relative"
                          key={index}
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
                                onChange={(e: any) => handleURLChange(e.currentTarget.value, index)}
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
                                render={({ onChange }) => (
                                  <Select
                                    options={LINK_TYPES}
                                    value={link.type}
                                    onChange={(opt: any) => {
                                      handleLinkTypeChange(opt, index);
                                      onChange(opt.value);
                                    }}
                                  />
                                )}
                              />
                              <FormErrorMessage>{!!form.errors.links?.[index]?.type}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].tooltip`}>{t('cta:tooltip')}</FormLabel>
                              <InputHelper>{t('cta:link_tooltip_helper')}</InputHelper>
                              <Input
                                isInvalid={!!form.errors.links?.[index]?.tooltip}
                                name={`links[${index}].tooltip`}
                                defaultValue={link.title}
                                onChange={(e:any) => handleTooltipChange(e.currentTarget.value, index)}
                                ref={form.register({ required: false })}
                              />
                              <FormErrorMessage>{!!form.errors.links?.[index]?.tooltip}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].iconUrl`}>{t('cta:link_icon')}</FormLabel>
                              <InputHelper>{t('cta:link_icon_helper')}</InputHelper>
                              <Input
                                isInvalid={!!form.errors.links?.[index]?.iconUrl}
                                name={`links[${index}].iconUrl`}
                                defaultValue={link.iconUrl}
                                onChange={(e:any) => handleIconChange(e.currentTarget.value, index)}
                                ref={form.register({ required: false })}
                              />
                              <FormErrorMessage>{!!form.errors.links?.[index]?.iconUrl}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].backgroundColor`}>{t('cta:background_color')}</FormLabel>
                              <InputHelper>{t('cta:background_color_helper')}</InputHelper>
                              <Input
                                isInvalid={!!form.errors.links?.[index]?.backgroundColor}
                                name={`links[${index}].backgroundColor`}
                                defaultValue={link.backgroundColor}
                                onChange={(e:any) => handleBackgroundColorChange(e.currentTarget.value, index)}
                                ref={form.register({ required: false })}
                              />
                              <FormErrorMessage>{!!form.errors.links?.[index]?.backgroundColor}</FormErrorMessage>
                            </FormControl>

                          </Grid>
                          <Button
                            mt={4}
                            variant="outline"
                            size="sm"
                            variantColor="red"
                            onClick={() => handleDeleteLink(index)}
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
          )}
        </Div>

        <Flex justifyContent="space-between">
          <ButtonGroup>
            <Button
              isLoading={addLoading || updateLoading}
              // isDisabled={!form.formState.isValid}
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
