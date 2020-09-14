import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useContext, useEffect, useState } from 'react';

import { LoginInput } from 'types/globalTypes';
import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';
import gql from 'graphql-tag';
import loginUserMutation from 'mutations/loginUser';
import useLocalStorage from 'hooks/useLocalStorage';

const requestInviteMutation = gql`
  mutation requestInvite($input: RequestInviteInput) {
    requestInvite(input: $input) {
      didInvite
    }
  }
`;

const refreshAccessTokenQuery = gql`
  query refreshAccessToken {
    refreshAccessToken {
      accessToken
    }
  }
`;

interface AuthContext {
  user: any;
  login: (userData: { email: string, password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginServerError?: Error;
  userIsValid?: () => boolean;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const AuthContext = React.createContext({} as AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(localStorage.getItem('user_data'));
  const [accessToken, setAccessToken] = useState<any>(() => localStorage.getItem('access_token'));
  const [authStorage, setAuthStorage] = useLocalStorage('auth', '');
  const toast = useToast();
  const history = useHistory();

  const { data: refreshTokenData } = useQuery(refreshAccessTokenQuery, {
    pollInterval: 300 * 1000,
  });

  const [loginMutation, { data: loginData, loading, error: loginServerError }] = useMutation(requestInviteMutation, {
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

  const userIsValid = () => {
    if (!authStorage?.auth?.expiryDate) return false;

    const date = new Date(authStorage?.auth?.expiryDate);
    const nowDate = new Date();

    if (date >= nowDate) return false;

    return true;
  };

  const login = async ({ email }: { email: string }) => {
    await loginMutation({ variables: { input: { email } } });
  };

  const logout = () => {
    localStorage.setItem('access_token', '');
    history.push('/');
  };

  useEffect(() => {
    if (refreshTokenData?.refreshAccessToken.accessToken) {
      setAccessToken(refreshTokenData?.refreshAccessToken.accessToken);
    }
  }, [refreshTokenData]);

  useEffect(() => {
    localStorage.setItem('access_token', accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      isLoggingIn: loading,
      logout,
      loginServerError,
      userIsValid,
      setAccessToken,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
