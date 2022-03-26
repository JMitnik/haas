import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from '@sentry/react';
import { I18nextProvider } from 'react-i18next';
import { QueryParamProvider } from 'use-query-params';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import React from 'react';

import { AppContainer } from 'styles/AppStyles';
import { DefaultThemeProviders } from 'providers/ThemeProvider';
import { GlobalErrorFallback } from 'components/Error/GlobalErrorFallback';
import UserProvider from 'providers/UserProvider';

import GlobalStyle from './global-styles';
import client from './apollo';
import lang from './i18n-config';

/**
 * AppProviders give all if not `most` context providers.
 */
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  // @ts-ignore
  <I18nextProvider i18n={lang}>
    <Router>
      <ErrorBoundary fallback={GlobalErrorFallback}>
        <ApolloProvider client={client}>
          <DefaultThemeProviders>
            <UserProvider>
              <AppContainer>
                <Toaster />
                <QueryParamProvider ReactRouterRoute={Route}>
                  <ErrorBoundary fallback={GlobalErrorFallback}>
                    {children}
                  </ErrorBoundary>
                </QueryParamProvider>
              </AppContainer>
              <GlobalStyle />
            </UserProvider>
          </DefaultThemeProviders>
        </ApolloProvider>
      </ErrorBoundary>
    </Router>
  </I18nextProvider>
);
