import React, { useContext, ReactNode, useReducer } from 'react';
import useLocalStorage from './useLocalStorage';

// Hook which combines the dispatches and variables
const useAuthToken = () => {
  const [token, setToken] = useLocalStorage('token', '');
};

export default useAuthToken;
