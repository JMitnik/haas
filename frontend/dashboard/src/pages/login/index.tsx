import React from 'react';
import { H2, Div, ColumnFlex } from '@haas/ui';
import { useForm } from 'react-hook-form';
import { LoginContainer } from '../LoginStyles';
import useUser from '../../hooks/useUser';

const Login = () => {
  const form = useForm();
  const { login } = useUser();

  const onSubmit = (data: any) => {
    try {
      login({
        variables: {
          email: data.email,
          password: data.password,
        },
      }).then((data: any) => {
        console.log('data', data);
      });
    } catch {
      console.log('Whoops');
    }
  };

  return (
    <LoginContainer>
      <ColumnFlex alignItems="center" justifyContent="center" width="50%">
        <H2>Welcome to haas!</H2>
        <Div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input name="email" type="email" ref={form.register} />
            <input name="password" type="password" ref={form.register} />
            <button type="submit">Login!</button>
          </form>
        </Div>
      </ColumnFlex>
      <Div backgroundColor="#4063e0" />
    </LoginContainer>
  );
};

export default Login;
