import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';
import React, { ReactNode } from 'react';

import client from 'config/apollo';
import theme from 'config/theme';

import { DialogueTreeProvider } from './DialogueTreeProvider';
import { ProjectProvider } from './ProjectProvider/ProjectProvider';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ProjectProvider>
        <DialogueTreeProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </DialogueTreeProvider>
      </ProjectProvider>
    </BrowserRouter>
  </ApolloProvider>
);

export default AppProviders;
