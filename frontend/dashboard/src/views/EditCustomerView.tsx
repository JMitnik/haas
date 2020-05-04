import React from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useHistory, useParams } from 'react-router';
import { Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form } from '@haas/ui';
import { getCustomerQuery } from '../queries/getCustomersQuery';

import { createNewCustomer } from '../mutations/createNewCustomer';
import editCustomerMutation from '../mutations/editCustomer';
import getEditCustomerData from '../queries/getEditCustomer'

interface FormDataProps {
  name: string;
  logo: string;
  slug: string;
  primaryColour?: string;
}

const EditCustomerView = () => {
  const history = useHistory();
  const { customerId } = useParams();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();

  // TODO: Add query that retrieves current data available for a customer
  const getEditCustomerQuery = useQuery(getEditCustomerData, {
    variables: {
      id: customerId
    }
  })

  // TODO: Update customer instead of creating new one
  const [editCustomer, { loading }] = useMutation(editCustomerMutation, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  if (getEditCustomerQuery.loading) return null;

  console.log(getEditCustomerQuery.data);
  
  const onSubmit = (formData: FormDataProps) => {
    const optionInput = { logo: formData.logo,
      slug: formData.slug,
      primaryColour: formData.primaryColour,
      name: formData.name };
      editCustomer({
      variables: {
        id: getEditCustomerQuery.data?.customer?.id,
        options: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Edit a new customer</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General customer information</H3>
              <Muted>
                General information about the customer, such as name, logo, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <StyledLabel>Name</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.name} name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Logo</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.settings?.logoUrl} name="logo" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Slug</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.slug} name="slug" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex py={4} flexDirection="column">
                  <StyledLabel>Primary colour</StyledLabel>
                  <StyledInput defaultValue={getEditCustomerQuery.data?.customer?.settings?.colourSettings?.primary} name="primaryColour" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Save topic</Button>
            <Button brand="default" type="button" onClick={() => history.push('/')}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default EditCustomerView;
