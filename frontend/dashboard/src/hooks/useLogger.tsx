import * as Sentry from '@sentry/react';
import { ScopeContext } from '@sentry/types';

export const useLogger = () => {
  const logError = (error: Error, context?: Partial<ScopeContext>) => {
    Sentry.captureException(error, context);
  };

  return {
    logError,
    sentry: Sentry
  }
}