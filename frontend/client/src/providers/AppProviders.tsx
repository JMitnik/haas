import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import client from 'config/apollo';

import { DialogueTreeProvider } from './DialogueTreeProvider';
import { UploadQueueProvider } from './UploadQueueProvider';
import ThemeProviders from './ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <DialogueTreeProvider>
        <UploadQueueProvider>
          <ThemeProviders>
            {children}
          </ThemeProviders>
        </UploadQueueProvider>
      </DialogueTreeProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
