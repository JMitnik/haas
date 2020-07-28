import React from 'react';

import { Div, Flex, Form, H2, H3 } from '@haas/ui';
import Logo from 'components/Logo';

import { Box, Button, FormControl, FormLabel, Icon, Input, InputGroup, InputLeftElement, Stack } from '@chakra-ui/core';
import { LoginBox, LoginViewContainer } from './LoginViewStyles';

const LoginView = () => {
  const { login, isLoggingIn } = useAuth();

  return (
    <LoginViewContainer>
      <Box bg="white" p={12} rounded="lg">
        <Stack spacing={2}>
          <Flex alignItems="center">
            <Logo />
            <H3>
              HAAS Dashboard
            </H3>
          </Flex>
          <Form>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <InputGroup>
                <InputLeftElement><Icon name="email" color="default.100" /></InputLeftElement>
                <Input size="lg" placeholder="bunny@haas.live" />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <InputLeftElement><Icon name="lock" color="default.100" /></InputLeftElement>
                <Input size="lg" placeholder="bunny@haas.live" type="password" />
              </InputGroup>
            </FormControl>

            <Button mt={4} isLoading={isLoggingIn} loadingText="Logging in">
              Log in
            </Button>
          </Form>

        </Stack>
      </Box>
      {/* <LoginBox> */}

      {/* </LoginBox> */}
    </LoginViewContainer>
  );
};

export default LoginView;
