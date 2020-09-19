import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import React, { useContext, useEffect, useState } from 'react';

import { useHistory } from 'react-router';
import gql from 'graphql-tag';

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

interface UserContextProps {
  user: any;
  userIsValid?: () => boolean;
  logout: () => void;
  accessToken: string | null;
  isLoggedIn: boolean;
  isInitializingUser: boolean;
  setAccessToken: (token: string) => void;
  setUser: (userData: any) => void;
}

const UserContext = React.createContext({} as UserContextProps);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();

  const [user, setUser] = useState<any>();
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [isInitializingUser, setIsInitializingUser] = useState<boolean>(() => !!accessToken);

  const { data: refreshTokenData } = useQuery(refreshAccessTokenQuery, {
    pollInterval: 300 * 1000,
    skip: !accessToken,
  });

  const [getUser] = useLazyQuery(queryMe, {
    onCompleted: (data) => {
      setUser({
        id: data.me.id,
        firstName: data.me.firstName,
        lastName: data.me.lastName,
        email: data.me.email,
        userCustomers: data.me.userCustomers,
      });

      setIsInitializingUser(false);
    },
    onError: () => {
      setIsInitializingUser(false);
    },
  });

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
      isInitializingUser,
      isLoggedIn: !!(user?.id && accessToken),
      accessToken,
      logout,
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
