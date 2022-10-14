import {
  ApolloCache,
  ApolloQueryResult,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  gql,
  useMutation,
  useQuery,
} from '@apollo/client';
import { useHistory } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';

import {
  Exact,
  FinishTourOfUserInput,
  FinishTourOfUserMutation,
  GetUserToursQuery,
  MeQuery,
  useFinishTourOfUserMutation,
  useGetUserToursLazyQuery,
  useMeQuery,
} from 'types/generated-types';

const POLL_INTERVAL_SECONDS = 60;

const refreshAccessTokenQuery = gql`
  query refreshAccessToken {
    refreshAccessToken {
      accessToken
    }
  }
`;

const logoutMutation = gql`
  mutation logout {
    logout
  }
`;

type MeUserType = MeQuery['me'];

interface AuthContextProps {
  user: MeUserType | null;
  userIsValid?: () => boolean;
  logout: () => void;
  userTours: GetUserToursQuery['user'] | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isInitializingUser: boolean;
  setAccessToken: (token: string) => void;
  setUser: (userData: MeUserType) => void;
  refreshUser: (variables?: Partial<Exact<{
    [key: string]: never;
  }>> | undefined) => Promise<ApolloQueryResult<MeQuery>>
  hardRefreshUser: () => void;
  finishTour: (options?: MutationFunctionOptions<FinishTourOfUserMutation, Exact<{
    input: FinishTourOfUserInput;
    // eslint-disable-next-line max-len
  }>, DefaultContext, ApolloCache<any>> | undefined) => Promise<FetchResult<FinishTourOfUserMutation, Record<string, any>, Record<string, any>>>
}

const UserContext = React.createContext({} as AuthContextProps);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory();
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [isInitializingUser, setIsInitializingUser] = useState<boolean>(() => !!accessToken);
  const stopInitializingUser = () => {
    setTimeout(() => {
      setIsInitializingUser(false);
    }, 1000);
  };

  const { data, refetch: getUser } = useMeQuery({
    onCompleted: () => {
      stopInitializingUser();
    },
    onError: () => {
      stopInitializingUser();
    },
    fetchPolicy: 'network-only',
  });

  const [fetchUserTours, { data: toursData }] = useGetUserToursLazyQuery({
    onCompleted: () => {
      console.log('Finished fetching tour data');
    },
  });

  const [finishTour] = useFinishTourOfUserMutation({
    refetchQueries: ['GetUserTours'],
  });

  const setUser = () => { };

  const [logout] = useMutation(logoutMutation, {
    onCompleted: () => {
      setAccessToken(null);
      // setUser(null);
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
    if (data?.me?.id) {
      fetchUserTours({
        variables: {
          userId: data.me.id,
        },
      });
    }
  }, [data?.me?.id]);

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

  console.log('Tour data: ', toursData);

  return (
    <UserContext.Provider value={{
      user: data?.me || null,
      userTours: toursData?.user || null,
      isInitializingUser,
      isLoggedIn: !!(data?.me?.id && accessToken && localStorage.getItem('access_token')),
      accessToken,
      logout,
      setUser,
      refreshUser: getUser,
      hardRefreshUser: startInitializingUser,
      setAccessToken,
      finishTour,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
