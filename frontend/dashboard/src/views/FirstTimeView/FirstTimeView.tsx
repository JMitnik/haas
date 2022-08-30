import * as UI from '@haas/ui';
import { Mail, Phone, User } from 'react-feather';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';

import { View } from 'layouts/View';
import { useTranslation } from 'react-i18next';
import { useUser } from 'providers/UserProvider';
import PreCustomerLayout from 'layouts/PreCustomerLayout';
import React from 'react';
import ServerError from 'components/ServerError';

const editUserMutation = gql`
  mutation FirstTimeEditUser($userId: String!, $input: EditUserInput) {
    editUser(userId: $userId, input: $input) {
      id
      firstName
      lastName
      email
      phone
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

const FirstTimeForm = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const toast = useToast();
  const history = useHistory();

  const [editUser, { loading: isLoading, error: serverErrors }] = useMutation(editUserMutation, {
    onCompleted: () => {
      toast({
        title: t('toast:welcome'),
        description: t('toast:welcome_on_board_helper'),
        status: 'success',
        position: 'bottom-right',
        duration: 1500,
      });

      setTimeout(() => {
        history.push('/dashboard');
      }, 500);
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: 'Currently unable to make trigger. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: user?.email,
    },
    mode: 'onBlur',
  });

  const handleSubmit = (formData: any) => {
    editUser({
      variables: {
        userId: user?.id,
        input: {
          firstName: formData.firstName,
          email: formData.email,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      },
    });
  };

  return (
    <UI.Card>
      <UI.CardBody>

        <UI.Form onSubmit={form.handleSubmit(handleSubmit)}>
          <ServerError serverError={serverErrors} />
          <UI.FormSection id="about">
            <UI.Div>
              <UI.H3 color="off.500" fontWeight={500}>{t('user:about_user')}</UI.H3>
              <UI.Muted color="gray.600">
                {t('user:about_user_helper')}
              </UI.Muted>
            </UI.Div>
            <UI.Div>
              <UI.InputGrid>
                <UI.FormControl isRequired isInvalid={!!form.formState.errors.firstName}>
                  <UI.FormLabel htmlFor="firstName">{t('first_name')}</UI.FormLabel>
                  <UI.InputHelper>{t('first_name_helper')}</UI.InputHelper>
                  <UI.Input
                    placeholder="Jane"
                    leftEl={<User />}
                    {...form.register('firstName')}
                  />
                </UI.FormControl>
                <UI.FormControl isRequired isInvalid={!!form.formState.errors.lastName}>
                  <UI.FormLabel htmlFor="lastName">{t('last_name')}</UI.FormLabel>
                  <UI.InputHelper>{t('last_name_helper')}</UI.InputHelper>
                  <UI.Input
                    placeholder="Doe"
                    leftEl={<User />}
                    {...form.register('lastName')}
                  />
                </UI.FormControl>
                <UI.FormControl isRequired isInvalid={!!form.formState.errors.email}>
                  <UI.FormLabel htmlFor="email">{t('email')}</UI.FormLabel>
                  <UI.InputHelper>{t('email_helper')}</UI.InputHelper>
                  <UI.Input
                    placeholder="Doe"
                    leftEl={<Mail />}
                    {...form.register('email')}
                  />
                </UI.FormControl>
                <UI.FormControl isInvalid={!!form.formState.errors.phone}>
                  <UI.FormLabel htmlFor="phone">{t('phone')}</UI.FormLabel>
                  <UI.InputHelper>{t('phone_helper')}</UI.InputHelper>
                  <UI.Input
                    placeholder="Doe"
                    leftEl={<Phone />}
                    {...form.register('phone')}
                  />
                </UI.FormControl>
              </UI.InputGrid>
            </UI.Div>
          </UI.FormSection>

          <UI.Hr />

          <UI.Flex>
            <UI.Button
              isLoading={isLoading}
              isDisabled={!form.formState.isValid}
              type="submit"
            >
              Save
            </UI.Button>
            <UI.Button ml={2} variant="outline" onClick={() => history.push('/dashboard')}>Another time</UI.Button>
          </UI.Flex>
        </UI.Form>
      </UI.CardBody>
    </UI.Card>
  );
};

export const FirstTimeView = () => {
  const { t } = useTranslation();
  return (
    <PreCustomerLayout>
      <View documentTitle="haas | Welcome to haas!">
        <UI.ViewHead compact>
          <UI.ViewTitle>
            {t('welcome_to_haas')}
          </UI.ViewTitle>
          <UI.ViewSubTitle>
            {t('welcome_to_haas_helper')}
          </UI.ViewSubTitle>
        </UI.ViewHead>
        <UI.ViewBody compact>
          <FirstTimeForm />
        </UI.ViewBody>
      </View>
    </PreCustomerLayout>
  );
};
