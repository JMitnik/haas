import { useMutation } from '@apollo/react-hooks';
import React, { useContext, useState } from 'react';

import { LoginInput } from 'types/globalTypes';
import loginUserMutation from 'mutations/loginUser';

interface AuthContext {
  user: any;
  login: (userData: { email: string, password: string }) => void;
  logout: () => void;
}

const AuthContext = React.createContext({} as AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginMutation, { data, loading }] = useMutation<{id: string}, LoginInput>(loginUserMutation);
  const [user, setUser] = useState(null);

  const login = async ({ email, password }: { email: string, password: string }) => {
    const userId = await loginMutation({ variables: { email, password } });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, isLoggingIn: loading logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
