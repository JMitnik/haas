import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { ModalProvider } from 'react-modal-hook';
import { QueryParamProvider } from 'use-query-params';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

import { AppContainer } from 'styles/AppStyles';
import { DefaultThemeProviders } from 'providers/ThemeProvider';
import { GlobalErrorFallback } from 'components/Error/GlobalErrorFallback';
import { ScrollToTop } from 'components/Utilities/ScrollToTop';
import UserProvider from 'providers/UserProvider';

import GlobalStyle from './global-styles';
import client from './server/apollo';
import lang from './i18n-config';

/**
 * AppProviders give all if not `most` context providers.
 */
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={lang}>
    <Router>
      <ScrollToTop />
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <ApolloProvider client={client}>
          <DefaultThemeProviders>
            <UserProvider>
              <ModalProvider>
                <AppContainer>
                  <QueryParamProvider ReactRouterRoute={Route}>
                    <>
                      {children}
                    </>
                  </QueryParamProvider>
                </AppContainer>
                <GlobalStyle />
              </ModalProvider>
            </UserProvider>
          </DefaultThemeProviders>
        </ApolloProvider>
      </ErrorBoundary>
    </Router>
  </I18nextProvider>
);
