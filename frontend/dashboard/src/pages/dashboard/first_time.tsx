import { Button, ButtonGroup, useToast } from '@chakra-ui/core';
import {
  Div, Form, FormContainer,
  FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper,
  Muted, SubtlePageHeading, SubtlePageSubHeading, ViewContainer,
} from '@haas/ui';
import { Mail, Phone, User } from 'react-feather';
import { Variants, motion } from 'framer-motion';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { useUser } from 'providers/UserProvider';
import ServerError from 'components/ServerError';

const FirstTimeOuterContainerAnimation: Variants = {
  initial: {
    y: 30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.5,
    },
  },
};

const FirstTimeFormContainerAnimation: Variants = {
  initial: {
    y: 30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 1,
    },
  },
};

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
    <FormContainer>
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <ServerError serverError={serverErrors} />
        <FormSection id="about">
          <Div>
            <H3 color="default.text" fontWeight={500} pb={2}>{t('user:about_user')}</H3>
            <Muted color="gray.600">
              {t('user:about_user_helper')}
            </Muted>
          </Div>
          <Div>
            <InputGrid>
              <FormControl isRequired isInvalid={!!form.formState.errors.firstName}>
                <FormLabel htmlFor="firstName">{t('first_name')}</FormLabel>
                <InputHelper>{t('first_name_helper')}</InputHelper>
                <Input
                  placeholder="Jane"
                  leftEl={<User />}
                  {...form.register('firstName')}
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!form.formState.errors.lastName}>
                <FormLabel htmlFor="lastName">{t('last_name')}</FormLabel>
                <InputHelper>{t('last_name_helper')}</InputHelper>
                <Input
                  placeholder="Doe"
                  leftEl={<User />}
                  {...form.register('lastName')}
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!form.formState.errors.email}>
                <FormLabel htmlFor="email">{t('email')}</FormLabel>
                <InputHelper>{t('email_helper')}</InputHelper>
                <Input
                  placeholder="Doe"
                  leftEl={<Mail />}
                  {...form.register('email')}
                />
              </FormControl>
              <FormControl isInvalid={!!form.formState.errors.phone}>
                <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                <InputHelper>{t('phone_helper')}</InputHelper>
                <Input
                  placeholder="Doe"
                  leftEl={<Phone />}
                  {...form.register('phone')}
                />
              </FormControl>
            </InputGrid>
          </Div>
        </FormSection>

        <Hr />

        <ButtonGroup mt={4}>
          <Button
            isLoading={isLoading}
            isDisabled={!form.formState.isValid}
            variantColor="teal"
            type="submit"
          >
            Save
          </Button>
          <Button variant="outline" onClick={() => history.push('/dashboard')}>Another time</Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

const FirstTimePage = () => {
  const { t } = useTranslation();
  return (
    <ViewContainer>
      <Div mt={4}>
        <motion.div variants={FirstTimeOuterContainerAnimation} initial="initial" animate="animate">
          <Div mb={16}>
            <SubtlePageHeading>{t('welcome_to_haas')}</SubtlePageHeading>
            <SubtlePageSubHeading color="gray.700">{t('welcome_to_haas_helper')}</SubtlePageSubHeading>
          </Div>
          <motion.div variants={FirstTimeFormContainerAnimation} initial="initial" animate="animate">
            <FirstTimeForm />
          </motion.div>
        </motion.div>
      </Div>
    </ViewContainer>
  );
};

export default FirstTimePage;
