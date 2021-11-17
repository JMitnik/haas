import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { QueryParamProvider } from 'use-query-params';
// @eslint-ignore-next-line
import { RenderOptions, render } from '@testing-library/react';
import React from 'react';

import ThemeProvider from 'providers/ThemeProvider';
import lang from 'config/i18n-config';

export const MockProviders: React.FC = ({ children }: { children?: React.ReactNode }) => (
  <MemoryRouter>
    <QueryParamProvider ReactRouterRoute={Route}>
      <MockedProvider
        addTypename={false}
      >
        <I18nextProvider i18n={lang}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nextProvider>
      </MockedProvider>
    </QueryParamProvider>
  </MemoryRouter>
);

const customRender = (
  component: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) => render(component, { wrapper: MockProviders, ...options });

export { customRender as render };
