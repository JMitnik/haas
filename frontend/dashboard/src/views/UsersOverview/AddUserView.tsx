import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';
import styled, { css } from 'styled-components/macro';

import { Button, Container, Div, ErrorStyle, Flex, Grid, H2, H3,
  Hr, Label, Muted, StyledInput } from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import createAddMutation from 'mutations/createUser';
import getRolesQuery from 'queries/getRoles';
import getUsersQuery from 'queries/getUsers';

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
}

const schema = yup.object().shape({
  email: yup.string().required(),
  role: yup.string().required(),
  firstName: yup.string().notRequired(),
  lastName: yup.string().notRequired(),
  phone: yup.string().notRequired(),
});

const AddUserView = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, setValue, control } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });
  const { customerSlug } = useParams();

  const [activeRole, setActiveRole] = useState<null | { label: string, value: string }>(null);

  const { data } = useQuery(getRolesQuery, { variables: { customerSlug } });
  const [addUser, { loading }] = useMutation(createAddMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/users/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
    refetchQueries: [
      {
        query: getUsersQuery,
        variables: { customerSlug },
      },
    ],
  });

  const handleRoleChange = (qOption: any) => {
    setValue('role', qOption?.value);
    setActiveRole(qOption);
  };

  const roles: Array<{name: string, id: string}> = data?.roles;
  const mappedRoles = roles?.map(({ name, id }) => ({ label: name, value: id }));

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      roleId: activeRole?.value || null,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      password: 'test123',
    };

    addUser({
      variables: {
        customerSlug,
        input: optionInput,
      },
    });
  };

  console.log('errors: ', errors);

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
                  <Label>First name</Label>
                  <StyledInput isInvalid={!!errors.firstName} name="firstName" ref={register({ required: true })} />
                  {errors.firstName && <Muted color="warning">{errors.firstName.message}</Muted>}
                </Flex>
                <Div useFlex flexDirection="column">
                  <Label>Last name</Label>
                  <StyledInput isInvalid={!!errors.lastName} name="lastName" ref={register({ required: true })} />
                  {errors.lastName && <Muted color="warning">{errors.lastName.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Email address</Label>
                  <StyledInput isInvalid={!!errors.email} name="email" ref={register({ required: true })} />
                  {errors.email && <Muted color="warning">{errors.email.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Phone number</Label>
                  <StyledInput isInvalid={!!errors.phone} name="phone" ref={register({ required: false })} />
                  {errors.phone && <Muted color="warning">{errors.phone.message}</Muted>}
                </Div>
                <Div useFlex flexDirection="column">
                  <Label>Role</Label>
                  <Controller
                    control={control}
                    render={({ onChange }) => (
                      <Select
                        options={mappedRoles}
                        value={activeRole}
                        onChange={(data: any) => {
                          handleRoleChange(data);
                          onChange(data.value);
                        }}
                      />
                    )}
                    name="role"
                    defaultValue={activeRole}
                  />
                  {/* <Select
                    styles={errors.role && !activeRole ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'role',
                      required: true,
                    })}
                    options={mappedRoles}
                    value={activeRole}
                    onChange={(qOption: any) => {
                      handleRoleChange(qOption);
                    }}
                  /> */}
                  {errors.role && !activeRole && <Muted color="warning">{errors.role.message}</Muted>}
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
