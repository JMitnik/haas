import { Button, ButtonGroup, FormErrorMessage, useToast } from '@chakra-ui/core';
import { Div, Form, FormContainer,
  FormControl, FormLabel, FormSection, H3, Hr, Input, InputGrid, InputHelper, Muted, PageTitle, ViewContainer } from '@haas/ui';
import { Mail, Phone, User } from 'react-feather';
import { Variants, motion } from 'framer-motion';
import { queryMe, useUser } from 'providers/UserProvider';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import React from 'react';
import ServerError from 'components/ServerError';
import gql from 'graphql-tag';

const EditMeAnimation: Variants = {
  initial: {
    y: 30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
    },
  },
};

const editUserMutation = gql`
  mutation EditMe($userId: String!, $input: EditUserInput) {
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

const EditMeForm = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const toast = useToast();
  const history = useHistory();

  const [editUser, { loading: isLoading, error: serverErrors }] = useMutation(editUserMutation, {
    onCompleted: () => {
      toast({
        title: t('toast:user_edited'),
        description: t('toast:user_edited_helper'),
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
        description: 'Currently unable to edit your detail. Please try again.',
        status: 'error',
        position: 'bottom-right',
        duration: 1500,
      });
    },
    refetchQueries: [{ query: queryMe }],
  });

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      email: user?.email,
    },
    mode: 'onChange',
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
            {t('save')}
          </Button>
          <Button variant="outline" onClick={() => history.goBack()}>{t('cancel')}</Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

const EditMePage = () => {
  const { t } = useTranslation();
  return (
    <ViewContainer>
      <PageTitle>{t('edit_user')}</PageTitle>
      <motion.div variants={EditMeAnimation} initial="initial" animate="animate">
        <EditMeForm />
      </motion.div>
    </ViewContainer>
  );
};

export default EditMePage;
