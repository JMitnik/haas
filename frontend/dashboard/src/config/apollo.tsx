import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';

const authorizeLink = new ApolloLink((operation, forward) => {
  const localToken = localStorage.getItem('access_token');

  if (localToken) {
    console.log(localToken);
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
      console.log(graphQLErrors);

      if (graphQLErrors) {
        const authorizedErrors = graphQLErrors.filter((error) => (
          error?.extensions?.code === 'UNAUTHENTICATED'
        ));

        if (authorizedErrors.length) {
          console.log('Unauthenticated flow');
          // TODO: Make this better
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
      uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
