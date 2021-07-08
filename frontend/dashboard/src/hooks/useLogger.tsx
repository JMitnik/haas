import * as Sentry from '@sentry/react';
import { ApolloError } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ScopeContext } from '@sentry/types';

const ignoreErrorCodes = ['BAD_USER_INPUT', 'UNAUTHORIZED'];

/**
 * Logger hook which exposes the `logError` function. This will send to Sentry
 * an updated error report.
 */
export const useLogger = () => {
  /**
   * Method to log errors to Sentry from dashboard.
   *
   * Will standard ignore errors with "handled" error-codes such
   * as BAD_USER_INPUT and UNAUTHORIZED.
   * @param error
   * @param context
   */
  const logError = (error: ApolloError | Error, context?: Partial<ScopeContext>) => {
    try {
      try {
        if (error instanceof ApolloError) {
          const relevantErrors = error.graphQLErrors.filter((graphqlError) => {
            if (ignoreErrorCodes.includes(graphqlError.extensions?.code || '')) {
              return false;
            }

            return true;
          });

          if (relevantErrors.length) {
            Sentry.captureException(error, context);
          }
        } else {
          Sentry.captureException(error, context);
        }
      } catch (internalError) {
        Sentry.captureException(internalError, {
          ...context,
          tags: {
            ...context?.tags,
            meta: 'error-handling',
          },
        });
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  return {
    logError,
    sentry: Sentry,
  };
};
