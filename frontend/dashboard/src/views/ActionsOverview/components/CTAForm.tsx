import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { Div, ErrorStyle, Flex, Form, FormContainer, FormControl,
  FormGroupContainer, FormLabel, FormSection, Grid, H3, H4, Hr, Input, InputGrid, InputHelper, Label, Muted } from '@haas/ui';
import { PlusCircle, Trash, Type, X } from 'react-feather';
import { cloneDeep, debounce } from 'lodash';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import updateCTAMutation from 'mutations/updateCTA';

import { AnimatePresence, motion } from 'framer-motion';
import { Button, ButtonGroup, FormErrorMessage, useToast } from '@chakra-ui/core';
import DeleteLinkSesctionButton from './DeleteLinkSectionButton';
import LinkIcon from 'components/Icons/LinkIcon';
import OpinionIcon from 'components/Icons/OpinionIcon';
import RegisterIcon from 'components/Icons/RegisterIcon';

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

interface CTAFormProps {
  id: string;
  title: string;
  links: Array<LinkInputProps>;
  type: { label: string, value: string };
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
  onNewCTAChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.object().shape({ label: yup.string().required(), value: yup.string().required() }).required(),
  links: yup.array().of(
    yup.object().shape({
      url: yup.string().required(),
      type: yup.string().required(),
    }),
  ),
});

const CTA_TYPES = [
  { label: 'Opinion', value: 'TEXTBOX', icon: OpinionIcon },
  { label: 'Register', value: 'REGISTRATION', RegisterIcon },
  { label: 'Link', value: 'LINK', LinkIcon },
];

const LINK_TYPES = [
  { label: 'SOCIAL', value: 'SOCIAL' },
  { label: 'API', value: 'API' },
  { label: 'FACEBOOK', value: 'FACEBOOK' },
  { label: 'INSTAGRAM', value: 'INSTAGRAM' },
  { label: 'LINKEDIN', value: 'LINKEDIN' },
  { label: 'TWITTER', value: 'TWITTER' },
];

const CTAForm = ({ id, title, type, links, onActiveCTAChange, onNewCTAChange }: CTAFormProps) => {
  const { customerSlug, dialogueSlug } = useParams();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      ctaType: type,
    },
  });

  const clonedLinks = cloneDeep(links);
  const [activeLinks, setActiveLinks] = useState<Array<LinkInputProps>>(clonedLinks);

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  useEffect(() => {
    // form.setValue('ctaType', type?.value);
    const mappedLinks = clonedLinks.map((link) => ({ ...link, type: link?.type?.value || '' }));
    form.setValue('links', mappedLinks);
  }, []);

  const handleMultiChange = useCallback((selectedOption: any) => {
    // form.setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  }, [setActiveType]);

  useEffect(() => {
    handleMultiChange(activeType);
  }, [activeType, handleMultiChange]);

  const addCondition = () => {
    setActiveLinks((prevLinks) => [...prevLinks, { id: null, url: '', title: '' }]);
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
        title: 'Added!',
        description: 'The call to action has been created.',
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
        title: 'Edit complete!',
        description: 'The call to action has been edited.',
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
          customerSlug,
          dialogueSlug,
          title: formData.title,
          type: formData.ctaType.value || undefined,
          links: mappedLinks,
        },
      });
    } else {
      const mappedLinks = { linkTypes: activeLinks.map((link) => ({ ...link, type: link.type?.value })) };
      updateCTA({
        variables: {
          id,
          title: formData.title,
          type: formData.ctaType.value || undefined,
          links: mappedLinks,
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
      prevLinks[index].url = newUrl;
      return [...prevLinks];
    });
  }, 250), []);

  const handleTooltipChange = useCallback(debounce((newTooltip: string, index: number) => {
    setActiveLinks((prevLinks) => {
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

  console.log('values: ', form.getValues());
  console.log('watch: ', watchType);

  return (
    <FormContainer expandedForm>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Div py={4}>
          <FormSection id="general">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Call to action</H3>
              <Muted color="gray.600">
                Information about your CTA
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <FormControl isRequired isInvalid={!!form.errors.title}>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <InputHelper>What is the main text of the CTA?</InputHelper>
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
                  <FormLabel htmlFor="ctaType">Type</FormLabel>
                  <InputHelper>What is the type of the CTA?</InputHelper>
                  <Controller
                    name="ctaType"
                    control={form.control}
                    as={<Select styles={form.errors.ctaType && !activeType ? ErrorStyle : undefined} />}
                    options={CTA_TYPES}
                    defaultValue={activeType}
                  />
                  <FormErrorMessage>{form.errors.ctaType?.value?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>
            </Div>
          </FormSection>
          {watchType?.value === 'LINK' && (
          <FormSection id="links">
            <Div>
              <H3 color="default.text" fontWeight={500} pb={2}>Links</H3>
              <Muted color="gray.600">
                What links do you want to add to the CTA?
              </Muted>
            </Div>
            <Div>
              <InputGrid>
                <Div gridColumn="1 / -1">
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
                    <H4>Links</H4>
                    <Button leftIcon={PlusCircle} onClick={addCondition} size="sm">Add link</Button>
                  </Flex>
                  <Hr />

                  <AnimatePresence>
                    {activeLinks.map((link, index) => (
                      <motion.div key={(link.id || link.title)} initial={{ opacity: 1 }} exit={{ opacity: 0, x: 100 }}>
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
                              <FormLabel htmlFor={`links[${index}].url`}>Url</FormLabel>
                              <InputHelper>What is the url the link should lead to?</InputHelper>
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
                              <FormLabel htmlFor={`links[${index}].type`}>Type</FormLabel>
                              <InputHelper>What is the type of the link?</InputHelper>
                              <Select
                                styles={form.errors.links?.[index]?.type && !activeLinks?.[index]?.type ? ErrorStyle : undefined}
                                ref={() => form.register({
                                  name: `links[${index}].type`,
                                  required: true,
                                })}
                                options={LINK_TYPES}
                                value={link.type}
                                onChange={(qOption: any) => {
                                  handleLinkTypeChange(qOption, index);
                                }}
                              />
                              <FormErrorMessage>{!!form.errors.links?.[index]?.type}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor={`links[${index}].tooltip`}>Tooltip</FormLabel>
                              <InputHelper>What is the text when hovering over the link?</InputHelper>
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
                              <FormLabel htmlFor={`links[${index}].iconUrl`}>Icon</FormLabel>
                              <InputHelper>What icon is displayed for the link?</InputHelper>
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
                              <FormLabel htmlFor={`links[${index}].backgroundColor`}>Background color</FormLabel>
                              <InputHelper>What icon is displayed for the link?</InputHelper>
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
                          <Button mt={4} variant="outline" size="sm" variantColor="red" onClick={() => handleDeleteLink(index)}>Delete link</Button>
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
              isDisabled={!form.formState.isValid}
              variantColor="teal"
              type="submit"
            >
              Save
            </Button>
            <Button variant="ghost" onClick={() => cancelCTA()}>Cancel</Button>
          </ButtonGroup>
          <Button variant="outline" variantColor="red" leftIcon={Trash}>Delete</Button>
        </Flex>
      </Form>
    </FormContainer>
  );
};

export default CTAForm;
