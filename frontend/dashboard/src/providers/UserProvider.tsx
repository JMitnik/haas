import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { useContext, useEffect, useState } from 'react';

import { useHistory } from 'react-router';
import gql from 'graphql-tag';

import { me as GetUserData, me_me as User } from './__generated__/me';

const POLL_INTERVAL_SECONDS = 20;

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
      id
      email
      firstName
      lastName
      globalPermissions
      userCustomers {
        customer {
          id
          name
          slug
        }
        role {
          name
          permissions
        }
      }
    }
  }
`;

const logoutMutation = gql`
  mutation logout {
    logout
  }
`;

interface AuthContextProps {
  user: User;
  userIsValid?: () => boolean;
  logout: () => void;
  accessToken: string | null;
  isLoggedIn: boolean;
  isInitializingUser: boolean;
  setAccessToken: (token: string) => void;
  setUser: (userData: User) => void;
  refreshUser: () => void;
  hardRefreshUser: () => void;
}

const UserContext = React.createContext({} as AuthContextProps);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [user, setUser] = useState<any>();
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [isInitializingUser, setIsInitializingUser] = useState<boolean>(() => !!accessToken);

  const stopInitializingUser = () => {
    setTimeout(() => {
      setIsInitializingUser(false);
    }, 1000);
  };

  const [getUser, { loading: isGettingUser }] = useLazyQuery<GetUserData>(queryMe, {
    onCompleted: (data) => {
      setUser({
        id: data.me.id,
        firstName: data.me.firstName,
        lastName: data.me.lastName,
        email: data.me.email,
        globalPermissions: data.me.globalPermissions,
        userCustomers: data.me.userCustomers,
      });
      stopInitializingUser();
    },
    onError: () => {
      stopInitializingUser();
    },
    fetchPolicy: 'network-only',
  });

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('customer');
      history.push('/logged_out');
    },
  });

  const { data: refreshTokenData } = useQuery(refreshAccessTokenQuery, {
    pollInterval: POLL_INTERVAL_SECONDS * 1000,
    skip: !accessToken,
    fetchPolicy: 'network-only',
  });

  const startInitializingUser = () => {
    setIsInitializingUser(true);
    getUser();
  };

  useEffect(() => {
    if (refreshTokenData) {
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
  }, [accessToken, getUser]);

  return (
    <UserContext.Provider value={{
      user,
      isInitializingUser,
      isLoggedIn: !!(user?.id && accessToken && localStorage.getItem('access_token')),
      accessToken,
      logout,
      setUser,
      refreshUser: getUser,
      hardRefreshUser: startInitializingUser,
      setAccessToken,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
