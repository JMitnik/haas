import React, { useContext, ReactNode, useReducer, useEffect, useCallback } from 'react';
import jwtDecoder from 'jwt-decode';
import { useMutation } from '@apollo/react-hooks';
import { MutationFunctionOptions } from '@apollo/react-common';
import gql from 'graphql-tag';
import useLocalStorage from './useLocalStorage';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextProps {
  user: null | any;
  login: ((options?: MutationFunctionOptions<any, Record<string, any>> | undefined) => Promise<any>);
  logout: (() => void);
}

export const UserContext = React.createContext({
  user: null,
} as UserContextProps);

interface UserLoginProps {
  email: string;
}

type UserAction = {
  type: 'login',
  payload: UserLoginProps
} | {
  type: 'logout'
};

const loginMutation = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password)
  }
`;

const logoutMutation = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password)
  }
`;

const isValidUser = (email: string, id: string) => email != null && id != null;

// Provider which manages the state of the context
export const UserProvider = ({ children }: UserProviderProps) => {
  const [userToken, setUserToken] = useLocalStorage('token', '');
  const [user, setUser] = useReducer((oldState: any, newState: any) => newState, null);

  useEffect(() => {
    if (userToken) {
      const { email, id } = jwtDecoder(userToken);
      if (isValidUser(email, id)) { setUser({ email, id }); }
    }
  }, [userToken, setUser]);

  const [login] = useMutation(loginMutation, {
    errorPolicy: 'all',
    onError: (err: any) => {
      console.log(`Oh no ${err}`);
    },
    onCompleted: (data) => {
      // TODO: Rename to token in API
      const token = data?.login;
      setUserToken(token);
    },
  });

  const logout = useCallback(
    () => {
      setUserToken('');
      setUser(null);
    },
    [setUser, setUserToken],
  );

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook which combines the dispatches and variables
const useUser = () => useContext(UserContext);

export default useUser;
