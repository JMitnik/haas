import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { Button, Div, ErrorStyle, Flex, Form, FormContainer, FormControl,
  FormGroupContainer, FormLabel, FormSection, Grid, H3, H4, Hr, Input, InputGrid, InputHelper, Label, Muted } from '@haas/ui';
import { PlusCircle, Type, X } from 'react-feather';
import { cloneDeep, debounce } from 'lodash';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import updateCTAMutation from 'mutations/updateCTA';

import { FormErrorMessage, useToast } from '@chakra-ui/core';
import DeleteLinkSesctionButton from './DeleteLinkSectionButton';

interface FormDataProps {
  title: string;
  ctaType: string;
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
  ctaType: yup.string().required(),
  links: yup.array().of(
    yup.object().shape({
      url: yup.string().required(),
      type: yup.string().required(),
    }),
  ),
});

const CTA_TYPES = [
  { label: 'Opinion', value: 'TEXTBOX' },
  { label: 'Register', value: 'REGISTRATION' },
  { label: 'Link', value: 'LINK' },
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
  });

  const clonedLinks = cloneDeep(links);
  const [activeLinks, setActiveLinks] = useState<Array<LinkInputProps>>(clonedLinks);

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  useEffect(() => {
    form.setValue('ctaType', type?.value);
    const mappedLinks = clonedLinks.map((link) => ({ ...link, type: link?.type?.value || '' }));
    form.setValue('links', mappedLinks);
  }, []);

  const handleMultiChange = useCallback((selectedOption: any) => {
    form.setValue('ctaType', selectedOption?.value);
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

  const [addCTA] = useMutation(createCTAMutation, {
    onCompleted: () => {
      onNewCTAChange(false);
      onActiveCTAChange(null);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: refetchingQueries,
  });

  const [updateCTA] = useMutation(updateCTAMutation, {
    onCompleted: () => {
      toast({
        title: 'Edit complete!',
        description: 'The call to action has been deleted.',
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
          type: formData.ctaType || undefined,
          links: mappedLinks,
        },
      });
    } else {
      const mappedLinks = { linkTypes: activeLinks.map((link) => ({ ...link, type: link.type?.value })) };
      updateCTA({
        variables: {
          id,
          title: formData.title,
          type: formData.ctaType || undefined,
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

  return (
    <FormContainer expandedForm>
      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <Div py={4}>
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
                  <Select
                    styles={form.errors.ctaType && !activeType ? ErrorStyle : undefined}
                    ref={() => form.register({
                      name: 'ctaType',
                      required: true,
                    })}
                    options={CTA_TYPES}
                    value={activeType}
                    onChange={(qOption: any) => {
                      handleMultiChange(qOption);
                    }}
                  />
                  <FormErrorMessage>{form.errors.ctaType?.message}</FormErrorMessage>
                </FormControl>
              </InputGrid>
            </Div>
            <Flex flexDirection="column" gridColumn="1 / -1">
              <Label>Title</Label>
              <Input isInvalid={!!form.errors.title} name="title" defaultValue={title} ref={form.register({ required: true })} />
              {form.errors.title && <Muted color="warning">{form.errors.title.message}</Muted>}
            </Flex>
            <Div useFlex flexDirection="column">
              <Label>Type</Label>
              <Select
                styles={form.errors.ctaType && !activeType ? ErrorStyle : undefined}
                ref={() => form.register({
                  name: 'ctaType',
                  required: true,
                })}
                options={CTA_TYPES}
                value={activeType}
                onChange={(qOption: any) => {
                  handleMultiChange(qOption);
                }}
              />
              {form.errors.ctaType && !activeType && (
              <Muted color="warning">
                {form.errors.ctaType.message}
              </Muted>
              )}
            </Div>
          </FormSection>
          <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
            <Flex flexDirection="column" gridColumn="1 / -1">
              <Label>Title</Label>
              <Input isInvalid={!!form.errors.title} name="title" defaultValue={title} ref={form.register({ required: true })} />
              {form.errors.title && <Muted color="warning">{form.errors.title.message}</Muted>}
            </Flex>
            <Div useFlex flexDirection="column">
              <Label>Type</Label>
              <Select
                styles={form.errors.ctaType && !activeType ? ErrorStyle : undefined}
                ref={() => form.register({
                  name: 'ctaType',
                  required: true,
                })}
                options={CTA_TYPES}
                value={activeType}
                onChange={(qOption: any) => {
                  handleMultiChange(qOption);
                }}
              />
              {form.errors.ctaType && !activeType && (
              <Muted color="warning">
                {form.errors.ctaType.message}
              </Muted>
              )}
            </Div>
            {activeType.value === 'LINK' && (
            <Div gridColumn="1 / -1">
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={5}>
                <H4>Links</H4>
                <PlusCircle onClick={addCondition} />
              </Flex>
              <Hr />

              {activeLinks.map((link, index) => (
                <Div position="relative" key={index} marginTop={15} gridColumn="1 / -1">
                  <Grid
                    border="1px solid"
                    borderColor="default.light"
                    gridGap="12px"
                    padding="10px"
                    gridTemplateColumns={['1fr 1fr']}
                  >
                    <DeleteLinkSesctionButton onClick={() => handleDeleteLink(index)}>
                      <X />
                    </DeleteLinkSesctionButton>
                    <Flex flexDirection="column">
                      <Label>Url</Label>
                      <Input
                        isInvalid={!!form.errors.links?.[index]?.url}
                        name={`links[${index}].url`}
                        defaultValue={link.url}
                        onChange={(e: any) => handleURLChange(e.currentTarget.value, index)}
                        ref={form.register({ required: true })}
                      />
                      {form.errors.links?.[index]?.url && (
                      <Muted color="warning">{form.errors.links?.[index]?.url?.message}</Muted>
                        )}
                    </Flex>
                    <Div useFlex flexDirection="column">
                      <Label>Type</Label>
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
                      {form.errors.links?.[index]?.type && !activeLinks?.[index]?.type && (
                      <Muted color="warning">
                        {form.errors.links?.[index]?.type?.message}
                      </Muted>
                        )}
                    </Div>
                    <Flex flexDirection="column">
                      <Label>Tooltip</Label>
                      <Input
                        isInvalid={!!form.errors.links?.[index]?.tooltip}
                        name={`links[${index}].tooltip`}
                        defaultValue={link.title}
                        onChange={(e:any) => handleTooltipChange(e.currentTarget.value, index)}
                        ref={form.register({ required: false })}
                      />
                      {form.errors.links?.[index]?.tooltip && (
                      <Muted color="warning">{form.errors.links?.[index]?.tooltip?.message}</Muted>
                        )}
                    </Flex>
                    <Flex flexDirection="column">
                      <Label>Icon</Label>
                      <Input
                        isInvalid={!!form.errors.links?.[index]?.iconUrl}
                        name={`links[${index}].iconUrl`}
                        defaultValue={link.iconUrl}
                        onChange={(e:any) => handleIconChange(e.currentTarget.value, index)}
                        ref={form.register({ required: false })}
                      />
                      {form.errors.links?.[index]?.iconUrl && (
                      <Muted color="warning">{form.errors.links?.[index]?.iconUrl?.message}</Muted>
                        )}
                    </Flex>
                    <Flex flexDirection="column">
                      <Label>Background color</Label>
                      <Input
                        isInvalid={!!form.errors.links?.[index]?.backgroundColor}
                        name={`links[${index}].backgroundColor`}
                        defaultValue={link.backgroundColor}
                        onChange={(e:any) => handleBackgroundColorChange(e.currentTarget.value, index)}
                        ref={form.register({ required: false })}
                      />
                      {form.errors.links?.[index]?.backgroundColor && (
                      <Muted color="warning">{form.errors.links?.[index]?.backgroundColor?.message}</Muted>
                        )}
                    </Flex>
                  </Grid>
                </Div>
              ))}

            </Div>
            )}
          </Grid>
        </Div>

        <Div>
          <Flex>
            <Button brand="primary" mr={2} type="submit">Save CTA</Button>
            <Button brand="default" type="button" onClick={() => cancelCTA()}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </FormContainer>
  );
};

export default CTAForm;
