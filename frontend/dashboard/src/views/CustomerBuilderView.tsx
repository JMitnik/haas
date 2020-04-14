import React from 'react';

import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import { Container, Flex, Grid, H2, H3, Muted, Button,
  Div, StyledLabel, StyledInput, Hr, FormGroupContainer, Form } from '@haas/ui';
import { getCustomerQuery } from '../queries/getCustomerQuery';

import { createNewCustomer } from '../mutations/createNewCustomer';

interface FormDataProps {
  name: String;
  logo: String;
  primaryColour?: String;
  seed?: Boolean;
}

const CustomerBuilderView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();

  const [addCustomer, { loading }] = useMutation(createNewCustomer, {
    onCompleted: () => {
      history.push('/');
    },
    refetchQueries: [{ query: getCustomerQuery }],
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = { logo: formData.logo,
      isSeed: formData.seed,
      primaryColour: formData.primaryColour };
    // TODO: Make better typescript supported
    addCustomer({
      variables: {
        name: formData.name,
        options: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> Customer </H2>
        <Muted pb={4}>Create a new customer</Muted>
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
                  <StyledInput name="name" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex pl={4} flexDirection="column">
                  <StyledLabel>Logo</StyledLabel>
                  <StyledInput name="logo" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex py={4} flexDirection="column">
                  <StyledLabel>Primary colour</StyledLabel>
                  <StyledInput name="primaryColour" ref={register({ required: true })} />
                  {errors.name && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
              </Grid>
              <Div py={4}>
                <StyledInput
                  type="checkbox"
                  id="seed"
                  name="seed"
                  ref={register({ required: false })}
                />
                <label htmlFor="seed"> Generate template topic for customer </label>
              </Div>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create topic</Button>
            <Button brand="default" type="button" onClick={() => history.push('/')}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default CustomerBuilderView;
