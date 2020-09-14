import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';

const authorizeLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `Bearer:${localStorage.getItem('access_token') || ''}`,
    },
  });

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
          localStorage.setItem('user_data', '');
          localStorage.setItem('access_token', '');
          // window.location.href = '/';
        }
      }
    }),
    authorizeLink,
    createUploadLink({
      credentials: 'include',
      uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
