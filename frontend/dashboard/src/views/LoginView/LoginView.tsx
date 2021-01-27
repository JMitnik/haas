import { useToast } from '@chakra-ui/core';
import React from 'react';
import * as UI from '@haas/ui';
import { Div, Form, FormControl, Input, InputGrid, Text } from '@haas/ui';
import { Mail, Send } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { gql } from '@apollo/client';

import Logo from 'components/Logo/Logo';
import AnimatedRoute from 'components/Routes/AnimatedRoute';
import AnimatedRoutes from 'components/Routes/AnimatedRoutes';
import ServerError from 'components/ServerError';
import { useRequestInviteMutation } from 'types/generated-types';

import * as LS from './LoginViewStyles';

interface FormData {
  email: string;
  password: string;
}

const baseRoute = '/public/login';

const LoginView = () => {
  const history = useHistory();
  const toast = useToast();

  const [requestInvite, { error: loginServerError, loading: isRequestingInvite }] = useRequestInviteMutation({
    onError: () => {
      toast({
        title: 'Unexpected error!',
        description: 'See the form for more information.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Invite has been sent in case the mail matches!',
        description: 'Check your email for your invitation',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });

      history.push(`${baseRoute}/waiting`);
    },
  });

  const form = useForm<FormData>({
    mode: 'onChange',
  });

  const handleRequestInvite = async (data: FormData) => {
    requestInvite({
      variables: {
        input: { email: data.email }
      },
    });
  };

  return (
    <LS.LoginViewContainer>
      <Div>
        <LS.LoginContentContainer padding={['4', '15%']}>
          <Logo color="gray.500" mb={4} />
          <UI.Text fontSize="2rem" fontWeight="800" color="gray.800" mb={2}>
            Sign in to Haas
          </UI.Text>
          <UI.Card height="300px" width="100%" maxWidth={600} bg="white" noHover>
            <UI.CardBody>
              <AnimatedRoutes>
                <AnimatedRoute exact path={`${baseRoute}`}>
                  <Form onSubmit={form.handleSubmit(handleRequestInvite)}>
                    <ServerError serverError={loginServerError} />

                    <InputGrid gridTemplateColumns="1fr">
                      <Div>
                        <FormControl>
                          <UI.FormLabel
                            fontSize="1rem"
                            htmlFor="email"
                          >Email</UI.FormLabel>
                          <Input
                            name="email"
                            id="email"
                            autoFocus
                            type="email"
                            autoComplete="username"
                            ref={form.register({ required: true })}
                            leftEl={<Mail />}
                            placeholder="bunny@haas.live"
                          />
                        </FormControl>
                      </Div>
                    </InputGrid>

                    <UI.Button
                      leftIcon={Send}
                      type="submit"
                      isDisabled={!form.formState.isValid}
                      mt={4}
                      isLoading={isRequestingInvite}
                      loadingText="Logging in"
                    >
                      Request login
                      </UI.Button>
                  </Form>
                </AnimatedRoute>
                <AnimatedRoute path={`${baseRoute}/waiting`}>
                  <Text fontSize="1.8rem" color="gray.600" textAlign="center">
                    Check your mail!
                </Text>
                  <Text textAlign="center" fontSize="1rem" fontWeight="300" color="gray.500">
                    You should receive an invitation link very soon!
                </Text>
                </AnimatedRoute>
              </AnimatedRoutes>
            </UI.CardBody>
          </UI.Card>
        </LS.LoginContentContainer>
      </Div>
    </LS.LoginViewContainer>
  );
};

export default LoginView;
