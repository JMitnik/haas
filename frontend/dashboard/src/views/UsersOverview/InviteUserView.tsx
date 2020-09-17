import * as yup from 'yup';
import { ApolloError, gql } from 'apollo-boost';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React from 'react';
import Select from 'react-select';

import { Button, ButtonGroup, FormErrorMessage } from '@chakra-ui/core';
import { Div, Form, FormContainer, FormControl,
  FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted, PageTitle } from '@haas/ui';
import { Mail } from 'react-feather';
import { motion } from 'framer-motion';
import { useCustomer } from 'providers/CustomerProvider';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import getRolesQuery from 'queries/getRoles';
import getUsersQuery from 'queries/getUsers';

interface SelectType {
  label: string;
  value: string;
}

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: SelectType;
}

const schema = yup.object().shape({
  email: yup.string().required(),
  role: yup.object().shape({
    value: yup.string().required(),
  }),
});

const inviteUserMutation = gql`
  mutation inviteUser($input: InviteUserInput) {
    inviteUser(input: $input) {
      didInvite
      didAlreadyExist
    }
  }
`;

const InviteUserView = () => {
  const history = useHistory();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  const { customerSlug } = useParams();
  const { activeCustomer } = useCustomer();

  const { t } = useTranslation();

  const { data } = useQuery(getRolesQuery, { variables: { customerSlug } });
  const [addUser, { loading: isLoading }] = useMutation(inviteUserMutation, {
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

  const roles: Array<{name: string, id: string}> = data?.roles;
  const mappedRoles = roles?.map(({ name, id }) => ({ label: name, value: id }));

  const handleSubmit = (formData: FormDataProps) => {
    const optionInput = {
      customerId: activeCustomer.id,
      roleId: formData.role?.value || null,
      email: formData.email || '',
    };

    addUser({
      variables: {
        input: optionInput,
      },
    });
  };

  return (
    <>
      <PageTitle>{t('views:invite_user')}</PageTitle>

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
                  <FormLabel htmlFor="pgone">{t('role_selector')}</FormLabel>
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
                Send invite
              </Button>
              <Button variant="outline" onClick={() => history.push('/')}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </>
  );
};

export default InviteUserView;
