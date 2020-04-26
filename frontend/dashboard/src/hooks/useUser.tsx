import React, { useContext, ReactNode, useReducer } from 'react';

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = React.createContext({
  user: null,
  login: () => null,
  logout: () => null,
});

interface UserLoginProps {
  email: string;
}

type UserAction = {
  type: 'login',
  payload: UserLoginProps
} | {
  type: 'logout'
};

// Provider which manages the state of the context
export const UserProvider = ({ children }: UserProviderProps) => (
  <UserContext.Provider value={{ user: null, login: () => null, logout: () => null }}>
    {children}
  </UserContext.Provider>
);

// Hook which combines the dispatches and variables
const useUser = () => useContext(UserContext);

export default useUser;
