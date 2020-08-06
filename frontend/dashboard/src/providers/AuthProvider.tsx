import { useMutation } from '@apollo/react-hooks';
import React, { useContext, useState } from 'react';

import { LoginInput } from 'types/globalTypes';
import loginUserMutation from 'mutations/loginUser';
import { useToast } from '@chakra-ui/core';

interface AuthContext {
  user: any;
  login: (userData: { email: string, password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginServerError?: Error;
  logout: () => void;
}

const AuthContext = React.createContext({} as AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const [loginMutation, { data, loading, error: loginServerError }] = useMutation<{id: string}, LoginInput>(loginUserMutation, {
    onError: () => {
      toast({
        title: 'Unexpected error!',
        description: 'See the form for more information.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      })
    },
    onCompleted: () => {
      toast({
        title: 'Logged in!',
        description: 'Welcome back!',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      })
    }
  });
  const [user, setUser] = useState(null);

  const login = async ({ email, password }: { email: string, password: string }) => {
    const userId = await loginMutation({ variables: { input: { email, password } } });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, isLoggingIn: loading, logout, loginServerError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
