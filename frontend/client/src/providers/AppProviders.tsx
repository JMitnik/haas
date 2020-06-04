import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import client from 'graphql/apollo';

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
