import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';

import {
  Button, Container, Div, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
import createCTAMutation from 'mutations/createCTA';
import getCTANodesQuery from 'queries/getCTANodes';

interface FormDataProps {
  title: string;
  ctaType: string;
}

const schema = yup.object().shape({
  title: yup.string().required(),
  ctaType: yup.string().required(),
});

const CTA_TYPES = [
  { label: 'Opinion', value: 'TEXTBOX' },
  { label: 'Register', value: 'REGISTRATION' },
  { label: 'Link', value: 'SOCIAL_SHARE' },
];

const AddActionView = () => {
  const { customerSlug, dialogueSlug } = useParams();
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    validationSchema: schema,
  });

  const [activeType, setActiveType] = useState<null | { label: string, value: string }>(null);

  const handleMultiChange = (selectedOption: any) => {
    setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  };

  const [addCTA, { loading }] = useMutation(createCTAMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [{ query: getCTANodesQuery,
      variables: {
        customerSlug,
        dialogueSlug,
      } }],
  });

  const onSubmit = (formData: FormDataProps) => {
    addCTA({
      variables: {
        customerSlug,
        dialogueSlug,
        title: formData.title,
        type: formData.ctaType || undefined,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}>Call-to-Action</H2>
        <Muted pb={4}>Create a new Call-to-Action</Muted>
      </Div>

      <Hr />

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
                  <StyledInput name="title" ref={register({ required: true })} />
                  {errors.title && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Type</StyledLabel>
                  <Select
                    ref={() => register({ name: 'ctaType',
                      required: true,
                      validate: (value) => (Array.isArray(value) ? value.length > 0 : !!value) })}
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
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create CTA</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default AddActionView;
