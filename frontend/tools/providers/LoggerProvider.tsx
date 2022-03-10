/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useContext } from 'react';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const LoggerContext = React.createContext({} as LoggerContextProps);

const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (sentryDsn) {
  console.log({ sentryDsn });
  Sentry.init({
    dsn: sentryDsn
  });
}

interface Logger {
  log: (message: string) => void;
  error: (message: string, error: Error, context?: LoggerErrorContext) => void;
}

interface LoggerErrorContext {
  tags?: Record<string, string>;
}

interface LoggerContextProps {
  name: string;
  logger: Logger;
}

interface LoggerProviderProps {
  name: string;
  children: React.ReactNode;
}

export const loggerInstance = {
  log: (message: string) => {
    console.log(message);
  },
  error: (message: string, error: Error, context?: LoggerErrorContext) => {
    console.error(message, `${error.message} ${error.stack}`);
    Sentry.captureException(error, {
      tags: {
        ...context?.tags,
        meta: 'error-handling'
      }
    });
  },
};

export const LoggerProvider = ({ children, name }: LoggerProviderProps) => {

  return (
    <LoggerContext.Provider value={{ name, logger: loggerInstance }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);
