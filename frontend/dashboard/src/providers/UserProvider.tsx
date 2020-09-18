import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useContext, useEffect, useState } from 'react';

import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/core';
import gql from 'graphql-tag';

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

const queryMe = gql`
  query me {
    me {
        email
        firstName
        lastName
        id
        userCustomers {
            customer {
                id
                name
                slug
            }
            role {
                permissions
            }
        }
    }
  }
`;

interface AuthContextProps {
  user: any;
  login: (userData: { email: string, password: string }) => Promise<any>;
  isLoggingIn: boolean;
  loginServerError?: Error;
  userIsValid?: () => boolean;
  logout: () => void;
  accessToken: string;
  isLoggedIn: boolean;
  isInitializingUser: boolean;
  setAccessToken: (token: string) => void;
  setUser: (userData: any) => void;
}

const UserContext = React.createContext({} as AuthContextProps);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [user, setUser] = useState<any>();

  const [accessToken, setAccessToken] = useState<any>(() => localStorage.getItem('access_token'));
  const toast = useToast();

  const { data: refreshTokenData, loading: isFetchingTokenData } = useQuery(refreshAccessTokenQuery, {
    pollInterval: 300 * 1000,
    skip: !accessToken,
  });

  const [getUser, { loading: isQueryingUser, data: userData }] = useLazyQuery(queryMe, {
    onCompleted: (fetchedUserData) => {
      setUser({
        id: fetchedUserData.me.id,
        email: fetchedUserData.me.email,
        userCustomers: fetchedUserData.me.userCustomers,
      });
    },
  });

  const [loginMutation, { loading, error: loginServerError }] = useMutation(requestInviteMutation, {
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
        title: 'Token has been sent!',
        description: 'Check the email adres for more information',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    },
  });

  const login = async ({ email }: { email: string }) => {
    await loginMutation({ variables: { input: { email } } });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customer');
    history.push('/logged_out');
  };

  useEffect(() => {
    if (refreshTokenData?.refreshAccessToken.accessToken) {
      setAccessToken(refreshTokenData?.refreshAccessToken.accessToken);
    }
  }, [refreshTokenData]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      getUser();
    } else {
      localStorage.removeItem('access_token');
    }
  }, [accessToken]);

  return (
    <UserContext.Provider value={{
      user,
      login,
      isInitializingUser: !user?.id && (isQueryingUser),
      isLoggingIn: loading,
      isLoggedIn: user?.id && accessToken,
      accessToken,
      logout,
      loginServerError,
      setUser,
      setAccessToken,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
