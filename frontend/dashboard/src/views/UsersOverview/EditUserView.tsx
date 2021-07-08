import * as yup from 'yup';
import { Button, ButtonGroup, FormErrorMessage, useToast } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Div, Form, FormContainer, FormControl,
  FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper, Loader, Muted, PageTitle,
} from '@haas/ui';
import { Mail, Phone, User } from 'react-feather';
import { gql, useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';
import Select from 'react-select';

import { useCustomer } from 'providers/CustomerProvider';
import getRolesQuery from 'queries/getRoles';
import getUsersQuery from 'queries/getUsers';

const schema = yup.object().shape({
  email: yup.string().email('Expected email format').required(),
  firstName: yup.string().ensure(),
  lastName: yup.string().ensure(),
  phone: yup.string().notRequired(),
  role: yup.object().shape({
    value: yup.string().required(),
    label: yup.string().notRequired(),
  }),
}).required();

type FormDataProps = yup.InferType<typeof schema>;

const getUserFromCustomer = gql`
  query getUserFromCustomer($userId: String!, $customerId: ID!) {
    customer(id: $customerId) {
      id
      userCustomer(userId: $userId) {
        user {
          id
          email
          phone
          firstName
          lastName
        }
        role {
          name
          id
        }
      }
    }
  }
`;

const editUserMutation = gql`
  mutation editUser($userId: String!, $input: EditUserInput) {
    editUser(userId: $userId, input: $input) {
      id
      firstName
      lastName
      email
      userCustomers {
        role {
          permissions
        }
        customer {
          id
          slug
        }
      }
    }
  }
`;

const EditUserForm = ({ userCustomer }: { userCustomer: any }) => {
  const history = useHistory();
  const { activeCustomer } = useCustomer();
  const toast = useToast();
  const { t } = useTranslation();

  const { data } = useQuery(getRolesQuery, { variables: { customerSlug: activeCustomer?.slug } });
  const roles: Array<{ name: string, id: string }> = data?.roles;
  const mappedRoles = roles?.map(({ name, id }) => ({ label: name, value: id }));

  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: userCustomer?.user?.email,
      firstName: userCustomer?.user?.firstName,
      lastName: userCustomer?.user?.lastName,
      phone: userCustomer?.user?.phone,
      role: {
        label: userCustomer?.role.name,
        value: userCustomer?.role.id,
      },
    },
  });

  const [editUser, { loading: isLoading }] = useMutation(editUserMutation, {
    onCompleted: () => {
      toast({
        title: 'User edited!',
        description: 'The user has been edited int the workspace.',
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });
      setTimeout(() => {
        history.push(`/dashboard/b/${activeCustomer?.slug}/users/`);
      }, 300);
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'The user was not edited.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    refetchQueries: [
      {
        query: getUsersQuery,
        variables: { customerSlug: activeCustomer?.slug },
      },
    ],
  });

  const handleSubmit = (formData: FormDataProps) => {
    const optionInput = {
      customerId: activeCustomer?.id,
      roleId: formData.role?.value || null,
      email: formData.email || '',
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      phone: formData.phone || '',
    };

    editUser({
      variables: {
        userId: userCustomer?.user?.id,
        input: optionInput,
      },
    });
  };

  return (
    <>
      <PageTitle>{t('edit_user')}</PageTitle>

      <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}>
        <FormContainer>
          <Form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormSection id="about">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('user:about_user')}</H3>
                <Muted color="gray.600">
                  {t('user:about_user_helper')}
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
                  <FormControl isInvalid={!!form.errors.phone}>
                    <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                    <InputHelper>{t('phone_helper')}</InputHelper>
                    <Input
                      placeholder="Doe"
                      leftEl={<Phone />}
                      name="phone"
                      ref={form.register()}
                    />
                    <FormErrorMessage>{form.errors.phone?.message}</FormErrorMessage>
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
                </InputGrid>
              </Div>
            </FormSection>

            <Hr />

            <FormSection id="roles">
              <Div>
                <H3 color="default.text" fontWeight={500} pb={2}>{t('roles')}</H3>
                <Muted color="gray.600">
                  {t('user:roles_helper')}
                </Muted>
              </Div>
              <Div>
                <FormControl isInvalid={!!form.errors.phone}>
                  <FormLabel htmlFor="phone">{t('role_selector')}</FormLabel>
                  <InputHelper>{t('role_selector_helper')}</InputHelper>
                  <Controller
                    name="role"
                    as={Select}
                    control={form.control}
                    options={mappedRoles}
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
                {t('edit')}
              </Button>
              <Button variant="outline" onClick={() => history.goBack()}>{t('cancel')}</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </>
  );
};

const EditUserView = () => {
  const { activeCustomer } = useCustomer();
  const { userId } = useParams<{ userId: string }>();

  const { data, loading } = useQuery(getUserFromCustomer, {
    variables: {
      customerId: activeCustomer?.id,
      userId,
    },
  });

  if (loading) return <Loader />;

  if (data?.customer?.userCustomer) {
    return (
      <EditUserForm userCustomer={data?.customer?.userCustomer} />
    );
  }

  return <Loader />;
};

export default EditUserView;
