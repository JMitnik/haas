import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { Button, Container, Div, Flex, Grid, H2, H3,
  Hr, Muted, StyledInput, StyledLabel } from '@haas/ui';
import createAddMutation from 'mutations/createUser';
import getRolesQuery from 'queries/getRoles';

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: { label: string, value: string };
}

const AddUserView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<FormDataProps>();
  const { customerId, customerSlug } = useParams();

  const [activeRole, setActiveRole] = useState<null | { label: string, value: string }>(null);

  const { data } = useQuery(getRolesQuery, { variables: { customerSlug } });
  const [addUser, { loading }] = useMutation(createAddMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/users/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const roles: Array<{name: string, id: string}> = data?.roles;
  const mappedRoles = roles?.map(({ name, id }) => ({ label: name, value: id }));

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      roleId: activeRole?.value || null,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
    };

    addUser({
      variables: {
        customerSlug,
        input: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}> User </H2>
        <Muted pb={4}>Create a new user</Muted>
      </Div>

      <Hr />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroupContainer>
          <Grid gridTemplateColumns={['1fr', '1fr 2fr']} gridColumnGap={4}>
            <Div py={4} pr={4}>
              <H3 color="default.text" fontWeight={500} pb={2}>General user information</H3>
              <Muted>
                General information about the user, such as name, contact details, role, etc.
              </Muted>
            </Div>
            <Div py={4}>
              <Grid gridTemplateColumns={['1fr', '1fr 1fr']}>
                <Flex flexDirection="column">
                  <StyledLabel>First name</StyledLabel>
                  <StyledInput name="firstName" ref={register({ required: true })} />
                  {errors.firstName && <Muted color="warning">Something went wrong!</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Last name</StyledLabel>
                  <StyledInput name="lastName" ref={register({ required: true })} />
                  {errors.lastName && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Email address</StyledLabel>
                  <StyledInput name="email" ref={register({ required: true })} />
                  {errors.email && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Phone number</StyledLabel>
                  <StyledInput name="phone" ref={register({ required: false })} />
                  {errors.phone && <Muted color="warning">Something went wrong!</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <StyledLabel>Role</StyledLabel>
                  <Select
                    options={mappedRoles}
                    value={activeRole}
                    onChange={(qOption: any) => {
                      setActiveRole(qOption);
                    }}
                  />
                </Div>
              </Grid>
            </Div>
          </Grid>
        </FormGroupContainer>

        <Div>
          {loading && (<Muted>Loading...</Muted>)}

          <Flex>
            <Button brand="primary" mr={2} type="submit">Create user</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/users/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

const FormGroupContainer = styled.div`
  ${({ theme }) => css`
    padding-bottom: ${theme.gutter * 3}px;
  `}
`;

const Form = styled.form``;

export default AddUserView;
