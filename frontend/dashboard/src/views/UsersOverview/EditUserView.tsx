import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import {
  Button, Container, Div, ErrorStyle, Flex, Form, FormGroupContainer, Grid,
  H2, H3, Hr, Label, Muted, StyledInput,
} from '@haas/ui';
import { yupResolver } from '@hookform/resolvers';
import editUserMutation from 'mutations/editUser';
import getRolesQuery from 'queries/getRoles';
import getUserQuery from 'queries/getUser';
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

const EditUsersView = () => {
  const { userId, customerSlug } = useParams<{ customerId: string, userId: string, customerSlug: string }>();

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
  const { userId, customerSlug } = useParams<{ customerId: string, customerSlug: string, userId: string }>();

  const userRole = user?.role ? { label: user?.role?.name, value: user?.role?.id } : null;
  const [activeRole, setActiveRole] = useState<null | { label: string, value: string }>(userRole);

  const { register, handleSubmit, errors, setValue } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user.email,
      phone: user.phone,
    },
  });

  useEffect(() => {
    setValue('role', userRole?.value);
  }, [setValue]);

  const handleRoleChange = (qOption: any) => {
    setValue('role', qOption?.value);
    setActiveRole(qOption);
  };

  const [editUser, { loading }] = useMutation(editUserMutation, {
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
                  <Select
                    styles={errors.role && !activeRole ? ErrorStyle : undefined}
                    ref={() => register({
                      name: 'role',
                      required: true,
                    })}
                    options={roles}
                    value={activeRole}
                    onChange={(qOption: any) => {
                      handleRoleChange(qOption);
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
