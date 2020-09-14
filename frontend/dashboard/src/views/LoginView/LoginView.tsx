import React, { useEffect, useState } from 'react';

import { Div, Form, FormControl, FormLabel, Grid, H2, Input, InputGrid, Paragraph } from '@haas/ui';

import { Button } from '@chakra-ui/core';
import { FullLogo } from 'components/Logo/Logo';
import { Mail, Send } from 'react-feather';
import { Route, Switch, useHistory } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import { useForm } from 'react-hook-form';
import ServerError from 'components/ServerError';

import { LoginContentContainer, LoginViewContainer, LoginViewSideScreen } from './LoginViewStyles';

interface FormData {
  email: string;
  password: string;
}

const baseRoute = '/public/login';

const LoginView = () => {
  const { login, isLoggingIn, loginServerError } = useAuth();
  const history = useHistory();

  const form = useForm<FormData>({
    mode: 'onChange',
  });

  const handleLogin = async (data: FormData) => {
    login({
      email: data.email,
      password: data.password,
    }).then(() => {
      history.push(`${baseRoute}/waiting`);
    });
  };

  return (
    <LoginViewContainer>
      <Grid minHeight="100vh" gridTemplateColumns={['1fr', '2fr 1fr']} gridGap={0}>
        <Div bg="white">
          <LoginContentContainer padding={['4', '15%']}>
            <FullLogo mb="84px" />
            <Switch>
              <Route exact path={`${baseRoute}`}>
                <Form onSubmit={form.handleSubmit(handleLogin)}>
                  <H2 color="gray.800" mb={2}>Log in</H2>
                  <Paragraph fontSize="0.9rem" color="gray.500" mb={4}>
                    Login using the credentials provided by the system admin
                  </Paragraph>
                  <ServerError serverError={loginServerError} />

                  <InputGrid gridTemplateColumns="1fr">
                    <FormControl>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        name="email"
                        ref={form.register({ required: true })}
                        leftEl={<Mail />}
                        placeholder="bunny@haas.live"
                      />
                    </FormControl>
                  </InputGrid>

                  <Button
                    leftIcon={Send}
                    type="submit"
                    isDisabled={!form.formState.isValid}
                    mt={4}
                    isLoading={isLoggingIn}
                    loadingText="Logging in"
                  >
                    Request login
                  </Button>
                </Form>
              </Route>
              <Route path={`${baseRoute}/waiting`}>
                <Div>
                  Waiting for mail
                </Div>
              </Route>
            </Switch>
          </LoginContentContainer>
        </Div>
        <LoginViewSideScreen order={[1, 2]} />
      </Grid>
    </LoginViewContainer>
  );
};

export default LoginView;
