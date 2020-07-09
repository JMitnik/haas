import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import Select from 'react-select';

import { Button, Div, Flex, Form, FormGroupContainer, Grid,
  H3, Muted, StyledInput, StyledLabel } from '@haas/ui';
import { getTopicBuilderQuery } from 'queries/getQuestionnaireQuery';
import getCTANodesQuery from 'queries/getCTANodes';
import updateCTAMutation from 'mutations/updateCTA';

interface FormDataProps {
  title: string;
  ctaType: string;
}

interface CTAFormProps {
  id: string;
  title: string;
  type: { label: string, value: string };
  onActiveCTAChange: React.Dispatch<React.SetStateAction<string | null>>;
}

const CTA_TYPES = [
  { label: 'Opinion', value: 'TEXTBOX' },
  { label: 'Register', value: 'REGISTRATION' },
  { label: 'Link', value: 'SOCIAL_SHARE' },
];

const CTAForm = ({ id, title, type, onActiveCTAChange }: CTAFormProps) => {
  const { customerSlug, dialogueSlug } = useParams();
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    // validationSchema: schema,
  });

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(type);

  const handleMultiChange = (selectedOption: any) => {
    setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  };

  const [updateCTA, { loading }] = useMutation(updateCTAMutation, {
    onCompleted: () => {
      onActiveCTAChange(null);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [
      {
        query: getCTANodesQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        },
      },
      {
        query: getTopicBuilderQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        },
      }],
  });

  const onSubmit = (formData: FormDataProps) => {
    updateCTA({
      variables: {
        id,
        title: formData.title,
        type: formData.ctaType || undefined,
      },
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
            </Grid>
          </Div>
        </Grid>
      </FormGroupContainer>

      <Div>
        <Flex>
          <Button brand="primary" mr={2} type="submit">Save CTA</Button>
          <Button brand="default" type="button" onClick={() => onActiveCTAChange(null)}>Cancel</Button>
        </Flex>
      </Div>
    </Form>
  );
};

export default CTAForm;
