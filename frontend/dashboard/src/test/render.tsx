import { I18nextProvider } from 'react-i18next';
import { Router, MemoryRouter, Route } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { QueryParamProvider } from 'use-query-params';
// @eslint-ignore-next-line
import { ApolloProvider } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RenderOptions, render } from '@testing-library/react';
import React from 'react';

import ThemeProvider from 'providers/ThemeProvider';
import client from 'config/apollo';
import lang from 'config/i18n-config';
import UserProvider from 'providers/UserProvider';
import CustomerProvider from 'providers/CustomerProvider';
import CustomerLayout from 'layouts/CustomerLayout';

interface TestProvidersProps {
  history: any;
  children?: React.ReactNode;
}


// TODO: Make provider type conditional on prop (now assumes a customer)
/**
 * Context providers needed to run MVP of application.
 */
export const TestProviders = ({ children, history }: TestProvidersProps) => {

  return (
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ApolloProvider client={client}>
            <UserProvider>
              <CustomerProvider workspaceOverrideSlug="workspace_1">
                <I18nextProvider i18n={lang}>
                  <ThemeProvider>
                    <CustomerLayout>
                      {children}
                    </CustomerLayout>
                  </ThemeProvider>
                </I18nextProvider>
              </CustomerProvider>
            </UserProvider>
        </ApolloProvider>
      </QueryParamProvider>
    </Router>
  )
};

/**
 * Render a particular component with TestProviders.
 */
const customRender = (
  component: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) => {
  const history = createMemoryHistory() as any;
  render(component, { wrapper: props => <TestProviders history={history} {...props} />, ...options });

  return { history };
};

export { customRender as render };
