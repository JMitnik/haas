import { ApolloClient, ApolloLink, from } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';

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
  link: from([
    onError(({ graphQLErrors }) => {
      if (graphQLErrors) {
        const authorizedErrors = graphQLErrors.filter((error) => (
          error?.extensions?.code === 'UNAUTHENTICATED'
        ));

        if (authorizedErrors.length) {
          localStorage.removeItem('user_data');
          localStorage.removeItem('access_token');
          localStorage.removeItem('customer');
          localStorage.removeItem('role');
          window.location.href = '/logged_out';
        }
      }
    }),
    authorizeLink,
    createUploadLink({
      credentials: 'include',
      uri: import.meta.env.VITE_API_ENDPOINT?.toString() || 'http://localhost:4000/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
