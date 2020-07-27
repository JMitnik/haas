import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { Button, Div, Flex, Form, FormGroupContainer, Grid,
  H3, H4, Hr, Muted, StyledInput, StyledLabel } from '@haas/ui';
import { PlusCircle, X } from 'react-feather';
import { cloneDeep, debounce } from 'lodash';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';
import updateCTAMutation from 'mutations/updateCTA';

import DeleteLinkSesctionButton from './DeleteLinkSectionButton';

interface FormDataProps {
  title: string;
  ctaType: string;
  url: string;
  linkType: string;
  tooltip?: string;
  icon: string;
  backgroundColor: string;
}

interface LinkInputProps {
  id?: string | null;
  title: string;
  type?: { label: string, value: string };
  url: string;
  iconUrl?: string;
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

const isLinkType = (ctaType: string) => ctaType === 'LINK';

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.string().required(),
  url: yup.string().notRequired().when(['ctaType'], {
    is: (ctaType: string) => isLinkType(ctaType),
    then: yup.string().required(),
  }),
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
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    // validationSchema: schema,
  });

  const [activeLinks, setActiveLinks] = useState<Array<LinkInputProps>>(cloneDeep(links));

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  const handleMultiChange = useCallback((selectedOption: any) => {
    setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  }, [setValue, setActiveType]);

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
      onActiveCTAChange(null);
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
    setValue('linkType', qOption?.value);
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroupContainer>
        <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
          <Div py={4} pr={4}>
            <H3 color="default.text" fontWeight={500} pb={2}>General Call-to-Action information</H3>
            <Muted>
              General information about the CAT, such as title, type, etc.
            </Muted>
          </Div>
          <Div py={4}>
            <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
              <Flex flexDirection="column" gridColumn="1 / -1">
                <StyledLabel>Title</StyledLabel>
                <StyledInput name="title" defaultValue={title} ref={register({ required: true })} />
                {errors.title && <Muted color="warning">Something went wrong!</Muted>}
              </Flex>
              <Div useFlex flexDirection="column">
                <StyledLabel>Type</StyledLabel>
                <Select
                  ref={() => register({
                    name: 'ctaType',
                    required: true,
                    validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value),
                  })}
                  options={CTA_TYPES}
                  value={activeType}
                  onChange={(qOption: any) => {
                    handleMultiChange(qOption);
                  }}
                />
                {errors.ctaType && (
                <Muted color="warning">
                  {errors.ctaType.message}
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
                        <StyledLabel>Url</StyledLabel>
                        <StyledInput
                          name="url"
                          defaultValue={link.url}
                          onChange={(e) => handleURLChange(e.currentTarget.value, index)}
                          ref={register({ required: true })}
                        />
                        {errors.url && <Muted color="warning">Something went wrong!</Muted>}
                      </Flex>
                      <Div useFlex flexDirection="column">
                        <StyledLabel>Type</StyledLabel>
                        <Select
                          ref={() => register({
                            name: 'linkType',
                            required: true,
                            validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value),
                          })}
                          options={LINK_TYPES}
                          value={link.type}
                          onChange={(qOption: any) => {
                            handleLinkTypeChange(qOption, index);
                          }}
                        />
                        {errors.ctaType && (
                        <Muted color="warning">
                          {errors.ctaType.message}
                        </Muted>
                        )}
                      </Div>
                      <Flex flexDirection="column">
                        <StyledLabel>Tooltip</StyledLabel>
                        <StyledInput
                          name="tooltip"
                          defaultValue={link.title}
                          onChange={(e) => handleTooltipChange(e.currentTarget.value, index)}
                          ref={register({ required: false })}
                        />
                        {errors.tooltip && <Muted color="warning">Something went wrong!</Muted>}
                      </Flex>
                      <Flex flexDirection="column">
                        <StyledLabel>Icon</StyledLabel>
                        <StyledInput
                          name="icon"
                          defaultValue={link.iconUrl}
                          onChange={(e) => handleIconChange(e.currentTarget.value, index)}
                          ref={register({ required: false })}
                        />
                        {errors.icon && <Muted color="warning">Something went wrong!</Muted>}
                      </Flex>
                      <Flex flexDirection="column">
                        <StyledLabel>Background color</StyledLabel>
                        <StyledInput
                          name="backgroundColor"
                          defaultValue={link.backgroundColor}
                          onChange={(e) => handleBackgroundColorChange(e.currentTarget.value, index)}
                          ref={register({ required: false })}
                        />
                        {errors.backgroundColor && <Muted color="warning">Something went wrong!</Muted>}
                      </Flex>
                    </Grid>
                  </Div>
                ))}

              </Div>
              )}
            </Grid>
          </Div>
        </Grid>
      </FormGroupContainer>

      <Div>
        <Flex>
          <Button brand="primary" mr={2} type="submit">Save CTA</Button>
          <Button brand="default" type="button" onClick={() => cancelCTA()}>Cancel</Button>
        </Flex>
      </Div>
    </Form>
  );
};

export default CTAForm;
