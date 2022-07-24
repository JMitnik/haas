import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import { DialogueInitializer } from 'modules/Dialogue/DialogueInitializer';
import { UploadQueueProvider } from 'modules/Session/UploadQueueProvider';
import client from 'config/apollo';

import { CampaignProvider } from '../modules/Campaign/CampaignProvider';
import ThemeProviders from '../modules/Theme/ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <DialogueInitializer>
        <CampaignProvider>
          <UploadQueueProvider>
            <ThemeProviders>{children}</ThemeProviders>
          </UploadQueueProvider>
        </CampaignProvider>
      </DialogueInitializer>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
