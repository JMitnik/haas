import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useState } from 'react';
import Select from 'react-select';

import {
  Button, Container, Div, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Muted, StyledInput, StyledLabel,
} from '@haas/ui';
import editUserMutation from 'mutations/editUser';
import getRolesQuery from 'queries/getRoles';
import getUserQuery from 'queries/getUser';

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: { label: string, value: string };
}

const EditUsersView = () => {
  const { customerId, userId, customerSlug } = useParams<{ customerId: string, userId: string, customerSlug: string }>();

  const { data: userData, error, loading } = useQuery(getUserQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: userId,
    },
  });

  const { data: rolesData, loading: rolesLoading } = useQuery(getRolesQuery, {
    variables: {
      customerSlug,
    },
  });

  if (loading || rolesLoading) return null;
  if (error) return <><p>{error.message}</p></>;

  const user = userData?.user;
  const roles: Array<any> = rolesData?.roles;
  const mappedRoles = roles?.map((role) => ({ label: role.name, value: role.id }));
  return <EditCustomerForm user={user} roles={mappedRoles} />;
};

const EditCustomerForm = ({ user, roles }: { user: any, roles: Array<{ label: string, value: string }> }) => {
  const history = useHistory();
  const { customerId, userId, customerSlug } = useParams<{ customerId: string, customerSlug: string, userId: string }>();

  const userRole = user?.role ? { label: user?.role?.name, value: user?.role?.id } : null;
  const [activeRole, setActiveRole] = useState<null | { label: string, value: string }>(userRole);

  const { register, handleSubmit, errors } = useForm<FormDataProps>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user.email,
      phone: user.phone,
    },
  });

  const [editUser, { loading }] = useMutation(editUserMutation, {
    onCompleted: () => {
      history.push(`/dashboard/b/${customerSlug}/users/`);
    },
    onError: (serverError: ApolloError) => {
      console.log(serverError);
    },
  });

  const onSubmit = (formData: FormDataProps) => {
    const optionInput = {
      roleId: activeRole?.value || null,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
    };
    editUser({
      variables: {
        id: userId,
        input: optionInput,
      },
    });
  };

  return (
    <Container>
      <Div>
        <H2 color="default.darkest" fontWeight={500} py={2}>User</H2>
        <Muted pb={4}>Edit an existing user</Muted>
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
                    options={roles}
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
            <Button brand="primary" mr={2} type="submit">Save user</Button>
            <Button brand="default" type="button" onClick={() => history.push(`/dashboard/b/${customerSlug}/users/`)}>Cancel</Button>
          </Flex>
        </Div>
      </Form>
    </Container>
  );
};

export default EditUsersView;
