import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import client from 'config/apollo';

import { ErrorBoundary } from 'react-error-boundary';
import { DialogueTreeProvider } from './DialogueTreeProvider';
import ThemeProviders from './ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <DialogueTreeProvider>
        <ThemeProviders>
          {children}
        </ThemeProviders>
      </DialogueTreeProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
