import * as yup from 'yup';
import { ApolloError } from 'apollo-boost';
import { Button, ButtonGroup, FormErrorMessage } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { Div, ErrorStyle, Flex, Form, FormContainer, FormControl,
  FormGroupContainer, FormLabel, FormSection, Grid, H2, H3, Hr, Input, InputGrid, InputHelper, Label, Muted, PageTitle, StyledInput } from '@haas/ui';
import { Mail, Phone, User } from 'react-feather';
import { motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { useTranslation } from 'react-i18next';
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
  console.log('Edit user view: ', user);
  return <EditCustomerForm user={user} roles={mappedRoles} />;
};

const EditCustomerForm = ({ user, roles }: { user: any, roles: Array<{ label: string, value: string }> }) => {
  const history = useHistory();
  const { userId, customerSlug } = useParams<{ customerId: string, customerSlug: string, userId: string }>();

  const userRole = user?.role ? { label: user?.role?.name, value: user?.role?.id } : null;
  console.log('user role: ', userRole);
  const [activeRole, setActiveRole] = useState<null | { label: string, value: string }>(userRole);
  const { t } = useTranslation();

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user.email,
      phone: user.phone,
      role: userRole?.value,
    },
    mode: 'onChange',
  });

  const { setValue } = form;

  // TODO: Put dependency of userRole
  useEffect(() => {
    if (userRole) {
      setValue('role', userRole?.value);
    }
  }, [setValue, userRole]);

  const handleRoleChange = (qOption: any) => {
    setValue('role', qOption?.value);
    setActiveRole(qOption);
  };

  const [editUser, { loading: isLoading }] = useMutation(editUserMutation, {
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

  const handleSubmit = (formData: FormDataProps) => {
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
    <>
      <PageTitle>Edit a new user</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>

        <FormContainer>
          <Form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormSection id="about">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>About the user</H3>
                <Muted color="gray.600">
                  Tell us about the user, and to which scope it applies (question/dialogue)
                </Muted>
              </Div>
              <Div>
                <InputGrid>
                  <FormControl isRequired isInvalid={!!form.errors.firstName}>
                    <FormLabel htmlFor="firstName">{t('first_name')}</FormLabel>
                    <InputHelper>{t('first_name_helper')}</InputHelper>
                    <Input
                      placeholder="Jane"
                      leftEl={<User />}
                      name="firstName"
                      ref={form.register()}
                    />
                    <FormErrorMessage>{form.errors.firstName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!form.errors.lastName}>
                    <FormLabel htmlFor="lastName">{t('last_name')}</FormLabel>
                    <InputHelper>{t('last_name_helper')}</InputHelper>
                    <Input
                      placeholder="Doe"
                      leftEl={<User />}
                      name="lastName"
                      ref={form.register()}
                    />
                    <FormErrorMessage>{form.errors.lastName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={!!form.errors.email}>
                    <FormLabel htmlFor="email">{t('email')}</FormLabel>
                    <InputHelper>{t('email_helper')}</InputHelper>
                    <Input
                      placeholder="Doe"
                      leftEl={<Mail />}
                      name="email"
                      ref={form.register()}
                    />
                    <FormErrorMessage>{form.errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!form.errors.phone}>
                    <FormLabel htmlFor="pgone">{t('phone')}</FormLabel>
                    <InputHelper>{t('phone_helper')}</InputHelper>
                    <Input
                      placeholder="Doe"
                      leftEl={<Phone />}
                      name="phone"
                      ref={form.register()}
                    />
                    <FormErrorMessage>{form.errors.phone?.message}</FormErrorMessage>
                  </FormControl>
                </InputGrid>
              </Div>
            </FormSection>

            <Hr />

            <FormSection id="roles">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>Roles</H3>
                <Muted color="gray.600">
                  Decide and assign roles for control access
                </Muted>
              </Div>
              <Div>
                <FormControl isInvalid={!!form.errors.role}>
                  <FormLabel htmlFor="pgone">{t('role_selector')}</FormLabel>
                  <InputHelper>{t('role_selector_helper')}</InputHelper>
                  <Select
                    ref={() => form.register({
                      name: 'role',
                      required: true,
                    })}
                    options={roles}
                    value={activeRole}
                    onChange={(qOption: any) => {
                      handleRoleChange(qOption);
                    }}
                  />
                </FormControl>
              </Div>
            </FormSection>

            <ButtonGroup>
              <Button
                isLoading={isLoading}
                isDisabled={!form.formState.isValid}
                variantColor="teal"
                type="submit"
              >
                Create
              </Button>
              <Button variant="outline" onClick={() => history.push(`/dashboard/b/${customerSlug}/users`)}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </>
  );
};

export default EditUsersView;
