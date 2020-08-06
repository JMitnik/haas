import React from 'react';

import { Div, Flex, Form, FormLabel, FormControl, InputHelper, H2, H3, Input, FormContainer, InputGrid, Grid, H4, Paragraph } from '@haas/ui';
import Logo from 'components/Logo';

import { Box, Button, Icon, InputLeftElement, Stack } from '@chakra-ui/core';
import { LoginBox, LoginViewContainer, LoginViewSideScreen, LoginContentContainer } from './LoginViewStyles';
import { useAuth } from 'providers/AuthProvider';
import { Mail, Lock } from 'react-feather';
import { FullLogo } from 'components/Logo/Logo';
import { useForm } from 'react-hook-form';
import ServerError from 'components/ServerError';

interface FormData {
  email: string;
  password: string;
}

const LoginView = () => {
  const { login, isLoggingIn, loginServerError } = useAuth();

  const form = useForm<FormData>({
    mode: 'onChange'
  });

  const handleLogin = async (data: FormData) => {
    const userData = await login({
      email: data.email,
      password: data.password
    });

    console.log(userData);
  }

  return (
    <LoginViewContainer>
      <Grid minHeight="100vh" gridTemplateColumns={["1fr", "2fr 1fr"]} gridGap={0}>
        <Div bg="white">
          <LoginContentContainer padding={['4', '15%']}>
            <FullLogo mb={"84px"} />
            <Form onSubmit={form.handleSubmit(handleLogin)}>
              <H2 color="gray.800" mb={2}>Log in</H2>
              <Paragraph fontSize="0.9rem" color="gray.500" mb={4}>Login using the credentials provided by the system admin</Paragraph>
              <ServerError serverError={loginServerError} />

              <InputGrid gridTemplateColumns="1fr">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input name="email" ref={form.register({ required: true })} leftEl={<Mail />} placeholder="bunny@haas.live" />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input name="password" ref={form.register({ required: true })} leftEl={<Lock />} type="password" />
                </FormControl>
              </InputGrid>

              <Button type="submit" isDisabled={!form.formState.isValid} mt={4} isLoading={isLoggingIn} loadingText="Logging in">
                Log in
              </Button>
            </Form>
          </LoginContentContainer>
        </Div>
        <LoginViewSideScreen order={[1, 2]} />
      </Grid>
    </LoginViewContainer>
  );
};

export default LoginView;
