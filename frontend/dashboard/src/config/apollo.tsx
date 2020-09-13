import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import Cookies from 'js-cookie';

const getHeader = () => {
  const authToken = Cookies.get('token');
  // const auth = localStorage.getItem('auth');

  if (!authToken) return null;

  return authToken;
};

const client = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError, operation, response }) => {
      if (graphQLErrors) {
        const authorizedErrors = graphQLErrors.filter((error) => (
          error?.extensions?.code === 'UNAUTHENTICATED'
        ));

        if (authorizedErrors.length) {
          localStorage.setItem('auth', '');
          window.location.href = '/';
        }
      }
    }),
    createUploadLink({
      credentials: 'include',
      uri: process.env.REACT_APP_API_ENDPOINT || 'http://localhost:4000/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

export default client;
