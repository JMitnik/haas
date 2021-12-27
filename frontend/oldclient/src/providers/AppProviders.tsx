import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import client from 'config/apollo';

import { CampaignProvider } from './CampaignProvider';
import { DialogueTreeProvider } from './DialogueTreeProvider';
import { UploadQueueProvider } from './UploadQueueProvider';
import ThemeProviders from './ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <CampaignProvider>
        <DialogueTreeProvider>
          <UploadQueueProvider>
            <ThemeProviders>{children}</ThemeProviders>
          </UploadQueueProvider>
        </DialogueTreeProvider>
      </CampaignProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
