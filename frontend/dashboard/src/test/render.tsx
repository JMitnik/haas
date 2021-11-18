import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
// @eslint-ignore-next-line
import { ApolloProvider } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RenderOptions, render } from '@testing-library/react';
import React from 'react';

import ThemeProvider from 'providers/ThemeProvider';
import client from 'config/apollo';
import lang from 'config/i18n-config';

/**
 * Context providers needed to run MVP of application.
 */
export const TestProviders: React.FC = ({ children }: { children?: React.ReactNode }) => (
  <MemoryRouter>
    <QueryParamProvider ReactRouterRoute={Route}>
      <ApolloProvider client={client}>
        <I18nextProvider i18n={lang}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nextProvider>
      </ApolloProvider>
    </QueryParamProvider>
  </MemoryRouter>
);

/**
 * Render a particular component with TestProviders.
 */
const customRender = (
  component: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) => render(component, { wrapper: TestProviders, ...options });

export { customRender as render };
