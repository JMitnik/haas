import { I18nextProvider } from 'react-i18next';
import { QueryParamProvider } from 'use-query-params';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
// @eslint-ignore-next-line
import { ApolloProvider } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RenderOptions, render } from '@testing-library/react';
import React from 'react';

import CustomerProvider from 'providers/CustomerProvider';
import ThemeProvider from 'providers/ThemeProvider';
import UserProvider from 'providers/UserProvider';
import WorkspaceLayout from 'layouts/WorkspaceLayout/WorkspaceLayout';
import client from 'config/server/apollo';
import lang from 'config/i18n-config';

interface TestProvidersProps {
  history: any;
  children?: React.ReactNode;
}

// TODO: Make provider type conditional on prop (now assumes a customer)
/**
 * Context providers needed to run MVP of application.
 */
export const TestProviders = ({ children, history }: TestProvidersProps) => (
  <Router history={history}>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ApolloProvider client={client}>
        <UserProvider>
          <CustomerProvider workspaceOverrideSlug="workspace_1" __test__>
            <I18nextProvider i18n={lang}>
              <ThemeProvider>
                <WorkspaceLayout>
                  {children}
                </WorkspaceLayout>
              </ThemeProvider>
            </I18nextProvider>
          </CustomerProvider>
        </UserProvider>
      </ApolloProvider>
    </QueryParamProvider>
  </Router>
);

/**
 * Render a particular component with TestProviders.
 */
const customRender = (
  component: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) => {
  const history = createMemoryHistory() as any;
  render(component, { wrapper: (props) => <TestProviders history={history} {...props} />, ...options });

  return { history };
};

export { customRender as render };
