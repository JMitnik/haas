/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useContext } from 'react';

const LoggerContext = React.createContext({} as LoggerContextProps);

interface Logger {
  log: (message: string) => void;
  error: (message: string, error: Error) => void;
}

interface LoggerContextProps {
  name: string;
  logger: Logger;
}

interface LoggerProviderProps {
  name: string;
  children: React.ReactNode;
}

export const LoggerProvider = ({ children, name }: LoggerProviderProps) => {
  const logger = {
    log: (message: string) => console.log(message),
    error: (message: string, error: Error) => console.error(message, `${error.message} ${error.stack}`),
  };

  return (
    <LoggerContext.Provider value={{ name, logger }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);
