import { ApolloClient, ApolloLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';

import { getApiEndpoint } from 'utils/getApiEndpoint';
import { handleUnauthentication } from './apollo.helpers';

const authorizeLink = new ApolloLink((operation, forward) => {
  const localToken = localStorage.getItem('access_token');

  if (localToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer:${localToken}`,
      },
    });
  }

  return forward(operation);
});

const client = new ApolloClient({
  credentials: 'include',
  link: ApolloLink.from([
    onError(({ graphQLErrors }) => {
      if (!graphQLErrors) return;

      handleUnauthentication(graphQLErrors);
    }),
    authorizeLink,
    createUploadLink({
      // credentials: 'include', // FIXME: does this need to be here instead of as property of client
      // IF so, it doesn't work
      uri: getApiEndpoint(),
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
