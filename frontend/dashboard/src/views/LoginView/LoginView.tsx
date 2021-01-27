import { useToast } from '@chakra-ui/core';
import React from 'react';
import * as UI from '@haas/ui';
import { Div, Form, FormControl, Input, InputGrid, Text } from '@haas/ui';
import { Mail, Send } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

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
      <LS.LoginContentContainer>
        <Logo color="gray.500" mb={4} />
        <UI.Text fontSize="2rem" fontWeight="800" color="gray.800" mb={2}>
          Sign in to Haas
        </UI.Text>
        <UI.Card height="250px" width="100%" maxWidth={600} bg="white" noHover>
          <UI.CardBody overflow="hidden">
            <AnimatedRoutes>
              <AnimatedRoute exact path={`${baseRoute}`}>
                <Form onSubmit={form.handleSubmit(handleRequestInvite)}>
                  <ServerError serverError={loginServerError} />

                  <UI.FormSectionHelper>
                    Welcome to Haas Dashboard! To continue, input your email below, and we will send you a login link
                  </UI.FormSectionHelper>

                  <UI.Div mt={2}>
                    <InputGrid gridTemplateColumns="1fr">
                      <Div>
                        <FormControl>
                          <UI.FormLabel
                            fontSize="1rem"
                            htmlFor="email"
                          >
                            Email
                          </UI.FormLabel>
                          <UI.Input
                            name="email"
                            id="email"
                            autoFocus
                            variant="filled"
                            type="email"
                            autoComplete="username"
                            ref={form.register({ required: true })}
                            leftEl={<Mail />}
                            placeholder="bunny@haas.live"
                          />
                        </FormControl>
                      </Div>
                    </InputGrid>
                  </UI.Div>

                  <UI.Button
                    variantColor="teal"
                    leftIcon={Send}
                    type="submit"
                    isDisabled={!form.formState.isValid}
                    mt={4}
                    isLoading={isRequestingInvite}
                    loadingText="Logging in"
                  >
                    Send login link
                  </UI.Button>
                </Form>
              </AnimatedRoute>
              <AnimatedRoute path={`${baseRoute}/waiting`}>
                <UI.Flex height="100%" alignItems="center" justifyContent="center">
                  <UI.Div>
                    <Text fontSize="1.8rem" color="gray.600" textAlign="center">
                      Check your mail!
                    </Text>
                    <Text textAlign="center" fontSize="1rem" fontWeight="300" color="gray.500">
                      You should receive an invitation link very soon!
                    </Text>
                  </UI.Div>
                </UI.Flex>
              </AnimatedRoute>
            </AnimatedRoutes>
          </UI.CardBody>
        </UI.Card>
      </LS.LoginContentContainer>
    </LS.LoginViewContainer>
  );
};

export default LoginView;
