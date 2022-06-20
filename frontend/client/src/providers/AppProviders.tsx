import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import { DialogueTreeProvider } from 'providers/DialogueTreeProvider/DialogueTreeProvider';
import client from 'config/apollo';

import { CampaignProvider } from './CampaignProvider';
// import { UploadQueueProvider } from './UploadQueueProvider';
import ThemeProviders from './ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <DialogueTreeProvider>
        <CampaignProvider>
          {/* <UploadQueueProvider> */}
          <ThemeProviders>{children}</ThemeProviders>
          {/* </UploadQueueProvider> */}
        </CampaignProvider>
      </DialogueTreeProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
