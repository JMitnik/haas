import React from 'react';
import apolloMocks from './apolloMocks';
import { MockedProvider } from '@apollo/react-testing';


const ApolloMockProvider = ({ children }: { children?: any }) => {
  return (
    <MockedProvider
        mocks={apolloMocks}
        addTypename={false}
        defaultOptions={{
            watchQuery: { fetchPolicy: 'no-cache' },
            query: { fetchPolicy: 'no-cache' },
        }}
    >
    {children}
    </MockedProvider>
  )
};

export default ApolloMockProvider;
