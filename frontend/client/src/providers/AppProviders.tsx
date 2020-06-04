import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import React, { ReactNode } from 'react';

import client from 'graphql/apollo';

import { DialogueTreeProvider } from './DialogueTreeProvider';
import { ProjectProvider } from './ProjectProvider/ProjectProvider';
import ThemeProviders from './ThemeProviders';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ProjectProvider>
        <DialogueTreeProvider>
          <ThemeProviders>
            {children}
          </ThemeProviders>
        </DialogueTreeProvider>
      </ProjectProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
