import { useMutation } from '@apollo/react-hooks';
import React, { useContext, useEffect, useState } from 'react';

import { LoginInput } from 'types/globalTypes';
import { useToast } from '@chakra-ui/core';
import loginUserMutation from 'mutations/loginUser';
import useLocalStorage from 'hooks/useLocalStorage';

interface AuthContext {
  user: any;
  login: (userData: { email: string, password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginServerError?: Error;
  userIsValid?: () => boolean;
  logout: () => void;
}

const AuthContext = React.createContext({} as AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authStorage, setAuthStorage] = useLocalStorage('auth', '');
  const toast = useToast();

  const [loginMutation, { data: loginData, loading, error: loginServerError }] = useMutation<{login: { token: string, user: any }}, LoginInput>(loginUserMutation, {
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
        title: 'Logged in!',
        description: 'Welcome back!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const [user, setUser] = useState(() => {
    if (authStorage) return authStorage?.user;

    return null;
  });

  const userIsValid = () => {
    if (!authStorage?.auth?.expiryDate) return false;

    const date = new Date(authStorage?.auth?.expiryDate);
    const nowDate = new Date();

    if (date >= nowDate) return false;

    return true;
  };

  const login = async ({ email, password }: { email: string, password: string }) => {
    await loginMutation({ variables: { input: { email, password } } });
  };

  useEffect(() => {
    if (loginData) {
      setAuthStorage(loginData.login);
    }
  }, [loginData, setUser, setAuthStorage]);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      isLoggingIn: loading,
      logout,
      loginServerError,
      userIsValid,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
