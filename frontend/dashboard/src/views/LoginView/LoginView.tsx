import { Button, useToast } from '@chakra-ui/core';
import { Div, Form, FormControl, FormLabel, Grid, H2, Input, InputGrid, Paragraph, Text } from '@haas/ui';
import { Mail, Send } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import gql from 'graphql-tag';

import { FullLogo } from 'components/Logo/Logo';
import AnimatedRoute from 'components/Routes/AnimatedRoute';
import AnimatedRoutes from 'components/Routes/AnimatedRoutes';
import ServerError from 'components/ServerError';

import { LoginContentContainer,
  LoginViewContainer, LoginViewSideScreen } from './LoginViewStyles';

interface FormData {
  email: string;
  password: string;
}

const requestInviteMutation = gql`
  mutation requestInvite($input: RequestInviteInput) {
    requestInvite(input: $input) {
      didInvite
    }
  }
`;

const baseRoute = '/public/login';

const LoginView = () => {
  const history = useHistory();
  const toast = useToast();

  const [requestInvite, { error: loginServerError, loading: isRequestingInvite }] = useMutation(requestInviteMutation, {
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
        title: 'Invite has been sent!',
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
      variables: { input: { email: data.email } },
    });
  };

  return (
    <LoginViewContainer>
      <Grid minHeight="100vh" gridTemplateColumns={['1fr', '2fr 1fr']} gridGap={0}>
        <Div bg="white">
          <LoginContentContainer padding={['4', '15%']}>
            <FullLogo mb="84px" />
            <AnimatedRoutes>
              <AnimatedRoute exact path={`${baseRoute}`}>
                <Form onSubmit={form.handleSubmit(handleRequestInvite)}>
                  <H2 color="gray.800" mb={2}>Log in</H2>
                  <Paragraph fontSize="0.9rem" color="gray.500" mb={4}>
                    Login using your email address
                  </Paragraph>
                  <ServerError serverError={loginServerError} />

                  <InputGrid gridTemplateColumns="1fr">
                    <Div maxWidth="500px">
                      <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
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

                  <Button
                    leftIcon={Send}
                    type="submit"
                    isDisabled={!form.formState.isValid}
                    mt={4}
                    isLoading={isRequestingInvite}
                    loadingText="Logging in"
                  >
                    Request login
                  </Button>
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
          </LoginContentContainer>
        </Div>
        <LoginViewSideScreen order={[1, 2]} />
      </Grid>
    </LoginViewContainer>
  );
};

export default LoginView;
