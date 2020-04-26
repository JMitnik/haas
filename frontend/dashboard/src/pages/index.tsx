import React, { FC } from 'react';
import { AppContainer } from '../styles/AppStyles';
import GlobalStyle from '../config/global-styles';
import Login from './login';
import useUser from '../hooks/useUser';
import Dashboard from './dashboard/';

const App: FC = () => {
  const { user } = useUser();

  return (
    <>
      <AppContainer>
        {user ? (
          <Dashboard />
        ) : (
          <Login />
        )}
      </AppContainer>
      <GlobalStyle />
    </>
  );
};

export default App;
