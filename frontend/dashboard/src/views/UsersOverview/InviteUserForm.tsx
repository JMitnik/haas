import * as UI from '@haas/ui';
import * as yup from 'yup';
import { Button, ButtonGroup, FormErrorMessage, useToast } from '@chakra-ui/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Div, Form, FormContainer, FormControl,
  FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted,
} from '@haas/ui';
import { Mail } from 'react-feather';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers';
import React from 'react';
import Select from 'react-select';

import { useCustomer } from 'providers/CustomerProvider';
import { useGetRolesQuery } from 'types/generated-types';
import getUsersQuery from 'queries/getUsers';

interface SelectType {
  label: string;
  value: string;
}

const inviteUserMutation = gql`
  mutation inviteUser($input: InviteUserInput) {
    inviteUser(input: $input) {
      didInvite
      didAlreadyExist
    }
  }
`;

interface FormDataProps {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: SelectType;
}

const schema = yup.object().shape({
  email: yup.string().email('Expected email format').required(),
  role: yup.object().shape({
    value: yup.string().required(),
  }),
});

const InviteUserForm = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const toast = useToast();
  const form = useForm<FormDataProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const { customerSlug } = useParams<{ customerSlug: string }>();
  const { activeCustomer } = useCustomer();
  const { data: roleData } = useGetRolesQuery({
    variables: { id: activeCustomer?.id },
    fetchPolicy: 'network-only',
  });
  const selectRoles = roleData?.customer?.roles?.map((role) => ({ label: role.name, value: role.id }));

  const [addUser, { loading: isLoading }] = useMutation(inviteUserMutation, {
    onCompleted: (resData) => {
      const userDidExist = resData?.inviteUser?.didAlreadyExist;
      const didInviteUser = resData?.inviteUser?.didInvite;

      if (!userDidExist && didInviteUser) {
        toast({
          title: 'Invited new user!',
          description: 'The user has been invited to the workspace.',
          status: 'success',
          position: 'bottom-right',
          duration: 1500,
        });
      } else if (!didInviteUser && userDidExist) {
        toast({
          title: 'User already exists!',
          description: 'The user already exists in your workspace. Any changes have been applied.',
          status: 'warning',
          position: 'bottom-right',
          duration: 1500,
        });
      } else {
        toast({
          title: 'Existing user added!',
          description: 'User has been added to this workspace.',
          status: 'success',
          position: 'bottom-right',
          duration: 1500,
        });
      }

      setTimeout(() => {
        history.push(`/dashboard/b/${customerSlug}/users/`);
      }, 300);
    },
    onError: (serverError: any) => {
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
      customerId: activeCustomer?.id,
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
    <UI.ViewBody>
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
                    <FormErrorMessage>{form.errors?.email?.message}</FormErrorMessage>
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
                    options={selectRoles}
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
              <Button variant="outline" onClick={() => history.goBack()}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </FormContainer>
      </motion.div>
    </UI.ViewBody>
  );
};

export default InviteUserForm;
