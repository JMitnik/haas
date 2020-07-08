import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';

import {
  Button, Container, Div, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Loader, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
import getCTANodeQuery from 'queries/getQuestionNode';
import getCTANodesQuery from 'queries/getCTANodes';
import getTopicBuilderQuery from 'queries/getQuestionnaireQuery';
import updateCTAMutation from 'mutations/updateCTA';

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

interface EditActionFormProps {
  currentCTAType: { label: string, value: string };
  title: string;
}

const EditActionView = () => {
  const { actionId } = useParams<{actionId: string }>();

  const initializeCTAType = (type: string) => {
    if (type === 'TEXTBOX') {
      return { label: 'Opinion', value: 'TEXTBOX' };
    }

    if (type === 'REGISTRATION') {
      return { label: 'Register', value: 'REGISTRATION' };
    }

    if (type === 'SOCIAL_SHARE') {
      return { label: 'Link', value: 'SOCIAL_SHARE' };
    }

    return { label: 'None', value: '' };
  };

  const { data: actionData } = useQuery(getCTANodeQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: actionId,
    },
  });

  if (!actionData) return <Loader />;

  const currentCTAType = initializeCTAType(actionData.questionNode.type);

  return (
    <EditActionForm currentCTAType={currentCTAType} title={actionData.questionNode.title} />
  );
};

const EditActionForm = ({ currentCTAType, title } : EditActionFormProps) => {
  const { actionId, customerSlug, dialogueSlug } = useParams();
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm<FormDataProps>({
    validationSchema: schema,
  });

  const [activeType, setActiveType] = useState<{ label: string, value: string }>(currentCTAType);

  const handleMultiChange = (selectedOption: any) => {
    setValue('ctaType', selectedOption?.value);
    setActiveType(selectedOption);
  };

  const [updateCTA, { loading }] = useMutation(updateCTAMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [
      { query: getCTANodesQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        } },
      {
        query: getTopicBuilderQuery,
        variables: {
          customerSlug,
          dialogueSlug,
        },
      }],
  });

  const onSubmit = (formData: FormDataProps) => {
    console.log('formData: ', formData);
    updateCTA({
      variables: {
        id: actionId,
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
                  <StyledInput name="title" defaultValue={title} ref={register({ required: true })} />
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
            <Button brand="primary" mr={2} type="submit">Update CTA</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/d/${dialogueSlug}/actions/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default EditActionView;
